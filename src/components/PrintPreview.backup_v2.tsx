import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const getSectionIntro = (title: string): string => {
  const t = title.toUpperCase();
  if (t.includes("WHISKY") || t.includes("WHISKEY")) return "A curated journey through the world's finest distilleries.";
  if (t.includes("VODKA") || t.includes("SPIRIT") || t.includes("RUM") || t.includes("GIN")) return "Pure, distinct, and crafted for the bold.";
  if (t.includes("BEER") || t.includes("BREW")) return "Crisp, refreshing, and perfectly poured.";
  if (t.includes("APPETIZER") || t.includes("STARTER") || t.includes("SNACK")) return "Small plates, bold flavors—the perfect beginning.";
  if (t.includes("MAIN") || t.includes("Course")) return "Hearty, soulful dishes crafted with passion.";
  if (t.includes("REFRESH") || t.includes("BEVERAGE")) return "Cool, crisp, and revitalizing.";
  if (t.includes("PREMIUM") || t.includes("RESERVE")) return "Exclusive pours for the distinguished palate.";
  if (t.includes("SIDE") || t.includes("DESSERT")) return "The perfect companions to your meal.";
  return "Experience the taste of excellence.";
};

const getCategoryIconSvg = (title: string, color: string): string => {
  const t = title.toUpperCase();
  const stroke = color;

  // Wine / Champaign
  if (t.includes("WINE") || t.includes("SANG") || t.includes("CHAMP"))
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>`;

  // Beer
  if (t.includes("BEER") || t.includes("BREW") || t.includes("DRAUGHT") || t.includes("PINT"))
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72 0-2.5.5a2.5 2.5 0 0 1 0 5c.78 0 1.57.5 2.5.5S9.44 13 11 13s2 .5 3 .5 1.72 0 2.5-.5a2.5 2.5 0 0 1 0-5c-.78 0-1.57-.5-2.5-.5Z"/><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/></svg>`;

  // Whisky / Spirits (Rock Glass style)
  if (t.includes("WHISK") || t.includes("SCOTCH") || t.includes("BOURBON") || t.includes("RUM") || t.includes("VODKA") || t.includes("GIN") || t.includes("TEQUILA") || t.includes("BRANDY") || t.includes("COGNAC"))
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V2"/><path d="M12 15a5 5 0 0 0 5-5H7a5 5 0 0 0 5 5Z"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>`;

  // Cocktails (Martini)
  if (t.includes("COCKTAIL") || t.includes("MARTINI") || t.includes("SHOOTER") || t.includes("SHOT"))
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M12 11v11"/><path d="m19 3-7 8-7-8h14Z"/></svg>`;

  // Food / Appetizers
  if (t.includes("APPETIZER") || t.includes("STARTER") || t.includes("SNACK") || t.includes("SALAD") || t.includes("SOUP") || t.includes("FRIES") || t.includes("BITE"))
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`;

  // Mains (Pot/Bowl)
  if (t.includes("MAIN") || t.includes("COURSE") || t.includes("CURRY") || t.includes("RICE") || t.includes("BIRYANI") || t.includes("NOODLE") || t.includes("PASTA") || t.includes("PIZZA"))
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a1 1 0 0 0-1-1v1a2 2 0 0 1-4 0V5a2 2 0 1 0-4 0v14a2 2 0 0 1-4 0v-1a1 1 0 0 0-1 1v2"/><path d="M19 10V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v5"/><path d="M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4Z"/><path d="M10 5a2 2 0 1 1 4 0v15a2 2 0 1 1-4 0V5Z"/></svg>`;

  // Default (Star/Sparkle)
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`;
};

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuItemRow = ({ item, isEven }: { item: MenuItem; isEven: boolean }) => {
  const hasSizes = item.sizes && item.sizes.length > 0;
  const hasHalfFull = item.halfPrice && item.fullPrice;

  return (
    <div className={`py-0.5 px-4 ${isEven ? "bg-white/[0.02]" : ""}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-[15px] font-semibold text-white tracking-wide uppercase">
              {item.name}
            </h4>
            {item.isChefSpecial && (
              <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded border border-pink-500/40"
                style={{
                  background: "linear-gradient(135deg, #be185d 0%, #ec4899 50%, #be185d 100%)",
                  color: "white",
                  boxShadow: "0 0 12px rgba(190, 24, 93, 0.5), inset 0 1px 1px rgba(255,255,255,0.3)",
                  backdropFilter: "blur(4px)"
                }}
              >
                ⭐ Chef's Special
              </span>
            )}
            {item.isBestSeller && (
              <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded border border-cyan-500/40"
                style={{
                  background: "linear-gradient(135deg, #0ea5e9 0%, #22d3ee 50%, #0ea5e9 100%)",
                  color: "white",
                  boxShadow: "0 0 12px rgba(14, 165, 233, 0.5), inset 0 1px 1px rgba(255,255,255,0.3)",
                  backdropFilter: "blur(4px)"
                }}
              >
                🔥 Best Seller
              </span>
            )}
            {item.isPremium && (
              <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded border border-yellow-500/40"
                style={{
                  background: "linear-gradient(135deg, #eab308 0%, #fde047 50%, #eab308 100%)",
                  color: "#1a1a1a",
                  boxShadow: "0 0 12px rgba(234, 179, 8, 0.6), inset 0 1px 1px rgba(255,255,255,0.4)",
                  backdropFilter: "blur(4px)",
                  textShadow: "0 0.5px 0 rgba(255,255,255,0.5)"
                }}
              >
                ✨ Premium
              </span>
            )}
            {item.isTopShelf && (
              <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded border border-purple-500/40"
                style={{
                  background: "linear-gradient(135deg, #9333ea 0%, #c084fc 50%, #9333ea 100%)",
                  color: "white",
                  boxShadow: "0 0 12px rgba(147, 51, 234, 0.5), inset 0 1px 1px rgba(255,255,255,0.3)",
                  backdropFilter: "blur(4px)"
                }}
              >
                🏆 Top Shelf
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-[10px] text-gray-400 mt-0.5 italic leading-tight tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {item.description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          {hasSizes ? (
            <div className="flex gap-4">
              {item.sizes!.map((size, i) => (
                <span key={i} className="text-[15px] font-semibold text-amber-400 min-w-[50px] text-center">
                  {size}
                </span>
              ))}
            </div>
          ) : hasHalfFull ? (
            <div className="flex gap-4 items-center">
              <div className="text-center">
                <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Half</span>
                <span className="text-[15px] font-semibold text-amber-400">{item.halfPrice}</span>
              </div>
              <div className="text-center">
                <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Full</span>
                <span className="text-[15px] font-semibold text-amber-400">{item.fullPrice}</span>
              </div>
            </div>
          ) : (
            <span className="text-[18px] font-bold text-amber-400">{item.price}</span>
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
    <div className="mb-4">
      {/* Category Header with Enhanced Divider */}
      <div className="flex items-center gap-3 mb-3 pb-2 relative">
        {/* Main underline gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}88, transparent)` }}
        />

        {/* Decorative Corner Flourishes */}
        <div className="absolute bottom-[-1px] left-0 w-12 h-[3px]" style={{
          background: `linear-gradient(90deg, ${accentColor}60, transparent)`
        }} />
        <div className="absolute bottom-[-1px] right-0 w-12 h-[3px]" style={{
          background: `linear-gradient(-90deg, ${accentColor}60, transparent)`
        }} />

        {/* Decorative dots */}
        <div className="absolute bottom-[-3px] left-14 w-1 h-1 rounded-full" style={{ backgroundColor: `${accentColor}80` }} />
        <div className="absolute bottom-[-3px] right-14 w-1 h-1 rounded-full" style={{ backgroundColor: `${accentColor}80` }} />

        <span className="text-lg flex items-center justify-center opacity-80"
          dangerouslySetInnerHTML={{ __html: getCategoryIconSvg(category.title, accentColor) }}
        />

        <h3 className="text-[14px] font-bold tracking-[0.2em] uppercase" style={{ color: accentColor }}>
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

// Cover Page Component
const CoverPage = ({
  pageRef,
  variant
}: {
  pageRef: React.RefObject<HTMLDivElement>;
  variant: "cyan" | "magenta" | "gold";
}) => {
  const accentColor = variant === "cyan" ? "#00f0ff" : variant === "magenta" ? "#ff00ff" : "#ffd700";

  return (
    <div
      ref={pageRef}
      className="bg-[#0a0a0f] w-[794px] min-h-[1123px] relative flex flex-col overflow-hidden items-center justify-center"
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    >
      {/* Enhanced Border Frame */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-[12px] border-2" style={{ borderColor: `${accentColor}60`, boxShadow: `inset 0 0 50px ${accentColor}15` }} />

        {/* Animated Corner Accents */}
        <div className="absolute top-[12px] left-[12px] w-32 h-32">
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
          <div className="absolute top-0 left-0 h-full w-1" style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }} />
        </div>
        <div className="absolute top-[12px] right-[12px] w-32 h-32">
          <div className="absolute top-0 right-0 w-full h-1" style={{ background: `linear-gradient(-90deg, ${accentColor}, transparent)` }} />
          <div className="absolute top-0 right-0 h-full w-1" style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }} />
        </div>
        <div className="absolute bottom-[12px] left-[12px] w-32 h-32">
          <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
          <div className="absolute bottom-0 left-0 h-full w-1" style={{ background: `linear-gradient(0deg, ${accentColor}, transparent)` }} />
        </div>
        <div className="absolute bottom-[12px] right-[12px] w-32 h-32">
          <div className="absolute bottom-0 right-0 w-full h-1" style={{ background: `linear-gradient(-90deg, ${accentColor}, transparent)` }} />
          <div className="absolute bottom-0 right-0 h-full w-1" style={{ background: `linear-gradient(0deg, ${accentColor}, transparent)` }} />
        </div>
      </div>

      {/* Logo Section */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8">
          <img
            src="/live_main_logo.jpg"
            alt="LIVE - Bar & Kitchen"
            className="relative w-[500px] h-auto drop-shadow-2xl"
            style={{ filter: "brightness(1.1) contrast(1.1)" }}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-32 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
          <div className="w-4 h-4 rotate-45" style={{ backgroundColor: accentColor, boxShadow: `0 0 20px ${accentColor}` }} />
          <div className="w-32 h-[2px]" style={{ background: `linear-gradient(-90deg, transparent, ${accentColor}, transparent)` }} />
        </div>

        {/* Restaurant Info */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-[0.3em] text-white uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
            Bar & Kitchen
          </h2>

          <div className="space-y-2">
            <p className="text-base tracking-[0.2em] text-gray-300 uppercase font-medium">
              Premium Dining & Spirits
            </p>
            <p className="text-[11px] text-gray-400 tracking-wider">
              Opp Pune Bakery, Wakad, Pune
            </p>
            {/* Address QR Code */}
            <div className="my-4 flex justify-center">
              <img src="/address_qr.png" alt="Location QR" className="w-20 h-20 rounded shadow-lg border border-cyan-500/30" />
            </div>
          </div>

          {/* Contact Information */}
          <div className="pt-6 space-y-3 border-t border-gray-700/50">
            <p className="text-sm text-cyan-400 tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              www.thelive.bar
            </p>
            <p className="text-[10px] text-cyan-400 tracking-wide font-bold uppercase mt-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              For booking contact: 7507066880 / 9881241411 / 9172792591
            </p>
          </div>

          {/* QR Code Placeholder (Optional) */}
          <div className="pt-8 pb-4">
            <p className="text-xs tracking-[0.25em] text-gray-600 uppercase mb-4">
              Menu • {new Date().getFullYear()}
            </p>

            {/* Tagline from Logo */}
            <p className="text-[10px] tracking-[0.4em] font-bold uppercase"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                background: "linear-gradient(90deg, #00f0ff, #ff00ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
              Eat • Drink • Code • Repeat
            </p>
          </div>

          {/* Binary Footer */}
          <div className="absolute bottom-6 left-0 right-0 text-center opacity-30">
            <p className="text-[6px] tracking-[0.8em] text-cyan-500 font-mono">
              01001100 01001001 01010110 01000101
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrintablePage = ({
  section,
  pageRef,
  variant,
  pageNumber,
  totalPages,
  isCover = false,
  isBackCover = false,
  proverb,
  twoColumn = false
}: {
  section: MenuSectionType;
  pageRef: React.RefObject<HTMLDivElement>;
  variant: "cyan" | "magenta" | "gold";
  pageNumber: number;
  totalPages: number;
  isCover?: boolean;
  isBackCover?: boolean;
  proverb?: string;
  twoColumn?: boolean;
}) => {
  const accentColor = variant === "cyan" ? "#00f0ff" : variant === "magenta" ? "#ff00ff" : "#ffd700";

  // Render cover page
  if (isCover) {
    return <CoverPage pageRef={pageRef} variant={variant} />;
  }

  // Render back cover page
  if (isBackCover) {
    return (
      <div
        ref={pageRef}
        className="bg-[#0a0a0f] w-[794px] min-h-[1123px] relative flex flex-col overflow-hidden items-center justify-center"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      >
        {/* Border Frame */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-3 border-2" style={{ borderColor: `${accentColor}60`, boxShadow: `inset 0 0 50px ${accentColor}15` }} />
          {/* Corners */}
          <div className="absolute top-3 left-3 w-32 h-32">
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
            <div className="absolute top-0 left-0 h-full w-1" style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }} />
          </div>
          <div className="absolute top-3 right-3 w-32 h-32">
            <div className="absolute top-0 right-0 w-full h-1" style={{ background: `linear-gradient(-90deg, ${accentColor}, transparent)` }} />
            <div className="absolute top-0 right-0 h-full w-1" style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }} />
          </div>
          <div className="absolute bottom-3 left-3 w-32 h-32">
            <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
            <div className="absolute bottom-0 left-0 h-full w-1" style={{ background: `linear-gradient(0deg, ${accentColor}, transparent)` }} />
          </div>
          <div className="absolute bottom-3 right-3 w-32 h-32">
            <div className="absolute bottom-0 right-0 w-full h-1" style={{ background: `linear-gradient(-90deg, ${accentColor}, transparent)` }} />
            <div className="absolute bottom-0 right-0 h-full w-1" style={{ background: `linear-gradient(0deg, ${accentColor}, transparent)` }} />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center max-w-[650px] px-12 text-center">
          {/* Story */}
          <div className="mb-10">
            <h2
              className="text-3xl font-bold tracking-[0.2em] mb-6"
              style={{
                fontFamily: "'Cinzel', serif",
                background: `linear-gradient(135deg, ${accentColor}, #fff)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              OUR STORY
            </h2>
            <div className="relative p-6 rounded-lg border border-white/5 bg-black/40">
              <p className="text-gray-200 text-sm leading-8 tracking-wide font-light italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                "Food is the universal language that connects us all. It transcends borders, cultures, and differences, bringing us together around a shared table. At LIVE, we believe in the power of this connection. Every dish we serve is a chapter in our story, crafted with passion, tradition, and a touch of innovation. We invite you to savor the moment, share the joy, and create memories that linger long after the last bite."
              </p>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="w-full flex gap-8 mb-8">
            <div className="flex-1 p-4 border border-gray-800/50 rounded bg-gray-900/20">
              <h3 className="text-sm font-bold tracking-[0.2em] mb-2" style={{ color: accentColor, fontFamily: "'Orbitron', sans-serif" }}>📍 LOCATION</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Opp Pune Bakery, Wakad<br />Pune, Maharashtra</p>
            </div>
            <div className="flex-1 p-4 border border-gray-800/50 rounded bg-gray-900/20">
              <h3 className="text-sm font-bold tracking-[0.2em] mb-2" style={{ color: accentColor, fontFamily: "'Orbitron', sans-serif" }}>🕐 HOURS</h3>
              <p className="text-gray-400 text-xs">Mon - Sun: 11:00 AM - 12:00 AM</p>
            </div>
          </div>

          {/* Contact */}
          <div className="w-full mb-8">
            <div className="pb-4 border-b border-gray-700/50 mb-4">
              <h3 className="text-lg font-bold tracking-[0.2em] mb-2" style={{ color: accentColor, fontFamily: "'Orbitron', sans-serif" }}>RESERVATIONS</h3>
              <p className="text-xl text-white font-light tracking-wider mb-1">+91 7507066880</p>
              <p className="text-cyan-400 text-sm font-semibold tracking-wide" style={{ fontFamily: "'Orbitron', sans-serif" }}>www.thelive.bar</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm mb-2">Follow our journey</p>
              <h3 className="text-xl font-bold tracking-[0.2em]" style={{ color: accentColor, fontFamily: "'Orbitron', sans-serif" }}>Live.lounge.wakad</h3>
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-4">
            <p className="text-[10px] tracking-[0.4em] text-cyan-400/60 font-semibold uppercase">Eat • Drink • Code • Repeat</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="bg-[#0a0a0f] w-[794px] min-h-[1123px] relative flex flex-col overflow-hidden"
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    >
      {/* World-Class Boundary System - A4 Optimized */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Outer Frame */}
        <div className="absolute inset-[12px] border border-gray-800/60" />

        {/* Inner Frame with Accent Glow */}
        <div
          className="absolute inset-[20px] border-2"
          style={{
            borderColor: `${accentColor}40`,
            boxShadow: `inset 0 0 30px ${accentColor}10`
          }}
        />

        {/* Corner Accents - Premium Tech Style */}
        <div className="absolute top-[20px] left-[20px] w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
          <div className="absolute top-0 left-0 h-full w-[3px]" style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }} />
          <div className="absolute top-[10px] left-[10px] w-3 h-3 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
        </div>

        <div className="absolute top-[20px] right-[20px] w-20 h-20">
          <div className="absolute top-0 right-0 w-full h-[3px]" style={{ background: `linear-gradient(-90deg, ${accentColor}, transparent)` }} />
          <div className="absolute top-0 right-0 h-full w-[3px]" style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }} />
          <div className="absolute top-[10px] right-[10px] w-3 h-3 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
        </div>

        <div className="absolute bottom-[20px] left-[20px] w-20 h-20">
          <div className="absolute bottom-0 left-0 w-full h-[3px]" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
          <div className="absolute bottom-0 left-0 h-full w-[3px]" style={{ background: `linear-gradient(0deg, ${accentColor}, transparent)` }} />
          <div className="absolute bottom-[10px] left-[10px] w-3 h-3 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
        </div>

        <div className="absolute bottom-[20px] right-[20px] w-20 h-20">
          <div className="absolute bottom-0 right-0 w-full h-[3px]" style={{ background: `linear-gradient(-90deg, ${accentColor}, transparent)` }} />
          <div className="absolute bottom-0 right-0 h-full w-[3px]" style={{ background: `linear-gradient(0deg, ${accentColor}, transparent)` }} />
          <div className="absolute bottom-[10px] right-[10px] w-3 h-3 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
        </div>

        {/* Side Circuit Lines */}
        <div className="absolute top-1/2 left-[20px] w-[40px] h-[2px] -translate-y-1/2" style={{ background: `linear-gradient(90deg, ${accentColor}80, transparent)` }} />
        <div className="absolute top-1/2 right-[20px] w-[40px] h-[2px] -translate-y-1/2" style={{ background: `linear-gradient(-90deg, ${accentColor}80, transparent)` }} />
      </div>

      {/* ENHANCED HEADER - Compact & Premium */}
      <div className="pt-6 pb-3 text-center relative z-10 flex-shrink-0">
        <div className="flex items-center justify-center gap-6">
          {/* Left Decorative Line */}
          <div className="flex-1 max-w-[120px] h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60)` }} />

          {/* Logo Section */}
          <div className="flex flex-col items-center">
            <img
              src={`/live_main_logo.jpg?v=${Date.now()}`}
              alt="LIVE - Bar & Kitchen"
              className="h-14 w-auto"
              style={{ filter: "brightness(1.1) contrast(1.05)" }}
            />
          </div>

          {/* Right Decorative Line */}
          <div className="flex-1 max-w-[120px] h-[1px]" style={{ background: `linear-gradient(-90deg, transparent, ${accentColor}60)` }} />
        </div>

        {/* Tagline */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <span className="text-[8px] tracking-[0.3em] uppercase text-cyan-400/80 font-semibold" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Eat • Drink • Code • Repeat
          </span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent via-magenta-500/50 to-transparent" />
        </div>
      </div>

      {/* Section Title - Always at Top */}
      <div className="mt-6 mb-4 px-12 relative flex-shrink-0">
        <div className="absolute top-1/2 left-12 right-12 h-[1px] bg-gray-800/50 -z-10" />
        <div className="text-center">
          <span
            className="inline-block px-10 py-2 bg-[#0a0a0f] text-xl font-bold tracking-[0.3em] uppercase"
            style={{
              color: accentColor,
              fontFamily: "'Orbitron', sans-serif",
              textShadow: `0 0 20px ${accentColor}40`,
              borderTop: `1px solid ${accentColor}30`,
              borderBottom: `1px solid ${accentColor}30`
            }}
          >
            {section.title}
          </span>
        </div>

        {/* Section Intro */}
        <div className="text-center mt-3">
          <p className="text-[10px] text-gray-400 font-serif italic tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {getSectionIntro(section.title)}
          </p>
        </div>
      </div>

      {/* Content Area - Expanded for A4 */}
      <div className="flex-1 px-12 pb-6 overflow-hidden">
        <div className={`mx-auto h-full ${twoColumn ? 'grid grid-cols-2 gap-6 content-start' : 'max-w-2xl space-y-6'}`}>
          {section.categories.map((category, index) => {
            const isVeg = section.title.includes("VEG") && !section.title.includes("NON");
            const isNonVeg = section.title.includes("NON-VEG") || section.title.includes("MEAT") || section.title.includes("CHICKEN");
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

      {/* Proverb Section */}
      {proverb && (
        <div className="px-12 py-2 text-center relative z-10">
          <p
            className="text-lg italic text-gray-300 tracking-wide"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            "{proverb}"
          </p>
        </div>
      )}

      {/* Daily Offers Banner */}
      <div className="px-12 py-2 relative z-10">
        <div
          className="text-center py-2 px-4 rounded-full mx-auto max-w-fit"
          style={{
            background: "linear-gradient(135deg, rgba(0,240,255,0.15), rgba(255,0,255,0.15))",
            border: "1px solid rgba(0,240,255,0.3)"
          }}
        >
          <p className="text-[10px] tracking-[0.15em] uppercase font-medium" style={{ color: "#22d3ee" }}>
            ✨ Check with the <span style={{ color: "#fff", fontWeight: "bold" }}>LIVE</span> team for daily offers ✨
          </p>
        </div>
      </div>

      {/* Binary Matrix Rain for Sparse Pages */}
      {section.categories.length <= 1 && !section.title.includes("COVER") && (
        <div className="absolute top-1/4 right-12 bottom-1/4 w-8 flex flex-col overflow-hidden opacity-10 pointer-events-none select-none z-0">
          <p className="text-[6px] text-cyan-500 font-mono leading-relaxed break-all text-center">
            {Array(60).fill("01001101 01010010").join(" ")}
          </p>
        </div>
      )}

      {/* ENHANCED FOOTER - Premium & Informative */}
      <div className="py-4 px-12 relative z-10 flex-shrink-0 border-t border-gray-800/30">
        <div className="flex justify-between items-center">
          {/* Left - Location */}
          <div className="text-left flex-1">
            <p className="text-[9px] tracking-[0.15em] text-gray-500 uppercase font-medium">Live Bar & Kitchen</p>
            <p className="text-[8px] text-gray-600">Pune, Maharashtra</p>
          </div>

          {/* Center - Page Number */}
          <div className="text-center flex-shrink-0 px-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}50)` }} />
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 border transform rotate-45" style={{ borderColor: `${accentColor}50` }} />
                <div className="relative z-10 flex flex-col items-center">
                  <p className="text-[6px] uppercase tracking-widest mb-0.5" style={{ color: accentColor }}>Page</p>
                  <p className="text-[14px] font-bold text-white leading-none" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {String(pageNumber).padStart(2, '0')}
                  </p>
                </div>
              </div>
              <div className="w-8 h-[1px]" style={{ background: `linear-gradient(-90deg, transparent, ${accentColor}50)` }} />
            </div>
          </div>

          {/* Right - Contact */}
          <div className="text-right flex-1">
            <p className="text-[9px] tracking-[0.15em] text-gray-500 uppercase font-medium">Premium Dining</p>
            <p className="text-[8px] text-gray-600">www.thelive.bar</p>
          </div>
        </div>
      </div>

      {/* Decorative Food Illustrations */}
      {!isCover && !isBackCover && (
        <div className="absolute bottom-16 left-0 right-0 pointer-events-none opacity-[0.12] overflow-hidden h-24">
          <svg viewBox="0 0 800 100" className="w-full h-full" style={{ color: accentColor }}>
            {/* Wine Glass */}
            <g transform="translate(50, 20)" stroke="currentColor" fill="none" strokeWidth="1.5">
              <path d="M0,0 Q5,-5 10,0 L10,30 Q10,35 15,35 L25,35 Q30,35 30,30 L30,0 Q35,-5 40,0" />
              <path d="M20,35 L20,55" />
              <ellipse cx="20" cy="60" rx="15" ry="5" />
            </g>
            {/* Cocktail Glass */}
            <g transform="translate(120, 15)" stroke="currentColor" fill="none" strokeWidth="1.5">
              <path d="M0,0 L25,30 L50,0" />
              <path d="M25,30 L25,55" />
              <ellipse cx="25" cy="60" rx="12" ry="4" />
              <circle cx="10" cy="10" r="5" />
              <path d="M42,5 L55,0" />
            </g>
            {/* Shrimp/Prawn */}
            <g transform="translate(200, 25)" stroke="currentColor" fill="none" strokeWidth="1.5">
              <path d="M0,30 Q10,0 40,5 Q60,10 70,25 Q65,35 55,40 Q40,42 25,38 Q10,35 0,30" />
              <path d="M70,25 Q75,22 80,25" />
              <path d="M70,28 Q75,28 78,30" />
              <path d="M15,32 Q20,35 25,32" />
              <path d="M30,35 Q35,38 40,35" />
            </g>
            {/* Fish */}
            <g transform="translate(320, 20)" stroke="currentColor" fill="none" strokeWidth="1.5">
              <path d="M0,25 Q20,5 50,10 Q80,15 90,25 Q80,35 50,40 Q20,45 0,25" />
              <circle cx="75" cy="22" r="4" />
              <path d="M-15,25 L0,15 L0,35 L-15,25" />
              <path d="M30,20 Q35,25 30,30" />
              <path d="M45,18 Q50,25 45,32" />
            </g>
            {/* Lemon Slice */}
            <g transform="translate(450, 30)" stroke="currentColor" fill="none" strokeWidth="1.5">
              <circle cx="20" cy="20" r="20" />
              <circle cx="20" cy="20" r="15" />
              <path d="M20,5 L20,35" />
              <path d="M5,20 L35,20" />
              <path d="M9,9 L31,31" />
              <path d="M31,9 L9,31" />
            </g>
            {/* Kebab Skewer */}
            <g transform="translate(530, 10)" stroke="currentColor" fill="none" strokeWidth="1.5">
              <path d="M5,0 L5,70" />
              <ellipse cx="5" cy="15" rx="8" ry="6" />
              <ellipse cx="5" cy="30" rx="10" ry="7" />
              <ellipse cx="5" cy="45" rx="8" ry="6" />
              <ellipse cx="5" cy="58" rx="6" ry="5" />
            </g>
            {/* Herb/Leaf */}
            <g transform="translate(580, 25)" stroke="currentColor" fill="none" strokeWidth="1.5">
              <path d="M20,50 Q20,30 35,15 Q50,0 70,5" />
              <path d="M30,35 Q40,25 55,20" />
              <path d="M25,45 Q30,40 40,38" />
              <path d="M45,28 Q55,22 65,20" />
            </g>
            {/* Beer Mug */}
            <g transform="translate(660, 15)" stroke="currentColor" fill="none" strokeWidth="1.5">
              <rect x="0" y="10" width="35" height="45" rx="3" />
              <path d="M35,18 Q50,18 50,35 Q50,48 35,48" />
              <path d="M5,5 Q10,0 15,5 Q20,8 25,5 Q30,2 35,8" />
              <path d="M8,20 L8,45" opacity="0.5" />
              <path d="M15,18 L15,48" opacity="0.5" />
            </g>
            {/* Chili */}
            <g transform="translate(740, 30)" stroke="currentColor" fill="none" strokeWidth="1.5">
              <path d="M0,20 Q5,0 15,5 Q30,10 35,30 Q38,45 30,50 Q20,55 10,45 Q0,35 0,20" />
              <path d="M12,5 Q10,-5 15,-8" />
            </g>
          </svg>
        </div>
      )}

      {/* Binary Code Watermark Footer */}
      <div className="absolute bottom-1 left-0 right-0 text-center opacity-20 pointer-events-none">
        <p className="text-[5px] tracking-[1.5em] text-cyan-500 font-mono">
          01001100 01001001 01010110 01000101
        </p>
      </div>
    </div >
  );
};

export const PrintPreview = ({ isOpen, onClose }: PrintPreviewProps) => {
  const { menuData } = useMenu();
  const [currentPage, setCurrentPage] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Promotional pricing state
  const [promoPercent, setPromoPercent] = useState<string>("");
  const [showPromoDialog, setShowPromoDialog] = useState(false);

  // Helper function to adjust price string by percentage
  const adjustPrice = (priceStr: string | undefined, percent: number): string => {
    if (!priceStr) return "";
    const numMatch = priceStr.match(/[\d,]+/);
    if (!numMatch) return priceStr;
    const num = parseFloat(numMatch[0].replace(/,/g, ""));
    const adjusted = Math.round(num * (1 + percent / 100));
    return priceStr.replace(numMatch[0], adjusted.toLocaleString("en-IN"));
  };

  // Get adjusted item with promotional pricing
  const getPromoItem = (item: MenuItem, overridePercent?: number): MenuItem => {
    if (overridePercent === undefined) return item;
    return {
      ...item,
      price: adjustPrice(item.price, overridePercent),
      halfPrice: adjustPrice(item.halfPrice, overridePercent),
      fullPrice: adjustPrice(item.fullPrice, overridePercent),
      sizes: item.sizes?.map(s => adjustPrice(s, overridePercent))
    };
  };

  // Optimized A4 page layout - 9 pages total (1 cover + 8 menu pages)
  const pages = [
    // Page 0: COVER PAGE
    {
      section: {
        title: "COVER",
        categories: []
      },
      variant: "cyan" as const,
      key: "cover",
      isCover: true
    },
    // Page 1: ALL APPETIZERS (Veg + Non-Veg) - TWO COLUMN
    {
      section: {
        title: "ARTISAN APPETIZERS",
        categories: [
          menuData.snacksAndStarters.categories[0], // VEG
          menuData.snacksAndStarters.categories[1]  // NON-VEG
        ]
      },
      variant: "cyan" as const,
      key: "appetizers-all",
      twoColumn: true
    },
    // Page 2: CURRIES & MAINS
    {
      section: {
        title: "SIGNATURE MAINS",
        categories: [
          menuData.foodMenu.categories[0], // Handi & Firepot
          menuData.foodMenu.categories[1], // Mutton
          menuData.foodMenu.categories[2]  // Thalis
        ]
      },
      variant: "magenta" as const,
      key: "food-mains"
    },
    // Page 3: VEGETARIAN & BITES
    {
      section: {
        title: "VEGETARIAN & BITES",
        categories: [
          menuData.foodMenu.categories[3],    // Veg Chef's Mains
          menuData.sideItems.categories[1],   // Bar Bites
        ]
      },
      variant: "magenta" as const,
      key: "veg-bites",
      proverb: "Good food is the foundation of genuine happiness."
    },
    // Page 3B: INDO-CHINESE & RICE
    {
      section: {
        title: "ASIAN & RICE",
        categories: [
          menuData.foodMenu.categories[4],    // Indo-Chinese Favorites
          menuData.sideItems.categories[2]    // Rice
        ]
      },
      variant: "magenta" as const,
      key: "asian-rice",
      twoColumn: true
    },
    // Page 4: BEERS & COOLERS
    {
      section: {
        title: "CRAFT BREWS & COOLERS",
        categories: [
          menuData.beveragesMenu.categories[0], // Large Beers
          menuData.beveragesMenu.categories[1], // Pints
          menuData.beveragesMenu.categories[2]  // Breezers
        ]
      },
      variant: "cyan" as const,
      key: "beers-coolers",
      twoColumn: true
    },
    // Page 5: VODKAS, RUMS & SPIRITS
    {
      section: {
        title: "SPIRITS COLLECTION",
        categories: [
          menuData.beveragesMenu.categories[8], // Premium Vodkas
          menuData.beveragesMenu.categories[3], // Crystal Vodkas
          menuData.beveragesMenu.categories[4], // Rums
          menuData.beveragesMenu.categories[10] // Gin & Brandy
        ]
      },
      variant: "cyan" as const,
      key: "spirits"
    },
    // Page 6: INDIAN WHISKIES
    {
      section: {
        title: "INDIAN WHISKY RESERVES",
        categories: [
          menuData.beveragesMenu.categories[5]  // Indian Reserves
        ]
      },
      variant: "gold" as const,
      key: "indian-whiskies"
    },
    // Page 7: WORLD WHISKIES
    {
      section: {
        title: "WORLD WHISKY COLLECTION",
        categories: [
          menuData.beveragesMenu.categories[6]  // World Whiskies
        ]
      },
      variant: "gold" as const,
      key: "world-whiskies",
      proverb: "Too much of anything is bad, but too much good whisky is barely enough."
    },
    // Page 7: CELEBRATION BOTTLES & WINES
    {
      section: {
        title: "PREMIUM SELECTION",
        categories: [
          menuData.beveragesMenu.categories[7],  // Celebration Bottles
          menuData.beveragesMenu.categories[9],  // Wines
          menuData.beveragesMenu.categories[11]  // Liqueurs
        ]
      },
      variant: "gold" as const,
      key: "premium",
      twoColumn: true
    },
    // Page 8: REFRESHMENTS
    {
      section: {
        title: "REFRESHMENTS",
        categories: [
          menuData.sideItems.categories[0],       // Water/Soda
          menuData.beveragesMenu.categories[12]   // Soft Drinks
        ]
      },
      variant: "cyan" as const,
      key: "refreshments",
      proverb: "Life is too short to drink anything but the best."
    },
    // Page 9: BACK COVER
    {
      section: {
        title: "BACK COVER",
        categories: []
      },
      variant: "cyan" as const,
      key: "back-cover",
      isBackCover: true
    },
  ];

  const capturePageAtIndex = async (index: number, overridePercent?: number): Promise<HTMLCanvasElement | null> => {
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

    // Check if this is the cover page
    if ((page as any).isCover) {
      // Cover Page HTML
      pageElement.innerHTML = `
        <div style="font-family: 'Rajdhani', sans-serif; background: #0a0a0f; background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px); background-size: 40px 40px; width: 794px; min-height: 1123px; position: relative; display: flex; flex-direction: column; overflow: hidden; align-items: center; justify-content: center;">
          ${overridePercent !== undefined ? `
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; font-weight: 900; color: rgba(255,255,255,0.05); white-space: nowrap; pointer-events: none; z-index: 0; text-transform: uppercase; border: 4px solid rgba(255,255,255,0.05); padding: 20px 40px; text-align: center;">
              PROMOTIONAL<br>PRICING
            </div>
          ` : ''}
          
          <!-- Enhanced Border Frame -->
          <div style="position: absolute; inset: 0; pointer-events: none;">
            <div style="position: absolute; inset: 12px; border: 2px solid ${accentColor}60; box-shadow: inset 0 0 50px ${accentColor}15;"></div>
            
            <!-- Corner Accents -->
            <div style="position: absolute; top: 12px; left: 12px; width: 128px; height: 128px;">
              <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, ${accentColor}, transparent);"></div>
              <div style="position: absolute; top: 0; left: 0; height: 100%; width: 4px; background: linear-gradient(180deg, ${accentColor}, transparent);"></div>
            </div>
            <div style="position: absolute; top: 12px; right: 12px; width: 128px; height: 128px;">
              <div style="position: absolute; top: 0; right: 0; width: 100%; height: 4px; background: linear-gradient(-90deg, ${accentColor}, transparent);"></div>
              <div style="position: absolute; top: 0; right: 0; height: 100%; width: 4px; background: linear-gradient(180deg, ${accentColor}, transparent);"></div>
            </div>
            <div style="position: absolute; bottom: 12px; left: 12px; width: 128px; height: 128px;">
              <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, ${accentColor}, transparent);"></div>
              <div style="position: absolute; bottom: 0; left: 0; height: 100%; width: 4px; background: linear-gradient(0deg, ${accentColor}, transparent);"></div>
            </div>
            <div style="position: absolute; bottom: 12px; right: 12px; width: 128px; height: 128px;">
              <div style="position: absolute; bottom: 0; right: 0; width: 100%; height: 4px; background: linear-gradient(-90deg, ${accentColor}, transparent);"></div>
              <div style="position: absolute; bottom: 0; right: 0; height: 100%; width: 4px; background: linear-gradient(0deg, ${accentColor}, transparent);"></div>
            </div>
          </div>

          <!-- Logo Section -->
          <div style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center;">
            <div style="position: relative; margin-bottom: 32px;">
              <img src="/live_main_logo.jpg" alt="LIVE - Bar & Kitchen" style="width: 500px; height: auto; display: block; filter: brightness(1.1) contrast(1.1);" />
            </div>

            <!-- Divider -->
            <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 32px;">
              <div style="width: 128px; height: 2px; background: linear-gradient(90deg, transparent, ${accentColor}, transparent);"></div>
              <div style="width: 16px; height: 16px; transform: rotate(45deg); background-color: ${accentColor}; box-shadow: 0 0 20px ${accentColor};"></div>
              <div style="width: 128px; height: 2px; background: linear-gradient(-90deg, transparent, ${accentColor}, transparent);"></div>
            </div>

            <!-- Restaurant Info -->
            <div style="text-align: center;">
              <h2 style="font-size: 32px; font-weight: bold; letter-spacing: 0.3em; color: white; text-transform: uppercase; font-family: 'Cinzel', serif; margin: 0 0 24px 0;">
                Bar & Kitchen
              </h2>
              
              <div style="margin-bottom: 24px;">
                <p style="font-size: 16px; letter-spacing: 0.2em; color: #d1d5db; text-transform: uppercase; font-weight: 500; margin: 0 0 8px 0;">
                  Premium Dining & Spirits
                </p>
                <p style="font-size: 14px; letter-spacing: 0.15em; color: #9ca3af; margin: 0;">
                  Opp Pune Bakery, Wakad, Pune
                </p>
              </div>
              
              <!-- Address QR Base64/Image -->
              <div style="margin-top: 12px; margin-bottom: 24px; display: flex; justify-content: center;">
                <img src="/address_qr.png" style="width: 80px; height: 80px; border-radius: 4px; border: 1px solid rgba(34,211,238,0.3); box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: block;" />
              </div>

              <!-- Contact Information -->
              <div style="padding-top: 24px; border-top: 1px solid rgba(55, 65, 81, 0.5);">
                <p style="font-size: 14px; color: #22d3ee; letter-spacing: 0.1em; font-family: 'Orbitron', sans-serif; margin: 0 0 12px 0;">
                  www.thelive.bar
                </p>
                <p style="font-size: 10px; color: #22d3ee; letter-spacing: 0.1em; font-family: 'Orbitron', sans-serif; margin: 0; font-weight: bold; text-transform: uppercase;">
                  For booking contact:<br/> 7507066880 / 9881241411 / 9172792591
                </p>
              </div>

              <!-- Year -->
              <div style="padding-top: 32px; padding-bottom: 24px;">
                <p style="font-size: 12px; letter-spacing: 0.25em; color: #4b5563; text-transform: uppercase; margin: 0 0 16px 0;">
                  Menu • ${new Date().getFullYear()}
                </p>
                <!-- Tagline -->
                <p style="font-size: 10px; letter-spacing: 0.4em; font-weight: bold; text-transform: uppercase; font-family: 'Orbitron', sans-serif; background: linear-gradient(90deg, #00f0ff, #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">
                  Eat • Drink • Code • Repeat
                </p>
              </div>

              <!-- Binary Footer -->
              <div style="position: absolute; bottom: 24px; left: 0; right: 0; text-align: center; opacity: 0.3;">
                <p style="font-size: 6px; letter-spacing: 0.8em; color: #06b6d4; font-family: monospace; margin: 0;">
                  01001100 01001001 01010110 01000101
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if ((page as any).isBackCover) {
      // Back Cover Page HTML
      pageElement.innerHTML = `
        <div style="font-family: 'Rajdhani', sans-serif; background: #0a0a0f; background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px); background-size: 40px 40px; width: 794px; min-height: 1123px; position: relative; display: flex; flex-direction: column; overflow: hidden; align-items: center; justify-content: space-between;">
          ${overridePercent !== undefined ? `
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; font-weight: 900; color: rgba(255,255,255,0.05); white-space: nowrap; pointer-events: none; z-index: 0; text-transform: uppercase; border: 4px solid rgba(255,255,255,0.05); padding: 20px 40px; text-align: center;">
              PROMOTIONAL<br>PRICING
            </div>
          ` : ''}
          
          <!-- Border Frame -->
          <div style="position: absolute; inset: 0; pointer-events: none;">
            <div style="position: absolute; inset: 12px; border: 2px solid ${accentColor}60; box-shadow: inset 0 0 50px ${accentColor}15;"></div>
            <!-- Corners -->
            <div style="position: absolute; top: 12px; left: 12px; width: 128px; height: 128px;">
               <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, ${accentColor}, transparent);"></div>
               <div style="position: absolute; top: 0; left: 0; height: 100%; width: 4px; background: linear-gradient(180deg, ${accentColor}, transparent);"></div>
            </div>
            <div style="position: absolute; top: 12px; right: 12px; width: 128px; height: 128px;">
               <div style="position: absolute; top: 0; right: 0; width: 100%; height: 4px; background: linear-gradient(-90deg, ${accentColor}, transparent);"></div>
               <div style="position: absolute; top: 0; right: 0; height: 100%; width: 4px; background: linear-gradient(180deg, ${accentColor}, transparent);"></div>
            </div>
            <div style="position: absolute; bottom: 12px; left: 12px; width: 128px; height: 128px;">
               <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, ${accentColor}, transparent);"></div>
               <div style="position: absolute; bottom: 0; left: 0; height: 100%; width: 4px; background: linear-gradient(0deg, ${accentColor}, transparent);"></div>
            </div>
            <div style="position: absolute; bottom: 12px; right: 12px; width: 128px; height: 128px;">
               <div style="position: absolute; bottom: 0; right: 0; width: 100%; height: 4px; background: linear-gradient(-90deg, ${accentColor}, transparent);"></div>
               <div style="position: absolute; bottom: 0; right: 0; height: 100%; width: 4px; background: linear-gradient(0deg, ${accentColor}, transparent);"></div>
            </div>
          </div>

          <!-- Content -->
          <div style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; max-width: 650px; padding: 0 48px; text-align: center;">
            
            <!-- Story -->
            <div style="margin-bottom: 40px;">
              <h2 style="font-size: 30px; font-weight: bold; letter-spacing: 0.2em; margin-bottom: 24px; font-family: 'Cinzel', serif; background: linear-gradient(135deg, ${accentColor}, #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; color: ${accentColor};">
                OUR STORY
              </h2>
              <div style="position: relative; padding: 24px 32px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.4);">
                <p style="color: #e2e8f0; font-size: 14px; line-height: 2; letter-spacing: 0.05em; font-weight: 300; font-style: italic; font-family: 'Playfair Display', serif;">
                  "Food is the universal language that connects us all. It transcends borders, cultures, and differences, bringing us together around a shared table. At LIVE, we believe in the power of this connection. Every dish we serve is a chapter in our story, crafted with passion, tradition, and a touch of innovation. We invite you to savor the moment, share the joy, and create memories that linger long after the last bite. Here's to good food, great company, and the beautiful tapestry of life woven one meal at a time."
                </p>
              </div>
            </div>

            <!-- Location & Hours Grid -->
            <div style="width: 100%; display: flex; gap: 32px; margin-bottom: 32px;">
              <!-- Location -->
              <div style="flex: 1; padding: 16px; border: 1px solid rgba(31,41,55,0.5); border-radius: 4px; background: rgba(17,24,39,0.2);">
                <h3 style="font-size: 14px; font-weight: bold; letter-spacing: 0.2em; margin-bottom: 8px; color: ${accentColor}; font-family: 'Orbitron', sans-serif;">📍 LOCATION</h3>
                <p style="color: #9ca3af; font-size: 12px; line-height: 1.6;">Opp Pune Bakery, Wakad<br/>Pune, Maharashtra</p>
              </div>
              <!-- Hours -->
              <div style="flex: 1; padding: 16px; border: 1px solid rgba(31,41,55,0.5); border-radius: 4px; background: rgba(17,24,39,0.2);">
                <h3 style="font-size: 14px; font-weight: bold; letter-spacing: 0.2em; margin-bottom: 8px; color: ${accentColor}; font-family: 'Orbitron', sans-serif;">🕐 HOURS</h3>
                <p style="color: #9ca3af; font-size: 12px;">Mon - Sun: 11:00 AM - 12:00 AM</p>
              </div>
            </div>

            <!-- Contact & Social -->
            <div style="width: 100%; margin-bottom: 32px;">
               <div style="padding-bottom: 16px; border-bottom: 1px solid rgba(55,65,81,0.5); margin-bottom: 16px;">
                 <h3 style="font-size: 18px; font-weight: bold; letter-spacing: 0.2em; margin-bottom: 8px; color: ${accentColor}; font-family: 'Orbitron', sans-serif;">RESERVATIONS</h3>
                 <p style="font-size: 20px; color: white; font-weight: 300; letter-spacing: 0.1em; margin-bottom: 4px;">+91 7507066880</p>
                 <p style="color: #22d3ee; font-size: 14px; font-weight: 600; letter-spacing: 0.05em; font-family: 'Orbitron', sans-serif;">www.thelive.bar</p>
               </div>
               <div>
                 <p style="color: #d1d5db; font-size: 14px; margin-bottom: 8px;">Follow our journey</p>
                 <h3 style="font-size: 20px; font-weight: bold; letter-spacing: 0.2em; color: ${accentColor}; font-family: 'Orbitron', sans-serif;">Live.lounge.wakad</h3>
               </div>
            </div>
            
            <!-- Feedback QR -->
            <div style="width: 100%; margin-bottom: 32px; padding: 20px; border: 1px dashed rgba(255,255,255,0.1); border-radius: 8px; background: rgba(0,0,0,0.3);">
              <p style="color: #fff; font-size: 14px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: bold; margin-bottom: 12px; font-family: 'Orbitron', sans-serif;">
                ❤️ Loved the Vibe?
              </p>
              <img src="/feedback_qr.png" style="width: 100px; height: 100px; border-radius: 12px; border: 2px solid white; box-shadow: 0 0 15px rgba(255,255,255,0.2); display: inline-block; margin-bottom: 8px;" />
              <p style="color: #9ca3af; font-size: 11px; letter-spacing: 0.1em; margin-top: 8px;">
                Scan to leave us a Google Review!<br/>Your feedback keeps us alive.
              </p>
            </div>

            <!-- Tagline -->
            <div style="margin-top: 16px;">
               <p style="font-size: 10px; letter-spacing: 0.4em; color: rgba(34,211,238,0.6); font-weight: 600; text-transform: uppercase;">Eat • Drink • Code • Repeat</p>
            </div>
            
            <!-- Binary Matrix Rain Back Cover -->
            <div style="position: absolute; top: 20%; left: 24px; bottom: 20%; width: 24px; overflow: hidden; opacity: 0.05; pointer-events: none;">
               <p style="font-size: 6px; color: #06b6d4; font-family: monospace; line-height: 2; word-break: break-all; text-align: center; margin: 0;">
                  ${Array(80).fill("0101").join(" ")}
               </p>
            </div>
            <div style="position: absolute; top: 20%; right: 24px; bottom: 20%; width: 24px; overflow: hidden; opacity: 0.05; pointer-events: none;">
               <p style="font-size: 6px; color: #06b6d4; font-family: monospace; line-height: 2; word-break: break-all; text-align: center; margin: 0;">
                  ${Array(80).fill("1010").join(" ")}
               </p>
            </div>
            
            <!-- Binary Footer -->
            <div style="position: absolute; bottom: 24px; left: 0; right: 0; text-align: center; opacity: 0.3;">
              <p style="font-size: 6px; letter-spacing: 0.8em; color: #06b6d4; font-family: monospace; margin: 0;">
                01001100 01001001 01010110 01000101
              </p>
            </div>
          </div>
        </div>
      `;
    } else {
      // A4 Dimensions: 210mm x 297mm (~794px x 1123px at 96dpi)
      pageElement.innerHTML = `
      <div style="font-family: 'Rajdhani', sans-serif; background: #0a0a0f; background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px); background-size: 40px 40px; width: 794px; min-height: 1123px; position: relative; display: flex; flex-direction: column; overflow: hidden;">
        ${overridePercent !== undefined ? `
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; font-weight: 900; color: rgba(255,255,255,0.05); white-space: nowrap; pointer-events: none; z-index: 0; text-transform: uppercase; border: 4px solid rgba(255,255,255,0.05); padding: 20px 40px; text-align: center;">
            PROMOTIONAL<br>PRICING
          </div>
        ` : ''}
        
        <!-- World-Class Boundary System A4 -->
        <div style="position: absolute; inset: 0; pointer-events: none;">
          ${page.section.categories.length <= 1 ? `
            <!-- Binary Matrix Rain Side -->
            <div style="position: absolute; top: 25%; right: 48px; bottom: 25%; width: 32px; overflow: hidden; opacity: 0.08; pointer-events: none; z-index: 0;">
              <p style="font-size: 6px; color: ${accentColor}; font-family: monospace; line-height: 1.8; word-break: break-all; text-align: center; margin: 0;">
                ${Array(100).fill("01").join(" 10 ")}
              </p>
            </div>
          ` : ''}
          <div style="position: absolute; inset: 12px; border: 1px solid rgba(55,65,81,0.6);"></div>
          <div style="position: absolute; inset: 20px; border: 2px solid ${accentColor}40; box-shadow: inset 0 0 30px ${accentColor}10;"></div>
          
          <!-- Corner Accents -->
          <div style="position: absolute; top: 20px; left: 20px; width: 80px; height: 80px;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; top: 0; left: 0; height: 100%; width: 3px; background: linear-gradient(180deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; top: 10px; left: 10px; width: 12px; height: 12px; border-radius: 50%; background-color: ${accentColor}; box-shadow: 0 0 10px ${accentColor};"></div>
          </div>
          <div style="position: absolute; top: 20px; right: 20px; width: 80px; height: 80px;">
            <div style="position: absolute; top: 0; right: 0; width: 100%; height: 3px; background: linear-gradient(-90deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; top: 0; right: 0; height: 100%; width: 3px; background: linear-gradient(180deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; top: 10px; right: 10px; width: 12px; height: 12px; border-radius: 50%; background-color: ${accentColor}; box-shadow: 0 0 10px ${accentColor};"></div>
          </div>
          <div style="position: absolute; bottom: 20px; left: 20px; width: 80px; height: 80px;">
            <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; bottom: 0; left: 0; height: 100%; width: 3px; background: linear-gradient(0deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; bottom: 10px; left: 10px; width: 12px; height: 12px; border-radius: 50%; background-color: ${accentColor}; box-shadow: 0 0 10px ${accentColor};"></div>
          </div>
          <div style="position: absolute; bottom: 20px; right: 20px; width: 80px; height: 80px;">
            <div style="position: absolute; bottom: 0; right: 0; width: 100%; height: 3px; background: linear-gradient(-90deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; bottom: 0; right: 0; height: 100%; width: 3px; background: linear-gradient(0deg, ${accentColor}, transparent);"></div>
            <div style="position: absolute; bottom: 10px; right: 10px; width: 12px; height: 12px; border-radius: 50%; background-color: ${accentColor}; box-shadow: 0 0 10px ${accentColor};"></div>
          </div>
          
          <div style="position: absolute; top: 50%; left: 20px; width: 40px; height: 2px; transform: translateY(-50%); background: linear-gradient(90deg, ${accentColor}80, transparent);"></div>
          <div style="position: absolute; top: 50%; right: 20px; width: 40px; height: 2px; transform: translateY(-50%); background: linear-gradient(-90deg, ${accentColor}80, transparent);"></div>
        </div>

        <!-- Enhanced Header -->
        <div style="padding-top: 24px; padding-bottom: 12px; text-align: center; position: relative; z-index: 10;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 24px;">
            <div style="flex: 1; max-width: 120px; height: 1px; background: linear-gradient(90deg, transparent, ${accentColor}60);"></div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <img src="/live_main_logo.jpg" alt="LIVE - Bar & Kitchen" style="height: 56px; width: auto; display: block; filter: brightness(1.1) contrast(1.05);" />
            </div>
            <div style="flex: 1; max-width: 120px; height: 1px; background: linear-gradient(-90deg, transparent, ${accentColor}60);"></div>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 8px;">
            <div style="width: 48px; height: 1px; background: linear-gradient(to right, transparent, rgba(6,182,212,0.5), transparent);"></div>
            <span style="font-size: 8px; letter-spacing: 0.3em; color: rgba(34,211,238,0.8); text-transform: uppercase; font-weight: 600; font-family: 'Orbitron', sans-serif;">Eat • Drink • Code • Repeat</span>
            <div style="width: 48px; height: 1px; background: linear-gradient(to left, transparent, rgba(217,70,239,0.5), transparent);"></div>
          </div>
        </div>

          <div style="margin-top: 24px; margin-bottom: 24px; padding-left: 48px; padding-right: 48px; position: relative; text-align: center;">
            <div style="position: absolute; top: 50%; left: 48px; right: 48px; height: 1px; background-color: rgba(31,41,55,0.5); z-index: 0;"></div>
            <span style="display: inline-block; padding: 8px 40px; background-color: #0a0a0f; font-size: 20px; font-weight: bold; letter-spacing: 0.3em; text-transform: uppercase; border-top: 1px solid ${accentColor}30; border-bottom: 1px solid ${accentColor}30; color: ${accentColor}; font-family: 'Orbitron', sans-serif; position: relative; z-index: 1; text-shadow: 0 0 20px ${accentColor}40;">
              ${escapeHtml(page.section.title)}
            </span>
            <!-- Section Intro HTML -->
            <div style="margin-top: 12px; position: relative; z-index: 2;">
              <p style="font-family: 'Cormorant Garamond', serif; font-size: 10px; color: #9ca3af; font-style: italic; letter-spacing: 0.05em; margin: 0; background-color: #0a0a0f; display: inline-block; padding: 0 16px;">
                ${getSectionIntro(page.section.title)}
              </p>
            </div>
          </div>

        <!-- Content -->
        <div style="flex: 1; padding-left: 48px; padding-right: 48px; padding-bottom: 24px; overflow: hidden;">
          <div style="max-width: 672px; margin: 0 auto; ${(page as any).twoColumn ? 'display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start;' : ''}">
          ${page.section.categories.filter(c => c && c.items).map((category, catIdx) => `
            <div style="margin-bottom: 32px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding-bottom: 4px; position: relative;">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, ${accentColor}88, transparent);"></div>
                <span style="display: flex; align-items: center; justify-content: center; opacity: 0.8;">
                   ${getCategoryIconSvg(category.title, accentColor)}
                </span>
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
                ${category.items.map((origItem, idx) => {
        const item = getPromoItem(origItem, overridePercent);
        return `
                  <div style="padding: 6px 12px; ${idx % 2 === 0 ? "background: rgba(255,255,255,0.02);" : ""}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
                      <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                          <h4 style="font-size: 14px; font-weight: 600; color: white; letter-spacing: 0.05em; text-transform: uppercase;">${escapeHtml(item.name)}</h4>
                          ${item.isChefSpecial ? `<span style="padding: 2px 8px; font-size: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px; background: linear-gradient(135deg, #ff00ff, #ff6b9d); color: #fff; box-shadow: 0 0 8px rgba(255,0,255,0.5);">⭐ Chef's Special</span>` : ''}
                          ${item.isBestSeller ? `<span style="padding: 2px 8px; font-size: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px; background: linear-gradient(135deg, #00f0ff, #0077ff); color: #000; box-shadow: 0 0 8px rgba(0,240,255,0.5);">🔥 Best Seller</span>` : ''}
                          ${item.isPremium ? `<span style="padding: 2px 8px; font-size: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px; background: linear-gradient(135deg, #ffd700, #ff8c00); color: #000; box-shadow: 0 0 8px rgba(255,215,0,0.5);">✨ Premium</span>` : ''}
                          ${item.isTopShelf ? `<span style="padding: 2px 8px; font-size: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px; background: linear-gradient(135deg, #9333ea, #7c3aed); color: #fff; box-shadow: 0 0 8px rgba(147,51,234,0.5);">🏆 Top Shelf</span>` : ''}
                        </div>
                        ${item.description ? `<p style="font-size: 9px; color: #9ca3af; margin-top: 2px; font-style: italic; line-height: 1.3; font-family: 'Cormorant Garamond', serif; letter-spacing: 0.02em;">${escapeHtml(item.description)}</p>` : ''}
                      </div>
                      <div style="flex-shrink: 0; text-align: right;">
                        ${item.sizes ? `
                          <div style="display: flex; gap: 16px; justify-content: flex-end;">
                            ${item.sizes.map(size => `<span style="font-size: 15px; font-weight: 600; color: #fbbf24; min-width: 40px; text-align: right; width: 50px;">${escapeHtml(size)}</span>`).join("")}
                          </div>
                        ` : item.halfPrice && item.fullPrice ? `
                          <div style="display: flex; gap: 12px; align-items: center; justify-content: flex-end;">
                            <span style="font-size: 15px; font-weight: 600; color: #fbbf24; min-width: 40px; text-align: right;">${escapeHtml(item.halfPrice)}</span>
                            <span style="font-size: 15px; font-weight: 600; color: #fbbf24; min-width: 40px; text-align: right;">${escapeHtml(item.fullPrice)}</span>
                          </div>
                        ` : `
                          <span style="font-size: 18px; font-weight: 700; color: #fbbf24;">${escapeHtml(item.price)}</span>
                        `}
                      </div>
                    </div>
                  </div>
                `}).join("")}
              </div>
            </div>
          `).join("")}
          </div>
        </div>

        <!-- Proverb -->
        ${(page as any).proverb ? `
        <div style="padding: 0 48px 8px; text-align: center; position: relative; z-index: 10;">
          <p style="font-size: 16px; font-style: italic; color: #d1d5db; font-family: 'Dancing Script', cursive; letter-spacing: 0.02em;">
            "${(page as any).proverb}"
          </p>
        </div>
        ` : ''}

        <!-- Daily Offers Banner -->
        <div style="padding: 0 48px 8px; text-align: center; position: relative; z-index: 10;">
          <div style="display: inline-block; padding: 8px 24px; border-radius: 50px; background: linear-gradient(135deg, rgba(0,240,255,0.15), rgba(255,0,255,0.15)); border: 1px solid rgba(0,240,255,0.3);">
            <p style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500; color: #22d3ee; margin: 0;">
              ✨ Check with the <span style="color: #fff; font-weight: bold;">LIVE</span> team for daily offers ✨
            </p>
          </div>
        </div>

        <!-- Enhanced Footer -->
        <div style="padding: 16px 48px; position: relative; z-index: 10; border-top: 1px solid rgba(55,65,81,0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="text-align: left; flex: 1;">
              <p style="font-size: 9px; letter-spacing: 0.15em; color: #6b7280; text-transform: uppercase; font-weight: 500; margin: 0 0 2px 0;">Live Bar & Kitchen</p>
              <p style="font-size: 8px; color: #4b5563; margin: 0;">Pune, Maharashtra</p>
            </div>
            <div style="text-align: center; flex-shrink: 0; padding: 0 24px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 32px; height: 1px; background: linear-gradient(90deg, transparent, ${accentColor}50);"></div>
                <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
                  <div style="position: absolute; inset: 0; border: 1px solid ${accentColor}40; transform: rotate(45deg);"></div>
                  <div style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center;">
                    <p style="font-size: 6px; text-transform: uppercase; letter-spacing: 0.1em; color: ${accentColor}; margin: 0 0 2px 0;">Page</p>
                    <p style="font-size: 14px; font-weight: bold; color: white; font-family: 'Orbitron', sans-serif; margin: 0; line-height: 1;">${String(index + 1).padStart(2, '0')}</p>
                  </div>
                </div>
                <div style="width: 32px; height: 1px; background: linear-gradient(-90deg, transparent, ${accentColor}50);"></div>
              </div>
            </div>
            <div style="text-align: right; flex: 1;">
              <p style="font-size: 9px; letter-spacing: 0.15em; color: #6b7280; text-transform: uppercase; font-weight: 500; margin: 0 0 2px 0;">Premium Dining</p>
              <p style="font-size: 8px; color: #4b5563; margin: 0;">www.thelive.bar</p>
            </div>
          </div>
        </div>
        </div>
        
        <!-- Binary Code Watermark Footer -->
        <div style="position: absolute; bottom: 4px; left: 0; right: 0; text-align: center; opacity: 0.2; pointer-events: none;">
          <p style="font-size: 5px; letter-spacing: 1.5em; color: #06b6d4; font-family: monospace; margin: 0;">
            01001100 01001001 01010110 01000101
          </p>
        </div>
      </div>
    `;
    }
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
        width: 794, // A4 width
        height: 1123, // A4 height
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

  const downloadAsPDF = async (allPages: boolean, overridePercent?: number) => {
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

        const canvas = await capturePageAtIndex(pageIndex, overridePercent);
        if (canvas) {
          if (pagesAdded > 0) pdf.addPage();

          // Use JPEG with high quality to ensure valid image data
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
          pagesAdded++;
        }
      }

      if (pagesAdded > 0) {
        const fileName = allPages
          ? (overridePercent !== undefined ? `LiveBar_Promo_${overridePercent}pct.pdf` : "LiveBar_Full_Menu.pdf")
          : `LiveBar_${pages[currentPage].key}.pdf`;

        // Create blob and download with explicit type
        const pdfBlob = pdf.output('blob');
        const blobUrl = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(blobUrl);

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
    <>
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
                  isCover={(pages[currentPage] as any).isCover}
                  isBackCover={(pages[currentPage] as any).isBackCover}
                  proverb={(pages[currentPage] as any).proverb}
                  twoColumn={(pages[currentPage] as any).twoColumn}
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
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPromoDialog(true)}
                  disabled={isExporting}
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                >
                  <div className="w-4 h-4 mr-2">🏷️</div>
                  Promo PDF
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

      {/* Promotional Pricing Dialog */}
      <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Create Promotional Menu</DialogTitle>
            <p className="text-sm text-gray-400">
              Create a temporary PDF with adjusted prices. The original menu remains unchanged.
            </p>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="percent">Price Adjustment Percentage (%)</Label>
              <Input
                id="percent"
                placeholder="e.g. 10 for +10%, -5 for -5%"
                value={promoPercent}
                onChange={(e) => setPromoPercent(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowPromoDialog(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const percent = parseFloat(promoPercent);
                if (!promoPercent || isNaN(percent)) {
                  toast.error("Please enter a valid percentage");
                  return;
                }

                downloadAsPDF(true, percent).then(() => {
                  setShowPromoDialog(false);
                });
              }}
              disabled={!promoPercent || isExporting}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Generate Promo PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
