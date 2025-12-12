export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Warm ambient gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]" />
      
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/80" />
      
      {/* Very subtle dot pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20" />
      
      {/* Elegant corner flourishes - top left */}
      <svg className="absolute top-8 left-8 w-24 h-24 text-primary/20" viewBox="0 0 100 100" fill="none">
        <path d="M0 50 L0 10 Q0 0 10 0 L50 0" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M0 40 L0 20 Q0 10 10 10 L40 10" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <circle cx="10" cy="10" r="2" fill="currentColor" />
      </svg>
      
      {/* Top right */}
      <svg className="absolute top-8 right-8 w-24 h-24 text-primary/20" viewBox="0 0 100 100" fill="none">
        <path d="M100 50 L100 10 Q100 0 90 0 L50 0" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M100 40 L100 20 Q100 10 90 10 L60 10" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <circle cx="90" cy="10" r="2" fill="currentColor" />
      </svg>
      
      {/* Bottom left */}
      <svg className="absolute bottom-8 left-8 w-24 h-24 text-primary/20" viewBox="0 0 100 100" fill="none">
        <path d="M0 50 L0 90 Q0 100 10 100 L50 100" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M0 60 L0 80 Q0 90 10 90 L40 90" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <circle cx="10" cy="90" r="2" fill="currentColor" />
      </svg>
      
      {/* Bottom right */}
      <svg className="absolute bottom-8 right-8 w-24 h-24 text-primary/20" viewBox="0 0 100 100" fill="none">
        <path d="M100 50 L100 90 Q100 100 90 100 L50 100" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M100 60 L100 80 Q100 90 90 90 L60 90" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <circle cx="90" cy="90" r="2" fill="currentColor" />
      </svg>
    </div>
  );
};
