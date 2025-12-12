import qrCode from "@/assets/qr-code.png";
import { CircuitBorder } from "./CircuitBorder";

export const MenuHeader = () => {
  return (
    <header className="relative py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main header layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Logo - Enhanced with better glow effect */}
          <div className="relative group">
            <CircuitBorder className="px-10 py-5 hover:scale-105 transition-transform duration-300">
              <h1 className="font-orbitron text-4xl md:text-5xl font-black tracking-[0.15em] gradient-text animate-pulse-glow drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                LIVE
              </h1>
              <p className="font-rajdhani text-xs tracking-[0.3em] text-foreground/80 mt-2 text-center uppercase">
                Eat • Drink • Code • Repeat
              </p>
            </CircuitBorder>
            {/* Subtle corner accents */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-neon-cyan/40" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-neon-magenta/40" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-neon-magenta/40" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-neon-cyan/40" />
          </div>

          {/* MENU title - Enhanced with premium styling */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="relative inline-block">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-magenta/10 to-neon-gold/10 blur-2xl" />

                <h2 className="relative font-cinzel text-6xl md:text-7xl font-bold tracking-[0.5em] text-foreground uppercase drop-shadow-2xl">
                  MENU
                </h2>
              </div>

              {/* Enhanced decorative elements */}
              <div className="flex items-center justify-center gap-4 mt-5">
                <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-primary to-neon-cyan opacity-60" />
                <div className="relative">
                  <div className="w-3 h-3 rotate-45 bg-accent animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 rotate-45 bg-accent/20 animate-ping" />
                </div>
                <div className="h-[2px] w-24 bg-gradient-to-l from-transparent via-secondary to-neon-magenta opacity-60" />
              </div>

              {/* Subtitle / Tagline */}
              <p className="font-orbitron text-sm md:text-base tracking-[0.4em] text-neon-cyan mt-4 uppercase font-bold drop-shadow-md animate-pulse-glow">
                Eat.Drink.Code.Repeat
              </p>
            </div>
          </div>

          {/* Restaurant info with QR code - Enhanced */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="text-center md:text-right">
              <h3 className="font-cinzel text-2xl md:text-3xl font-bold tracking-[0.2em] text-foreground drop-shadow-lg">
                LIVE BAR
              </h3>
              <p className="font-rajdhani text-sm tracking-[0.15em] text-muted-foreground mt-2">
                FINE DINING • PUNE
              </p>
              <p className="font-rajdhani text-xs tracking-[0.1em] text-muted-foreground/70 mt-1">
                Est. 2024
              </p>
            </div>

            {/* QR Code with enhanced styling */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-gold rounded-xl opacity-30 group-hover:opacity-50 blur transition-opacity" />
              <div className="relative bg-white p-2 rounded-xl shadow-2xl">
                <img
                  src={qrCode}
                  alt="Scan for location"
                  className="w-24 h-24 md:w-28 md:h-28"
                />
              </div>
            </div>
            <p className="font-rajdhani text-xs text-muted-foreground tracking-[0.15em] uppercase">
              Scan for Location
            </p>
          </div>
        </div>

        {/* Decorative bottom divider - Enhanced */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <div className="h-[1px] flex-1 max-w-[300px] bg-gradient-to-r from-transparent via-primary/40 to-neon-cyan/60" />
          <div className="relative">
            <div className="w-3 h-3 rotate-45 bg-accent/70 animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 rotate-45 border border-neon-gold animate-spin-slow" />
          </div>
          <div className="h-[1px] flex-1 max-w-[300px] bg-gradient-to-l from-transparent via-secondary/40 to-neon-magenta/60" />
        </div>
      </div>
    </header>
  );
};
