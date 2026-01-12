import { useState } from "react";
import { Calendar, Plus, ChefHat } from "lucide-react";
import { RecipeCard, Recipe } from "@/components/ui/RecipeCard";
import { cn } from "@/lib/utils";

interface WeeklyMenuProps {
  recipes: Recipe[];
  onRemoveRecipe: (id: string) => void;
}

const DAYS = [
  { short: "D", name: "Domingo", num: 12 },
  { short: "S", name: "Segunda", num: 13 },
  { short: "T", name: "Terça", num: 14 },
  { short: "Q", name: "Quarta", num: 15 },
  { short: "Q", name: "Quinta", num: 16 },
  { short: "S", name: "Sexta", num: 17 },
  { short: "S", name: "Sábado", num: 18 },
];

export function WeeklyMenu({ recipes, onRemoveRecipe }: WeeklyMenuProps) {
  const [selectedDay, setSelectedDay] = useState(3);

  // Mock data for demonstration
  const menuByDay: { [key: number]: Recipe[] } = {
    0: recipes.slice(0, 1),
    1: recipes.slice(0, 2),
    2: recipes.slice(1, 2),
    3: recipes.slice(0, 3),
    4: [],
    5: recipes.slice(0, 1),
    6: recipes.slice(1, 3),
  };

  const dayRecipes = menuByDay[selectedDay] || [];

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Menu Semanal</h1>
        <p className="text-muted-foreground mt-1">
          Organize suas refeições da semana
        </p>
      </div>

      {/* Day Selector Card */}
      <div className="bg-card rounded-3xl p-5 shadow-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Janeiro 2026</h3>
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day, i) => {
            const hasRecipes = (menuByDay[i] || []).length > 0;
            const isSelected = selectedDay === i;
            
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className="flex flex-col items-center gap-1 py-2"
              >
                <span className={cn(
                  "text-xs font-medium",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )}>
                  {day.short}
                </span>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                  isSelected 
                    ? "bg-primary text-primary-foreground shadow-button" 
                    : hasRecipes 
                      ? "bg-primary/10 text-primary" 
                      : "bg-muted text-muted-foreground"
                )}>
                  {day.num}
                </div>
                {/* Indicator dot */}
                {hasRecipes && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isSelected ? "bg-primary" : "bg-primary/50"
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          {DAYS[selectedDay].name}, {DAYS[selectedDay].num}
        </h2>
        <span className="text-sm text-muted-foreground">
          {dayRecipes.length} {dayRecipes.length === 1 ? "receita" : "receitas"}
        </span>
      </div>

      {/* Recipes List */}
      {dayRecipes.length === 0 ? (
        <div className="bg-card rounded-3xl p-8 shadow-card text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Nenhuma refeição planejada</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Adicione receitas do Scanner ou Descobrir Prato
          </p>
          <button className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-button hover:opacity-90 transition-opacity">
            <Plus className="w-5 h-5" />
            Adicionar receita
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {dayRecipes.map((recipe, index) => (
            <div 
              key={recipe.id} 
              className="stagger-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <RecipeCard
                recipe={recipe}
                compact
                onDelete={() => onRemoveRecipe(recipe.id)}
              />
            </div>
          ))}

          {/* Add More Button */}
          <button className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar mais
          </button>
        </div>
      )}
    </div>
  );
}
