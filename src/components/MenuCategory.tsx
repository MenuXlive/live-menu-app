import { useState } from "react";
import { MenuCategory as MenuCategoryType } from "@/data/menuData";
import { EditableMenuItem } from "./EditableMenuItem";
import { useMenu } from "@/contexts/MenuContext";
import { Plus, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MenuCategoryProps {
  category: MenuCategoryType;
  index: number;
  sectionKey: string;
}

export const MenuCategory = ({ category, index, sectionKey }: MenuCategoryProps) => {
  const { isEditMode, addMenuItem } = useMenu();
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "", description: "" });

  const isEven = index % 2 === 0;

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      addMenuItem(sectionKey, index, {
        name: newItem.name,
        price: newItem.price,
        description: newItem.description || undefined,
      });
      setNewItem({ name: "", price: "", description: "" });
      setIsAdding(false);
    }
  };

  return (
    <div
      className="relative"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Premium Category Header */}
      <div className="mb-6 relative">
        <div className="flex items-center gap-4">
          <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${isEven ? 'via-neon-cyan/50 to-transparent' : 'via-neon-magenta/50 to-transparent'
            }`} />

          <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border backdrop-blur-md shadow-lg ${isEven
            ? "border-neon-cyan/30 bg-neon-cyan/5 shadow-neon-cyan/10"
            : "border-neon-magenta/30 bg-neon-magenta/5 shadow-neon-magenta/10"
            }`}>
            {category.icon && <span className="text-xl filter drop-shadow-md">{category.icon}</span>}
            <h3 className={`font-orbitron text-lg font-bold tracking-[0.2em] uppercase ${isEven ? "text-neon-cyan" : "text-neon-magenta"
              }`}>
              {category.title}
            </h3>
          </div>

          <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${isEven ? 'via-neon-cyan/50 to-transparent' : 'via-neon-magenta/50 to-transparent'
            }`} />
        </div>
      </div>

      {/* Items List with premium spacing */}
      <div className="space-y-1">
        {category.items.map((item, itemIndex) => (
          <EditableMenuItem
            key={`${item.name}-${itemIndex}`}
            item={item}
            index={itemIndex}
            accentColor={isEven ? "cyan" : "magenta"}
            sectionKey={sectionKey}
            categoryIndex={index}
            itemIndex={itemIndex}
          />
        ))}

        {/* Add Item Button/Form */}
        {isEditMode && (
          isAdding ? (
            <div className="py-3 px-4 rounded-sm bg-card/80 border border-primary/30 mt-3">
              <div className="flex flex-col gap-3">
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Item name"
                  className="h-9 text-sm bg-background/50 border-border/40"
                  autoFocus
                />
                <Input
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="Price (e.g., ₹299)"
                  className="h-9 text-sm bg-background/50 border-border/40"
                />
                <Input
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Description (optional)"
                  className="h-9 text-sm bg-background/50 border-border/40"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddItem}
                    className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                    disabled={!newItem.name || !newItem.price}
                  >
                    <Check className="w-4 h-4 text-primary" />
                  </button>
                  <button
                    onClick={() => { setIsAdding(false); setNewItem({ name: "", price: "", description: "" }); }}
                    className="p-2 hover:bg-destructive/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className={`w-full mt-2 py-2.5 px-4 rounded-lg border border-dashed transition-all duration-300 flex items-center justify-center gap-2 text-sm font-rajdhani tracking-wide ${isEven
                ? "border-primary/30 text-primary/70 hover:border-primary/60 hover:bg-primary/5"
                : "border-secondary/30 text-secondary/70 hover:border-secondary/60 hover:bg-secondary/5"
                }`}
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          )
        )}
      </div>
    </div>
  );
};
