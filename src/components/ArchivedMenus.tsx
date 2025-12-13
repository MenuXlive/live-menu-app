import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, Calendar, Download, Eye, X, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useMenu } from "@/contexts/MenuContext";

interface ArchivedMenu {
  id: string;
  archived_at: string;
  notes: string | null;
  menu_data: any;
  archived_by: string | null;
}

interface ArchivedMenusProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export const ArchivedMenus = ({ isOpen, onClose }: ArchivedMenusProps) => {
  const { restoreDatabase } = useMenu();
  const [archivedMenus, setArchivedMenus] = useState<ArchivedMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchArchivedMenus();
    }
  }, [isOpen]);

  const fetchArchivedMenus = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("archived_menus")
      .select("*")
      .order("archived_at", { ascending: false });

    if (error) {
      console.error("Error fetching archived menus:", error);
      toast.error("Failed to load archived menus");
    } else {
      setArchivedMenus(data || []);
    }
    setIsLoading(false);
  };

  const handleRestore = async (archive: ArchivedMenu) => {
    if (confirm("Are you sure you want to restore this version? This will replace your current menu data.")) {
      setIsRestoring(archive.id);
      const success = await restoreDatabase(archive.menu_data);
      setIsRestoring(null);

      if (success) {
        toast.success("Menu restored successfully");
        onClose();
      } else {
        toast.error("Failed to restore menu");
      }
    }
  };

  const generatePDFForArchive = async (archive: ArchivedMenu) => {
    setIsExporting(archive.id);

    try {
      const menuData = archive.menu_data;
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [794, 1123],
      });

      const pages = buildPagesFromMenuData(menuData);

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage([794, 1123]);

        const canvas = await capturePageFromData(pages[i], i, pages.length);
        if (canvas) {
          const imgData = canvas.toDataURL("image/jpeg", 0.95);
          pdf.addImage(imgData, "JPEG", 0, 0, 794, 1123);
        }
      }

      const dateStr = format(new Date(archive.archived_at), "yyyy-MM-dd_HHmm");
      pdf.save(`menu_archive_${dateStr}.pdf`);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsExporting(null);
    }
  };

  const buildPagesFromMenuData = (menuData: any) => {
    const pages = [];

    // Page 1: Veg Snacks
    if (menuData.snacksAndStarters?.categories?.[0]) {
      pages.push({
        section: { title: "SNACKS & STARTERS", categories: [menuData.snacksAndStarters.categories[0]] },
        variant: "cyan" as const
      });
    }

    // Page 2: Non-Veg Snacks
    if (menuData.snacksAndStarters?.categories?.[1]) {
      pages.push({
        section: { title: "SNACKS & STARTERS", categories: [menuData.snacksAndStarters.categories[1]] },
        variant: "cyan" as const
      });
    }

    // Page 3: Handi & Mutton
    if (menuData.foodMenu?.categories) {
      const cats = [menuData.foodMenu.categories[0], menuData.foodMenu.categories[1]].filter(Boolean);
      if (cats.length > 0) {
        pages.push({
          section: { title: "CHEF'S SIGNATURE CURRIES", categories: cats },
          variant: "magenta" as const
        });
      }
    }

    // Page 4: Thali & Veg Mains
    if (menuData.foodMenu?.categories) {
      const cats = [menuData.foodMenu.categories[3], menuData.foodMenu.categories[2]].filter(Boolean);
      if (cats.length > 0) {
        pages.push({
          section: { title: "MAINS & THALIS", categories: cats },
          variant: "magenta" as const
        });
      }
    }

    // Page 5: Beers
    if (menuData.beveragesMenu?.categories) {
      const cats = [menuData.beveragesMenu.categories[0], menuData.beveragesMenu.categories[1]].filter(Boolean);
      if (cats.length > 0) {
        pages.push({
          section: { title: "BREWS & SPIRITS", categories: cats },
          variant: "cyan" as const
        });
      }
    }

    // Page 6: Breezers & Vodkas
    if (menuData.beveragesMenu?.categories) {
      const cats = [
        menuData.beveragesMenu.categories[2],
        menuData.beveragesMenu.categories[3]
      ].filter(Boolean);
      if (cats.length > 0) {
        pages.push({
          section: { title: "VODKAS & COOLERS", categories: cats },
          variant: "cyan" as const
        });
      }
    }

    // Page 7: Rums
    if (menuData.beveragesMenu?.categories) {
      const cats = [
        menuData.beveragesMenu.categories[4]
      ].filter(Boolean);
      if (cats.length > 0) {
        pages.push({
          section: { title: "RUM SELECTION", categories: cats },
          variant: "cyan" as const
        });
      }
    }

    // Page 8: Indian Whiskies
    if (menuData.beveragesMenu?.categories) {
      const cats = [
        menuData.beveragesMenu.categories[5] // Indian Whiskies
      ].filter(Boolean);
      if (cats.length > 0) {
        pages.push({
          section: { title: "INDIAN WHISKY RESERVES", categories: cats },
          variant: "gold" as const
        });
      }
    }

    // Page 9: World Whiskies I
    if (menuData.beveragesMenu?.categories?.[6]) {
      const cat = menuData.beveragesMenu.categories[6];
      const items1 = cat.items.slice(0, 8);
      if (items1.length > 0) {
        pages.push({
          section: { title: "WORLD WHISKY CLASSICS", categories: [{ ...cat, items: items1 }] },
          variant: "gold" as const
        });
      }
    }

    // Page 10: World Whiskies II
    if (menuData.beveragesMenu?.categories?.[6]) {
      const cat = menuData.beveragesMenu.categories[6];
      const items2 = cat.items.slice(8);
      if (items2.length > 0) {
        pages.push({
          section: { title: "PREMIUM & SINGLE MALTS", categories: [{ ...cat, items: items2 }] },
          variant: "gold" as const
        });
      }
    }


    // Page 8: Celebration & Premium
    if (menuData.beveragesMenu?.categories) {
      const cats = [
        menuData.beveragesMenu.categories[7], // Celebration Bottles
        menuData.beveragesMenu.categories[8]  // Premium Vodkas
      ].filter(Boolean);
      if (cats.length > 0) {
        pages.push({
          section: { title: "CELEBRATION & LUXURY", categories: cats },
          variant: "gold" as const
        });
      }
    }

    // Page 9: Wines
    if (menuData.beveragesMenu?.categories?.[9]) {
      pages.push({
        section: { title: "FINE WINES", categories: [menuData.beveragesMenu.categories[9]] },
        variant: "magenta" as const
      });
    }

    // Page 8: Sides
    if (menuData.sideItems?.categories) {
      const cats = [menuData.sideItems.categories[0], menuData.sideItems.categories[1], menuData.sideItems.categories[2]].filter(Boolean);
      if (cats.length > 0) {
        pages.push({
          section: { title: "SIDES & REFRESHMENTS", categories: cats },
          variant: "gold" as const
        });
      }
    }

    return pages;
  };

  const capturePageFromData = async (
    page: { section: { title: string; categories: any[] }; variant: "cyan" | "magenta" | "gold" },
    index: number,
    totalPages: number
  ): Promise<HTMLCanvasElement | null> => {
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    document.body.appendChild(tempDiv);

    const accentColor = page.variant === "cyan" ? "#00f0ff" : page.variant === "magenta" ? "#ff00ff" : "#ffd700";

    const pageElement = document.createElement("div");
    pageElement.innerHTML = `
      <div style="font-family: 'Rajdhani', sans-serif; background: #0a0a0f; width: 794px; min-height: 1123px; position: relative; display: flex; flex-direction: column;">
        <div style="position: absolute; inset: 16px; border: 1px solid rgba(55,65,81,0.3); pointer-events: none;"></div>
        <div style="position: absolute; inset: 24px; border: 1px solid rgba(55,65,81,0.2); pointer-events: none;"></div>
        
        <div style="padding-top: 48px; padding-bottom: 24px; text-align: center;">
          <div style="margin-bottom: 8px;">
            <span style="font-size: 10px; letter-spacing: 0.4em; color: #6b7280; text-transform: uppercase;">Est. 2024</span>
          </div>
          <h1 style="font-size: 36px; font-weight: bold; letter-spacing: 0.15em; color: white; margin-bottom: 8px; font-family: 'Orbitron', sans-serif;">LIVE BAR</h1>
          <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 12px;">
            <div style="height: 1px; width: 80px; background: linear-gradient(to right, transparent, #4b5563);"></div>
            <div style="width: 8px; height: 8px; transform: rotate(45deg); border: 1px solid #4b5563;"></div>
            <div style="height: 1px; width: 80px; background: linear-gradient(to left, transparent, #4b5563);"></div>
          </div>
          <p style="font-size: 10px; letter-spacing: 0.3em; color: #9ca3af; text-transform: uppercase;">Fine Dining & Premium Spirits • Pune</p>
        </div>
        
        <div style="text-align: center; margin-bottom: 24px; padding: 0 48px;">
          <div style="display: inline-block;">
            <h2 style="font-size: 20px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; color: ${accentColor}; font-family: 'Orbitron', sans-serif;">
              ${escapeHtml(page.section.title)}
            </h2>
            <div style="height: 2px; width: 100%; background: linear-gradient(90deg, transparent, ${accentColor}, transparent);"></div>
          </div>
        </div>
        
        <div style="flex: 1; padding: 0 40px 32px;">
          <div style="max-width: 768px; margin: 0 auto;">
            ${page.section.categories.map((category) => `
              <div style="margin-bottom: 24px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(55,65,81,0.5);">
                  ${category.icon ? `<span style="font-size: 18px;">${escapeHtml(category.icon)}</span>` : ""}
                  <h3 style="font-size: 13px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; color: #00f0ff;">${escapeHtml(category.title)}</h3>
                </div>
                ${category.items?.[0]?.sizes ? `
                  <div style="display: flex; justify-content: flex-end; gap: 16px; padding: 0 16px 8px; border-bottom: 1px solid rgba(31,41,55,1);">
                    <span style="font-size: 9px; color: #6b7280; min-width: 50px; text-align: center; text-transform: uppercase;">30ml</span>
                    <span style="font-size: 9px; color: #6b7280; min-width: 50px; text-align: center; text-transform: uppercase;">60ml</span>
                    <span style="font-size: 9px; color: #6b7280; min-width: 50px; text-align: center; text-transform: uppercase;">90ml</span>
                    <span style="font-size: 9px; color: #6b7280; min-width: 50px; text-align: center; text-transform: uppercase;">180ml</span>
                  </div>
                ` : ""}
                <div>
                  ${(category.items || []).map((item: any, idx: number) => `
                    <div style="padding: 12px 16px; ${idx % 2 === 0 ? "background: rgba(255,255,255,0.02);" : ""}">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
                        <div style="flex: 1;">
                          <h4 style="font-size: 15px; font-weight: 600; color: white; letter-spacing: 0.05em; text-transform: uppercase;">${escapeHtml(item.name)}</h4>
                          <div style="display: flex; gap: 6px; margin: 4px 0;">
                            ${item.isChefSpecial ? `<span style="padding: 2px 4px; font-size: 8px; font-weight: bold; background: #be185d; color: white; border-radius: 2px; text-transform: uppercase;">⭐ Chef's Special</span>` : ""}
                            ${item.isBestSeller ? `<span style="padding: 2px 4px; font-size: 8px; font-weight: bold; background: #0ea5e9; color: white; border-radius: 2px; text-transform: uppercase;">🔥 Best Seller</span>` : ""}
                            ${item.isPremium ? `<span style="padding: 2px 4px; font-size: 8px; font-weight: bold; background: #eab308; color: black; border-radius: 2px; text-transform: uppercase;">✨ Premium</span>` : ""}
                            ${item.isTopShelf ? `<span style="padding: 2px 4px; font-size: 8px; font-weight: bold; background: #9333ea; color: white; border-radius: 2px; text-transform: uppercase;">🏆 Top Shelf</span>` : ""}
                          </div>
                          ${item.description ? `<p style="font-size: 11px; color: #9ca3af; margin-top: 4px; font-style: italic;">${escapeHtml(item.description)}</p>` : ""}
                        </div>
                        <div style="flex-shrink: 0; text-align: right;">
                          ${item.sizes ? `
                            <div style="display: flex; gap: 16px;">
                              ${item.sizes.map((size: string) => `<span style="font-size: 13px; font-weight: 500; color: #fbbf24; min-width: 50px; text-align: center;">${escapeHtml(size)}</span>`).join("")}
                            </div>
                          ` : item.halfPrice && item.fullPrice ? `
                            <div style="display: flex; gap: 16px; align-items: center;">
                              <div style="text-align: center;">
                                <span style="font-size: 9px; color: #6b7280; display: block; text-transform: uppercase;">Half</span>
                                <span style="font-size: 13px; font-weight: 500; color: #fbbf24;">${escapeHtml(item.halfPrice)}</span>
                              </div>
                              <div style="text-align: center;">
                                <span style="font-size: 9px; color: #6b7280; display: block; text-transform: uppercase;">Full</span>
                                <span style="font-size: 13px; font-weight: 500; color: #fbbf24;">${escapeHtml(item.fullPrice)}</span>
                              </div>
                            </div>
                          ` : `
                            <span style="font-size: 14px; font-weight: 600; color: #fbbf24;">${escapeHtml(item.price)}</span>
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
        
        <div style="padding-bottom: 32px; text-align: center;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 12px;">
            <div style="height: 1px; width: 64px; background: #374151;"></div>
            <div style="width: 6px; height: 6px; transform: rotate(45deg); background: rgba(245,158,11,0.5);"></div>
            <div style="height: 1px; width: 64px; background: #374151;"></div>
          </div>
          <p style="font-size: 9px; letter-spacing: 0.2em; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">All prices inclusive of applicable taxes</p>
          <p style="font-size: 9px; color: #4b5563;">Page ${index + 1} of ${totalPages}</p>
        </div>
      </div>
    `;
    tempDiv.appendChild(pageElement);

    try {
      const canvas = await html2canvas(pageElement.firstElementChild as HTMLElement, {
        scale: 2,
        backgroundColor: "#0a0a0f",
        useCORS: true,
        logging: false,
        width: 794,
        height: 1123,
      });
      document.body.removeChild(tempDiv);
      return canvas;
    } catch (error) {
      console.error("Canvas capture error:", error);
      document.body.removeChild(tempDiv);
      return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-slate-800 border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Archived Menu Versions
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
          ) : archivedMenus.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No archived menus yet</p>
              <p className="text-sm mt-2">Menu versions are saved automatically when prices are adjusted</p>
            </div>
          ) : (
            <div className="space-y-3">
              {archivedMenus.map((archive) => (
                <Card key={archive.id} className="bg-slate-700/50 border-slate-600">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {format(new Date(archive.archived_at), "PPP 'at' p")}
                        </CardTitle>
                        <CardDescription className="text-slate-300 mt-1">
                          {archive.notes || "Menu archive"}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestore(archive)}
                          disabled={isRestoring === archive.id}
                          className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                        >
                          {isRestoring === archive.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Restore
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generatePDFForArchive(archive)}
                          disabled={isExporting === archive.id}
                          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          {isExporting === archive.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
