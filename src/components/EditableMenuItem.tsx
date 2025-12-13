import { useState } from "react";
import { MenuItem as MenuItemType } from "@/data/menuData";
import { cn } from "@/lib/utils";
import { useMenu } from "@/contexts/MenuContext";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check, X, Trash2 } from "lucide-react";

interface EditableMenuItemProps {
  item: MenuItemType;
  index: number;
  accentColor: "cyan" | "magenta";
  sectionKey: string;
  categoryIndex: number;
  itemIndex: number;
}

export const EditableMenuItem = ({
  item,
  index,
  accentColor,
  sectionKey,
  categoryIndex,
  itemIndex
}: EditableMenuItemProps) => {
  const { isEditMode, updateMenuItem, deleteMenuItem } = useMenu();
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);
  const [imageError, setImageError] = useState(false);

  const hasMultiplePrices = item.halfPrice && item.fullPrice;
  const hasSizes = item.sizes && item.sizes.length > 0;

  const handleSave = () => {
    updateMenuItem(sectionKey, categoryIndex, itemIndex, editedItem);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMenuItem(sectionKey, categoryIndex, itemIndex);
  };

  if (isEditMode && isEditing) {
    return (
      <div className="py-3 px-4 rounded-sm bg-card/80 border border-primary/30">
        <div className="flex flex-col gap-3">
          <Input
            value={editedItem.name}
            onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
            placeholder="Item name"
            className="h-9 text-sm font-medium bg-background/50 border-border/40 text-white"
          />
          <Input
            value={editedItem.description || ""}
            onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
            placeholder="Description (e.g., Artisan preparation with house-made spices)"
            className="h-9 text-sm bg-background/50 border-border/40 text-white"
          />
          <Input
            value={editedItem.image || ""}
            onChange={(e) => setEditedItem({ ...editedItem, image: e.target.value })}
            placeholder="Image URL (https://...)"
            className="h-9 text-sm bg-background/50 font-mono text-xs text-muted-foreground"
          />

          {/* Tags / Badges Toggles */}
          <div className="flex flex-wrap gap-4 py-2 border-y border-white/10 my-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`chef-${index}`}
                checked={editedItem.isChefSpecial}
                onCheckedChange={(c) => setEditedItem({ ...editedItem, isChefSpecial: c as boolean })}
                className="border-magenta-500 data-[state=checked]:bg-magenta-500"
              />
              <Label htmlFor={`chef-${index}`} className="text-[10px] uppercase tracking-wider text-magenta-400 font-bold cursor-pointer">Chef's Special</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`best-${index}`}
                checked={editedItem.isBestSeller}
                onCheckedChange={(c) => setEditedItem({ ...editedItem, isBestSeller: c as boolean })}
                className="border-cyan-500 data-[state=checked]:bg-cyan-500"
              />
              <Label htmlFor={`best-${index}`} className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold cursor-pointer">Best Seller</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`premium-${index}`}
                checked={editedItem.isPremium}
                onCheckedChange={(c) => setEditedItem({ ...editedItem, isPremium: c as boolean })}
                className="border-yellow-500 data-[state=checked]:bg-yellow-500"
              />
              <Label htmlFor={`premium-${index}`} className="text-[10px] uppercase tracking-wider text-yellow-400 font-bold cursor-pointer">Premium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`top-${index}`}
                checked={editedItem.isTopShelf}
                onCheckedChange={(c) => setEditedItem({ ...editedItem, isTopShelf: c as boolean })}
                className="border-purple-500 data-[state=checked]:bg-purple-500"
              />
              <Label htmlFor={`top-${index}`} className="text-[10px] uppercase tracking-wider text-purple-400 font-bold cursor-pointer">Top Shelf</Label>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            {hasSizes ? (
              editedItem.sizes?.map((size, i) => (
                <Input
                  key={i}
                  value={size}
                  onChange={(e) => {
                    const newSizes = [...(editedItem.sizes || [])];
                    newSizes[i] = e.target.value;
                    setEditedItem({ ...editedItem, sizes: newSizes });
                  }}
                  className="h-9 w-20 text-sm bg-background/50 border-border/40 text-white"
                />
              ))
            ) : hasMultiplePrices ? (
              <>
                <Input
                  value={editedItem.halfPrice || ""}
                  onChange={(e) => setEditedItem({ ...editedItem, halfPrice: e.target.value })}
                  placeholder="Half"
                  className="h-9 w-24 text-sm bg-background/50 border-border/40 text-white"
                />
                <Input
                  value={editedItem.fullPrice || ""}
                  onChange={(e) => setEditedItem({ ...editedItem, fullPrice: e.target.value })}
                  placeholder="Full"
                  className="h-9 w-24 text-sm bg-background/50 border-border/40 text-white"
                />
              </>
            ) : (
              <Input
                value={editedItem.price || ""}
                onChange={(e) => setEditedItem({ ...editedItem, price: e.target.value })}
                placeholder="Price"
                className="h-9 w-24 text-sm bg-background/50 border-border/40 text-white"
              />
            )}
            <button onClick={handleSave} className="p-2 hover:bg-primary/20 rounded-sm transition-colors ml-auto">
              <Check className="w-4 h-4 text-primary" />
            </button>
            <button onClick={handleCancel} className="p-2 hover:bg-destructive/20 rounded-sm transition-colors">
              <X className="w-4 h-4 text-destructive" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative p-4 rounded-xl transition-all duration-500 overflow-hidden",
        "border border-transparent hover:border-white/5",
        "hover:bg-card/40 hover:shadow-[0_0_15px_-5px_hsl(var(--primary)/0.1)]",
        "backdrop-blur-sm",
        index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]",
        isEditMode && "cursor-pointer ring-1 ring-transparent hover:ring-primary/40"
      )}
      onClick={() => isEditMode && setIsEditing(true)}
    >
      {/* Subtle Tech Background Pattern on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className={`absolute top-0 left-0 w-8 h-8 border-l border-t ${accentColor === 'cyan' ? 'border-neon-cyan/20' : 'border-neon-magenta/20'}`} />
        <div className={`absolute bottom-0 right-0 w-8 h-8 border-r border-b ${accentColor === 'cyan' ? 'border-neon-cyan/20' : 'border-neon-magenta/20'}`} />
      </div>

      {/* Delete button in edit mode */}
      {isEditMode && (
        <button
          onClick={handleDelete}
          className="absolute right-2 top-2 p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/30 opacity-0 group-hover:opacity-100 transition-all z-20"
        >
          <Trash2 className="w-3.5 h-3.5 text-destructive" />
        </button>
      )}

      {/* Row layout - name/description on left, prices on right */}
      <div className="flex items-start gap-6 relative z-10">

        {/* Item Image */}
        {item.image && !imageError && (
          <div className={cn(
            "w-32 h-32 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-black/40 shadow-2xl relative group-hover:shadow-[0_0_20px_-5px_var(--accent-color)]",
            accentColor === "cyan" ? "group-hover:border-neon-cyan/50 shadow-neon-cyan/10" : "group-hover:border-neon-magenta/50 shadow-neon-magenta/10",
            "transition-all duration-500 group-hover:scale-[1.02]"
          )}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        <div className="flex-1 flex justify-between gap-4 min-w-0 pt-1">
          {/* Item name and description */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className={cn(
                "w-1.5 h-1.5 rounded-sm rotate-45 transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_8px_currentColor] flex-shrink-0",
                accentColor === "cyan"
                  ? "bg-neon-cyan shadow-neon-cyan/20 text-neon-cyan"
                  : "bg-neon-magenta shadow-neon-magenta/20 text-neon-magenta"
              )} />
              <span className="font-orbitron text-base font-medium tracking-wide text-foreground group-hover:text-white transition-colors">
                {item.name}
              </span>

              {/* Badges */}
              {item.isChefSpecial && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neon-magenta/10 text-neon-magenta tracking-widest uppercase border border-neon-magenta/20">
                  Chef's Special
                </span>
              )}
              {item.isBestSeller && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan tracking-widest uppercase border border-neon-cyan/20">
                  Best Seller
                </span>
              )}
              {item.isPremium && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neon-gold/10 text-neon-gold tracking-widest uppercase border border-neon-gold/20">
                  Premium
                </span>
              )}
              {item.isTopShelf && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 tracking-widest uppercase border border-purple-500/20">
                  Top Shelf
                </span>
              )}
              {item.name.toLowerCase().includes('signature') && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300 tracking-widest uppercase border border-white/20">
                  Signature
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground/80 mt-1.5 font-rajdhani leading-relaxed tracking-wide group-hover:text-muted-foreground transition-colors">
                {item.description}
              </p>
            )}
          </div>

          {/* Price(s) */}
          <div className="flex-shrink-0 text-right self-start pt-0.5">
            {hasSizes ? (
              <div className={`flex items-center gap-4 text-sm font-rajdhani font-semibold ${accentColor === 'cyan' ? 'text-neon-cyan' : 'text-neon-magenta'
                }`}>
                {item.sizes!.map((size, i) => (
                  <div key={i} className="flex flex-col items-end group/price">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5 opacity-60">
                      {i === 0 ? '30ml' : i === 1 ? '60ml' : i === 2 ? '90ml' : '180ml'}
                    </span>
                    <span className="tracking-wide text-base group-hover:text-white transition-colors">{size}</span>
                  </div>
                ))}
              </div>
            ) : hasMultiplePrices ? (
              <div className="flex items-center gap-4 font-rajdhani">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Half</span>
                  <span className="text-neon-gold font-bold tracking-wide text-base">{item.halfPrice}</span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Full</span>
                  <span className="text-neon-gold font-bold tracking-wide text-base">{item.fullPrice}</span>
                </div>
              </div>
            ) : (
              <span className="font-orbitron text-lg font-bold text-neon-gold tracking-wide whitespace-nowrap drop-shadow-[0_0_8px_rgba(255,215,0,0.3)] group-hover:scale-105 transition-transform inline-block">
                {item.price}
              </span>
            )}
          </div>
        </div>
      </div >
    </div >
  );
};
