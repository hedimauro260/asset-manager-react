import {
  type BaseEntity,
  TagCategory,
  type Color,
  type IconName,
} from "./common";

/**
 * Tag representa uma categoria personalizável para transações.
 * Permite ao usuário criar suas próprias categorias além das predefinidas.
 */
export interface Tag extends BaseEntity {
  name: string; // Nome da tag
  category: TagCategory; // Categoria predefinida
  icon: IconName;
  color: Color;
  description?: string;
  isCustom: boolean; // true se foi criada pelo usuário
  usageCount: number; // Quantas transações usam esta tag
}

// DTOs
export type CreateTagDTO = Omit<
  Tag,
  "id" | "createdAt" | "updatedAt" | "usageCount"
>;

export type UpdateTagDTO = Partial<Omit<Tag, "id" | "createdAt" | "updatedAt">>;

// Tags predefinidas do sistema
export const DEFAULT_TAGS: Omit<Tag, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Reward",
    category: TagCategory.Reward,
    icon: "gift",
    color: "#10B981",
    isCustom: false,
    usageCount: 0,
  },
  {
    name: "Mining",
    category: TagCategory.Mining,
    icon: "pickaxe",
    color: "#F59E0B",
    isCustom: false,
    usageCount: 0,
  },
  {
    name: "Salary",
    category: TagCategory.Salary,
    icon: "banknote",
    color: "#3B82F6",
    isCustom: false,
    usageCount: 0,
  },
  {
    name: "Investment",
    category: TagCategory.Investment,
    icon: "trending-up",
    color: "#8B5CF6",
    isCustom: false,
    usageCount: 0,
  },
  {
    name: "Gift",
    category: TagCategory.Gift,
    icon: "gift",
    color: "#EC4899",
    isCustom: false,
    usageCount: 0,
  },
  {
    name: "Expense",
    category: TagCategory.Expense,
    icon: "shopping-cart",
    color: "#EF4444",
    isCustom: false,
    usageCount: 0,
  },
  {
    name: "Transfer",
    category: TagCategory.Transfer,
    icon: "arrow-right-left",
    color: "#6B7280",
    isCustom: false,
    usageCount: 0,
  },
  {
    name: "Faucet",
    category: TagCategory.Faucet,
    icon: "droplet",
    color: "#06B6D4",
    isCustom: false,
    usageCount: 0,
  },
  {
    name: "Trading",
    category: TagCategory.Trading,
    icon: "candlestick-chart",
    color: "#F97316",
    isCustom: false,
    usageCount: 0,
  },
  {
    name: "P2P",
    category: TagCategory.P2P,
    icon: "users",
    color: "#14B8A6",
    isCustom: false,
    usageCount: 0,
  },
  {
    name: "Staking",
    category: TagCategory.Staking,
    icon: "lock",
    color: "#A855F7",
    isCustom: false,
    usageCount: 0,
  },
  {
    name: "Airdrop",
    category: TagCategory.Airdrop,
    icon: "parachute",
    color: "#0EA5E9",
    isCustom: false,
    usageCount: 0,
  },
];
