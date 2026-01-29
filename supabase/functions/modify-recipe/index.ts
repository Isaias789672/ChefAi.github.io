import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Recipe {
  name: string;
  description: string;
  time: string;
  calories: number;
  servings: number;
  difficulty: "Fácil" | "Médio" | "Difícil";
  ingredients: string[];
  steps: string[];
  tips?: string;
}

interface ModifyRecipeRequest {
  recipe: Recipe;
  modification: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { recipe, modification }: ModifyRecipeRequest = await req.json();

    if (!recipe || !modification) {
      throw new Error("Receita e modificação são obrigatórios");
    }

    console.log("Modifying recipe:", recipe.name);
    console.log("Modification requested:", modification);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = `Você é um chef profissional brasileiro. O usuário quer modificar a seguinte receita:

RECEITA ATUAL:
Nome: ${recipe.name}
Descrição: ${recipe.description}
Tempo: ${recipe.time}
Calorias: ${recipe.calories}
Porções: ${recipe.servings}
Dificuldade: ${recipe.difficulty}
Ingredientes: ${recipe.ingredients.join(", ")}
Passos: ${recipe.steps.join(" | ")}
${recipe.tips ? `Dicas: ${recipe.tips}` : ""}

MODIFICAÇÃO SOLICITADA: "${modification}"

Crie uma NOVA versão da receita aplicando a modificação. Mantenha o espírito da receita original, mas adapte conforme solicitado.

Responda APENAS com um JSON válido neste formato:
{
  "name": "Nome da receita modificada",
  "description": "Descrição breve (max 2 linhas)",
  "time": "X min",
  "calories": número,
  "servings": número,
  "difficulty": "Fácil" ou "Médio" ou "Difícil",
  "ingredients": ["ingrediente 1", "ingrediente 2", ...],
  "steps": ["Passo 1", "Passo 2", ...],
  "tips": "Dica opcional"
}`;

    const response = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable API error:", errorText);
      throw new Error("Erro ao modificar receita com IA");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Resposta vazia da IA");
    }

    console.log("AI response:", content);

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Formato de resposta inválido");
    }

    const modifiedRecipe = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!modifiedRecipe.name || !modifiedRecipe.ingredients || !modifiedRecipe.steps) {
      throw new Error("Receita modificada incompleta");
    }

    return new Response(
      JSON.stringify({ recipe: modifiedRecipe }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error modifying recipe:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro ao modificar receita";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
