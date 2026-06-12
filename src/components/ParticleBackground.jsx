import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const HACKER_CHARS = "01アイウエオカキクケコ";
const GAME_ICONS = ["⭐", "💎", "🔥", "⚡", "🎯", "🏆", "💫"];

const ParticleBackground = () => {
  const { theme } = useTheme();

  const particles = useMemo(() => {
    const generator = (length, themeName) => {
      return Array.from({ length }, (_, i) => {
        const base = {
          id: `${themeName}-${i}`,
          left: Math.random() * 100,
          delay: Math.random() * 10,
          duration: 8 + Math.random() * 6,
          size: 10 + Math.random() * 14,
        };

        if (themeName === "rainy") {
          base.delay = Math.random() * 2;
          // Rain ki speed fast karne ke liye duration kam kiya (0.6s to 1.2s)
          base.duration = 0.6 + Math.random() * 0.6;
          base.size = 1.5 + Math.random() * 1.5;
        } else if (themeName === "neon") {
          base.delay = Math.random() * 5;
          base.duration = 3 + Math.random() * 4;
          base.size = 4 + Math.random() * 4;
          base.top = 20 + Math.random() * 60;
          base.hue = 180 + Math.random() * 120;
        } else if (themeName === "hacker") {
          base.delay = Math.random() * 5;
          base.duration = 2 + Math.random() * 3;
          base.size = 12;
          base.char = HACKER_CHARS[Math.floor(Math.random() * HACKER_CHARS.length)];
        } else if (themeName === "game") {
          base.delay = Math.random() * 6;
          base.duration = 4 + Math.random() * 4;
          base.size = 16 + Math.random() * 10;
        } else if (themeName === "futuristic") {
          base.delay = Math.random() * 4;
          base.duration = 3 + Math.random() * 5;
          base.size = 3 + Math.random() * 5;
          base.top = 10 + Math.random() * 80;
        }
        return base;
      });
    };

    switch (theme) {
      case "sakura": return generator(15, "sakura");
      case "rainy": return generator(60, "rainy"); // Rain density badhane ke liye 40 se 60 kiya
      case "neon": return generator(8, "neon");
      case "hacker": return generator(30, "hacker");
      case "game": return generator(12, "game");
      case "futuristic": return generator(10, "futuristic");
      default: return [];
    }
  }, [theme]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none transform-gpu">
      {theme === "sakura" &&
        particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-sakura text-anime-sakura transform-gpu will-change-transform"
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

      {theme === "rainy" &&
        particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-rain bg-current text-sky-400/40 rounded-full transform-gpu will-change-transform"
            style={{
              left: `${p.left}%`,
              top: `-20px`, // Screen ke upar se start hoga taaki smoother drop lage
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.size}px`,
              height: `${p.size * 12}px`, // Bars ko realistic stretch look diya
            }}
          />
        ))}

      {theme === "neon" &&
        particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-float rounded-full transform-gpu will-change-transform"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `radial-gradient(circle, hsl(${p.hue} 100% 50% / 0.6), transparent)`,
            }}
          />
        ))}

      {theme === "hacker" &&
        particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-rain font-mono text-primary/30 transform-gpu will-change-transform"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              fontSize: `${p.size}px`,
            }}
          >
            {p.char}
          </div>
        ))}

      {theme === "game" &&
        particles.map((p, idx) => (
          <div
            key={p.id}
            className="absolute animate-sakura transform-gpu will-change-transform"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              fontSize: `${p.size}px`,
              opacity: 0.4,
            }}
          >
            {GAME_ICONS[idx % GAME_ICONS.length]}
          </div>
        ))}

      {theme === "futuristic" &&
        particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-float rounded-full transform-gpu will-change-transform"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
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
};

export default ParticleBackground;