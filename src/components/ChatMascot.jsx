import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";

const reactionEmoji = {
  neutral: "",
  happy: "😄",
  sad: "😢",
  surprised: "😲",
  playful: "😜",
  angry: "😤",
  sleeping: "💤",
};

const reactionText = {
  neutral: "",
  happy: "Yay~!",
  sad: "Aww...",
  surprised: "Whoa!",
  playful: "Hehe~",
  angry: "Hmph!",
  sleeping: "Zzz...",
};

const MASCOT_SIZE = 110;
const WALK_SPEED = 4000;

/* ---------------- Cute Mascot SVG ---------------- */

const CuteMascotSVG = ({
  emotion,
  blinking,
  facingLeft,
  isWalking,
}) => {
  const isSleeping = emotion === "sleeping";
  const isHappy = emotion === "happy";
  const isSad = emotion === "sad";
  const isAngry = emotion === "angry";
  const isSurprised = emotion === "surprised";
  const isPlayful = emotion === "playful";

  const getEyes = () => {
    if (blinking || isSleeping) {
      return (
        <>
          <motion.path d="M35 42 Q38 44 41 42" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
          <motion.path d="M55 42 Q58 44 61 42" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      );
    }

    if (isHappy || isPlayful) {
      return (
        <>
          <motion.path d="M34 44 Q38 39 42 44" stroke="hsl(var(--foreground))" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <motion.path d="M54 44 Q58 39 62 44" stroke="hsl(var(--foreground))" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      );
    }

    if (isSurprised) {
      return (
        <>
          <circle cx="38" cy="42" r="5" fill="hsl(var(--foreground))" />
          <circle cx="58" cy="42" r="5" fill="hsl(var(--foreground))" />
          <circle cx="36" cy="40" r="1.5" fill="white" />
          <circle cx="56" cy="40" r="1.5" fill="white" />
        </>
      );
    }

    if (isAngry) {
      return (
        <>
          <line x1="33" y1="37" x2="41" y2="39" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" />
          <line x1="63" y1="37" x2="55" y2="39" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" />
          <circle cx="38" cy="43" r="3.5" fill="hsl(var(--foreground))" />
          <circle cx="58" cy="43" r="3.5" fill="hsl(var(--foreground))" />
        </>
      );
    }

    if (isSad) {
      return (
        <>
          <circle cx="38" cy="43" r="3.5" fill="hsl(var(--foreground))" />
          <circle cx="58" cy="43" r="3.5" fill="hsl(var(--foreground))" />
          <circle cx="36.5" cy="41.5" r="1.2" fill="white" />
          <circle cx="56.5" cy="41.5" r="1.2" fill="white" />
          <motion.ellipse
            cx="42"
            cy="48"
            rx="1.5"
            ry="2.5"
            fill="hsl(var(--primary) / 0.5)"
            animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </>
      );
    }

    return (
      <>
        <circle cx="38" cy="42" r="4" fill="hsl(var(--foreground))" />
        <circle cx="58" cy="42" r="4" fill="hsl(var(--foreground))" />
        <circle cx="36.5" cy="40.5" r="1.5" fill="white" />
        <circle cx="56.5" cy="40.5" r="1.5" fill="white" />
      </>
    );
  };

  return (
    <svg
      viewBox="0 0 96 96"
      width={MASCOT_SIZE}
      height={MASCOT_SIZE}
      style={{ transform: facingLeft ? "scaleX(-1)" : "scaleX(1)" }}
    >
      {getEyes()}
    </svg>
  );
};

/* ---------------- Main Component ---------------- */

const ChatMascot = ({ emotion = "neutral" }) => {
  const [showReaction, setShowReaction] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const containerRef = useRef(null);
  const controls = useAnimationControls();
  const [facingLeft, setFacingLeft] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });

  const isSleeping = emotion === "sleeping";

  const getRandomPos = useCallback(() => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };

    const maxX = container.clientWidth - MASCOT_SIZE;
    const maxY = container.clientHeight - MASCOT_SIZE;

    return {
      x: Math.max(0, Math.random() * maxX),
      y: Math.max(0, Math.random() * maxY),
    };
  }, []);

  useEffect(() => {
    if (isSleeping) return;

    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 180);
    };

    const interval = setInterval(blink, 3000);
    return () => clearInterval(interval);
  }, [isSleeping]);

  useEffect(() => {
    if (emotion !== "neutral") {
      setShowReaction(true);
      const timer = setTimeout(() => setShowReaction(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [emotion]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <motion.div
        animate={controls}
        className="absolute"
        style={{ width: MASCOT_SIZE, height: MASCOT_SIZE, opacity: 0.35 }}
      >
        <CuteMascotSVG
          emotion={emotion}
          blinking={blinking}
          facingLeft={facingLeft}
          isWalking={isWalking}
        />

        <AnimatePresence>
          {showReaction && reactionEmoji[emotion] && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2"
            >
              {reactionEmoji[emotion]} {reactionText[emotion]}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ChatMascot;