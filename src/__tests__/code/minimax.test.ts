import { describe, it } from 'vitest';

import { createEmptyBoard, createFilledBoard } from '../../code/data/types.ts';
import { EnCellState } from '../../code/data/enums.ts';
import { verifyMiniMaxForBoard } from '../utils/assertions.ts';

describe('Tests of MiniMax algorithm.', () => {
  describe('Terminal results.', () => {
    it('score for board in win state', () => {
      const board = createEmptyBoard();
      board[0][0] = EnCellState.X;
      board[1][1] = EnCellState.X;
      board[2][2] = EnCellState.X;
      const expectedResult = { score: 1000, depth: 0, moves: [] };
      // win is at depth 0, no need to go deeper
      verifyMiniMaxForBoard(board, EnCellState.X, 15, expectedResult);
    });

    it('score for board in loss state', () => {
      const board = createEmptyBoard();
      board[0][0] = EnCellState.X;
      board[1][1] = EnCellState.X;
      board[2][2] = EnCellState.X;
      const expectedResult = { score: -1000, depth: 0, moves: [] };
      // loss is at depth 0, no need to go deeper
      verifyMiniMaxForBoard(board, EnCellState.O, 15, expectedResult);
    });

    it('score for board in draw state (no move possible)', () => {
      const board = createFilledBoard(EnCellState.X);
      board[0][1] = EnCellState.O; // ensure it is draw by replacing some X's with O's
      board[0][2] = EnCellState.O;
      board[1][0] = EnCellState.O;
      board[2][1] = EnCellState.O;
      board[2][2] = EnCellState.O;
      const expectedResult = { score: 0, depth: 0, moves: [] };
      // draw is at depth 0, no need to go deeper
      verifyMiniMaxForBoard(board, EnCellState.X, 15, expectedResult);
    });
  });

  describe('Scoring results for empty board.', () => {
    it('score for empty board and 0 depth (scoring for this state of board only)', () => {
      const board = createEmptyBoard();
      const expectedResult = { score: 0, depth: 0, moves: [] };
      verifyMiniMaxForBoard(board, EnCellState.X, 0, expectedResult);
    });

    it('score for empty board and 1 depth (scoring for next move)', () => {
      const board = createEmptyBoard();
      const expectedResult = { score: 4, depth: 1, moves: [{ x: 1, y: 1 }] };
      verifyMiniMaxForBoard(board, EnCellState.X, 1, expectedResult);
    });

    it('score for empty board and 2 depth (scoring for two moves: you and opponent)', () => {
      const board = createEmptyBoard();
      const expectedResult = {
        score: 1,
        depth: 2,
        moves: [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
        ],
      };
      verifyMiniMaxForBoard(board, EnCellState.X, 2, expectedResult);
    });

    it('score for empty board and 3 depth (scoring for three moves: you, opponent, you)', () => {
      const board = createEmptyBoard();
      const expectedResult = {
        score: 12,
        depth: 3,
        moves: [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 0 },
        ],
      };
      verifyMiniMaxForBoard(board, EnCellState.X, 3, expectedResult);
    });
  });

  describe('Scoring results for mostly empty board.', () => {
    it('score for board with win for X in one move and 0 depth (scoring for this state of board only)', () => {
      const board = createEmptyBoard();
      board[0][1] = EnCellState.X;
      board[1][1] = EnCellState.X;
      // Current state of board:
      // ???
      // XX?
      // ???

      const expectedResult = { score: 14, depth: 0, moves: [] };
      verifyMiniMaxForBoard(board, EnCellState.X, 0, expectedResult);
    });

    it('score for board with win for X in one move and 1 depth', () => {
      const board = createEmptyBoard();
      board[0][1] = EnCellState.X;
      board[1][1] = EnCellState.X;
      const expectedResult = { score: 1000, depth: 1, moves: [{ x: 2, y: 1 }] };
      verifyMiniMaxForBoard(board, EnCellState.X, 1, expectedResult);
    });

    it('score for board with win for X in one move and 15 depth (impossibly deep)', () => {
      const board = createEmptyBoard();
      board[0][1] = EnCellState.X;
      board[1][1] = EnCellState.X;

      const expectedResult = { score: 1000, depth: 1, moves: [{ x: 2, y: 1 }] };
      // We found winning move immediately at depth 1.
      // Algo finds exactly same winning move later, at higher depth.
      // There is literally no reason to reuse same move later.
      //const invalidResult = { score: 1000, depth: 5, moves: [{x: 2, y: 1}] };
      verifyMiniMaxForBoard(board, EnCellState.X, 15, expectedResult);
    });
  });

  describe('Scoring results for realistic board states.', () => {
    it('score for board where most O moves are good', () => {
      const board = createEmptyBoard();
      board[0][1] = EnCellState.X;
      board[1][1] = EnCellState.O;
      board[2][0] = EnCellState.X;
      // Current state of board:
      // ??X
      // XO?
      // ???

      // Should not make move 2, 1 or 0, 2.
      const expectedResult = {
        score: 10,
        depth: 3,
        moves: [
          { x: 1, y: 2 },
          { x: 1, y: 0 },
          { x: 0, y: 0 },
        ],
      };
      verifyMiniMaxForBoard(board, EnCellState.O, 3, expectedResult);
    });

    it('score for board where O is about to lose (minimal)', () => {
      const board = createEmptyBoard();
      board[1][1] = EnCellState.X;
      board[2][0] = EnCellState.O;
      board[2][1] = EnCellState.X;
      // Current state of board:
      // ??O
      // ?XX
      // ???

      // O must make move 0,1 otherwise it will lose
      const expectedResult = {
        score: 0,
        depth: 3,
        moves: [
          { x: 0, y: 1 },
          { x: 0, y: 0 },
          { x: 2, y: 2 },
        ],
      };
      verifyMiniMaxForBoard(board, EnCellState.O, 3, expectedResult);
    });

    it('score for board where O is about to lose (further)', () => {
      const board = createEmptyBoard();
      board[0][2] = EnCellState.X;
      board[1][1] = EnCellState.O;
      board[2][0] = EnCellState.O;
      board[2][1] = EnCellState.X;
      board[2][2] = EnCellState.X;
      // Current state of board:
      // ??O
      // ?OX
      // X?X

      // O must make move 1,2 otherwise it will lose
      const expectedResult = {
        score: 0,
        depth: 3,
        moves: [
          { x: 1, y: 2 },
          { x: 1, y: 0 },
          { x: 0, y: 1 },
        ],
      };
      verifyMiniMaxForBoard(board, EnCellState.O, 3, expectedResult);
    });
  });
});
