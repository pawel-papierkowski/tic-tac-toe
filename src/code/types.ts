// GAME DATA

// //////////
// Game view.
// //////////

type GameView = {
  activeScreen: "mainMenu" | "game";
};

export function createGameView(): GameView {
  return {
    activeScreen: "mainMenu"
  };
}

// //////////////
// Game settings.
// //////////////

export enum EnDifficulty {
    Easy, // AI makes completely random moves.
    Medium, // AI sometimes actually tries to make 3 in row.
    Hard, // AI sometimes makes mistakes.
    Impossible // AI plays perfectly; at best, only tie possible.
}

export enum EnWhoFirst {
  Random,
  Human,
  AI
}

type GameSettings = {
  difficulty: EnDifficulty;
  whoFirst: EnWhoFirst;
};

export function createGameSettings(): GameSettings {
  return {
    difficulty: EnDifficulty.Easy,
    whoFirst: EnWhoFirst.Random
  };
}

// ////////////////////////
// Tic Tac Toe board state.
// ////////////////////////

export enum EnGameStatus {
  Stop, // game is halted
  InProgress,
  PlayerWon, // we know which one via currentPlayer
  Tie
};

export enum EnCellState {
  Unknown, // should not happen
  Empty, // starting value
  X, // cross
  O // nought
};

export enum EnPlayerType {
  Human,
  AI
}

type GameBoard = {
  status: EnGameStatus;
  cells: EnCellState[][];
  firstPlayer: EnPlayerType;
  currentPlayer: EnPlayerType;
};

export function createGameBoard(): GameBoard {
  return {
    status: EnGameStatus.InProgress,
    cells: [[EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
            [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
            [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty]],
    firstPlayer: EnPlayerType.Human,
    currentPlayer: EnPlayerType.Human
  };
}

type GameStatistics = {
  round: number;
  ties: number;
  tiesInRow: number;
  humanScore: number;
  humanWinInRow: number;
  aiScore: number;
  aiWinInRow: number;
}

export function createGameStatistics(): GameStatistics {
  return {
    round: 0,
    ties: 0,
    tiesInRow: 0,
    humanScore: 0,
    humanWinInRow: 0,
    aiScore: 0,
    aiWinInRow: 0
  };
}

// ///////////////////////
// Complete state of game.
// In principle you could serialize it into file on disk, creating full save of game.
// ///////////////////////

export type GameState = {
  view: GameView;
  settings: GameSettings;
  board: GameBoard;
  statistics: GameStatistics;
};

export function createGameState(): GameState {
  return {
    view: createGameView(), // what should be shown on screen
    settings: createGameSettings(), // determined in main menu
    board: createGameBoard(), // reset every round (and so also every game)
    statistics: createGameStatistics() // reset every game
  };
}

// /////////////////////////////
// Types for tic-tac-toe engine.
// /////////////////////////////

export enum EnMoveResult {
  Error, // Tried to do illegal move. Most likely bug.
  Tie, // Failed to move. Indicates tie.
  Success, // Move was made successfully, but it was not winning move.
  Win // Move was made successfully, and it was winning move.
}

export type LegalMove = {
  x: number,
  y: number,
  score: number // the higher score, the better is move
}
