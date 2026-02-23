import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const ParticleBackground = () => {
  const { theme } = useTheme();

  const particles = useMemo(() => {
    if (theme === "sakura") {
      return Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 6,
        size: 10 + Math.random() * 14,
      }));
    }
    if (theme === "rainy") {
      return Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 1 + Math.random() * 1.5,
        size: 2,
      }));
    }
    if (theme === "neon") {
      return Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        size: 4 + Math.random() * 4,
      }));
    }
    if (theme === "hacker") {
      return Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
        size: 12,
      }));
    }
    if (theme === "game") {
      return Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 4 + Math.random() * 4,
        size: 16 + Math.random() * 10,
      }));
    }
    if (theme === "futuristic") {
      return Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 5,
        size: 3 + Math.random() * 5,
      }));
    }
    return [];
  }, [theme]);

  if (theme === "sakura") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-sakura text-anime-sakura"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              fontSize: `${p.size}px`,
            }}
          >
            🌸
          </div>
        ))}
      </div>
    );
  }

  if (theme === "rainy") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-rain bg-accent/40 rounded-full"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.size}px`,
              height: `${p.size * 8}px`,
            }}
          />
        ))}
      </div>
    );
  }

  if (theme === "neon") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-float rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `radial-gradient(circle, hsl(${180 + Math.random() * 120} 100% 50% / 0.6), transparent)`,
            }}
          />
        ))}
      </div>
    );
  }

  if (theme === "hacker") {
    const chars = "01アイウエオカキクケコ";
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-rain font-mono text-primary/30"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              fontSize: `${p.size}px`,
            }}
          >
            {chars[Math.floor(Math.random() * chars.length)]}
          </div>
        ))}
      </div>
    );
  }

  if (theme === "game") {
    const icons = ["⭐", "💎", "🔥", "⚡", "🎯", "🏆", "💫"];
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-sakura"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              fontSize: `${p.size}px`,
              opacity: 0.4,
            }}
          >
            {icons[p.id % icons.length]}
          </div>
        ))}
      </div>
    );
  }

  if (theme === "futuristic") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-float rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `radial-gradient(circle, hsl(195 100% 50% / 0.4), hsl(270 70% 60% / 0.2), transparent)`,
            }}
          />
        ))}
      </div>
    );
  }

  // light theme — no particles
  return null;
};

export default ParticleBackground;
