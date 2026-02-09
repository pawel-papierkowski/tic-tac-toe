// GAME DATA

// //////////
// Game view.
type GameView = {
  activeScreen: "mainMenu" | "game";
};

const defaultGameView: GameView = {
  activeScreen: "mainMenu"
};

// //////////////
// Game settings.
export enum Difficulty {
    Easy, // AI makes completely random moves.
    Medium, // AI sometimes actually tries to make 3 in row.
    Hard, // AI sometimes makes mistakes.
    Impossible // AI plays perfectly; at best, only tie possible.
}

type GameSettings = {
  difficulty: Difficulty;
};

const defaultGameSettings: GameSettings = {
  difficulty: Difficulty.Easy
};

// ////////////////////////
// Tic Tac Toe board state.
enum CellState {
  Empty,
  X,
  O
};

type GameBoard = {
  cells: CellState[][];
  playerScore: number;
  playerWinInRow: number;
  aiScore: number;
};

export const defaultGameBoard: GameBoard = {
  cells: [[CellState.Empty, CellState.Empty, CellState.Empty],
          [CellState.Empty, CellState.Empty, CellState.Empty],
          [CellState.Empty, CellState.Empty, CellState.Empty]],
  playerScore: 0,
  playerWinInRow: 0,
  aiScore: 0
};

// ///////////////////////
// Complete state of game.
// In principle you could serialize it into file on disk, creating full save of game.
export type GameState = {
  view: GameView;
  settings: GameSettings;
  board: GameBoard;
};

export const defaultGameState: GameState = {
  view: defaultGameView,
  settings: defaultGameSettings,
  board: defaultGameBoard
};
