import { useState } from "react";
import { 
  Refrigerator, 
  UtensilsCrossed, 
  CalendarDays, 
  ShoppingCart,
  ChefHat 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FridgeScanner } from "@/components/tabs/FridgeScanner";
import { DiscoverDish } from "@/components/tabs/DiscoverDish";
import { WeeklyMenu } from "@/components/tabs/WeeklyMenu";
import { ShoppingList } from "@/components/tabs/ShoppingList";
import { Recipe } from "@/components/ui/RecipeCard";

const tabs = [
  { id: "scanner", label: "Scanner", icon: Refrigerator },
  { id: "discover", label: "Descobrir", icon: UtensilsCrossed },
  { id: "menu", label: "Menu", icon: CalendarDays },
  { id: "shopping", label: "Compras", icon: ShoppingCart },
] as const;

type TabId = typeof tabs[number]["id"];

// Sample recipes for demo
const sampleRecipes: Recipe[] = [
  {
    id: "1",
    name: "Salada Caesar com Frango",
    time: "25 min",
    difficulty: "Fácil",
    servings: 2,
    ingredients: ["Alface romana", "Frango grelhado", "Croutons", "Parmesão", "Molho Caesar"],
    steps: ["Grelhe o frango", "Monte a salada", "Adicione o molho"]
  },
  {
    id: "2",
    name: "Risoto de Cogumelos",
    time: "45 min",
    difficulty: "Médio",
    servings: 4,
    ingredients: ["Arroz arbóreo", "Cogumelos", "Caldo de legumes", "Vinho branco", "Parmesão"],
    steps: ["Refogue os cogumelos", "Adicione o arroz", "Cozinhe lentamente"]
  },
  {
    id: "3",
    name: "Bowl de Açaí",
    time: "10 min",
    difficulty: "Fácil",
    servings: 1,
    ingredients: ["Açaí", "Banana", "Granola", "Mel", "Frutas variadas"],
    steps: ["Bata o açaí", "Decore com toppings", "Sirva gelado"]
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("scanner");
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(sampleRecipes);

  const handleAddToMenu = (recipe: Recipe) => {
    if (!savedRecipes.find(r => r.id === recipe.id)) {
      setSavedRecipes(prev => [...prev, recipe]);
    }
  };

  const handleRemoveRecipe = (id: string) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "scanner":
        return <FridgeScanner onAddToMenu={handleAddToMenu} />;
      case "discover":
        return <DiscoverDish onAddToMenu={handleAddToMenu} />;
      case "menu":
        return <WeeklyMenu recipes={savedRecipes} onRemoveRecipe={handleRemoveRecipe} />;
      case "shopping":
        return <ShoppingList recipes={savedRecipes} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
            <ChefHat className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">Chef AI</h1>
            <p className="text-xs text-muted-foreground">Transforme fotos em receitas</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-50 glass-effect border-t border-border px-2 py-2 pb-safe">
        <div className="max-w-lg mx-auto flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                    isActive
                      ? "gradient-hero shadow-soft"
                      : "bg-transparent"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-primary-foreground" : ""
                    )}
                  />
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Index;
