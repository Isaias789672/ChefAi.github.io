import { useState } from "react";
import { ShoppingCart, Check, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Recipe } from "@/components/ui/RecipeCard";

interface ShoppingListProps {
  recipes: Recipe[];
}

interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  fromRecipe: string;
}

export function ShoppingList({ recipes }: ShoppingListProps) {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    // Generate shopping list from recipes
    const allIngredients: ShoppingItem[] = [];
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        allIngredients.push({
          id: crypto.randomUUID(),
          name: ingredient,
          checked: false,
          fromRecipe: recipe.name,
        });
      });
    });
    return allIngredients;
  });

  const [newItem, setNewItem] = useState("");

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addItem = () => {
    if (newItem.trim()) {
      setItems((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: newItem.trim(),
          checked: false,
          fromRecipe: "Adicionado manualmente",
        },
      ]);
      setNewItem("");
    }
  };

  const uncheckedItems = items.filter((item) => !item.checked);
  const checkedItems = items.filter((item) => item.checked);

  return (
    <div className="slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
          <ShoppingCart className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Lista de Compras</h2>
          <p className="text-sm text-muted-foreground">
            {uncheckedItems.length} itens pendentes
          </p>
        </div>
      </div>

      {/* Add Item */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addItem()}
          placeholder="Adicionar item..."
          className="flex-1 px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={addItem}
          className="px-4 py-3 rounded-xl gradient-hero text-primary-foreground shadow-soft hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <ShoppingCart className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Sua lista está vazia</p>
          <p className="text-sm text-muted-foreground mt-1">
            Adicione receitas ao menu para gerar a lista
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Unchecked Items */}
          {uncheckedItems.length > 0 && (
            <div className="space-y-2">
              {uncheckedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card shadow-card group"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-6 h-6 rounded-full border-2 border-border hover:border-primary transition-colors flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-transparent" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.fromRecipe}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Checked Items */}
          {checkedItems.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Comprados ({checkedItems.length})
              </h4>
              <div className="space-y-2">
                {checkedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 group"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </button>
                    <p className="flex-1 text-muted-foreground line-through truncate">
                      {item.name}
                    </p>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
