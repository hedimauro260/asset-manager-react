import { useState, useEffect, useCallback } from "react";
import { AssetRepository } from "../database/repositories";
import type { Asset } from "../types";

export interface UseAssetsReturn {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAssets(): UseAssetsReturn {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AssetRepository.getAll();
      setAssets(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load assets";
      setError(message);
      console.error("useAssets error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  return {
    assets,
    loading,
    error,
    refresh: loadAssets,
  };
}
