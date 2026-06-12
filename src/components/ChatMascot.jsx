import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";

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

const CuteMascotSVG = ({ emotion, blinking, facingLeft }) => {
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
          <motion.path d="M35 42 Q38 44 41 42" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <motion.path d="M55 42 Q58 44 61 42" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      );
    }

    if (isHappy || isPlayful) {
      return (
        <>
          <motion.path d="M34 44 Q38 39 42 44" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
          <motion.path d="M54 44 Q58 39 62 44" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    }

    if (isSurprised) {
      return (
        <>
          <circle cx="38" cy="42" r="5" fill="currentColor" />
          <circle cx="58" cy="42" r="5" fill="currentColor" />
          <circle cx="36" cy="40" r="1.5" fill="white" />
          <circle cx="56" cy="40" r="1.5" fill="white" />
        </>
      );
    }

    if (isAngry) {
      return (
        <>
          <line x1="33" y1="37" x2="41" y2="39" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="63" y1="37" x2="55" y2="39" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="38" cy="43" r="3.5" fill="currentColor" />
          <circle cx="58" cy="43" r="3.5" fill="currentColor" />
        </>
      );
    }

    if (isSad) {
      return (
        <>
          <circle cx="38" cy="43" r="3.5" fill="currentColor" />
          <circle cx="58" cy="43" r="3.5" fill="currentColor" />
          <circle cx="36.5" cy="41.5" r="1.2" fill="white" />
          <circle cx="56.5" cy="41.5" r="1.2" fill="white" />
          <motion.ellipse
            cx="42"
            cy="48"
            rx="1.5"
            ry="2.5"
            fill="rgba(244, 63, 94, 0.5)"
            animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </>
      );
    }

    return (
      <>
        <circle cx="38" cy="42" r="4" fill="currentColor" />
        <circle cx="58" cy="42" r="4" fill="currentColor" />
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
      className="text-slate-400 dark:text-slate-500"
      style={{ transform: facingLeft ? "scaleX(-1)" : "scaleX(1)", transition: "transform 0.3s" }}
    >
      <circle cx="48" cy="48" r="32" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
      {getEyes()}
    </svg>
  );
};

const ChatMascot = ({ emotion = "neutral" }) => {
  const [showReaction, setShowReaction] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  
  const containerRef = useRef(null);
  const controls = useAnimationControls();
  const posRef = useRef({ x: 100, y: 100 });

  const isSleeping = emotion === "sleeping";

  const getRandomPos = useCallback(() => {
    const container = containerRef.current;
    if (!container) return { x: 100, y: 100 };

    const maxX = container.clientWidth - MASCOT_SIZE;
    const maxY = container.clientHeight - MASCOT_SIZE;

    return {
      x: Math.max(20, Math.random() * maxX),
      y: Math.max(20, Math.random() * maxY),
    };
  }, []);

  const startWalkingLoop = useCallback(async () => {
    if (isSleeping) return;
    
    setIsWalking(true);
    const nextPos = getRandomPos();
    
    if (nextPos.x < posRef.current.x) {
      setFacingLeft(true);
    } else {
      setFacingLeft(false);
    }

    await controls.start({
      x: nextPos.x,
      y: nextPos.y,
      transition: { duration: WALK_SPEED / 1000, ease: "linear" }
    });

    posRef.current = nextPos;
    setIsWalking(false);

    setTimeout(() => {
      startWalkingLoop();
    }, Math.random() * 4000 + 2000);
  }, [controls, getRandomPos, isSleeping]);

  useEffect(() => {
    const startX = Math.random() * 100 + 50;
    const startY = Math.random() * 100 + 100;
    posRef.current = { x: startX, y: startY };
    controls.set({ x: startX, y: startY });
    
    startWalkingLoop();
    
    return () => {
      controls.stop();
    };
  }, [startWalkingLoop, controls]);

  useEffect(() => {
    if (isSleeping) {
      controls.stop();
      setIsWalking(false);
      return;
    }

    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 180);
    };

    const interval = setInterval(blink, 4000);
    return () => clearInterval(interval);
  }, [isSleeping, controls]);

  useEffect(() => {
    if (emotion !== "neutral") {
      setShowReaction(true);
      const timer = setTimeout(() => setShowReaction(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [emotion]);

  const bobbingAnimation = useMemo(() => {
    if (isSleeping) return {};
    return {
      y: isWalking ? [0, -6, 0] : [0, -3, 0],
      transition: {
        repeat: Infinity,
        duration: isWalking ? 0.4 : 1.8,
        ease: "easeInOut"
      }
    };
  }, [isWalking, isSleeping]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <motion.div
        animate={controls}
        className="absolute"
        style={{ width: MASCOT_SIZE, height: MASCOT_SIZE }}
      >
        <motion.div animate={bobbingAnimation} className="relative w-full h-full opacity-35 dark:opacity-20">
          <CuteMascotSVG
            emotion={emotion}
            blinking={blinking}
            facingLeft={facingLeft}
          />
        </motion.div>

        <AnimatePresence>
          {showReaction && reactionEmoji[emotion] && (
            <motion.div
              initial={{ scale: 0, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0, y: -10, opacity: 0 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800/80 text-white dark:bg-slate-200 dark:text-slate-900 text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap shadow-md"
            >
              <span>{reactionEmoji[emotion]}</span>
              <span>{reactionText[emotion]}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ChatMascot;