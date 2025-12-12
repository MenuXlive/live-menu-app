import { useState } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { MenuHeader } from "@/components/MenuHeader";
import { MenuNavigation } from "@/components/MenuNavigation";
import { MenuSection } from "@/components/MenuSection";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { useMenu } from "@/contexts/MenuContext";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [activeSection, setActiveSection] = useState("snacks");
  const { menuData, isLoading } = useMenu();
  const { user } = useAuth();

  const renderActiveSection = () => {
    switch (activeSection) {
      case "snacks":
        return <MenuSection section={menuData.snacksAndStarters} variant="cyan" sectionKey="snacksAndStarters" />;
      case "food":
        return <MenuSection section={menuData.foodMenu} variant="magenta" sectionKey="foodMenu" />;
      case "beverages":
        return <MenuSection section={menuData.beveragesMenu} variant="cyan" sectionKey="beveragesMenu" />;
      case "sides":
        return <MenuSection section={menuData.sideItems} variant="gold" sectionKey="sideItems" />;
      default:
        return <MenuSection section={menuData.snacksAndStarters} variant="cyan" sectionKey="snacksAndStarters" />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundEffects />

      {/* Admin Button */}
      <Link
        to={user ? "/admin" : "/auth"}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-neon-cyan/30 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300"
        title="Admin Settings"
      >
        <Settings className="w-5 h-5 text-neon-cyan" />
      </Link>

      <div className="relative z-10">
        <MenuHeader />
        <MenuNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <main className="max-w-6xl mx-auto px-4 pb-16">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
              <span className="ml-3 text-muted-foreground">Loading menu...</span>
            </div>
          ) : (
            renderActiveSection()
          )}
        </main>

        <footer className="border-t border-border/30 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="font-rajdhani text-muted-foreground text-sm tracking-wide">
              © 2024 LIVE BAR • Fine Dining & Premium Spirits
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-neon-cyan/50" />
              <div className="w-1.5 h-1.5 rotate-45 bg-neon-gold/50" />
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-neon-magenta/50" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
