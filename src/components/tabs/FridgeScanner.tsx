import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { ImageDropzone } from "@/components/ui/ImageDropzone";
import { LoadingState } from "@/components/ui/LoadingState";
import { RecipeCard, Recipe } from "@/components/ui/RecipeCard";

interface FridgeScannerProps {
  onAddToMenu: (recipe: Recipe) => void;
}

type LoadingStep = { id: string; text: string; status: "pending" | "active" | "completed" };

const LOADING_STEPS: LoadingStep[] = [
  { id: "1", text: "Identificando ingredientes...", status: "pending" },
  { id: "2", text: "Analisando combinações...", status: "pending" },
  { id: "3", text: "Buscando temperos ideais...", status: "pending" },
  { id: "4", text: "Gerando receita completa...", status: "pending" },
];

export function FridgeScanner({ onAddToMenu }: FridgeScannerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loadingSteps, setLoadingSteps] = useState(LOADING_STEPS);
  const [progress, setProgress] = useState(0);

  const simulateLoading = async () => {
    const stepDelay = 800;
    
    for (let i = 0; i < LOADING_STEPS.length; i++) {
      // Set current step to active
      setLoadingSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx < i ? "completed" : idx === i ? "active" : "pending"
      })));
      setProgress(((i + 0.5) / LOADING_STEPS.length) * 100);
      
      await new Promise(resolve => setTimeout(resolve, stepDelay));
      
      // Complete current step
      setLoadingSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx <= i ? "completed" : idx === i + 1 ? "active" : "pending"
      })));
      setProgress(((i + 1) / LOADING_STEPS.length) * 100);
    }
  };

  const handleImageSelect = async (file: File) => {
    setUploadedImage(URL.createObjectURL(file));
    setIsAnalyzing(true);
    setGeneratedRecipe(null);
    setLoadingSteps(LOADING_STEPS);
    setProgress(0);
    
    await simulateLoading();
    
    const mockRecipe: Recipe = {
      id: crypto.randomUUID(),
      name: "Salada Caesar Mediterrânea",
      time: "25 min",
      difficulty: "Fácil",
      servings: 2,
      calories: 380,
      ingredients: [
        "200g de alface romana fresca",
        "100g de parmesão ralado",
        "150g de tomate cereja",
        "80g de croutons artesanais",
        "4 colheres de molho Caesar",
        "Azeite extra virgem a gosto"
      ],
      steps: [
        "Lave e seque bem as folhas de alface romana, rasgando em pedaços médios.",
        "Corte os tomates cereja ao meio e reserve.",
        "Em uma tigela grande, misture a alface, tomates e croutons.",
        "Regue com o molho Caesar e misture delicadamente.",
        "Finalize com parmesão ralado generosamente por cima e um fio de azeite."
      ]
    };
    
    setGeneratedRecipe(mockRecipe);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setGeneratedRecipe(null);
    setUploadedImage(null);
    setLoadingSteps(LOADING_STEPS);
    setProgress(0);
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Scanner de Geladeira</h1>
        <p className="text-muted-foreground mt-1">
          Fotografe seus ingredientes e receba uma receita personalizada
        </p>
      </div>

      {!generatedRecipe && !isAnalyzing && (
        <ImageDropzone 
          onImageSelect={handleImageSelect}
          title="Fotografe seus ingredientes"
          subtitle="Faremos mágica com o que você tem"
        />
      )}

      {isAnalyzing && (
        <div className="space-y-6 fade-in">
          {/* Uploaded Image Preview */}
          {uploadedImage && (
            <div className="relative rounded-3xl overflow-hidden aspect-video">
              <img 
                src={uploadedImage} 
                alt="Ingredientes" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-foreground">
                  Analisando imagem...
                </span>
              </div>
            </div>
          )}

          <LoadingState steps={loadingSteps} progress={progress} />
        </div>
      )}

      {generatedRecipe && !isAnalyzing && (
        <div className="space-y-6 fade-in">
          {/* Back Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Nova análise</span>
          </button>

          {/* Uploaded Image */}
          {uploadedImage && (
            <div className="rounded-3xl overflow-hidden aspect-video">
              <img 
                src={uploadedImage} 
                alt="Ingredientes" 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Recipe Card */}
          <RecipeCard 
            recipe={generatedRecipe}
            onAddToMenu={() => onAddToMenu(generatedRecipe)}
          />
        </div>
      )}
    </div>
  );
}
