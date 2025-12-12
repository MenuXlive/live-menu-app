import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Printer, FileImage, FileText, X } from "lucide-react";
import { useMenu } from "@/contexts/MenuContext";
import { MenuSection as MenuSectionType, MenuCategory as MenuCategoryType, MenuItem } from "@/data/menuData";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

// HTML entity escaping to prevent XSS in PDF export
const escapeHtml = (text: string | undefined | null): string => {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuItemRow = ({ item, isEven }: { item: MenuItem; isEven: boolean }) => {
  const hasSizes = item.sizes && item.sizes.length > 0;
  const hasHalfFull = item.halfPrice && item.fullPrice;

  return (
    <div className={`py-3 px-4 ${isEven ? "bg-white/[0.02]" : ""}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h4 className="text-[15px] font-semibold text-white tracking-wide uppercase">
            {item.name}
          </h4>
          {item.description && (
            <p className="text-[11px] text-gray-400 mt-1 italic leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          {hasSizes ? (
            <div className="flex gap-4">
              {item.sizes!.map((size, i) => (
                <span key={i} className="text-[13px] font-medium text-amber-400 min-w-[50px] text-center">
                  {size}
                </span>
              ))}
            </div>
          ) : hasHalfFull ? (
            <div className="flex gap-4 items-center">
              <div className="text-center">
                <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Half</span>
                <span className="text-[13px] font-medium text-amber-400">{item.halfPrice}</span>
              </div>
              <div className="text-center">
                <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Full</span>
                <span className="text-[13px] font-medium text-amber-400">{item.fullPrice}</span>
              </div>
            </div>
          ) : (
            <span className="text-[14px] font-semibold text-amber-400">{item.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const CategoryBlock = ({
  category,
  index,
  accentColor = "#00f0ff",
  dietIcon = null
}: {
  category: MenuCategoryType;
  index: number;
  accentColor?: string;
  dietIcon?: "veg" | "non-veg" | null;
}) => {
  return (
    <div className="mb-6">
      {/* Category Header with Holographic Gradient */}
      <div className="flex items-center gap-3 mb-3 pb-2 relative">
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}88, transparent)` }}
        />

        {category.icon && <span className="text-lg">{category.icon}</span>}

        <h3 className="text-[13px] font-bold tracking-[0.2em] uppercase" style={{ color: accentColor }}>
          {category.title}
        </h3>

        {/* Veg/Non-Veg Indicator */}
        {dietIcon && (
          <div className={`ml-auto border border-current p-[2px] ${dietIcon === "veg" ? "text-green-500" : "text-red-500"}`}>
            <div className={`w-2 h-2 rounded-full ${dietIcon === "veg" ? "bg-green-500" : "bg-red-500"}`} />
          </div>
        )}
      </div>

      {/* Size Headers for drinks */}
      {category.items[0]?.sizes && (
        <div className="flex justify-end gap-4 px-4 pb-2 border-b border-gray-800">
          {category.items[0].sizes.length === 4 ? (
            <>
              <span className="text-[9px] text-gray-400 min-w-[50px] text-center uppercase tracking-wider font-semibold">30ml</span>
              <span className="text-[9px] text-gray-400 min-w-[50px] text-center uppercase tracking-wider font-semibold">60ml</span>
              <span className="text-[9px] text-gray-400 min-w-[50px] text-center uppercase tracking-wider font-semibold">90ml</span>
              <span className="text-[9px] text-gray-400 min-w-[50px] text-center uppercase tracking-wider font-semibold">180ml</span>
            </>
          ) : (
            category.items[0].sizes.map((_, i) => (
              <span key={i} className="text-[9px] text-gray-500 min-w-[50px] text-center uppercase tracking-wider">
                Size {i + 1}
              </span>
            ))
          )}
        </div>
      )}

      {/* Items */}
      <div className="divide-y divide-gray-800/50">
        {category.items.map((item, idx) => (
          <MenuItemRow key={item.name} item={item} isEven={idx % 2 === 0} />
        ))}
      </div>
    </div>
  );
};

const PrintablePage = ({
  section,
  pageRef,
  variant,
  pageNumber,
  totalPages
}: {
  section: MenuSectionType;
  pageRef: React.RefObject<HTMLDivElement>;
  variant: "cyan" | "magenta" | "gold";
  pageNumber: number;
  totalPages: number;
}) => {
  const accentColor = variant === "cyan" ? "#00f0ff" : variant === "magenta" ? "#ff00ff" : "#ffd700";

  return (
    <div
      ref={pageRef}
      className="bg-[#0a0a0f] w-[559px] min-h-[794px] relative flex flex-col overflow-hidden"
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
        backgroundSize: "30px 30px"
      }}
    >
      {/* World-Class Boundary System - A5 Optimized */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Outer Frame with tech corners */}
        <div className="absolute inset-[8px] border border-gray-800/80">
          {/* Tech notches */}
          <div className="absolute top-1/4 left-[-1px] w-[3px] h-8 bg-gray-800" />
          <div className="absolute bottom-1/4 right-[-1px] w-[3px] h-8 bg-gray-800" />
        </div>

        {/* Inner Frame with Accent */}
        <div className="absolute inset-[15px] border border-opacity-30" style={{ borderColor: accentColor }} />

        {/* corner SVG Circuits */}
        <svg className="absolute top-[15px] left-[15px] w-24 h-24 opacity-60" viewBox="0 0 100 100" style={{ color: accentColor }}>
          <path fill="none" stroke="currentColor" strokeWidth="1" d="M 0,0 L 40,0 L 45,5 L 45,20 M 0,0 L 0,40 L 5,45 L 20,45" />
          <circle cx="45" cy="20" r="2" fill="currentColor" />
          <circle cx="20" cy="45" r="2" fill="currentColor" />
          <rect x="2" y="2" width="10" height="10" fill="currentColor" opacity="0.5" />
        </svg>

        <svg className="absolute top-[15px] right-[15px] w-24 h-24 opacity-60" viewBox="0 0 100 100" style={{ color: accentColor, transform: "scaleX(-1)" }}>
          <path fill="none" stroke="currentColor" strokeWidth="1" d="M 0,0 L 40,0 L 45,5 L 45,20 M 0,0 L 0,40 L 5,45 L 20,45" />
          <circle cx="45" cy="20" r="2" fill="currentColor" />
          <circle cx="20" cy="45" r="2" fill="currentColor" />
          <rect x="2" y="2" width="10" height="10" fill="currentColor" opacity="0.5" />
        </svg>

        <svg className="absolute bottom-[15px] left-[15px] w-24 h-24 opacity-60" viewBox="0 0 100 100" style={{ color: accentColor, transform: "scaleY(-1)" }}>
          <path fill="none" stroke="currentColor" strokeWidth="1" d="M 0,0 L 40,0 L 45,5 L 45,20 M 0,0 L 0,40 L 5,45 L 20,45" />
          <circle cx="45" cy="20" r="2" fill="currentColor" />
          <circle cx="20" cy="45" r="2" fill="currentColor" />
          <rect x="2" y="2" width="10" height="10" fill="currentColor" opacity="0.5" />
        </svg>

        <svg className="absolute bottom-[15px] right-[15px] w-24 h-24 opacity-60" viewBox="0 0 100 100" style={{ color: accentColor, transform: "rotate(180deg)" }}>
          <path fill="none" stroke="currentColor" strokeWidth="1" d="M 0,0 L 40,0 L 45,5 L 45,20 M 0,0 L 0,40 L 5,45 L 20,45" />
          <circle cx="45" cy="20" r="2" fill="currentColor" />
          <circle cx="20" cy="45" r="2" fill="currentColor" />
          <rect x="2" y="2" width="10" height="10" fill="currentColor" opacity="0.5" />
        </svg>
      </div>

      {/* Premium Header with New Logo - ENHANCED BRIGHTNESS */}
      <div className="pt-8 pb-4 text-center relative z-10">
        <div className="flex justify-center mb-4">
          <div className="relative inline-block px-12 py-5 border-2 border-amber-500/40 rounded-lg bg-black/60 shadow-[0_0_30px_rgba(251,191,36,0.1)]">
            <h1 className="font-orbitron text-6xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] drop-shadow-[0_0_25px_rgba(245,158,11,0.5)] leading-tight">
              LIVE
            </h1>
            {/* Corner Accents */}
            <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#FBBF24]" />
            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-[#FBBF24]" />
            <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-[#FBBF24]" />
            <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#FBBF24]" />

            {/* Circuit lines */}
            <div className="absolute top-1/2 left-0 w-3 h-[2px] -ml-3 bg-[#FBBF24]/50" />
            <div className="absolute top-1/2 right-0 w-3 h-[2px] -mr-3 bg-[#FBBF24]/50" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-white drop-shadow-md" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            EAT . DRINK . CODE . REPEAT
          </span>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent via-magenta-500 to-transparent" />
        </div>
      </div>

      {/* Section Title with Neon Glow */}
      <div className="mb-6 px-8 relative">
        <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-gray-800 -z-10" />
        <div className="text-center">
          <span
            className="inline-block px-8 py-2 bg-[#0a0a0f] text-2xl font-bold tracking-[0.25em] uppercase border-y border-gray-800"
            style={{
              color: accentColor,
              fontFamily: "'Orbitron', sans-serif",
              textShadow: `0 0 10px ${accentColor}66`
            }}
          >
            {section.title}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 pb-8">
        <div className="max-w-md mx-auto">
          {section.categories.map((category, index) => {
            // Auto-detect Veg/Non-Veg for Food Pages
            const isVeg = section.title.includes("VEG") && !section.title.includes("NON");
            const isNonVeg = section.title.includes("NON-VEG") || section.title.includes("MEAT") || section.title.includes("CHICKEN");
            // Only show icons for Food pages (Indices 0-4 roughly, or just logic check)
            const showDietIcon = isVeg || isNonVeg;

            return (
              <CategoryBlock
                key={category.title}
                category={category}
                index={index}
                accentColor={accentColor}
                dietIcon={showDietIcon ? (isVeg ? "veg" : "non-veg") : null}
              />
            );
          })}
        </div>
      </div>


      {/* Footer */}
      <div className="pb-6 text-center relative z-10">
        <div className="flex justify-between items-end px-12">
          <div className="text-left">
            <p className="text-[8px] tracking-[0.15em] text-gray-600 uppercase">PUNE</p>
          </div>
          <div className="text-center">
            <p className="text-[8px] text-gray-500 mb-0.5" style={{ color: accentColor }}>page</p>
            <p className="text-[12px] font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              0{pageNumber} <span className="text-gray-600 text-[9px]">/ 0{totalPages}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[8px] tracking-[0.15em] text-gray-600 uppercase">DINING</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrintPreview = ({ isOpen, onClose }: PrintPreviewProps) => {
  const { menuData } = useMenu();
  const [currentPage, setCurrentPage] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Smart grouping for A5 pages (more pages to ensure no cutoff)
  // Smart grouping for A5 pages with automatic splitting for large sections
  // Smart grouping for A5 pages with automatic splitting for large sections
  const pages = [
    // Page 1: Veg Snacks Part 1 (9 Items)
    {
      section: {
        title: "APPETIZERS (VEG)",
        categories: [{
          ...menuData.snacksAndStarters.categories[0],
          items: menuData.snacksAndStarters.categories[0].items.slice(0, 9)
        }]
      },
      variant: "cyan" as const,
      key: "snacks-veg-1"
    },
    // Page 2: Veg Snacks Part 2 (Remainder)
    {
      section: {
        title: "APPETIZERS (VEG) - CONT.",
        categories: [{
          ...menuData.snacksAndStarters.categories[0],
          title: "VEG (CONTINUED)",
          items: menuData.snacksAndStarters.categories[0].items.slice(9)
        }]
      },
      variant: "cyan" as const,
      key: "snacks-veg-2"
    },
    // Page 3: Non-Veg Snacks Part 1 (10 Items)
    {
      section: {
        title: "APPETIZERS (NON-VEG)",
        categories: [{
          ...menuData.snacksAndStarters.categories[1],
          items: menuData.snacksAndStarters.categories[1].items.slice(0, 10)
        }]
      },
      variant: "cyan" as const,
      key: "snacks-nonveg-1"
    },
    // Page 4: Non-Veg Snacks Part 2 (Remainder)
    {
      section: {
        title: "APPETIZERS (NON-VEG) - CONT.",
        categories: [{
          ...menuData.snacksAndStarters.categories[1],
          title: "NON-VEG (CONTINUED)",
          items: menuData.snacksAndStarters.categories[1].items.slice(10)
        }]
      },
      variant: "cyan" as const,
      key: "snacks-nonveg-2"
    },
    // Page 5: Curries (9 Items - Safe)
    {
      section: {
        title: "SIGNATURE CURRIES",
        categories: [menuData.foodMenu.categories[0], menuData.foodMenu.categories[1]]
      },
      variant: "magenta" as const,
      key: "food-curries"
    },
    // Page 6: Mains Part 1 (10 Items)
    {
      section: {
        title: "VEGETARIAN MAINS",
        categories: [{
          ...menuData.foodMenu.categories[3],
          items: menuData.foodMenu.categories[3].items.slice(0, 10)
        }]
      },
      variant: "magenta" as const,
      key: "food-mains-1"
    },
    // Page 7: Mains Part 2 (Remainder + Thalis)
    {
      section: {
        title: "MAINS & THALIS",
        categories: [
          {
            ...menuData.foodMenu.categories[3],
            title: "VEG MAINS (CONTINUED)",
            items: menuData.foodMenu.categories[3].items.slice(10)
          },
          menuData.foodMenu.categories[2]
        ]
      },
      variant: "magenta" as const,
      key: "food-mains-2"
    },
    // Page 8: Gourmet Sides (6 Items - Safe)
    {
      section: {
        title: "GOURMET SIDES",
        categories: [
          menuData.sideItems.categories[1],      // Bar Bites
          menuData.sideItems.categories[2]       // Rice
        ]
      },
      variant: "magenta" as const,
      key: "food-sides"
    },
    // Page 9: Beers Part 1 (Large - 7 Items)
    {
      section: {
        title: "CRAFT BREWS (LARGE)",
        categories: [
          menuData.beveragesMenu.categories[0]   // Large (7 items)
        ]
      },
      variant: "cyan" as const,
      key: "drinks-beers-large"
    },
    // Page 10: Beers Part 2 (Pints - 8 Items)
    {
      section: {
        title: "CRAFT BREWS (PINTS)",
        categories: [
          menuData.beveragesMenu.categories[1]   // Pints (8 items)
        ]
      },
      variant: "cyan" as const,
      key: "drinks-beers-small"
    },
    // Page 11: Coolers & Premium Vodkas (9 Items)
    {
      section: {
        title: "COOLERS & VODKAS",
        categories: [
          menuData.beveragesMenu.categories[2], // Breezers (4)
          menuData.beveragesMenu.categories[8], // Premium Vodkas (5)
        ]
      },
      variant: "cyan" as const,
      key: "drinks-vodkas-1"
    },
    // Page 12: Crystal Vodkas (4 Items) - Very Spacious
    {
      section: {
        title: "CRYSTAL VODKAS",
        categories: [
          menuData.beveragesMenu.categories[3], // Crystal Vodkas (4)
        ]
      },
      variant: "cyan" as const,
      key: "drinks-vodkas-2"
    },
    // Page 13: Rums (6 Items)
    {
      section: {
        title: "AGED RUMS",
        categories: [
          menuData.beveragesMenu.categories[4]  // Rums (6)
        ]
      },
      variant: "cyan" as const,
      key: "drinks-rums"
    },
    // Page 14: Gin & Liqueurs (7 Items)
    {
      section: {
        title: "GIN & LIQUEURS",
        categories: [
          menuData.beveragesMenu.categories[10], // Gin & Brandy (4)
          menuData.beveragesMenu.categories[11], // Premium Liqueurs (3)
        ]
      },
      variant: "cyan" as const,
      key: "drinks-gin-liqueurs"
    },
    // Page 15: Indian Reserves Part 1 (7 Items)
    {
      section: {
        title: "INDIAN RESERVES",
        categories: [{
          ...menuData.beveragesMenu.categories[5],
          items: menuData.beveragesMenu.categories[5].items.slice(0, 7)
        }]
      },
      variant: "gold" as const,
      key: "drinks-indian-whisky-1"
    },
    // Page 16: Indian Reserves Part 2 (6 Items)
    {
      section: {
        title: "INDIAN RESERVES - CONT.",
        categories: [{
          ...menuData.beveragesMenu.categories[5],
          title: "INDIAN WHISKY (CONTINUED)",
          items: menuData.beveragesMenu.categories[5].items.slice(7)
        }]
      },
      variant: "gold" as const,
      key: "drinks-indian-whisky-2"
    },
    // Page 17: World Whiskies Part 1 (8 Items)
    {
      section: {
        title: "WORLD COLLECTION",
        categories: [{
          ...menuData.beveragesMenu.categories[6],
          items: menuData.beveragesMenu.categories[6].items.slice(0, 8)
        }]
      },
      variant: "gold" as const,
      key: "drinks-world-whisky-1"
    },
    // Page 18: World Whiskies Part 2 (8 Items)
    {
      section: {
        title: "WORLD COLLECTION - CONT.",
        categories: [{
          ...menuData.beveragesMenu.categories[6],
          title: "WORLD WHISKY (CONTINUED)",
          items: menuData.beveragesMenu.categories[6].items.slice(8)
        }]
      },
      variant: "gold" as const,
      key: "drinks-world-whisky-2"
    },
    // Page 19: Celebration Bottles (9 Items)
    {
      section: {
        title: "CELEBRATION BOTTLES",
        categories: [menuData.beveragesMenu.categories[7]]
      },
      variant: "gold" as const,
      key: "drinks-bottles"
    },
    // Page 20: Wines (10 Items - Safe)
    {
      section: {
        title: "FINE WINES COLLECTION",
        categories: [
          menuData.beveragesMenu.categories[9], // Wines
        ]
      },
      variant: "magenta" as const,
      key: "drinks-wines"
    },
    // Page 21: Refreshments (11 Items)
    {
      section: {
        title: "REFRESHMENTS",
        categories: [
          menuData.sideItems.categories[0],      // Water/Soda
          menuData.beveragesMenu.categories[12], // Soft Drinks
        ]
      },
      variant: "cyan" as const,
      key: "refreshments"
    },
  ];

  const capturePageAtIndex = async (index: number): Promise<HTMLCanvasElement | null> => {
    // First make sure the page is visible for capture
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    document.body.appendChild(tempDiv);

    const page = pages[index];
    const accentColor = page.variant === "cyan" ? "#00f0ff" : page.variant === "magenta" ? "#ff00ff" : "#ffd700";

    // Auto-detect Veg/Non-Veg for PDF generation
    const isVeg = page.section.title.includes("VEG") && !page.section.title.includes("NON");
    const isNonVeg = page.section.title.includes("NON-VEG") || page.section.title.includes("MEAT") || page.section.title.includes("CHICKEN");
    const showDietIcon = isVeg || isNonVeg;

    const pageElement = document.createElement("div");
    // A5 Dimensions: 148mm x 210mm (~560px x 794px at 96dpi)
    pageElement.innerHTML = `
      <div style="font-family: 'Rajdhani', sans-serif; background: #0a0a0f; background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px); background-size: 30px 30px; width: 559px; min-height: 794px; position: relative; display: flex; flex-direction: column; overflow: hidden;">
        
        <!-- World-Class Boundary System -->
        <div style="position: absolute; inset: 0; pointer-events: none;">
          <!-- Outer Frame -->
          <div style="position: absolute; inset: 8px; border: 1px solid rgba(55,65,81,0.8);">
            <!-- Tech notches -->
            <div style="position: absolute; top: 25%; left: -1px; width: 3px; height: 32px; background: #1f2937;"></div>
            <div style="position: absolute; bottom: 25%; right: -1px; width: 3px; height: 32px; background: #1f2937;"></div>
          </div>
          
          <!-- Inner Frame with Accent -->
          <div style="position: absolute; inset: 15px; border: 1px solid ${accentColor}44;"></div>
          
          <!-- Corner Accents SVG Simulated -->
           <div style="position: absolute; top: 15px; left: 15px; width: 48px; height: 48px; border-top: 3px solid ${accentColor}; border-left: 3px solid ${accentColor}; box-shadow: -2px -2px 10px ${accentColor}44;"></div>
           <div style="position: absolute; top: 15px; right: 15px; width: 48px; height: 48px; border-top: 3px solid ${accentColor}; border-right: 3px solid ${accentColor}; box-shadow: 2px -2px 10px ${accentColor}44;"></div>
           <div style="position: absolute; bottom: 15px; left: 15px; width: 48px; height: 48px; border-bottom: 3px solid ${accentColor}; border-left: 3px solid ${accentColor}; box-shadow: -2px 2px 10px ${accentColor}44;"></div>
           <div style="position: absolute; bottom: 15px; right: 15px; width: 48px; height: 48px; border-bottom: 3px solid ${accentColor}; border-right: 3px solid ${accentColor}; box-shadow: 2px 2px 10px ${accentColor}44;"></div>
        </div>

        <!-- Premium Header -->
        <div style="padding-top: 32px; padding-bottom: 16px; text-align: center; position: relative; z-index: 10;">
          <div style="display: flex; justify-content: center; margin-bottom: 16px;">
             <div style="display: inline-block; padding: 20px 48px; position: relative; border: 2px solid rgba(245, 158, 11, 0.4); border-radius: 8px; background: rgba(0,0,0,0.6); box-shadow: 0 0 30px rgba(251, 191, 36, 0.1);">
                <h1 style="font-family: 'Orbitron', 'sans-serif'; font-size: 60px; line-height: 1; font-weight: 900; letter-spacing: 0.2em; color: #f59e0b; background: -webkit-linear-gradient(0deg, #fde68a, #f59e0b, #d97706); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 25px rgba(245, 158, 11, 0.5)); margin: 0;">LIVE</h1>
                <!-- Corner Accents -->
                <div style="position: absolute; top: -6px; left: -6px; width: 16px; height: 16px; border-top: 2px solid #fbbf24; border-left: 2px solid #fbbf24;"></div>
                <div style="position: absolute; top: -6px; right: -6px; width: 16px; height: 16px; border-top: 2px solid #fbbf24; border-right: 2px solid #fbbf24;"></div>
                <div style="position: absolute; bottom: -6px; left: -6px; width: 16px; height: 16px; border-bottom: 2px solid #fbbf24; border-left: 2px solid #fbbf24;"></div>
                <div style="position: absolute; bottom: -6px; right: -6px; width: 16px; height: 16px; border-bottom: 2px solid #fbbf24; border-right: 2px solid #fbbf24;"></div>
                <!-- Circuit lines -->
                <div style="position: absolute; top: 50%; left: -12px; width: 12px; height: 2px; background: rgba(251, 191, 36, 0.5);"></div>
                <div style="position: absolute; top: 50%; right: -12px; width: 12px; height: 2px; background: rgba(251, 191, 36, 0.5);"></div>
             </div>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px;">
            <div style="height: 1px; width: 64px; background: linear-gradient(to right, transparent, #06b6d4, transparent);"></div>
            <span style="font-size: 9px; letter-spacing: 0.25em; color: white; text-transform: uppercase; font-weight: bold; font-family: 'Orbitron', sans-serif; text-shadow: 0 0 5px rgba(34,211,238,0.8);">EAT . DRINK . CODE . REPEAT</span>
            <div style="height: 1px; width: 64px; background: linear-gradient(to left, transparent, #d946ef, transparent);"></div>
          </div>
        </div>

        <!-- Section Title -->
        <div style="margin-bottom: 24px; padding-left: 32px; padding-right: 32px; position: relative; text-align: center;">
             <div style="position: absolute; top: 50%; left: 32px; right: 32px; height: 1px; background-color: #1f2937; z-index: 0;"></div>
             <span style="display: inline-block; padding: 6px 24px; background-color: #0a0a0f; font-size: 20px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; border-top: 1px solid #1f2937; border-bottom: 1px solid #1f2937; color: ${accentColor}; font-family: 'Orbitron', sans-serif; position: relative; z-index: 1; text-shadow: 0 0 10px ${accentColor}66;">
               ${escapeHtml(page.section.title)}
             </span>
        </div>

        <!-- Content -->
        <div style="flex: 1; padding-left: 32px; padding-right: 32px; padding-bottom: 32px;">
          <div style="max-width: 440px; margin: 0 auto;">
          ${page.section.categories.map((category, catIdx) => `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding-bottom: 4px; position: relative;">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, ${accentColor}88, transparent);"></div>
                ${category.icon ? `<span style="font-size: 16px;">${escapeHtml(category.icon)}</span>` : ""}
                <h3 style="font-size: 12px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; color: ${accentColor};">${escapeHtml(category.title)}</h3>
                ${showDietIcon ? `
                  <div style="margin-left: auto; border: 1px solid ${isVeg ? "#22c55e" : "#ef4444"}; padding: 2px; width: 12px; height: 12px; display: flex; align-items: center; justify-content: center; border-radius: 2px;">
                     <div style="width: 6px; height: 6px; border-radius: 50%; background-color: ${isVeg ? "#22c55e" : "#ef4444"};"></div>
                  </div>
                ` : ""}
              </div>
              ${category.items[0]?.sizes ? `
                <div style="display: flex; justify-content: flex-end; gap: 16px; padding: 0 16px 8px; border-bottom: 1px solid rgba(31,41,55,1);">
                  ${category.items[0].sizes.length === 4 ? `
                    <span style="font-size: 9px; color: #9ca3af; min-width: 40px; text-align: right; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; width: 50px;">30ml</span>
                    <span style="font-size: 9px; color: #9ca3af; min-width: 40px; text-align: right; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; width: 50px;">60ml</span>
                    <span style="font-size: 9px; color: #9ca3af; min-width: 40px; text-align: right; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; width: 50px;">90ml</span>
                    <span style="font-size: 9px; color: #9ca3af; min-width: 40px; text-align: right; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; width: 50px;">180ml</span>
                  ` : `
                    ${category.items[0].sizes.map((_, i) => `<span style="font-size: 9px; color: #9ca3af; min-width: 40px; text-align: right;">Size ${i + 1}</span>`).join("")}
                  `}
                </div>
              ` : category.items[0]?.halfPrice ? `
                 <div style="display: flex; justify-content: flex-end; gap: 12px; padding: 0 16px 8px; border-bottom: 1px solid rgba(31,41,55,1);">
                    <span style="font-size: 9px; color: #9ca3af; min-width: 40px; text-align: right; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Half</span>
                    <span style="font-size: 9px; color: #9ca3af; min-width: 40px; text-align: right; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Full</span>
                 </div>
              ` : ""}
              <div style="display: flex; flex-direction: column; gap: 1px; margin-top: 4px;">
                ${category.items.map((item, idx) => `
                  <div style="padding: 8px 10px; ${idx % 2 === 0 ? "background: rgba(255,255,255,0.02);" : ""}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                      <div style="flex: 1;">
                        <h4 style="font-size: 13px; font-weight: 600; color: white; letter-spacing: 0.05em; text-transform: uppercase;">${escapeHtml(item.name)}</h4>
                        ${item.description ? `<p style="font-size: 9px; color: #9ca3af; margin-top: 2px; font-style: italic; line-height: 1.4;">${escapeHtml(item.description)}</p>` : ""}
                      </div>
                      <div style="flex-shrink: 0; text-align: right;">
                        ${item.sizes ? `
                          <div style="display: flex; gap: 16px; justify-content: flex-end;">
                            ${item.sizes.map(size => `<span style="font-size: 11px; font-weight: 500; color: #fbbf24; min-width: 40px; text-align: right; width: 50px;">${escapeHtml(size)}</span>`).join("")}
                          </div>
                        ` : item.halfPrice && item.fullPrice ? `
                          <div style="display: flex; gap: 12px; align-items: center; justify-content: flex-end;">
                            <span style="font-size: 11px; font-weight: 500; color: #fbbf24; min-width: 40px; text-align: right;">${escapeHtml(item.halfPrice)}</span>
                            <span style="font-size: 11px; font-weight: 500; color: #fbbf24; min-width: 40px; text-align: right;">${escapeHtml(item.fullPrice)}</span>
                          </div>
                        ` : `
                          <span style="font-size: 13px; font-weight: 600; color: #fbbf24;">${escapeHtml(item.price)}</span>
                        `}
                      </div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
          </div>
        </div>

        <!-- Footer -->
        <div style="padding-bottom: 24px; padding-left: 48px; padding-right: 48px; position: relative; z-index: 10;">
          <div style="display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="text-align: left;">
              <p style="font-size: 8px; letter-spacing: 0.15em; color: #4b5563; text-transform: uppercase; margin: 0;">PUNE</p>
            </div>
            <div style="text-align: center;">
               <p style="font-size: 8px; color: ${accentColor}; margin-bottom: 2px; margin: 0;">page</p>
               <p style="font-size: 12px; font-weight: bold; color: white; font-family: 'Orbitron', sans-serif; margin: 0;">
                 0${index + 1} <span style="font-size: 10px; color: #4b5563;">/ 0${pages.length}</span>
               </p>
            </div>
            <div style="text-align: right;">
              <p style="font-size: 8px; letter-spacing: 0.15em; color: #4b5563; text-transform: uppercase; margin: 0;">DINING</p>
            </div>
          </div>
        </div>
      </div>
    `;
    tempDiv.appendChild(pageElement);

    // Wait for images to load explicitly to ensure they are captured
    const images = Array.from(pageElement.getElementsByTagName("img"));
    await Promise.all(images.map((img: any) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = () => resolve(null);
        img.onerror = () => resolve(null);
        // Force resolve after 1s to prevent hanging
        setTimeout(() => resolve(null), 1000);
      });
    }));

    try {
      const canvas = await html2canvas(pageElement.firstElementChild as HTMLElement, {
        scale: 2,
        backgroundColor: "#0a0a0f",
        useCORS: true,
        logging: false,
        width: 559, // A5 width
        height: 794, // A5 height
      });
      document.body.removeChild(tempDiv);
      return canvas;
    } catch (error) {
      console.error("Canvas capture error:", error);
      document.body.removeChild(tempDiv);
      return null;
    }
  };

  const downloadCurrentAsImage = async (format: "png" | "jpg") => {
    setIsExporting(true);
    try {
      const canvas = await capturePageAtIndex(currentPage);
      if (!canvas) throw new Error("Failed to capture");

      const link = document.createElement("a");
      link.download = `menu-${pages[currentPage].key}.${format}`;
      link.href = canvas.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 1.0);
      link.click();
      toast.success(`Page downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to download");
    } finally {
      setIsExporting(false);
    }
  };

  const downloadAllAsImages = async (format: "png" | "jpg") => {
    setIsExporting(true);
    try {
      for (let i = 0; i < pages.length; i++) {
        toast.info(`Exporting page ${i + 1} of ${pages.length}...`);
        const canvas = await capturePageAtIndex(i);
        if (canvas) {
          const link = document.createElement("a");
          link.download = `menu-${pages[i].key}.${format}`;
          link.href = canvas.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 1.0);
          link.click();
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      toast.success(`All ${pages.length} pages downloaded`);
    } catch (error) {
      toast.error("Failed to download");
    } finally {
      setIsExporting(false);
    }
  };

  const downloadAsPDF = async (allPages: boolean) => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a5", // A5 Format
        compress: true
      });

      const pagesToExport = allPages ? pages.map((_, i) => i) : [currentPage];
      const pdfWidth = 148; // A5 width
      const pdfHeight = 210; // A5 height
      let pagesAdded = 0;

      for (let i = 0; i < pagesToExport.length; i++) {
        const pageIndex = pagesToExport[i];
        toast.info(allPages ? `Processing page ${i + 1} of ${pages.length}...` : "Generating PDF...", {
          duration: 2000,
        });

        // Wait a bit to ensure browser doesn't freeze and DOM is ready
        await new Promise(resolve => setTimeout(resolve, 200));

        const canvas = await capturePageAtIndex(pageIndex);
        if (canvas) {
          if (pagesAdded > 0) pdf.addPage();

          // Use JPEG with high quality to ensure valid image data
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
          pagesAdded++;
        }
      }

      if (pagesAdded > 0) {
        const fileName = allPages ? "LiveBar-Full-Menu.pdf" : `LiveBar-Menu-${pages[currentPage].key}.pdf`;

        // Manual Blob download for maximum compatibility
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);

        const link = document.createElement('a');
        link.href = url;
        const simpleName = allPages ? "LiveBar_Full_Menu.pdf" : "LiveBar_Page.pdf";
        link.setAttribute('download', simpleName); // Explicit attribute
        link.style.display = 'none';
        document.body.appendChild(link);

        link.click();

        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);

        toast.success("PDF downloaded successfully!");
      } else {
        throw new Error("No valid pages could be generated");
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to create PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = async () => {
    setIsExporting(true);
    try {
      const canvas = await capturePageAtIndex(currentPage);
      if (!canvas) throw new Error("Failed to capture");

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Please allow popups for printing");
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Menu - ${pages[currentPage].section.title}</title>
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                @page { size: A5; margin: 0; }
              }
              body { display: flex; justify-content: center; margin: 0; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${canvas.toDataURL()}" onload="setTimeout(function(){window.print();window.close();},300);" />
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      toast.error("Failed to print");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] bg-background border-border p-0 flex flex-col">
        <DialogHeader className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-orbitron text-foreground">
              Print Preview - {pages[currentPage].section.title}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-4 bg-muted/30">
          <div className="flex justify-center">
            <div className="shadow-2xl transform scale-[0.65] origin-top">
              <PrintablePage
                section={pages[currentPage].section}
                pageRef={{ current: null }}
                variant={pages[currentPage].variant}
                pageNumber={currentPage + 1}
                totalPages={pages.length}
              />
            </div>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex gap-1">
                {pages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${currentPage === i ? "bg-primary" : "bg-muted"
                      }`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
                disabled={currentPage === pages.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Export Actions */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1 border-r border-border pr-2 mr-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  disabled={isExporting}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadCurrentAsImage("png")}
                disabled={isExporting}
              >
                <FileImage className="w-4 h-4 mr-2" />
                Current PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadAsPDF(false)}
                disabled={isExporting}
              >
                <FileText className="w-4 h-4 mr-2" />
                Current PDF
              </Button>
              <Button
                onClick={() => downloadAsPDF(true)}
                disabled={isExporting}
                className="bg-primary hover:bg-primary/90 min-w-[120px]"
              >
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export Full PDF
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
