import { describe, it } from 'vitest';

import { assertEvaluation } from '../utils/assertions.ts';

import { EnCellState } from '../../code/data/enums.ts';
import { evaluate } from '../../code/miniMax.ts';

describe('Tests of evaluation function for MiniMax algorithm.', () => {
  describe('Evaluation of single mark type.', () => {
    it('evaluate empty board', () => {
      const board = [
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      assertEvaluation(actualScore, 0);
    });

    it('evaluate board with single mark at edge', () => {
      const board = [
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
        [EnCellState.Empty, EnCellState.X,     EnCellState.Empty],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      // 2 lines (bottom horizontal and middle vertical) have hits for one in-the-line for X
      assertEvaluation(actualScore, 2);
    });

    it('evaluate board with single mark at edge, reversed players', () => {
      const board = [
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
        [EnCellState.Empty, EnCellState.X,     EnCellState.Empty],
      ];
      const actualScore = evaluate(EnCellState.O, EnCellState.X, board);
      // 2 lines (bottom horizontal and middle vertical) have hits for one in-the-line for X
      assertEvaluation(actualScore, -2);
    });

    it('evaluate board with single mark in corner', () => {
      const board = [
        [EnCellState.Empty, EnCellState.Empty, EnCellState.O],
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      // 3 lines (top horizontal, right vertical and one of diagonals) have hits for one in-the-line for O
      assertEvaluation(actualScore, -3);
    });

    it('evaluate board with single mark in center', () => {
      const board = [
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
        [EnCellState.Empty, EnCellState.X,     EnCellState.Empty],
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      // 4 lines (central horizontal, vertical and both diagonals) have hits for one in-the-line for X
      assertEvaluation(actualScore, 4);
    });

    it('evaluate board with three marks spreaded out on board so there are only "one in-the-line" hits', () => {
      const board = [
        [EnCellState.X,     EnCellState.Empty, EnCellState.Empty],
        [EnCellState.Empty, EnCellState.Empty, EnCellState.X],
        [EnCellState.Empty, EnCellState.X,     EnCellState.Empty],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      // 7 lines have hits for one in-the-line for X
      assertEvaluation(actualScore, 7);
    });

    it('evaluate board with two marks on top right', () => {
      const board = [
        [EnCellState.Empty, EnCellState.O,     EnCellState.O],
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      // 3 lines (two right verticals and one diagonal) have hits for one in-the-line for O
      // 1 line (top horizontal) has hit for two in-the-line for O
      assertEvaluation(actualScore, -13);
    });

    it('evaluate board with two marks on bottom left', () => {
      const board = [
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
        [EnCellState.X,     EnCellState.Empty, EnCellState.Empty],
        [EnCellState.X,     EnCellState.Empty, EnCellState.Empty],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      // 3 lines (two bottom verticals and one diagonal) have hits for one in-the-line for X
      // 1 line (left horizontal) has hit for two in-the-line for X
      assertEvaluation(actualScore, 13);
    });

    it('evaluate board with 2x2 box of marks', () => {
      const board = [
        [EnCellState.O,     EnCellState.O,     EnCellState.Empty],
        [EnCellState.O,     EnCellState.O,     EnCellState.Empty],
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      // 5 lines have hit for two in-the-line for O
      // 1 line has hit for one in-the-line for O
      assertEvaluation(actualScore, -51);
    });

    it('evaluate board for "three in-the-line" case', () => {
      const board = [
        [EnCellState.Empty, EnCellState.X, EnCellState.Empty],
        [EnCellState.Empty, EnCellState.X, EnCellState.Empty],
        [EnCellState.Empty, EnCellState.X, EnCellState.Empty],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      // 5 lines have hit for one in-the-line for X
      // 1 line has hit for three in-the-line for X
      assertEvaluation(actualScore, 105);
    });

    it('evaluate board for two "three in-the-line" cases', () => {
      const board = [
        [EnCellState.O, EnCellState.Empty, EnCellState.Empty],
        [EnCellState.O, EnCellState.Empty, EnCellState.Empty],
        [EnCellState.O, EnCellState.O,     EnCellState.O],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      // 5 lines have hit for one in-the-line for O
      // 1 line has hit for two in-the-line for O
      // 2 lines have hit for three in-the-line for O
      assertEvaluation(actualScore, -215);
    });
  });

  describe('Evaluation of two mark types.', () => {
    it('evaluate one X and one O that do not interact with each other', () => {
      const board = [
        [EnCellState.Empty, EnCellState.O,     EnCellState.Empty],
        [EnCellState.X,     EnCellState.Empty, EnCellState.Empty],
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      // 2 lines have hit for one in-the-line for X
      // 2 lines have hit for one in-the-line for O
      // their values nullify each other, even though they aren't on same lines
      assertEvaluation(actualScore, 0);
    });

    it('evaluate X and O marks, some of them interact with each other', () => {
      const board = [
        [EnCellState.X,     EnCellState.O,     EnCellState.Empty],
        [EnCellState.X,     EnCellState.Empty, EnCellState.Empty],
        [EnCellState.Empty, EnCellState.Empty, EnCellState.Empty],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      // 1 line is nullified as it has both X and O
      // 1 line has hit for one in-the-line for O
      // 2 lines have hit for one in-the-line for X
      // 1 line has hit for two in-the-line for X
      assertEvaluation(actualScore, 11);
    });

    it('evaluate X and O marks: nullified line', () => {
      const board = [
        [EnCellState.X, EnCellState.Empty, EnCellState.Empty],
        [EnCellState.X, EnCellState.Empty, EnCellState.Empty],
        [EnCellState.O, EnCellState.Empty, EnCellState.Empty],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      // 1 line is nullified as it has both X and O
      // 2 lines have hit for one in-the-line for O
      // 3 lines have hit for one in-the-line for X
      assertEvaluation(actualScore, 1);
    });

    it('evaluate X and O marks: all lines nullified', () => {
      const board = [
        [EnCellState.X, EnCellState.O,     EnCellState.X],
        [EnCellState.X, EnCellState.Empty, EnCellState.O],
        [EnCellState.O, EnCellState.X,     EnCellState.O],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      // all 9 lines are nullified as it has both X and O
      assertEvaluation(actualScore, 0);
    });

    it('evaluate X and O marks: board with significant advantage for O', () => {
      const board = [
        [EnCellState.O,     EnCellState.Empty, EnCellState.O],
        [EnCellState.Empty, EnCellState.X,     EnCellState.Empty],
        [EnCellState.O,     EnCellState.Empty, EnCellState.X],
      ];
      const actualScore = evaluate(EnCellState.X, EnCellState.O, board);
      // 3 lines are nullified as it has both X and O
      // 2 lines have hit for two in-the-line for O
      // 2 lines have hit for one in-the-line for X
      assertEvaluation(actualScore, -18);
    });
  });
});
