import { cn } from "@/lib/utils";

interface GeometricPatternProps {
  className?: string;
  variant?: "subtle" | "medium" | "bold";
}

export function GeometricPattern({ className, variant = "subtle" }: GeometricPatternProps) {
  const opacity = {
    subtle: 0.03,
    medium: 0.06,
    bold: 0.1
  }[variant];

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(22, 101, 52, ${opacity}) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(245, 158, 11, ${opacity * 0.7}) 0%, transparent 50%),
          linear-gradient(45deg, transparent 40%, rgba(22, 101, 52, ${opacity * 0.5}) 50%, transparent 60%)
        `,
        backgroundSize: "60px 60px, 40px 40px, 80px 80px",
      }}
    />
  );
}

interface IslamicCardProps {
  children: React.ReactNode;
  className?: string;
  showTopAccent?: boolean;
}

export function IslamicCard({ children, className, showTopAccent = true }: IslamicCardProps) {
  return (
    <div className={cn("islamic-card relative", className)}>
      {showTopAccent && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent opacity-70" />
      )}
      <GeometricPattern className="opacity-50" variant="subtle" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
