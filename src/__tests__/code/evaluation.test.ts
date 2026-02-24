import { describe, it } from 'vitest';

import { verifyEvaluation, verifySameEvaluation } from '../utils/assertions.ts';

import { createEmptyBoard } from '../../code/data/types.ts';
import { EnCellState } from '../../code/data/enums.ts';

describe('Tests of evaluation function for MiniMax algorithm.', () => {
  describe('Evaluation of single mark type.', () => {
    it('evaluate empty board', () => {
      const board = createEmptyBoard();

      // No hits for empty board, so evaluation score is 0.
      verifyEvaluation(board, EnCellState.X, EnCellState.O, 0);
    });

    it('evaluate board with single mark at edge', () => {
      const board = createEmptyBoard();
      board[1][2] = EnCellState.X;

      // 2 lines (bottom horizontal and middle vertical) have hits for one in-the-line for X
      verifyEvaluation(board, EnCellState.X, EnCellState.O, 2);
    });

    it('evaluate board with single mark for opposite player in corner', () => {
      const board = createEmptyBoard();
      board[2][0] = EnCellState.O;

      // 3 lines (top horizontal, right vertical and one of diagonals) have hits for one in-the-line for O
      verifyEvaluation(board, EnCellState.X, EnCellState.O, -3);
    });

    it('evaluate board with single mark in center', () => {
      const board = createEmptyBoard();
      board[1][1] = EnCellState.X;

      // 4 lines (central horizontal, vertical and both diagonals) have hits for one in-the-line for X
      verifyEvaluation(board, EnCellState.X, EnCellState.O, 4);
    });

    it('evaluate board with three marks spreaded out on board so there are only "one in-the-line" hits', () => {
      const board = createEmptyBoard();
      board[0][0] = EnCellState.X;
      board[1][2] = EnCellState.X;
      board[2][1] = EnCellState.X;

      // 7 lines have hits for one in-the-line for X
      verifyEvaluation(board, EnCellState.X, EnCellState.O, 7);
    });

    it('evaluate board with two marks for opposite player on top right', () => {
      const board = createEmptyBoard();
      board[1][0] = EnCellState.O;
      board[2][0] = EnCellState.O;

      // 3 lines (two right verticals and one diagonal) have hits for one in-the-line for O
      // 1 line (top horizontal) has hit for two in-the-line for O
      verifyEvaluation(board, EnCellState.X, EnCellState.O, -13);
    });

    it('evaluate board with two marks for your player on bottom left', () => {
      const board = createEmptyBoard();
      board[0][1] = EnCellState.X;
      board[0][2] = EnCellState.X;

      // 3 lines (two bottom verticals and one diagonal) have hits for one in-the-line for X
      // 1 line (left horizontal) has hit for two in-the-line for X
      verifyEvaluation(board, EnCellState.X, EnCellState.O, 13);
    });

    it('evaluate board with two marks for your player on vertical middle line', () => {
      const board = createEmptyBoard();
      board[1][0] = EnCellState.X;
      board[1][2] = EnCellState.X; // note gap in middle

      // 2 lines (top and bottom horizontal) have hits for one in-the-line for X
      // 1 line (middle vertical) has hit for two in-the-line for X
      verifyEvaluation(board, EnCellState.X, EnCellState.O, 12);
    });

    it('evaluate board with 2x2 box of marks', () => {
      const board = createEmptyBoard();
      board[0][0] = EnCellState.O;
      board[1][0] = EnCellState.O;
      board[0][1] = EnCellState.O;
      board[1][1] = EnCellState.O;

      // 5 lines have hit for two in-the-line for O
      // 1 line has hit for one in-the-line for O (backward diagonal)
      verifyEvaluation(board, EnCellState.X, EnCellState.O, -51);
    });

    it('evaluate board for "three in-the-line" case: horizontal', () => {
      const board = createEmptyBoard();
      board[0][0] = EnCellState.X;
      board[1][0] = EnCellState.X;
      board[2][0] = EnCellState.X;

      // 5 lines have hit for one in-the-line for X
      // 1 line has hit for three in-the-line for X
      verifyEvaluation(board, EnCellState.X, EnCellState.O, 105);
    });

    it('evaluate board for "three in-the-line" case: vertical', () => {
      const board = createEmptyBoard();
      board[1][0] = EnCellState.X;
      board[1][1] = EnCellState.X;
      board[1][2] = EnCellState.X;

      // 5 lines have hit for one in-the-line for X
      // 1 line has hit for three in-the-line for X
      verifyEvaluation(board, EnCellState.X, EnCellState.O, 105);
    });

    it('evaluate board for "three in-the-line" case: backward diagonal', () => {
      const board = createEmptyBoard();
      board[2][0] = EnCellState.O;
      board[1][1] = EnCellState.O;
      board[0][2] = EnCellState.O;

      // 7 lines have hit for one in-the-line for O
      // 1 line has hit for three in-the-line for O
      verifyEvaluation(board, EnCellState.X, EnCellState.O, -107);
    });

    it('evaluate board for two "three in-the-line" cases', () => {
      const board = createEmptyBoard();
      board[0][0] = EnCellState.O;
      board[0][1] = EnCellState.O;
      board[0][2] = EnCellState.O;
      board[1][2] = EnCellState.O;
      board[2][2] = EnCellState.O;

      // 5 lines have hit for one in-the-line for O
      // 1 line has hit for two in-the-line for O
      // 2 lines have hit for three in-the-line for O
      verifyEvaluation(board, EnCellState.X, EnCellState.O, -215);
    });
  });

  describe('Evaluation of two mark types.', () => {
    it('evaluate one X and one O that do not interact with each other', () => {
      const board = createEmptyBoard();
      board[1][0] = EnCellState.O;
      board[0][1] = EnCellState.X;

      // 2 lines have hit for one in-the-line for X
      // 2 lines have hit for one in-the-line for O
      // their values nullify each other, even though they aren't on same lines
      verifyEvaluation(board, EnCellState.X, EnCellState.O, 0);
    });

    it('evaluate X and O marks, some of them interact with each other', () => {
      const board = createEmptyBoard();
      board[1][0] = EnCellState.O;
      board[0][1] = EnCellState.X;
      board[0][2] = EnCellState.X;

      // 1 line is nullified as it has both X and O
      // 1 line has hit for one in-the-line for O
      // 2 lines have hit for one in-the-line for X
      // 1 line has hit for two in-the-line for X
      verifyEvaluation(board, EnCellState.X, EnCellState.O, 11);
    });

    it('evaluate X and O marks: nullified line', () => {
      const board = createEmptyBoard();
      board[0][0] = EnCellState.X;
      board[0][1] = EnCellState.X;
      board[0][2] = EnCellState.O;

      // 1 line is nullified as it has both X and O
      // 2 lines have hit for one in-the-line for O
      // 3 lines have hit for one in-the-line for X
      verifyEvaluation(board, EnCellState.X, EnCellState.O, 1);
    });

    it('evaluate X and O marks: all lines nullified', () => {
      const board = createEmptyBoard();
      board[0][0] = EnCellState.X;
      board[0][1] = EnCellState.X;
      board[0][2] = EnCellState.O;
      board[1][0] = EnCellState.O;
      board[1][2] = EnCellState.X;
      board[2][0] = EnCellState.X;
      board[2][1] = EnCellState.O;
      board[2][2] = EnCellState.O;
      // all 9 lines are nullified as it has both X and O
      verifyEvaluation(board, EnCellState.X, EnCellState.O, 0);
    });

    it('evaluate X and O marks: board with significant advantage for O', () => {
      const board = createEmptyBoard();
      board[0][0] = EnCellState.O;
      board[0][2] = EnCellState.O;
      board[1][1] = EnCellState.X;
      board[2][0] = EnCellState.O;
      board[2][2] = EnCellState.X;

      // 3 lines are nullified as it has both X and O
      // 2 lines have hit for two in-the-line for O
      // 2 lines have hit for one in-the-line for X
      verifyEvaluation(board, EnCellState.X, EnCellState.O, -18);
    });
  });

  describe('Other.', () => {
    it('evaluate symmetric positions identically (rotational symmetry)', () => {
      const board1 = createEmptyBoard();
      board1[0][0] = EnCellState.X; // top-left corner
      board1[1][1] = EnCellState.O; // center

      const board2 = createEmptyBoard();
      board2[2][0] = EnCellState.X; // top-right corner (90° rotation)
      board2[1][1] = EnCellState.O; // center

      // All corners are equivalent, should score identically.
      verifySameEvaluation(board1, board2);
    });

    it('evaluate mirrored positions identically (horizontal flip)', () => {
      const board1 = createEmptyBoard();
      board1[0][0] = EnCellState.X;
      board1[2][0] = EnCellState.O;

      const board2 = createEmptyBoard();
      board2[2][0] = EnCellState.X;
      board2[0][0] = EnCellState.O;

      // All corners are equivalent, should score identically.
      verifySameEvaluation(board1, board2);
    });
  });
});
