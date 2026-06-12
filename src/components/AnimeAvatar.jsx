import { motion } from "framer-motion";

const DEFAULT_SAKURA = "/uploads/avatar-sakura.png";

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
  xl: "w-28 h-28",
};

const emotionEmoji = {
  neutral: "",
  happy: "😄",
  sad: "😢",
  surprised: "😲",
  playful: "😜",
  angry: "😤",
  sleeping: "💤",
};

const emotionAnimation = {
  neutral: { y: [0, -4, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
  happy: { y: [0, -8, 0], rotate: [0, 3, -3, 0], transition: { duration: 0.6, repeat: Infinity } },
  sad: { y: [0, 2, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
  surprised: { scale: [1, 1.1, 1], transition: { duration: 0.4, repeat: 2 } },
  playful: { rotate: [0, -8, 8, -8, 0], transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 } },
  angry: { x: [0, -3, 3, -3, 0], transition: { duration: 0.3, repeat: 2 } },
  sleeping: { rotate: [0, 5, 0], y: [0, 3, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
};

const AnimeAvatar = ({
  src,
  name,
  status,
  emotion = "neutral",
  size = "md",
  showStatus = true,
}) => {
  const isOnline = status === "online";
  const isSleeping = emotion === "sleeping";

  const selectedSize = sizeMap[size] || sizeMap.md;
  const selectedAnimation = emotionAnimation[emotion] || emotionAnimation.neutral;
  const selectedEmoji = emotionEmoji[emotion] || "";

  const finalSrc = src && src !== "" ? src : DEFAULT_SAKURA;

  const handleImgError = (e) => {
    if (e.target.src !== window.location.origin + DEFAULT_SAKURA) {
      e.target.src = DEFAULT_SAKURA;
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      <motion.div
        animate={selectedAnimation}
        className={`${selectedSize} relative`}
      >
        <div
          className={`absolute inset-0 rounded-full ${
            isOnline ? "avatar-online-glow" : ""
          }`}
        />

        <motion.img
          src={finalSrc}
          alt={name || "User Avatar"}
          className={`${selectedSize} rounded-full object-cover border-2 ${
            isOnline ? "border-anime-online" : "border-muted"
          } ${isSleeping ? "opacity-70 grayscale-[30%]" : ""}`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          onError={handleImgError}
        />

        {showStatus && (
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
              isOnline ? "bg-anime-online" : "bg-anime-offline"
            }`}
          />
        )}

        {selectedEmoji && (
          <motion.span
            initial={{ scale: 0, y: 5 }}
            animate={{ scale: 1, y: 0 }}
            className="absolute -top-1 -right-1 text-sm"
          >
            {selectedEmoji}
          </motion.span>
        )}
      </motion.div>
    </div>
  );
};

export default AnimeAvatar;