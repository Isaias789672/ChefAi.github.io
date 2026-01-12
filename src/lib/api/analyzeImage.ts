import { supabase } from "@/integrations/supabase/client";
import { Recipe } from "@/components/ui/RecipeCard";

interface AnalyzeResult {
  success: boolean;
  data?: {
    ingredients?: string[];
    dishName?: string;
    confidence?: string;
    recipe: {
      name: string;
      time: string;
      difficulty: "Fácil" | "Médio" | "Difícil";
      servings: number;
      calories: number;
      ingredients: string[];
      steps: string[];
    };
  };
  error?: string;
}

export async function analyzeImage(
  file: File, 
  type: "fridge" | "dish"
): Promise<{ recipe: Recipe | null; ingredients?: string[]; dishName?: string; error?: string }> {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);
    
    const { data, error } = await supabase.functions.invoke<AnalyzeResult>("analyze-image", {
      body: { image: base64, type },
    });

    if (error) {
      console.error("Function error:", error);
      return { recipe: null, error: error.message || "Erro ao analisar imagem" };
    }

    if (!data?.success || !data?.data?.recipe) {
      return { recipe: null, error: data?.error || "Não foi possível identificar a imagem" };
    }

    const recipeData = data.data.recipe;
    const recipe: Recipe = {
      id: crypto.randomUUID(),
      name: recipeData.name,
      time: recipeData.time,
      difficulty: recipeData.difficulty,
      servings: recipeData.servings,
      calories: recipeData.calories,
      ingredients: recipeData.ingredients,
      steps: recipeData.steps,
    };

    return {
      recipe,
      ingredients: data.data.ingredients,
      dishName: data.data.dishName,
    };
  } catch (err) {
    console.error("Analyze error:", err);
    return { 
      recipe: null, 
      error: err instanceof Error ? err.message : "Erro desconhecido" 
    };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
