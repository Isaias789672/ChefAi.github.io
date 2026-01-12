import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ImageDropzone } from "@/components/ui/ImageDropzone";
import { LoadingState } from "@/components/ui/LoadingState";
import { RecipeCard, Recipe } from "@/components/ui/RecipeCard";
import { analyzeImage } from "@/lib/api/analyzeImage";
import { useToast } from "@/hooks/use-toast";

interface FridgeScannerProps {
  onAddToMenu: (recipe: Recipe) => void;
}

type LoadingStep = { id: string; text: string; status: "pending" | "active" | "completed" };

const LOADING_STEPS: LoadingStep[] = [
  { id: "1", text: "Enviando imagem para análise...", status: "pending" },
  { id: "2", text: "Identificando ingredientes com IA...", status: "pending" },
  { id: "3", text: "Buscando combinações ideais...", status: "pending" },
  { id: "4", text: "Gerando receita personalizada...", status: "pending" },
];

export function FridgeScanner({ onAddToMenu }: FridgeScannerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(LOADING_STEPS);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const updateStep = (stepIndex: number, status: "active" | "completed") => {
    setLoadingSteps(prev => prev.map((step, idx) => ({
      ...step,
      status: idx < stepIndex ? "completed" : idx === stepIndex ? status : "pending"
    })));
    setProgress(((stepIndex + (status === "completed" ? 1 : 0.5)) / LOADING_STEPS.length) * 100);
  };

  const handleImageSelect = async (file: File) => {
    setUploadedImage(URL.createObjectURL(file));
    setIsAnalyzing(true);
    setGeneratedRecipe(null);
    setDetectedIngredients([]);
    setLoadingSteps(LOADING_STEPS.map(s => ({ ...s, status: "pending" as const })));
    setProgress(0);
    
    // Step 1: Uploading
    updateStep(0, "active");
    await new Promise(resolve => setTimeout(resolve, 500));
    updateStep(0, "completed");
    
    // Step 2: Identifying
    updateStep(1, "active");
    
    // Call AI API
    const result = await analyzeImage(file, "fridge");
    
    if (result.error) {
      toast({
        title: "Erro na análise",
        description: result.error,
        variant: "destructive",
      });
      setIsAnalyzing(false);
      setUploadedImage(null);
      return;
    }
    
    updateStep(1, "completed");
    
    // Step 3: Combining
    updateStep(2, "active");
    await new Promise(resolve => setTimeout(resolve, 400));
    updateStep(2, "completed");
    
    // Step 4: Generating
    updateStep(3, "active");
    await new Promise(resolve => setTimeout(resolve, 400));
    updateStep(3, "completed");
    
    if (result.recipe) {
      setGeneratedRecipe(result.recipe);
      if (result.ingredients) {
        setDetectedIngredients(result.ingredients);
      }
    }
    
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setGeneratedRecipe(null);
    setUploadedImage(null);
    setDetectedIngredients([]);
    setLoadingSteps(LOADING_STEPS.map(s => ({ ...s, status: "pending" as const })));
    setProgress(0);
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Scanner de Geladeira</h1>
        <p className="text-muted-foreground mt-1">
          Fotografe seus ingredientes e a IA criará uma receita personalizada
        </p>
      </div>

      {!generatedRecipe && !isAnalyzing && (
        <ImageDropzone 
          onImageSelect={handleImageSelect}
          title="Fotografe seus ingredientes"
          subtitle="A IA vai analisar e criar uma receita"
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
                  🤖 Analisando com IA...
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
            <div className="rounded-3xl overflow-hidden aspect-video relative">
              <img 
                src={uploadedImage} 
                alt="Ingredientes" 
                className="w-full h-full object-cover"
              />
              {/* Detected ingredients overlay */}
              {detectedIngredients.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white/80 text-xs mb-2">Ingredientes detectados:</p>
                  <div className="flex flex-wrap gap-2">
                    {detectedIngredients.slice(0, 6).map((ing, i) => (
                      <span key={i} className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs">
                        {ing}
                      </span>
                    ))}
                    {detectedIngredients.length > 6 && (
                      <span className="px-2 py-1 bg-primary/80 rounded-full text-white text-xs">
                        +{detectedIngredients.length - 6}
                      </span>
                    )}
                  </div>
                </div>
              )}
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
