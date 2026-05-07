import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROWS = 6;
const COLS = 7;

type Player = "Red" | "Yellow" | null;

const ConnectFour = () => {
  const [board, setBoard] = useState<Player[][]>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [currTurn, setCurrTurn] = useState<"Red" | "Yellow">("Red");
  const [winner, setWinner] = useState<Player | "Draw">(null);

  const checkWinner = (grid: Player[][], r: number, c: number) => {
    const player = grid[r][c];
    if (!player) return false;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of directions) {
      let count = 1;
      for (let i = 1; i < 4; i++) {
        const nr = r + dr * i, nc = c + dc * i;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === player) count++;
        else break;
      }
      for (let i = 1; i < 4; i++) {
        const nr = r - dr * i, nc = c - dc * i;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === player) count++;
        else break;
      }
      if (count >= 4) return true;
    }
    return false;
  };

  const handleClick = (c: number) => {
    if (winner) return;
    const newBoard = board.map(row => [...row]);
    let placedRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!newBoard[r][c]) {
        newBoard[r][c] = currTurn;
        placedRow = r;
        break;
      }
    }
    if (placedRow === -1) return;
    setBoard(newBoard);
    if (checkWinner(newBoard, placedRow, c)) {
      setWinner(currTurn);
    } else if (newBoard.every(row => row.every(cell => cell !== null))) {
      setWinner("Draw");
    } else {
      setCurrTurn(currTurn === "Red" ? "Yellow" : "Red");
    }
  };

  const reset = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setCurrTurn("Red");
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full min-h-[400px] justify-center mt-10">
      <div className="text-xl font-bold text-white mb-2">
        {winner === "Draw" ? "🤝 Draw!" : winner ? `🎉 ${winner} Wins!` : `Turn: ${currTurn === "Red" ? "🔴 Red" : "🟡 Yellow"}`}
      </div>

      {/* Board with fixed background to ensure visibility */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border-4 border-blue-900 shadow-2xl">
        <div className="flex gap-2">
          {Array.from({ length: COLS }).map((_, c) => (
            <div 
              key={c} 
              onClick={() => handleClick(c)}
              className="flex flex-col gap-2 cursor-pointer hover:bg-white/5 rounded-lg p-1 transition-colors"
            >
              {Array.from({ length: ROWS }).map((_, r) => {
                const cell = board[r][c];
                return (
                  <div
                    key={`${r}-${c}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center relative shadow-inner"
                  >
                    <AnimatePresence>
                      {cell && (
                        <motion.div
                          initial={{ y: -300, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className={`w-full h-full rounded-full ${
                            cell === "Red" ? "bg-red-600 shadow-lg" : "bg-yellow-500 shadow-lg"
                          }`}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={reset}
        className="mt-4 px-8 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg active:scale-95"
      >
        New Game
      </button>
    </div>
  );
};

export default ConnectFour;