import { describe, it, expect } from 'vitest';

import { EnCellState } from '../../code/data/enums.ts';
import { evaluate } from '../../code/miniMax.ts';

describe('Tests of MiniMax algorithm.', () => {
  it('evaluate empty board', () => {
    const board = [
      [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
    ];
    const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
    const exceptedScore = 0;
    expect(actualScore, `Evaluated score mismatch.`).toBe(exceptedScore);
  });

  it('evaluate board with single mark at edge', () => {
    const board = [
      [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      [EnCellState.Empty, EnCellState.X,     EnCellState.Empty],
    ];
    const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
    // 2 lines (bottom horizontal and middle vertical) have hits for one in-the-line for X
    const exceptedScore = 2;
    expect(actualScore, `Evaluated score mismatch.`).toBe(exceptedScore);
  });

  it('evaluate board with single mark in corner', () => {
    const board = [
      [EnCellState.Empty, EnCellState.Empty, EnCellState.O],
      [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
    ];
    const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
    // 3 lines (top horizontal, right vertical and one of diagonals) have hits for one in-the-line for O
    const exceptedScore = -3;
    expect(actualScore, `Evaluated score mismatch.`).toBe(exceptedScore);
  });

  it('evaluate board with single mark in center', () => {
    const board = [
      [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      [EnCellState.Empty, EnCellState.X,     EnCellState.Empty],
      [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
    ];
    const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
    // 4 lines (central horizontal, vertical and both diagonals) have hits for one in-the-line for X
    const exceptedScore = 4;
    expect(actualScore, `Evaluated score mismatch.`).toBe(exceptedScore);
  });
});
