import { useState } from "react";
import { UtensilsCrossed, ChefHat, Clock, Users } from "lucide-react";
import { ImageDropzone } from "@/components/ui/ImageDropzone";
import { LoadingState } from "@/components/ui/LoadingState";
import { Recipe } from "@/components/ui/RecipeCard";

interface DiscoverDishProps {
  onAddToMenu: (recipe: Recipe) => void;
}

export function DiscoverDish({ onAddToMenu }: DiscoverDishProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [discoveredRecipe, setDiscoveredRecipe] = useState<Recipe | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageSelect = async (file: File) => {
    setUploadedImage(URL.createObjectURL(file));
    setIsAnalyzing(true);
    setDiscoveredRecipe(null);
    
    // Simulating AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockRecipe: Recipe = {
      id: crypto.randomUUID(),
      name: "Tiramisù Clássico Italiano",
      time: "45 min + 4h de geladeira",
      difficulty: "Médio",
      servings: 8,
      ingredients: [
        "500g de mascarpone",
        "4 gemas de ovo",
        "100g de açúcar",
        "300ml de café espresso forte (frio)",
        "3 colheres de sopa de licor de café (Kahlúa)",
        "200g de biscoitos champagne (savoiardi)",
        "Cacau em pó para polvilhar",
        "Raspas de chocolate amargo"
      ],
      steps: [
        "Prepare o café espresso forte e deixe esfriar. Adicione o licor.",
        "Bata as gemas com o açúcar até obter um creme claro e fofo.",
        "Adicione o mascarpone e misture delicadamente até ficar homogêneo.",
        "Mergulhe rapidamente os biscoitos no café (não deixe encharcar).",
        "Monte camadas: biscoitos, creme, biscoitos, creme.",
        "Leve à geladeira por pelo menos 4 horas, ou de um dia para o outro.",
        "Antes de servir, polvilhe generosamente com cacau em pó e raspas de chocolate."
      ]
    };
    
    setDiscoveredRecipe(mockRecipe);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setDiscoveredRecipe(null);
    setUploadedImage(null);
  };

  return (
    <div className="slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
          <UtensilsCrossed className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Descobrir Prato</h2>
          <p className="text-sm text-muted-foreground">Envie uma foto de qualquer prato</p>
        </div>
      </div>

      {!discoveredRecipe && !isAnalyzing && (
        <ImageDropzone 
          onImageSelect={handleImageSelect}
          title="Fotografe o prato"
          subtitle="Descubra como recriar em casa"
        />
      )}

      {isAnalyzing && (
        <LoadingState 
          message="Identificando o prato..."
          submessage="Analisando ingredientes e técnicas"
        />
      )}

      {discoveredRecipe && !isAnalyzing && (
        <div className="space-y-6">
          {uploadedImage && (
            <div className="rounded-2xl overflow-hidden shadow-card">
              <img 
                src={uploadedImage} 
                alt="Prato enviado" 
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          <div className="p-5 rounded-2xl bg-card shadow-card">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <ChefHat className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">{discoveredRecipe.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {discoveredRecipe.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {discoveredRecipe.servings} porções
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Ingredientes</h4>
                <ul className="space-y-1.5">
                  {discoveredRecipe.ingredients.map((ingredient, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Modo de Preparo</h4>
                <ol className="space-y-3">
                  {discoveredRecipe.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <button
              onClick={() => onAddToMenu(discoveredRecipe)}
              className="mt-6 w-full py-3 rounded-xl gradient-hero text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition-opacity"
            >
              Adicionar ao Menu Semanal
            </button>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl border-2 border-border text-foreground font-medium hover:bg-muted transition-colors"
          >
            Descobrir outro prato
          </button>
        </div>
      )}
    </div>
  );
}
