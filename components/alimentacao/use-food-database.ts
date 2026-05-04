"use client";

import { useCallback, useState } from "react";

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  serving: string;
  category: string;
}

const foodDatabase: FoodItem[] = [
  // Cereais e massas
  { id: "1", name: "Arroz branco cozido", calories: 130, carbs: 28, protein: 2.7, fat: 0.3, serving: "100g", category: "Cereais" },
  { id: "2", name: "Arroz integral cozido", calories: 112, carbs: 23, protein: 2.6, fat: 0.9, serving: "100g", category: "Cereais" },
  { id: "3", name: "Feijão preto cozido", calories: 116, carbs: 21, protein: 8.9, fat: 0.5, serving: "100g", category: "Leguminosas" },
  { id: "4", name: "Feijão Carioca cozido", calories: 118, carbs: 21, protein: 8.7, fat: 0.5, serving: "100g", category: "Leguminosas" },
  { id: "5", name: "Lentilha cozida", calories: 116, carbs: 20, protein: 9, fat: 0.4, serving: "100g", category: "Leguminosas" },
  { id: "6", name: "Grão de bico cozido", calories: 164, carbs: 27, protein: 9, fat: 2.6, serving: "100g", category: "Leguminosas" },
  { id: "7", name: "Macarrão cozido", calories: 131, carbs: 25, protein: 5, fat: 1.1, serving: "100g", category: "Massas" },
  { id: "8", name: "Macarrão integral cozido", calories: 124, carbs: 26, protein: 5.3, fat: 0.5, serving: "100g", category: "Massas" },
  { id: "9", name: "Aveia em flocos", calories: 389, carbs: 66, protein: 17, fat: 7, serving: "100g", category: "Cereais" },
  { id: "10", name: "Pão francês", calories: 265, carbs: 48, protein: 9, fat: 3.2, serving: "100g", category: "Padaria" },
  { id: "11", name: "Pão integral", calories: 247, carbs: 41, protein: 13, fat: 4.2, serving: "100g", category: "Padaria" },
  { id: "12", name: "Torrada", calories: 406, carbs: 72, protein: 13, fat: 9, serving: "100g", category: "Padaria" },
  
  // Proteínas
  { id: "13", name: "Frango cozido", calories: 165, carbs: 0, protein: 31, fat: 3.6, serving: "100g", category: "Carnes" },
  { id: "14", name: "Frango grelhado", calories: 165, carbs: 0, protein: 31, fat: 3.6, serving: "100g", category: "Carnes" },
  { id: "15", name: "Frango em strips", calories: 163, carbs: 0, protein: 30, fat: 3.4, serving: "100g", category: "Carnes" },
  { id: "16", name: "Bife bovino grelhado", calories: 271, carbs: 0, protein: 25, fat: 19, serving: "100g", category: "Carnes" },
  { id: "17", name: "Carne moída cozida", calories: 250, carbs: 0, protein: 26, fat: 15, serving: "100g", category: "Carnes" },
  { id: "18", name: "Almôndega", calories: 280, carbs: 10, protein: 18, fat: 19, serving: "100g", category: "Carnes" },
  { id: "19", name: "Ovo cozido", calories: 155, carbs: 1.1, protein: 13, fat: 11, serving: "2 unidades", category: "Ovos" },
  { id: "20", name: "Ovo frito", calories: 196, carbs: 0.4, protein: 14, fat: 15, serving: "1 unidade", category: "Ovos" },
  { id: "21", name: "Omelete", calories: 184, carbs: 2, protein: 12, fat: 14, serving: "100g", category: "Ovos" },
  { id: "22", name: "Clara de ovo", calories: 52, carbs: 0.7, protein: 11, fat: 0.2, serving: "100g", category: "Ovos" },
  { id: "23", name: "Salmão grelhado", calories: 206, carbs: 0, protein: 20, fat: 13, serving: "100g", category: "Peixes" },
  { id: "24", name: "Atum enlatado", calories: 116, carbs: 0, protein: 26, fat: 1, serving: "100g", category: "Peixes" },
  { id: "25", name: "Filé de tilápia", calories: 128, carbs: 0, protein: 26, fat: 2.7, serving: "100g", category: "Peixes" },
  { id: "26", name: "Bacalhau cozido", calories: 105, carbs: 0, protein: 23, fat: 0.7, serving: "100g", category: "Peixes" },
  { id: "27", name: "Camarão cozido", calories: 85, carbs: 0, protein: 18, fat: 1, serving: "100g", category: "Frutos do mar" },
  { id: "28", name: "Whey protein isolado", calories: 120, carbs: 1, protein: 24, fat: 1, serving: "30g", category: "Suplementos" },
  { id: "29", name: "Whey protein concentrado", calories: 130, carbs: 3, protein: 24, fat: 2, serving: "30g", category: "Suplementos" },
  { id: "30", name: "Caseína", calories: 120, carbs: 3, protein: 24, fat: 1, serving: "30g", category: "Suplementos" },

  // Laticínios
  { id: "31", name: "Leite integral", calories: 60, carbs: 4.8, protein: 3, fat: 3.3, serving: "100ml", category: "Laticínios" },
  { id: "32", name: "Leite desnatado", calories: 34, carbs: 5, protein: 3.4, fat: 0.1, serving: "100ml", category: "Laticínios" },
  { id: "33", name: "Leite semi desnatado", calories: 47, carbs: 4.8, protein: 3.2, fat: 1.5, serving: "100ml", category: "Laticínios" },
  { id: "34", name: "Iogurte natural", calories: 61, carbs: 4.7, protein: 3.5, fat: 3.3, serving: "100g", category: "Laticínios" },
  { id: "35", name: "Iogurte grego", calories: 97, carbs: 3.6, protein: 9, fat: 5, serving: "100g", category: "Laticínios" },
  { id: "36", name: "Iogurte desnatado", calories: 41, carbs: 5, protein: 3.8, fat: 0.2, serving: "100g", category: "Laticínios" },
  { id: "37", name: "Queijo mussarela", calories: 280, carbs: 2.2, protein: 28, fat: 17, serving: "100g", category: "Queijos" },
  { id: "38", name: "Queijo coalho", calories: 321, carbs: 2.6, protein: 20, fat: 26, serving: "100g", category: "Queijos" },
  { id: "39", name: "Ricota", calories: 174, carbs: 3, protein: 11, fat: 13, serving: "100g", category: "Queijos" },
  { id: "40", name: "Parmegiano ralado", calories: 431, carbs: 4, protein: 38, fat: 29, serving: "100g", category: "Queijos" },
  { id: "41", name: "Cream cheese", calories: 342, carbs: 4, protein: 6, fat: 34, serving: "100g", category: "Queijos" },
  { id: "42", name: "Requeijão", calories: 196, carbs: 3.5, protein: 10, fat: 16, serving: "100g", category: "Queijos" },
  { id: "43", name: "Presunto magro", calories: 104, carbs: 1.5, protein: 19, fat: 2.1, serving: "100g", category: "Frios" },
  { id: "44", name: "Peito de peru", calories: 85, carbs: 0.4, protein: 17, fat: 1.3, serving: "100g", category: "Frios" },
  { id: "45", name: "Salame", calories: 336, carbs: 2, protein: 18, fat: 28, serving: "100g", category: "Frios" },
  { id: "46", name: "Bacon", calories: 541, carbs: 0, protein: 37, fat: 42, serving: "100g", category: "Frios" },

  // Gorduras
  { id: "47", name: "Azeite de oliva", calories: 884, carbs: 0, protein: 0, fat: 100, serving: "100ml", category: "Óleos" },
  { id: "48", name: "Óleo de soja", calories: 884, carbs: 0, protein: 0, fat: 100, serving: "100ml", category: "Óleos" },
  { id: "49", name: "Manteiga", calories: 717, carbs: 0.1, protein: 0.9, fat: 81, serving: "100g", category: "Gorduras" },
  { id: "50", name: "Margarina", calories: 717, carbs: 0, protein: 0, fat: 80, serving: "100g", category: "Gorduras" },

  // Frutas
  { id: "51", name: "Banana prata", calories: 88, carbs: 23, protein: 1.1, fat: 0.3, serving: "1 unidade", category: "Frutas" },
  { id: "52", name: "Banana nanica", calories: 86, carbs: 22, protein: 1.3, fat: 0.4, serving: "1 unidade", category: "Frutas" },
  { id: "53", name: "Maçã gala", calories: 52, carbs: 14, protein: 0.3, fat: 0.2, serving: "1 unidade", category: "Frutas" },
  { id: "54", name: "Maçã Fuji", calories: 52, carbs: 14, protein: 0.3, fat: 0.2, serving: "1 unidade", category: "Frutas" },
  { id: "55", name: "Laranja", calories: 47, carbs: 12, protein: 0.9, fat: 0.1, serving: "1 unidade", category: "Frutas" },
  { id: "56", name: "Uva", calories: 69, carbs: 18, protein: 0.7, fat: 0.2, serving: "100g", category: "Frutas" },
  { id: "57", name: "Morango", calories: 32, carbs: 7.7, protein: 0.7, fat: 0.3, serving: "100g", category: "Frutas" },
  { id: "58", name: "Abacate", calories: 160, carbs: 9, protein: 2, fat: 15, serving: "100g", category: "Frutas" },
  { id: "59", name: "Mamão", calories: 43, carbs: 11, protein: 0.5, fat: 0.3, serving: "100g", category: "Frutas" },
  { id: "60", name: "Melancia", calories: 30, carbs: 7.5, protein: 0.6, fat: 0.2, serving: "100g", category: "Frutas" },

  // Vegetais
  { id: "61", name: "Batata cozida", calories: 87, carbs: 20, protein: 1.9, fat: 0.1, serving: "100g", category: "Vegetais" },
  { id: "62", name: "Batata doce", calories: 86, carbs: 20, protein: 1.6, fat: 0.1, serving: "100g", category: "Vegetais" },
  { id: "63", name: "Inhame", calories: 118, carbs: 28, protein: 1.5, fat: 0.2, serving: "100g", category: "Vegetais" },
  { id: "64", name: "Mandioca", calories: 151, carbs: 36, protein: 1.4, fat: 0.3, serving: "100g", category: "Vegetais" },
  { id: "65", name: "Cenoura", calories: 41, carbs: 10, protein: 0.9, fat: 0.2, serving: "100g", category: "Vegetais" },
  { id: "66", name: "Beterraba", calories: 43, carbs: 10, protein: 1.6, fat: 0.2, serving: "100g", category: "Vegetais" },
  { id: "67", name: "Cebola", calories: 40, carbs: 9, protein: 1.1, fat: 0.1, serving: "100g", category: "Vegetais" },
  { id: "68", name: "Alho", calories: 149, carbs: 33, protein: 6.4, fat: 0.5, serving: "100g", category: "Vegetais" },
  { id: "69", name: "Tomate", calories: 18, carbs: 3.9, protein: 0.9, fat: 0.2, serving: "100g", category: "Vegetais" },
  { id: "70", name: "Alface", calories: 15, carbs: 2.9, protein: 1.4, fat: 0.2, serving: "100g", category: "Vegetais" },
  { id: "71", name: "Brócolis", calories: 34, carbs: 7, protein: 2.8, fat: 0.4, serving: "100g", category: "Vegetais" },
  { id: "72", name: "Espinafre", calories: 23, carbs: 3.6, protein: 2.9, fat: 0.4, serving: "100g", category: "Vegetais" },
  { id: "73", name: "Repolho", calories: 25, carbs: 6, protein: 1.3, fat: 0.1, serving: "100g", category: "Vegetais" },
  { id: "74", name: "Pepino", calories: 16, carbs: 3.6, protein: 0.7, fat: 0.1, serving: "100g", category: "Vegetais" },
  { id: "75", name: "Vagem", calories: 31, carbs: 7, protein: 1.8, fat: 0.2, serving: "100g", category: "Vegetais" },
  { id: "76", name: "Abóbora", calories: 26, carbs: 6.5, protein: 1, fat: 0.1, serving: "100g", category: "Vegetais" },
  { id: "77", name: "Berinjela", calories: 25, carbs: 6, protein: 1, fat: 0.2, serving: "100g", category: "Vegetais" },
  { id: "78", name: "Pimenta", calories: 40, carbs: 9, protein: 2, fat: 0.4, serving: "100g", category: "Temperos" },
  { id: "79", name: "Ervilha congelada", calories: 77, carbs: 14, protein: 5, fat: 0.4, serving: "100g", category: "Leguminosas" },
  { id: "80", name: "Milho verde", calories: 86, carbs: 19, protein: 3.3, fat: 1.4, serving: "100g", category: "Vegetais" },

  // Otros
  { id: "81", name: "Açúcar refinado", calories: 387, carbs: 100, protein: 0, fat: 0, serving: "100g", category: "Doces" },
  { id: "82", name: "Açúcar mascavo", calories: 380, carbs: 98, protein: 0.5, fat: 0, serving: "100g", category: "Doces" },
  { id: "83", name: "Mel", calories: 304, carbs: 82, protein: 0.3, fat: 0, serving: "100g", category: "Doces" },
  { id: "84", name: "Adoçante stevi", calories: 0, carbs: 0, protein: 0, fat: 0, serving: "1g", category: "Doces" },
  { id: "85", name: "Sal", calories: 0, carbs: 0, protein: 0, fat: 0, serving: "1g", category: "Temperos" },
  { id: "86", name: " Café coado", calories: 2, carbs: 0, protein: 0.3, fat: 0, serving: "100ml", category: "Bebidas" },
  { id: "87", name: "Achocolatado", calories: 80, carbs: 16, protein: 2.5, fat: 1, serving: "100ml", category: "Bebidas" },
  { id: "88", name: "Suco de laranja", calories: 45, carbs: 10, protein: 0.7, fat: 0.2, serving: "100ml", category: "Bebidas" },
  { id: "89", name: "Suco de uva", calories: 60, carbs: 15, protein: 0.4, fat: 0.1, serving: "100ml", category: "Bebidas" },
  { id: "90", name: "Cerveja", calories: 43, carbs: 3.6, protein: 0.5, fat: 0, serving: "100ml", category: "Bebidas" },
  { id: "91", name: "Vinho tinto", calories: 83, carbs: 2.6, protein: 0.1, fat: 0, serving: "100ml", category: "Bebidas" },
  { id: "92", name: "Amendoim", calories: 567, carbs: 20, protein: 25, fat: 49, serving: "100g", category: "Castanhas" },
  { id: "93", name: "Castanha do Pará", calories: 656, carbs: 12, protein: 14, fat: 66, serving: "100g", category: "Castanhas" },
  { id: "94", name: "Nozes", calories: 654, carbs: 14, protein: 15, fat: 65, serving: "100g", category: "Castanhas" },
  { id: "95", name: "Pistache", calories: 560, carbs: 28, protein: 20, fat: 45, serving: "100g", category: "Castanhas" },
  { id: "96", name: " pasta de amendoim", calories: 588, carbs: 20, protein: 25, fat: 50, serving: "100g", category: "Castanhas" },
  { id: "97", name: "Granola", calories: 471, carbs: 64, protein: 10, fat: 20, serving: "100g", category: "Cereais" },
  { id: "98", name: "Goiabada", calories: 323, carbs: 79, protein: 1.3, fat: 0.4, serving: "100g", category: "Doces" },
  { id: "99", name: "Doce de leite", calories: 327, carbs: 55, protein: 8, fat: 8, serving: "100g", category: "Doces" },
  { id: "100", name: "Leite condensado", calories: 321, carbs: 54, protein: 8, fat: 8, serving: "100g", category: "Laticínios" },
];

export function useFoodDatabase() {
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  const searchFood = useCallback((query: string) => {
    if (!query || query.length < 1) {
      setResults([]);
      return;
    }

    setLoading(true);

    const q = query.toLowerCase();
    const filtered = foodDatabase
      .filter(f => f.name.toLowerCase().includes(q))
      .slice(0, 15);

    setResults(filtered);
    setLoading(false);
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  const getFoodById = useCallback((id: string) => {
    return foodDatabase.find(f => f.id === id);
  }, []);

  return {
    results,
    loading,
    searchFood,
    clearResults,
    getFoodById,
  };
}