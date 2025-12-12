import { cn } from "@/lib/utils";

interface MenuNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: "snacks", label: "APPETIZERS" },
  { id: "food", label: "MAINS" },
  { id: "beverages", label: "LIBATIONS" },
  { id: "sides", label: "SIDES" },
];

export const MenuNavigation = ({ activeSection, onSectionChange }: MenuNavigationProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-background/98 backdrop-blur-md border-y border-border/40 mb-10">
      <div className="px-4 md:px-10">
        <div className="flex items-center justify-center gap-2 py-4 overflow-x-auto scrollbar-hide">
          {sections.map((section, index) => (
            <div key={section.id} className="flex items-center">
              <button
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "px-5 py-2 font-cinzel text-xs md:text-sm font-medium tracking-[0.15em] transition-all duration-300 whitespace-nowrap uppercase",
                  activeSection === section.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {section.label}
              </button>
              {index < sections.length - 1 && (
                <div className="w-1 h-1 rotate-45 bg-border mx-2 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};
