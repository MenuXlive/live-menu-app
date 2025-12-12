import { cn } from "@/lib/utils";

interface CircuitBorderProps {
  children: React.ReactNode;
  className?: string;
  variant?: "cyan" | "magenta" | "gold";
}

export const CircuitBorder = ({ children, className, variant = "cyan" }: CircuitBorderProps) => {
  const borderColors = {
    cyan: "border-neon-cyan/30",
    magenta: "border-neon-magenta/30",
    gold: "border-neon-gold/30",
  };

  const glowColors = {
    cyan: "shadow-[0_0_30px_hsl(180_100%_50%/0.2)]",
    magenta: "shadow-[0_0_30px_hsl(300_100%_60%/0.2)]",
    gold: "shadow-[0_0_30px_hsl(42_100%_50%/0.2)]",
  };

  return (
    <div className={cn(
      "relative rounded-lg border-2 p-6 bg-card/80 backdrop-blur-sm",
      borderColors[variant],
      glowColors[variant],
      className
    )}>
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-magenta rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-magenta rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-cyan rounded-br-lg" />
      
      {/* Circuit line decorations */}
      <div className="absolute top-4 left-4 w-8 h-[2px] bg-gradient-to-r from-neon-cyan to-transparent" />
      <div className="absolute top-4 right-4 w-8 h-[2px] bg-gradient-to-l from-neon-magenta to-transparent" />
      <div className="absolute bottom-4 left-4 w-8 h-[2px] bg-gradient-to-r from-neon-magenta to-transparent" />
      <div className="absolute bottom-4 right-4 w-8 h-[2px] bg-gradient-to-l from-neon-cyan to-transparent" />
      
      {children}
    </div>
  );
};
