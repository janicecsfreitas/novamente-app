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

const commonFoods: FoodSearchResult[] = [
  { id: "1", name: "Arroz branco cozido", calories: 130, carbs: 28, protein: 2.7, fat: 0.3, servingSize: "100g" },
  { id: "2", name: "Feijão preto cozido", calories: 116, carbs: 21, protein: 8, fat: 0.5, servingSize: "100g" },
  { id: "3", name: "Frango cozido", calories: 165, carbs: 0, protein: 31, fat: 3.6, servingSize: "100g" },
  { id: "4", name: "Bife bovino grelhado", calories: 271, carbs: 0, protein: 25, fat: 19, servingSize: "100g" },
  { id: "5", name: "Ovo cozido", calories: 155, carbs: 1.1, protein: 13, fat: 11, servingSize: "100g" },
  { id: "6", name: "Pão francês", calories: 265, carbs: 48, protein: 9, fat: 3.2, servingSize: "100g" },
  { id: "7", name: "Leite integral", calories: 60, carbs: 4.8, protein: 3, fat: 3.3, servingSize: "100ml" },
  { id: "8", name: "Banana prata", calories: 88, carbs: 23, protein: 1.1, fat: 0.3, servingSize: "100g" },
  { id: "9", name: "Maçã gala", calories: 52, carbs: 14, protein: 0.3, fat: 0.2, servingSize: "100g" },
  { id: "10", name: "Batata cozida", calories: 87, carbs: 20, protein: 1.9, fat: 0.1, servingSize: "100g" },
  { id: "11", name: "Macarrão cozido", calories: 131, carbs: 25, protein: 5, fat: 1.1, servingSize: "100g" },
  { id: "12", name: "Alface", calories: 15, carbs: 2.9, protein: 1.4, fat: 0.2, servingSize: "100g" },
  { id: "13", name: "Tomate", calories: 18, carbs: 3.9, protein: 0.9, fat: 0.2, servingSize: "100g" },
  { id: "14", name: "Cebola", calories: 40, carbs: 9, protein: 1.1, fat: 0.1, servingSize: "100g" },
  { id: "15", name: "Azeite", calories: 884, carbs: 0, protein: 0, fat: 100, servingSize: "100ml" },
  { id: "16", name: "Sal", calories: 0, carbs: 0, protein: 0, fat: 0, servingSize: "1g" },
  { id: "17", name: "Açúcar refinado", calories: 387, carbs: 100, protein: 0, fat: 0, servingSize: "100g" },
  { id: "18", name: "Iogurte natural", calories: 61, carbs: 4.7, protein: 3.5, fat: 3.3, servingSize: "100g" },
  { id: "19", name: "Queijo mussarela", calories: 280, carbs: 2.2, protein: 28, fat: 17, servingSize: "100g" },
  { id: "20", name: "Presunto", calories: 145, carbs: 1.5, protein: 21, fat: 5.5, servingSize: "100g" },
  { id: "21", name: "Whey protein", calories: 120, carbs: 3, protein: 24, fat: 1, servingSize: "30g" },
  { id: "22", name: "Aveia", calories: 389, carbs: 66, protein: 17, fat: 7, servingSize: "100g" },
  { id: "23", name: "Amendoim", calories: 567, carbs: 20, protein: 25, fat: 49, servingSize: "100g" },
  { id: "24", name: "Abacate", calories: 160, carbs: 9, protein: 2, fat: 15, servingSize: "100g" },
  { id: "25", name: "Salmão grelhado", calories: 206, carbs: 0, protein: 20, fat: 13, servingSize: "100g" },
  { id: "26", name: "Atum enlatado", calories: 116, carbs: 0, protein: 26, fat: 1, servingSize: "100g" },
  { id: "27", name: "Brócolis", calories: 34, carbs: 7, protein: 2.8, fat: 0.4, servingSize: "100g" },
  { id: "28", name: "Cenoura", calories: 41, carbs: 10, protein: 0.9, fat: 0.2, servingSize: "100g" },
  { id: "29", name: "Pepino", calories: 16, carbs: 3.6, protein: 0.7, fat: 0.1, servingSize: "100g" },
  { id: "30", name: "café coado", calories: 2, carbs: 0, protein: 0.3, fat: 0, servingSize: "100ml" },
];

export function useFoodSearch() {
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const searchFood = useCallback(async (query: string) => {
    if (!query || query.length < 1) {
      setResults([]);
      return;
    }

    setLoading(true);

    const q = query.toLowerCase();
    const filtered = commonFoods
      .filter(f => f.name.toLowerCase().includes(q))
      .slice(0, 8);

    setResults(filtered);
    setLoading(false);
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    loading,
    searchFood,
    clearResults,
  };
}