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
// //////////////

export enum Difficulty {
    Easy, // AI makes completely random moves.
    Medium, // AI sometimes actually tries to make 3 in row.
    Hard, // AI sometimes makes mistakes.
    Impossible // AI plays perfectly; at best, only tie possible.
}

export enum WhoFirst {
  Random,
  Human,
  AI
}

type GameSettings = {
  difficulty: Difficulty;
  whoFirst: WhoFirst;
};

const defaultGameSettings: GameSettings = {
  difficulty: Difficulty.Easy,
  whoFirst: WhoFirst.Random
};

// ////////////////////////
// Tic Tac Toe board state.
// ////////////////////////

export enum CellState {
  Unknown, // indicates bug
  Empty,
  X, // cross
  O // nought
};

export enum PlayerType {
  Human,
  AI
}

type GameBoard = {
  cells: CellState[][];
  first: PlayerType;

  ties: number;
  tiesInRow: number;
  humanScore: number;
  humanWinInRow: number;
  aiScore: number;
  aiWinInRow: number;
};

export const defaultGameBoard: GameBoard = {
  cells: [[CellState.Empty, CellState.Empty, CellState.Empty],
          [CellState.Empty, CellState.Empty, CellState.Empty],
          [CellState.Empty, CellState.Empty, CellState.Empty]],
  first: PlayerType.Human,

  ties: 0,
  tiesInRow: 0,
  humanScore: 0,
  humanWinInRow: 0,
  aiScore: 0,
  aiWinInRow: 0
};

// ///////////////////////
// Complete state of game.
// In principle you could serialize it into file on disk, creating full save of game.
// ///////////////////////

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
