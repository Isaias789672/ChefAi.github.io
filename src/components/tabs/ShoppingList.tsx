import { useState } from "react";
import { ShoppingCart, Check, Plus, Trash2, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Recipe } from "@/components/ui/RecipeCard";

interface ShoppingListProps {
  recipes: Recipe[];
}

interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
}

export function ShoppingList({ recipes }: ShoppingListProps) {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const allIngredients: ShoppingItem[] = [];
    const seen = new Set<string>();
    
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const name = ingredient.split('•')[0].trim();
        if (!seen.has(name.toLowerCase())) {
          seen.add(name.toLowerCase());
          allIngredients.push({
            id: crypto.randomUUID(),
            name,
            checked: false,
          });
        }
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
        {
          id: crypto.randomUUID(),
          name: newItem.trim(),
          checked: false,
        },
        ...prev,
      ]);
      setNewItem("");
    }
  };

  const uncheckedItems = items.filter((item) => !item.checked);
  const checkedItems = items.filter((item) => item.checked);

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Lista de Compras</h1>
        <p className="text-muted-foreground mt-1">
          Ingredientes das suas receitas salvas
        </p>
      </div>

      {/* Stats Card */}
      <div className="bg-card rounded-3xl p-5 shadow-card mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShoppingCart className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-foreground">{uncheckedItems.length}</p>
            <p className="text-sm text-muted-foreground">itens pendentes</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-success">{checkedItems.length}</p>
            <p className="text-sm text-muted-foreground">comprados</p>
          </div>
        </div>
      </div>

      {/* Add Item Input */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addItem()}
          placeholder="Adicionar item..."
          className="flex-1 px-5 py-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        <button
          onClick={addItem}
          className="px-5 py-4 rounded-2xl bg-primary text-primary-foreground shadow-button hover:opacity-90 transition-all active:scale-[0.98]"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-card rounded-3xl p-8 shadow-card text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Lista vazia</h3>
          <p className="text-sm text-muted-foreground">
            Adicione receitas ao menu para gerar sua lista
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pending Items */}
          {uncheckedItems.length > 0 && (
            <div className="bg-card rounded-3xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">A comprar</h3>
              </div>
              <div className="divide-y divide-border">
                {uncheckedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 group hover:bg-accent/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 hover:border-primary transition-colors flex items-center justify-center flex-shrink-0"
                    />
                    <span className="flex-1 font-medium text-foreground">{item.name}</span>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Checked Items */}
          {checkedItems.length > 0 && (
            <div className="bg-card rounded-3xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-muted-foreground">
                  Comprados ({checkedItems.length})
                </h3>
              </div>
              <div className="divide-y divide-border">
                {checkedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 group hover:bg-accent/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0"
                    >
                      <Check className="w-3.5 h-3.5 text-success-foreground" />
                    </button>
                    <span className="flex-1 text-muted-foreground line-through">
                      {item.name}
                    </span>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
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
