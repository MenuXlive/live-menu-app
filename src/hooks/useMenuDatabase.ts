import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuSection, MenuItem, snacksAndStarters, foodMenu, beveragesMenu, sideItems } from "@/data/menuData";
import { Json } from "@/integrations/supabase/types";
type MenuSectionType = 'snacks' | 'food' | 'beverages' | 'sides';

interface DbMenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number | null;
  half_price: number | null;
  full_price: number | null;
  sizes: string[] | null;
  display_order: number;
  image_url: string | null;
}

interface DbCategory {
  id: string;
  section_id: string;
  title: string;
  icon: string | null;
  display_order: number;
  menu_items: DbMenuItem[];
}

interface DbSection {
  id: string;
  type: MenuSectionType;
  title: string;
  display_order: number;
  menu_categories: DbCategory[];
}

const formatPrice = (value: number | null): string | undefined => {
  if (value === null) return undefined;
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
};

const parsePrice = (price: string | undefined): number | null => {
  if (!price) return null;
  return parseFloat(price.replace(/[₹,]/g, "")) || null;
};

const dbToMenuItem = (item: DbMenuItem): MenuItem => ({
  name: item.name,
  description: item.description || undefined,
  price: formatPrice(item.price),
  halfPrice: formatPrice(item.half_price),
  fullPrice: formatPrice(item.full_price),
  sizes: item.sizes || undefined,
  image: item.image_url || undefined,
});

const dbToMenuSection = (section: DbSection): MenuSection => ({
  title: section.title,
  categories: section.menu_categories
    .sort((a, b) => a.display_order - b.display_order)
    .map(cat => ({
      title: cat.title,
      icon: cat.icon || undefined,
      items: cat.menu_items
        .sort((a, b) => a.display_order - b.display_order)
        .map(dbToMenuItem),
    })),
});

export const useMenuDatabase = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeded, setIsSeeded] = useState(false);

  const fetchMenuData = async () => {
    const { data: sections, error } = await supabase
      .from("menu_sections")
      .select(`
        id, type, title, display_order,
        menu_categories (
          id, section_id, title, icon, display_order,
          menu_items (
            id, category_id, name, description, price, half_price, full_price, sizes, display_order, image_url
          )
        )
      `)
      .order("display_order");

    if (error) {
      console.error("Error fetching menu:", error);
      return null;
    }

    if (!sections || sections.length === 0) {
      return null;
    }

    const sectionMap: Record<MenuSectionType, MenuSection | null> = {
      snacks: null,
      food: null,
      beverages: null,
      sides: null,
    };

    sections.forEach((section: DbSection) => {
      sectionMap[section.type] = dbToMenuSection(section);
    });

    return {
      snacksAndStarters: sectionMap.snacks || snacksAndStarters,
      foodMenu: sectionMap.food || foodMenu,
      beveragesMenu: sectionMap.beverages || beveragesMenu,
      sideItems: sectionMap.sides || sideItems,
    };
  };

  const seedDatabase = async () => {
    const sectionsData: { type: MenuSectionType; title: string; display_order: number; data: MenuSection }[] = [
      { type: 'snacks', title: snacksAndStarters.title, display_order: 0, data: snacksAndStarters },
      { type: 'food', title: foodMenu.title, display_order: 1, data: foodMenu },
      { type: 'beverages', title: beveragesMenu.title, display_order: 2, data: beveragesMenu },
      { type: 'sides', title: sideItems.title, display_order: 3, data: sideItems },
    ];

    for (const section of sectionsData) {
      // Insert section
      const { data: sectionResult, error: sectionError } = await supabase
        .from("menu_sections")
        .insert({ type: section.type, title: section.title, display_order: section.display_order })
        .select()
        .single();

      if (sectionError) {
        console.error("Error inserting section:", sectionError);
        continue;
      }

      // Insert categories
      for (let catIdx = 0; catIdx < section.data.categories.length; catIdx++) {
        const category = section.data.categories[catIdx];

        const { data: catResult, error: catError } = await supabase
          .from("menu_categories")
          .insert({
            section_id: sectionResult.id,
            title: category.title,
            icon: category.icon || null,
            display_order: catIdx,
          })
          .select()
          .single();

        if (catError) {
          console.error("Error inserting category:", catError);
          continue;
        }

        // Insert items
        const itemsToInsert = category.items.map((item, idx) => ({
          category_id: catResult.id,
          name: item.name,
          description: item.description || null,
          price: parsePrice(item.price),
          half_price: parsePrice(item.halfPrice),
          full_price: parsePrice(item.fullPrice),
          sizes: item.sizes || null,
          display_order: idx,
          image_url: item.image || null,
        }));

        const { error: itemsError } = await supabase
          .from("menu_items")
          .insert(itemsToInsert);

        if (itemsError) {
          console.error("Error inserting items:", itemsError);
        }
      }
    }

    setIsSeeded(true);
  };

  const updateMenuItem = async (
    sectionType: MenuSectionType,
    categoryIndex: number,
    itemIndex: number,
    updatedItem: MenuItem
  ) => {
    // Get the section
    const { data: section } = await supabase
      .from("menu_sections")
      .select("id")
      .eq("type", sectionType)
      .single();

    if (!section) return;

    // Get the category
    const { data: categories } = await supabase
      .from("menu_categories")
      .select("id")
      .eq("section_id", section.id)
      .order("display_order");

    if (!categories || !categories[categoryIndex]) return;

    // Get the item
    const { data: items } = await supabase
      .from("menu_items")
      .select("id")
      .eq("category_id", categories[categoryIndex].id)
      .order("display_order");

    if (!items || !items[itemIndex]) return;

    // Update the item
    await supabase
      .from("menu_items")
      .update({
        name: updatedItem.name,
        description: updatedItem.description || null,
        price: parsePrice(updatedItem.price),
        half_price: parsePrice(updatedItem.halfPrice),
        full_price: parsePrice(updatedItem.fullPrice),
        sizes: updatedItem.sizes || null,
        image_url: updatedItem.image || null,
      })
      .eq("id", items[itemIndex].id);
  };

  const checkAndSeed = async () => {
    setIsLoading(true);
    const data = await fetchMenuData();

    if (!data) {
      await seedDatabase();
    }

    setIsLoading(false);
  };

  // Archive current menu before making changes
  const archiveCurrentMenu = async (notes?: string): Promise<boolean> => {
    try {
      const currentData = await fetchMenuData();
      if (!currentData) {
        console.error('No menu data to archive');
        return false;
      }

      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('archived_menus')
        .insert({
          menu_data: currentData as unknown as Json,
          archived_by: user?.id || null,
          notes: notes || 'Menu updated'
        });

      if (error) {
        console.error('Error archiving menu:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in archiveCurrentMenu:', error);
      return false;
    }
  };

  // Fetch archived menus
  const fetchArchivedMenus = async () => {
    const { data, error } = await supabase
      .from('archived_menus')
      .select('*')
      .order('archived_at', { ascending: false });

    if (error) {
      console.error('Error fetching archived menus:', error);
      return [];
    }

    return data || [];
  };

  return {
    fetchMenuData,
    updateMenuItem,
    checkAndSeed,
    archiveCurrentMenu,
    fetchArchivedMenus,
    isLoading,
    isSeeded,
  };
};

export const sectionKeyToType = (key: string): MenuSectionType => {
  const map: Record<string, MenuSectionType> = {
    snacksAndStarters: 'snacks',
    foodMenu: 'food',
    beveragesMenu: 'beverages',
    sideItems: 'sides',
  };
  return map[key] || 'snacks';
};