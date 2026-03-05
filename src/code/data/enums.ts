export enum EnDifficulty {
  Easy, // AI makes completely random moves.
  Medium, // AI sometimes actually tries to make 3 in row.
  Hard, // AI sometimes makes mistakes.
  Impossible, // AI plays perfectly; at best, only tie possible.
}

export const difficultyDescr: Record<EnDifficulty, string> = {
  [EnDifficulty.Easy]: 'Easy - Random moves',
  [EnDifficulty.Medium]: 'Medium - Sometimes strategic',
  [EnDifficulty.Hard]: 'Hard - Occasional mistakes',
  [EnDifficulty.Impossible]: 'Impossible - Perfect play',
};

export enum EnWhoFirst {
  Random, // AI or Human
  Human,
  AI,
  HumanVsHuman, // two human players mode
}

export const whoFirstDescr: Record<EnWhoFirst, string> = {
  [EnWhoFirst.Random]: 'Random',
  [EnWhoFirst.Human]: 'Human',
  [EnWhoFirst.AI]: 'AI',
  [EnWhoFirst.HumanVsHuman]: 'Human vs human',
};

export enum EnGameStatus {
  Stop, // game is halted due to error
  InProgress,
  PlayerWon, // we know which one via currentPlayer
  Tie,
}

export const gameStatusDescr: Record<EnGameStatus, string> = {
  [EnGameStatus.Stop]: 'Stop',
  [EnGameStatus.InProgress]: 'In progress',
  [EnGameStatus.PlayerWon]: 'Player won',
  [EnGameStatus.Tie]: 'Tie',
};

export enum EnCellState {
  Unknown, // should not happen
  Empty, // starting value
  X, // cross
  O, // nought
}

export const cellStateDescr: Record<EnCellState, string> = {
  [EnCellState.Unknown]: 'Unknown',
  [EnCellState.Empty]: 'Empty',
  [EnCellState.X]: 'Cross',
  [EnCellState.O]: 'Naught',
};

export enum EnPlayerType {
  Human,
  AI,
  Human1, // for EnWhoFirst.HumanVsHuman
  Human2,
}

export const playerTypeDescr: Record<EnPlayerType, string> = {
  [EnPlayerType.Human]: 'Human',
  [EnPlayerType.AI]: 'AI',
  [EnPlayerType.Human1]: 'Human 1',
  [EnPlayerType.Human2]: 'Human 2',
};
