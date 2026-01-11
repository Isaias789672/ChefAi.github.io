import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { RecipeCard, Recipe } from "@/components/ui/RecipeCard";

interface WeeklyMenuProps {
  recipes: Recipe[];
  onRemoveRecipe: (id: string) => void;
}

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const FULL_DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export function WeeklyMenu({ recipes, onRemoveRecipe }: WeeklyMenuProps) {
  const [selectedDay, setSelectedDay] = useState(0);

  // Mock data for demonstration - in real app, this would come from state/db
  const menuByDay: { [key: number]: Recipe[] } = {
    0: recipes.slice(0, 2),
    1: recipes.slice(1, 3),
    2: recipes.slice(0, 1),
    3: [],
    4: recipes.slice(2, 4),
    5: recipes.slice(0, 3),
    6: recipes.slice(1, 2),
  };

  const dayRecipes = menuByDay[selectedDay] || [];

  return (
    <div className="slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
          <CalendarDays className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Menu Semanal</h2>
          <p className="text-sm text-muted-foreground">Organize suas refeições da semana</p>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSelectedDay((prev) => (prev - 1 + 7) % 7)}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex gap-1 overflow-x-auto pb-2">
          {DAYS.map((day, i) => (
            <button
              key={day}
              onClick={() => setSelectedDay(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedDay === i
                  ? "gradient-hero text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSelectedDay((prev) => (prev + 1) % 7)}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Selected Day Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-foreground">{FULL_DAYS[selectedDay]}</h3>
          <span className="text-sm text-muted-foreground">
            {dayRecipes.length} {dayRecipes.length === 1 ? "refeição" : "refeições"}
          </span>
        </div>

        {dayRecipes.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <CalendarDays className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">Nenhuma refeição planejada</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              <Plus className="w-4 h-4" />
              Adicionar receita
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {dayRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                compact
                onDelete={() => onRemoveRecipe(recipe.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Week Overview */}
      {recipes.length > 0 && (
        <div className="mt-8 p-4 rounded-xl bg-muted">
          <h4 className="font-semibold text-foreground mb-3">Visão da Semana</h4>
          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((day, i) => {
              const count = (menuByDay[i] || []).length;
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(i)}
                  className={`py-2 rounded-lg text-center cursor-pointer transition-colors ${
                    selectedDay === i
                      ? "bg-primary text-primary-foreground"
                      : count > 0
                      ? "bg-accent text-accent-foreground"
                      : "bg-background text-muted-foreground"
                  }`}
                >
                  <div className="text-xs font-medium">{day}</div>
                  <div className="text-lg font-bold">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
