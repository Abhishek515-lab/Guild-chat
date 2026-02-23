import { useState } from "react";
import { motion } from "framer-motion";

const winLines = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

const TicTacToe = () => {
  const [board, setBoard] = useState<(string|null)[]>(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const [winLine, setWinLine] = useState<number[]|null>(null);

  const getWinner = (b: (string|null)[]) => {
    for (const line of winLines) {
      const [a, c, d] = line;
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return { winner: b[a], line };
    }
    return null;
  };

  const winner = getWinner(board);
  const isDraw = !winner && board.every(Boolean);

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = xTurn ? "X" : "O";
    setBoard(newBoard);
    const result = getWinner(newBoard);
    if (result) setWinLine(result.line);
    setXTurn(!xTurn);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setXTurn(true);
    setWinLine(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm font-heading font-bold text-foreground">
        {winner ? `🎉 ${winner.winner} Wins!` : isDraw ? "🤝 Draw!" : `Turn: ${xTurn ? "X" : "O"}`}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            whileHover={!cell && !winner ? { scale: 1.05 } : {}}
            whileTap={!cell && !winner ? { scale: 0.95 } : {}}
            onClick={() => handleClick(i)}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl text-2xl font-extrabold font-heading flex items-center justify-center transition-all ${
              winLine?.includes(i)
                ? "anime-gradient text-primary-foreground shadow-lg"
                : cell
                ? "bg-muted text-foreground"
                : "bg-muted/40 hover:bg-muted/70 text-muted-foreground"
            }`}
          >
            {cell && (
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {cell === "X" ? "✕" : "○"}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={reset}
        className="px-4 py-2 rounded-lg anime-gradient text-primary-foreground text-xs font-heading font-bold shadow-md"
      >
        New Game
      </motion.button>
    </div>
  );
};

export default TicTacToe;
