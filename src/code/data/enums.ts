export enum EnDifficulty {
  Easy, // AI makes completely random moves.
  Medium, // AI sometimes actually tries to make 3 in row.
  Hard, // AI sometimes makes mistakes.
  Impossible, // AI plays perfectly; at best, only tie possible.
}

export enum EnWhoFirst {
  Random, // AI or Human
  Human,
  AI,
  HumanVsHuman, // two human players mode
}

export enum EnGameStatus {
  Stop, // game is halted
  InProgress,
  PlayerWon, // we know which one via currentPlayer
  Tie,
}

export enum EnCellState {
  Unknown, // should not happen
  Empty, // starting value
  X, // cross
  O, // nought
}

export enum EnPlayerType {
  Human,
  AI,
  Human1, // for EnWhoFirst.HumanVsHuman
  Human2,
}
