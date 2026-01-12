import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ImageDropzone } from "@/components/ui/ImageDropzone";
import { LoadingState } from "@/components/ui/LoadingState";
import { RecipeCard, Recipe } from "@/components/ui/RecipeCard";
import { analyzeImage } from "@/lib/api/analyzeImage";
import { useToast } from "@/hooks/use-toast";

interface DiscoverDishProps {
  onAddToMenu: (recipe: Recipe) => void;
}

type LoadingStep = { id: string; text: string; status: "pending" | "active" | "completed" };

const LOADING_STEPS: LoadingStep[] = [
  { id: "1", text: "Enviando imagem para análise...", status: "pending" },
  { id: "2", text: "Identificando o prato com IA...", status: "pending" },
  { id: "3", text: "Analisando ingredientes visíveis...", status: "pending" },
  { id: "4", text: "Montando receita detalhada...", status: "pending" },
];

export function DiscoverDish({ onAddToMenu }: DiscoverDishProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [discoveredRecipe, setDiscoveredRecipe] = useState<Recipe | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dishName, setDishName] = useState<string | null>(null);
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
    setDiscoveredRecipe(null);
    setDishName(null);
    setLoadingSteps(LOADING_STEPS.map(s => ({ ...s, status: "pending" as const })));
    setProgress(0);
    
    // Step 1: Uploading
    updateStep(0, "active");
    await new Promise(resolve => setTimeout(resolve, 500));
    updateStep(0, "completed");
    
    // Step 2: Identifying
    updateStep(1, "active");
    
    // Call AI API
    const result = await analyzeImage(file, "dish");
    
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
    
    // Step 3: Analyzing
    updateStep(2, "active");
    await new Promise(resolve => setTimeout(resolve, 400));
    updateStep(2, "completed");
    
    // Step 4: Generating
    updateStep(3, "active");
    await new Promise(resolve => setTimeout(resolve, 400));
    updateStep(3, "completed");
    
    if (result.recipe) {
      setDiscoveredRecipe(result.recipe);
      if (result.dishName) {
        setDishName(result.dishName);
      }
    }
    
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setDiscoveredRecipe(null);
    setUploadedImage(null);
    setDishName(null);
    setLoadingSteps(LOADING_STEPS.map(s => ({ ...s, status: "pending" as const })));
    setProgress(0);
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Descobrir Prato</h1>
        <p className="text-muted-foreground mt-1">
          Fotografe qualquer prato e a IA revelará a receita
        </p>
      </div>

      {!discoveredRecipe && !isAnalyzing && (
        <ImageDropzone 
          onImageSelect={handleImageSelect}
          title="Fotografe o prato"
          subtitle="A IA vai identificar e revelar a receita"
        />
      )}

      {isAnalyzing && (
        <div className="space-y-6 fade-in">
          {/* Uploaded Image Preview */}
          {uploadedImage && (
            <div className="relative rounded-3xl overflow-hidden aspect-video">
              <img 
                src={uploadedImage} 
                alt="Prato" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-foreground">
                  🔍 Identificando prato...
                </span>
              </div>
            </div>
          )}

          <LoadingState steps={loadingSteps} progress={progress} />
        </div>
      )}

      {discoveredRecipe && !isAnalyzing && (
        <div className="space-y-6 fade-in">
          {/* Back Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Descobrir outro</span>
          </button>

          {/* Uploaded Image with dish name */}
          {uploadedImage && (
            <div className="rounded-3xl overflow-hidden aspect-video relative">
              <img 
                src={uploadedImage} 
                alt="Prato descoberto" 
                className="w-full h-full object-cover"
              />
              {dishName && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="text-white font-semibold">Identificado: {dishName}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recipe Card */}
          <RecipeCard 
            recipe={discoveredRecipe}
            onAddToMenu={() => onAddToMenu(discoveredRecipe)}
          />
        </div>
      )}
    </div>
  );
}
