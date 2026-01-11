import { useState } from "react";
import { Refrigerator, Sparkles } from "lucide-react";
import { ImageDropzone } from "@/components/ui/ImageDropzone";
import { LoadingState } from "@/components/ui/LoadingState";
import { RecipeCard, Recipe } from "@/components/ui/RecipeCard";

interface FridgeScannerProps {
  onAddToMenu: (recipe: Recipe) => void;
}

export function FridgeScanner({ onAddToMenu }: FridgeScannerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);

  const handleImageSelect = async (file: File) => {
    setIsAnalyzing(true);
    setGeneratedRecipe(null);
    
    // Simulating AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockIngredients = ["Tomates", "Cebola", "Alho", "Azeite", "Manjericão", "Queijo Parmesão", "Macarrão"];
    setDetectedIngredients(mockIngredients);
    
    const mockRecipe: Recipe = {
      id: crypto.randomUUID(),
      name: "Macarrão ao Molho de Tomate Fresco",
      time: "35 min",
      difficulty: "Fácil",
      servings: 4,
      ingredients: mockIngredients,
      steps: [
        "Ferva água com sal e cozinhe o macarrão até ficar al dente.",
        "Em uma panela, refogue o alho e a cebola picados no azeite.",
        "Adicione os tomates picados e deixe cozinhar por 15 minutos.",
        "Tempere com sal, pimenta e manjericão fresco.",
        "Misture o molho ao macarrão e finalize com queijo parmesão ralado."
      ]
    };
    
    setGeneratedRecipe(mockRecipe);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setGeneratedRecipe(null);
    setDetectedIngredients([]);
  };

  return (
    <div className="slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
          <Refrigerator className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Scanner de Geladeira</h2>
          <p className="text-sm text-muted-foreground">Tire uma foto dos seus ingredientes</p>
        </div>
      </div>

      {!generatedRecipe && !isAnalyzing && (
        <ImageDropzone 
          onImageSelect={handleImageSelect}
          title="Fotografe sua geladeira"
          subtitle="A IA vai identificar os ingredientes"
        />
      )}

      {isAnalyzing && (
        <LoadingState 
          message="Analisando ingredientes..."
          submessage="Identificando itens e criando receita"
        />
      )}

      {generatedRecipe && !isAnalyzing && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-accent">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-medium text-accent-foreground">Ingredientes Detectados</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {detectedIngredients.map((ingredient, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 bg-background rounded-full text-sm font-medium text-foreground"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Receita Sugerida</h3>
            <RecipeCard 
              recipe={generatedRecipe}
              onAddToMenu={() => onAddToMenu(generatedRecipe)}
            />
          </div>

          <div className="p-4 rounded-xl bg-muted">
            <h4 className="font-semibold text-foreground mb-3">Modo de Preparo</h4>
            <ol className="space-y-3">
              {generatedRecipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl border-2 border-border text-foreground font-medium hover:bg-muted transition-colors"
          >
            Escanear novamente
          </button>
        </div>
      )}
    </div>
  );
}
