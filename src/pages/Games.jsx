import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Grid3X3, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import TicTacToe from "../components/games/TicTacToe";
import ChessGame from "../components/games/ChessGame";
import { useIsMobile } from "../hooks/use-mobile";

const games = [
  { id: "tictactoe", name: "Tic-Tac-Toe", icon: Grid3X3, desc: "Classic X vs O" },
  { id: "chess", name: "Chess", icon: Crown, desc: "Strategy battle" },
];

const Games = () => {
  const [activeGame, setActiveGame] = useState(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex items-center gap-3">
        {isMobile && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              activeGame ? setActiveGame(null) : navigate("/")
            }
            className="p-2 rounded-full hover:bg-muted/50 text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        )}

        <div>
          <h1 className="text-lg font-heading font-extrabold text-foreground">
            {activeGame
              ? games.find((g) => g.id === activeGame)?.name
              : "🎮 Games"}
          </h1>
          <p className="text-[10px] text-muted-foreground">
            2-Player Local Games
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-3 pt-2"
            >
              {games.map((game, i) => (
                <motion.button
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveGame(game.id)}
                  className="flex items-center gap-4 p-4 rounded-2xl glass-panel hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl anime-gradient flex items-center justify-center text-primary-foreground">
                    <game.icon className="w-6 h-6" />
                  </div>

                  <div className="text-left">
                    <p className="font-heading font-bold text-foreground">
                      {game.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {game.desc}
                    </p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={activeGame}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center pt-4"
            >
              {!isMobile && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveGame(null)}
                  className="self-start mb-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to Games
                </motion.button>
              )}

              {activeGame === "tictactoe" && <TicTacToe />}
              {activeGame === "chess" && <ChessGame />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Games;