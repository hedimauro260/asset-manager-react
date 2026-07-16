import { db } from "../db";
import type { Tag, CreateTagDTO, UpdateTagDTO } from "../../types";
import { DEFAULT_TAGS, TagCategory } from "../../types";
import { v4 as uuidv4 } from "uuid";

export class TagRepository {
  /**
   * Inicializa as tags padrão na primeira execução
   */
  static async initializeDefaults(): Promise<void> {
    const count = await db.tags.count();
    if (count > 0) return;

    const tags: Tag[] = DEFAULT_TAGS.map((tag) => ({
      id: uuidv4(),
      ...tag,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await db.tags.bulkAdd(tags);
  }

  static async create(data: CreateTagDTO): Promise<Tag> {
    const id = uuidv4();
    const now = new Date();

    const tag: Tag = {
      id,
      ...data,
      isCustom: true,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    await db.tags.add(tag);
    return tag;
  }

  static async getAll(): Promise<Tag[]> {
    return await db.tags.toArray();
  }

  static async getDefaults(): Promise<Tag[]> {
    return await db.tags.filter(t => !t.isCustom).toArray();
  }

  static async getCustom(): Promise<Tag[]> {
    return await db.tags.filter(t => t.isCustom).toArray();
  }

  static async getByCategory(category: TagCategory): Promise<Tag[]> {
    return await db.tags.where("category").equals(category).toArray();
  }

  static async getById(id: string): Promise<Tag | undefined> {
    return await db.tags.get(id);
  }

  static async update(
    id: string,
    data: UpdateTagDTO,
  ): Promise<Tag | undefined> {
    await db.tags.update(id, {
      ...data,
      updatedAt: new Date(),
    });

    return await db.tags.get(id);
  }

  static async delete(id: string): Promise<void> {
    const tag = await db.tags.get(id);
    if (!tag) throw new Error("Tag not found");

    if (!tag.isCustom) {
      throw new Error("Cannot delete default tags");
    }

    if (tag.usageCount > 0) {
      throw new Error("Cannot delete tag: it is being used in transactions");
    }

    await db.tags.delete(id);
  }

  /**
   * Incrementa o contador de uso da tag
   */
  static async incrementUsage(tagIds: string[]): Promise<void> {
    for (const tagId of tagIds) {
      const tag = await db.tags.get(tagId);
      if (tag) {
        await db.tags.update(tagId, {
          usageCount: tag.usageCount + 1,
          updatedAt: new Date(),
        });
      }
    }
  }

  /**
   * Decrementa o contador de uso da tag
   */
  static async decrementUsage(tagIds: string[]): Promise<void> {
    for (const tagId of tagIds) {
      const tag = await db.tags.get(tagId);
      if (tag && tag.usageCount > 0) {
        await db.tags.update(tagId, {
          usageCount: tag.usageCount - 1,
          updatedAt: new Date(),
        });
      }
    }
  }

  static async getMostUsed(limit: number = 5): Promise<Tag[]> {
    const tags = await db.tags.toArray();
    return tags.sort((a, b) => b.usageCount - a.usageCount).slice(0, limit);
  }
}
