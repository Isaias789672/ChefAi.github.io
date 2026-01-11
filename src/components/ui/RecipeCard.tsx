import { Clock, ChefHat, Users, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Recipe {
  id: string;
  name: string;
  image?: string;
  time: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  servings: number;
  ingredients: string[];
  steps: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onDelete?: () => void;
  onAddToMenu?: () => void;
  compact?: boolean;
  className?: string;
}

const difficultyColors = {
  "Fácil": "bg-emerald-100 text-emerald-700",
  "Médio": "bg-amber-100 text-amber-700",
  "Difícil": "bg-rose-100 text-rose-700",
};

export function RecipeCard({ 
  recipe, 
  onClick, 
  onDelete, 
  onAddToMenu,
  compact = false,
  className 
}: RecipeCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative bg-card rounded-2xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-elevated cursor-pointer",
        compact ? "flex items-center gap-4 p-3" : "",
        className
      )}
    >
      {compact ? (
        <>
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
            {recipe.image ? (
              <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-accent">
                <ChefHat className="w-6 h-6 text-primary" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">{recipe.name}</h4>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {recipe.time}
              </span>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", difficultyColors[recipe.difficulty])}>
                {recipe.difficulty}
              </span>
            </div>
          </div>
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </>
      ) : (
        <>
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            {recipe.image ? (
              <img 
                src={recipe.image} 
                alt={recipe.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent to-secondary">
                <ChefHat className="w-12 h-12 text-primary/50" />
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="font-semibold text-lg text-foreground leading-tight line-clamp-2">
                {recipe.name}
              </h3>
              <span className={cn(
                "flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium",
                difficultyColors[recipe.difficulty]
              )}>
                {recipe.difficulty}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {recipe.time}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {recipe.servings} porções
              </span>
            </div>

            {onAddToMenu && (
              <button
                onClick={(e) => { e.stopPropagation(); onAddToMenu(); }}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar ao Menu
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
