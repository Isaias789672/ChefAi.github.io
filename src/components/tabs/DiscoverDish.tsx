import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ImageDropzone } from "@/components/ui/ImageDropzone";
import { LoadingState } from "@/components/ui/LoadingState";
import { RecipeCard, Recipe } from "@/components/ui/RecipeCard";

interface DiscoverDishProps {
  onAddToMenu: (recipe: Recipe) => void;
}

type LoadingStep = { id: string; text: string; status: "pending" | "active" | "completed" };

const LOADING_STEPS: LoadingStep[] = [
  { id: "1", text: "Identificando o prato...", status: "pending" },
  { id: "2", text: "Analisando ingredientes visíveis...", status: "pending" },
  { id: "3", text: "Calculando proporções...", status: "pending" },
  { id: "4", text: "Montando receita detalhada...", status: "pending" },
];

export function DiscoverDish({ onAddToMenu }: DiscoverDishProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [discoveredRecipe, setDiscoveredRecipe] = useState<Recipe | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loadingSteps, setLoadingSteps] = useState(LOADING_STEPS);
  const [progress, setProgress] = useState(0);

  const simulateLoading = async () => {
    const stepDelay = 900;
    
    for (let i = 0; i < LOADING_STEPS.length; i++) {
      setLoadingSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx < i ? "completed" : idx === i ? "active" : "pending"
      })));
      setProgress(((i + 0.5) / LOADING_STEPS.length) * 100);
      
      await new Promise(resolve => setTimeout(resolve, stepDelay));
      
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
    setDiscoveredRecipe(null);
    setLoadingSteps(LOADING_STEPS);
    setProgress(0);
    
    await simulateLoading();
    
    const mockRecipe: Recipe = {
      id: crypto.randomUUID(),
      name: "Risoto de Cogumelos Trufado",
      time: "45 min",
      difficulty: "Médio",
      servings: 4,
      calories: 520,
      ingredients: [
        "300g de arroz arbório",
        "200g de mix de cogumelos frescos",
        "1L de caldo de legumes quente",
        "100ml de vinho branco seco",
        "50g de manteiga",
        "80g de parmesão ralado",
        "Óleo de trufas para finalizar",
        "Sal e pimenta a gosto"
      ],
      steps: [
        "Em uma panela, refogue os cogumelos na manteiga até dourarem. Reserve.",
        "Na mesma panela, adicione mais manteiga e toste o arroz por 2 minutos.",
        "Adicione o vinho branco e mexa até evaporar completamente.",
        "Adicione o caldo quente aos poucos, mexendo sempre, por cerca de 18-20 minutos.",
        "Quando o arroz estiver al dente, desligue o fogo e adicione o parmesão e os cogumelos.",
        "Finalize com um fio generoso de óleo de trufas e sirva imediatamente."
      ]
    };
    
    setDiscoveredRecipe(mockRecipe);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setDiscoveredRecipe(null);
    setUploadedImage(null);
    setLoadingSteps(LOADING_STEPS);
    setProgress(0);
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Descobrir Prato</h1>
        <p className="text-muted-foreground mt-1">
          Fotografe qualquer prato e descubra como fazer
        </p>
      </div>

      {!discoveredRecipe && !isAnalyzing && (
        <ImageDropzone 
          onImageSelect={handleImageSelect}
          title="Fotografe o prato"
          subtitle="Descubra a receita instantaneamente"
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
                  Identificando prato...
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

          {/* Uploaded Image */}
          {uploadedImage && (
            <div className="rounded-3xl overflow-hidden aspect-video">
              <img 
                src={uploadedImage} 
                alt="Prato descoberto" 
                className="w-full h-full object-cover"
              />
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
