import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { MenuItem, MenuSection, snacksAndStarters, foodMenu, beveragesMenu, sideItems } from "@/data/menuData";
import { useMenuDatabase, sectionKeyToType } from "@/hooks/useMenuDatabase";

interface MenuData {
  snacksAndStarters: MenuSection;
  foodMenu: MenuSection;
  beveragesMenu: MenuSection;
  sideItems: MenuSection;
}

interface MenuContextType {
  menuData: MenuData;
  isEditMode: boolean;
  isLoading: boolean;
  setIsEditMode: (value: boolean) => void;
  updateMenuItem: (sectionKey: string, categoryIndex: number, itemIndex: number, updatedItem: MenuItem) => void;
  addMenuItem: (sectionKey: string, categoryIndex: number, newItem: MenuItem) => void;
  deleteMenuItem: (sectionKey: string, categoryIndex: number, itemIndex: number) => void;
  adjustPrices: (percentage: number, sectionKey?: string, categoryIndex?: number) => Promise<void>;
  refreshMenu: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const parsePrice = (price: string): number => {
  return parseFloat(price.replace(/[₹,]/g, "")) || 0;
};

const formatPrice = (value: number): string => {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
};

const adjustItemPrices = (item: MenuItem, multiplier: number): MenuItem => {
  const newItem = { ...item };
  if (item.price) {
    newItem.price = formatPrice(parsePrice(item.price) * multiplier);
  }
  if (item.halfPrice) {
    newItem.halfPrice = formatPrice(parsePrice(item.halfPrice) * multiplier);
  }
  if (item.fullPrice) {
    newItem.fullPrice = formatPrice(parsePrice(item.fullPrice) * multiplier);
  }
  if (item.sizes) {
    newItem.sizes = item.sizes.map(size => formatPrice(parsePrice(size) * multiplier));
  }
  return newItem;
};

const getDefaultMenuData = (): MenuData => ({
  snacksAndStarters: deepClone(snacksAndStarters),
  foodMenu: deepClone(foodMenu),
  beveragesMenu: deepClone(beveragesMenu),
  sideItems: deepClone(sideItems),
});

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menuData, setMenuData] = useState<MenuData>(getDefaultMenuData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchMenuData, updateMenuItem: dbUpdateMenuItem, checkAndSeed, archiveCurrentMenu } = useMenuDatabase();

  const refreshMenu = async () => {
    setIsLoading(true);
    const data = await fetchMenuData();
    if (data) {
      setMenuData(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      // Temporarily disable DB fetch to use local file data
      // await checkAndSeed();
      // await refreshMenu(); 
      setIsLoading(false);
    };
    init();
  }, []);

  const updateMenuItem = async (sectionKey: string, categoryIndex: number, itemIndex: number, updatedItem: MenuItem) => {
    // Update local state immediately
    setMenuData(prev => {
      const newData = deepClone(prev);
      const section = newData[sectionKey as keyof MenuData];
      if (section && section.categories[categoryIndex]) {
        section.categories[categoryIndex].items[itemIndex] = updatedItem;
      }
      return newData;
    });

    // Update in database
    await dbUpdateMenuItem(sectionKeyToType(sectionKey), categoryIndex, itemIndex, updatedItem);
  };

  const addMenuItem = (sectionKey: string, categoryIndex: number, newItem: MenuItem) => {
    setMenuData(prev => {
      const newData = deepClone(prev);
      const section = newData[sectionKey as keyof MenuData];
      if (section && section.categories[categoryIndex]) {
        section.categories[categoryIndex].items.push(newItem);
      }
      return newData;
    });
    // TODO: Add to database
  };

  const deleteMenuItem = (sectionKey: string, categoryIndex: number, itemIndex: number) => {
    setMenuData(prev => {
      const newData = deepClone(prev);
      const section = newData[sectionKey as keyof MenuData];
      if (section && section.categories[categoryIndex]) {
        section.categories[categoryIndex].items.splice(itemIndex, 1);
      }
      return newData;
    });
    // TODO: Delete from database
  };

  const adjustPrices = async (percentage: number, sectionKey?: string, categoryIndex?: number) => {
    // Archive current menu before price adjustment
    await archiveCurrentMenu(`Price adjustment: ${percentage > 0 ? '+' : ''}${percentage}%`);

    const multiplier = 1 + percentage / 100;

    setMenuData(prev => {
      const newData = deepClone(prev);

      const adjustSection = (section: MenuSection, catIndex?: number) => {
        section.categories.forEach((category, idx) => {
          if (catIndex === undefined || catIndex === idx) {
            category.items = category.items.map(item => adjustItemPrices(item, multiplier));
          }
        });
      };

      if (sectionKey) {
        const section = newData[sectionKey as keyof MenuData];
        if (section) {
          adjustSection(section, categoryIndex);
        }
      } else {
        (Object.keys(newData) as Array<keyof MenuData>).forEach(key => adjustSection(newData[key]));
      }

      return newData;
    });
    // TODO: Batch update prices in database
  };

  return (
    <MenuContext.Provider value={{
      menuData,
      isEditMode,
      isLoading,
      setIsEditMode,
      updateMenuItem,
      addMenuItem,
      deleteMenuItem,
      adjustPrices,
      refreshMenu
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};