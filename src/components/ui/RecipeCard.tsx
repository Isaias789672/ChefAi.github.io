import { Clock, ChefHat, Users, Flame, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Recipe {
  id: string;
  name: string;
  image?: string;
  time: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  servings: number;
  calories?: number;
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

export function RecipeCard({ 
  recipe, 
  onClick, 
  onDelete, 
  onAddToMenu,
  compact = false,
  className 
}: RecipeCardProps) {
  const difficultyColor = {
    "Fácil": "text-success",
    "Médio": "text-yellow-600",
    "Difícil": "text-destructive"
  };

  if (compact) {
    return (
      <div 
        onClick={onClick}
        className={cn(
          "group flex items-center gap-4 p-4 bg-card rounded-2xl border border-border transition-all duration-200 hover:shadow-card",
          onClick && "cursor-pointer",
          className
        )}
      >
        {/* Image */}
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <ChefHat className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{recipe.name}</h4>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {recipe.time}
            </span>
            {recipe.calories && (
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                {recipe.calories} cal
              </span>
            )}
          </div>
        </div>

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("bg-card rounded-3xl overflow-hidden shadow-card", className)}>
      {/* Image */}
      {recipe.image && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-foreground">{recipe.name}</h3>

        {/* Info Badges */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-xl">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{recipe.time}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-xl">
            <ChefHat className={cn("w-4 h-4", difficultyColor[recipe.difficulty])} />
            <span className={cn("text-sm font-medium", difficultyColor[recipe.difficulty])}>
              {recipe.difficulty}
            </span>
          </div>
          {recipe.calories && (
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-xl">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">{recipe.calories} cal</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-xl">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{recipe.servings} porções</span>
          </div>
        </div>

        {/* Ingredients Block - Orange */}
        <div className="bg-ingredient-bg border-2 border-ingredient-border rounded-2xl p-4">
          <h4 className="font-semibold text-ingredient-text mb-3 flex items-center gap-2">
            <span className="text-lg">🥕</span>
            Ingredientes
          </h4>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-ingredient-border mt-2 flex-shrink-0" />
                <span className="text-ingredient-text">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps Block - Green */}
        <div className="bg-steps-bg border-2 border-steps-border rounded-2xl p-4">
          <h4 className="font-semibold text-steps-text mb-3 flex items-center gap-2">
            <span className="text-lg">👨‍🍳</span>
            Modo de Preparo
          </h4>
          <ol className="space-y-3">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-steps-text pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Action Button */}
        {onAddToMenu && (
          <button
            onClick={onAddToMenu}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-button hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Adicionar ao Menu
          </button>
        )}
      </div>
    </div>
  );
}
