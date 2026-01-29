import { useState } from "react";
import { X, Wand2, Loader2, Sparkles } from "lucide-react";
import { Recipe } from "@/components/ui/RecipeCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChefModifierModalProps {
  recipe: Recipe;
  onClose: () => void;
  onRecipeModified: (newRecipe: Recipe) => void;
}

const QUICK_MODIFICATIONS = [
  "Versão sem glúten",
  "Versão vegana",
  "Mais proteína",
  "Menos calorias",
  "Versão low carb",
  "Mais rápido de fazer",
];

export function ChefModifierModal({ recipe, onClose, onRecipeModified }: ChefModifierModalProps) {
  const [modification, setModification] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleModify = async (customModification?: string) => {
    const modText = customModification || modification;
    if (!modText.trim()) {
      toast.error("Digite o que você quer modificar na receita");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("modify-recipe", {
        body: {
          recipe,
          modification: modText.trim(),
        },
      });

      if (error) throw error;

      if (data?.recipe) {
        toast.success("Receita modificada com sucesso!");
        onRecipeModified(data.recipe);
        onClose();
      }
    } catch (err) {
      console.error("Modification error:", err);
      toast.error("Não foi possível modificar a receita. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickModification = (mod: string) => {
    handleModify(mod);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-background rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Chef Modificador</h2>
              <p className="text-sm text-muted-foreground">Personalize sua receita</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Recipe */}
        <div className="bg-muted/50 rounded-2xl p-4 mb-6">
          <p className="text-xs text-muted-foreground mb-1">Receita atual:</p>
          <p className="font-semibold text-foreground">{recipe.name}</p>
        </div>

        {/* Quick Modifications */}
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">Modificações rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_MODIFICATIONS.map((mod) => (
              <button
                key={mod}
                onClick={() => handleQuickModification(mod)}
                disabled={isLoading}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                {mod}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Modification */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Ou descreva sua modificação:</p>
          <Textarea
            value={modification}
            onChange={(e) => setModification(e.target.value)}
            placeholder="Ex: Trocar nhoque por nhoque de batata, adicionar mais queijo, fazer versão fitness..."
            className="min-h-[100px] rounded-2xl resize-none"
            disabled={isLoading}
          />
          
          <Button
            onClick={() => handleModify()}
            disabled={isLoading || !modification.trim()}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white font-bold text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Modificando receita...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Modificar Receita
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
