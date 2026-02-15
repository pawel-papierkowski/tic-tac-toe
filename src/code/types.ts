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
  debugMode: boolean;
  debugPlayer: EnPlayerType;
};

export function createGameSettings(): GameSettings {
  return {
    difficulty: EnDifficulty.Easy,
    whoFirst: EnWhoFirst.Random,
    debugMode: true, // Settable only in code.
    debugPlayer: EnPlayerType.AI, // Which player's debug should be shown.
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

 // If present === true, draws strikethrough on screen from x1,y1 to x2,y2. Note units are in cells indexes, not pixels.
type StrikeData = {
  present: boolean,
  x1: number,
  y1: number,
  x2: number,
  y2: number
};

function createStrikeData(): StrikeData {
  return {
    present: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
  };
}

export type DebugData = {
  score: number,
  win: boolean,
  preventLoss: boolean,
  lineUp: number,
};

function createDebugData(): DebugData {
  return {
    score: 0,
    win: false,
    preventLoss: false,
    lineUp: 0,
  };
}

function createDebugBoard(): DebugData[][] {
  const debugBoard : DebugData[][] = [[],[],[]]; // initialize
  for (let i=0; i<3; i++) {
    for (let j=0; j<3; j++) {
      debugBoard[i]![j] = createDebugData();
    }
  }
  return debugBoard;
}

type GameBoard = {
  status: EnGameStatus;
  cells: EnCellState[][];
  debug: DebugData[][];
  firstPlayer: EnPlayerType;
  currentPlayer: EnPlayerType;
  strike: StrikeData;
};

export function createGameBoard(): GameBoard {
  return {
    status: EnGameStatus.InProgress,
    cells: [[EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
            [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
            [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty]],
    debug: createDebugBoard(),
    firstPlayer: EnPlayerType.Human,
    currentPlayer: EnPlayerType.Human,
    strike: createStrikeData()
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

export type LegalMove = {
  who: EnCellState, // Who is making move: crosses or naughts?
  x: number,
  y: number,
  weight: number, // Importance of move. Used in medium and hard difficulties.
  score: number, // The higher score, the better is move. Same on any difficulty.
  win: boolean, // If true, this move is winning move.
  preventLoss: boolean, // If true, this move prevents win of opponent.
  lineUp: number, // Amout of other X/O that are lined up with this move.
}

export function createLegalMove(who : EnCellState, x : number, y : number): LegalMove {
  return {
    who: who,
    x: x,
    y: y,
    weight: 0,
    score: 0,
    win: false,
    preventLoss: false,
    lineUp: 0,
  };
}
