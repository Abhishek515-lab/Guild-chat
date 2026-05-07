import { useState, useCallback } from "react";
import { motion } from "framer-motion";

type Piece = { type: string; color: "w" | "b" } | null;

const PIECES: Record<string, string> = {
  wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟",
};

const initBoard = (): Piece[][] => {
  const b: Piece[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  const backRow = ["R","N","B","Q","K","B","N","R"];
  for (let c = 0; c < 8; c++) {
    b[0][c] = { type: backRow[c], color: "b" };
    b[1][c] = { type: "P", color: "b" };
    b[6][c] = { type: "P", color: "w" };
    b[7][c] = { type: backRow[c], color: "w" };
  }
  return b;
};

const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;

const getValidMoves = (board: Piece[][], row: number, col: number): [number, number][] => {
  const piece = board[row][col];
  if (!piece) return [];
  const moves: [number, number][] = [];
  const { type, color } = piece;
  const enemy = color === "w" ? "b" : "w";
  const dir = color === "w" ? -1 : 1;

  const addIfValid = (r: number, c: number) => {
    if (!inBounds(r, c)) return false;
    if (!board[r][c]) { moves.push([r, c]); return true; }
    if (board[r][c]!.color === enemy) { moves.push([r, c]); return false; }
    return false;
  };

  const addLine = (dr: number, dc: number) => {
    for (let i = 1; i < 8; i++) {
      if (!addIfValid(row + dr * i, col + dc * i)) break;
    }
  };

  switch (type) {
    case "P": {
      const startRow = color === "w" ? 6 : 1;
      if (inBounds(row+dir, col) && !board[row+dir][col]) {
        moves.push([row+dir, col]);
        if (row === startRow && !board[row+dir*2][col]) moves.push([row+dir*2, col]);
      }
      for (const dc of [-1, 1]) {
        const nr = row+dir, nc = col+dc;
        if (inBounds(nr, nc) && board[nr][nc]?.color === enemy) moves.push([nr, nc]);
      }
      break;
    }
    case "R": addLine(1,0); addLine(-1,0); addLine(0,1); addLine(0,-1); break;
    case "B": addLine(1,1); addLine(1,-1); addLine(-1,1); addLine(-1,-1); break;
    case "Q": addLine(1,0); addLine(-1,0); addLine(0,1); addLine(0,-1); addLine(1,1); addLine(1,-1); addLine(-1,1); addLine(-1,-1); break;
    case "N":
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) addIfValid(row+dr, col+dc);
      break;
    case "K":
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (dr||dc) addIfValid(row+dr, col+dc);
      break;
  }
  return moves;
};

const ChessGame = () => {
  const [board, setBoard] = useState<Piece[][]>(initBoard);
  const [selected, setSelected] = useState<[number,number]|null>(null);
  const [validMoves, setValidMoves] = useState<[number,number][]>([]);
  const [turn, setTurn] = useState<"w"|"b">("w");
  const [captured, setCaptured] = useState<{w: string[], b: string[]}>({w:[], b:[]});
  const [gameOver, setGameOver] = useState<string|null>(null);

  const isValidMove = useCallback((r: number, c: number) => 
    validMoves.some(([mr, mc]) => mr === r && mc === c), [validMoves]);

  const handleClick = (row: number, col: number) => {
    if (gameOver) return;

    if (selected) {
      if (isValidMove(row, col)) {
        const newBoard = board.map(r => [...r]);
        const target = newBoard[row][col];
        if (target) {
          if (target.type === "K") {
            setGameOver(turn === "w" ? "White" : "Black");
          }
          setCaptured(prev => ({
            ...prev,
            [turn]: [...prev[turn], PIECES[target.color + target.type]]
          }));
        }
        newBoard[row][col] = newBoard[selected[0]][selected[1]];
        if (newBoard[row][col]?.type === "P" && (row === 0 || row === 7)) {
          newBoard[row][col] = { type: "Q", color: turn };
        }
        newBoard[selected[0]][selected[1]] = null;
        setBoard(newBoard);
        setTurn(turn === "w" ? "b" : "w");
        setSelected(null);
        setValidMoves([]);
        return;
      }
    }

    const piece = board[row][col];
    if (piece && piece.color === turn) {
      setSelected([row, col]);
      setValidMoves(getValidMoves(board, row, col));
    } else {
      setSelected(null);
      setValidMoves([]);
    }
  };

  const reset = () => {
    setBoard(initBoard());
    setSelected(null);
    setValidMoves([]);
    setTurn("w");
    setCaptured({w:[], b:[]});
    setGameOver(null);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-sm font-heading font-bold text-foreground">
        {gameOver ? `🎉 ${gameOver} Wins!` : `Turn: ${turn === "w" ? "⬜ White" : "⬛ Black"}`}
      </div>

      <div className="flex gap-4 text-xs">
        <span className="text-muted-foreground">⬜ {captured.w.join("")}</span>
        <span className="text-muted-foreground">⬛ {captured.b.join("")}</span>
      </div>

      {/* Main Board Container with outer border */}
      <div className="rounded-sm overflow-hidden shadow-2xl border-2 border-primary/20">
        {board.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => {
              const isLight = (r + c) % 2 === 0;
              const isSelected = selected?.[0] === r && selected?.[1] === c;
              const isMove = isValidMove(r, c);
              const isCapture = isMove && !!cell;

              return (
                <motion.button
                  key={`${r}-${c}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleClick(r, c)}
                  // Added border-t, border-l to cells for internal grid visibility
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl relative transition-colors border-[0.5px] border-primary/10 ${
                    isSelected
                      ? "bg-primary/50"
                      : isLight
                      ? "bg-[#ebecd0]" 
                      : "bg-[#779556]"
                  } ${isCapture ? "ring-2 ring-inset ring-red-500/80" : ""}`}
                >
                  {isMove && !cell && (
                    <div className="absolute w-3 h-3 rounded-full bg-black/10" />
                  )}
                  {cell && (
                    <span className={`select-none ${cell.color === "w" ? "text-white drop-shadow-md" : "text-black/80"}`}>
                      {PIECES[cell.color + cell.type]}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
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

export default ChessGame;