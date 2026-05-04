"use client";

import { useCallback, useState } from "react";

export interface FoodSearchResult {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  servingSize: string;
}

export function useOpenFoodSearch() {
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFood = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/openfoodfacts?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      const products = data.products || [];

      if (products.length === 0) {
        setResults([]);
        return;
      }

      const mapped = products
        .filter((p: Record<string, unknown>) => 
          (p.product_name as string) || (p.product_name_en as string)
        )
        .slice(0, 15)
        .map((p: Record<string, unknown>): FoodSearchResult => {
          const nutriments = (p.nutriments as Record<string, unknown>) || {};
          
          return {
            id: String(p.code || p.id || Math.random()),
            name: String(p.product_name || p.product_name_en || "Unknown"),
            brand: p.brands ? String(p.brands) : undefined,
            calories: Math.round(Number(nutriments["energy-kcal_100g"] || nutriments["energy-kcal"] || 0)),
            carbs: Math.round(Number(nutriments["carbohydrates_100g"] || nutriments["carbohydrates"] || 0)),
            protein: Math.round(Number(nutriments["proteins_100g"] || nutriments["proteins"] || 0)),
            fat: Math.round(Number(nutriments["fat_100g"] || nutriments["fat"] || 0)),
            servingSize: "100g",
          };
        });

      setResults(mapped);
    } catch (err) {
      console.error("Search error:", err);
      setError("Erro ao buscar");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    loading,
    error,
    searchFood,
    clearResults,
  };
}