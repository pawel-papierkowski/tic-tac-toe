import { describe, it, expect } from 'vitest';

import type { MiniMaxResult } from '../../code/data/types.ts';
import { createEmptyBoard, createFilledBoard } from '../../code/data/types.ts';
import { EnCellState } from '../../code/data/enums.ts';
import { resolveMiniMax } from '../../code/miniMax.ts';

function verifyMiniMaxForBoard(board: EnCellState[][], who: EnCellState, maxDepth: number, expectedResult: MiniMaxResult) {
  const actualResult = resolveMiniMax(board, who, maxDepth);
  expect(actualResult, `MiniMax result mismatch`).toEqual(expectedResult);
}

describe('Tests of MiniMax algorithm.', () => {
  describe('Scoring results.', () => {
    it('score for empty board and 0 depth (scoring for this state of board only)', () => {
      const board = createEmptyBoard();
      const expectedResult = { score: 0, depth: 0, x: -1, y: -1 };
      verifyMiniMaxForBoard(board, EnCellState.X, 0, expectedResult);
    });

    it('score for empty board and 1 depth (scoring for next move)', () => {
      const board = createEmptyBoard();
      const expectedResult = { score: 4, depth: 1, x: 1, y: 1 };
      verifyMiniMaxForBoard(board, EnCellState.X, 1, expectedResult);
    });

    it('score for empty board and 2 depth (scoring for two moves: you and opponent)', () => {
      const board = createEmptyBoard();
      const expectedResult = { score: 0, depth: 2, x: 1, y: 2 };
      verifyMiniMaxForBoard(board, EnCellState.X, 2, expectedResult);
    });

    it('score for empty board and 3 depth (scoring for three moves: you, opponent, you)', () => {
      const board = createEmptyBoard();
      const expectedResult = { score: 11, depth: 3, x: 1, y: 1 };
      verifyMiniMaxForBoard(board, EnCellState.X, 3, expectedResult);
    });

    it('score for board with win for X in one move and 0 depth (scoring for this state of board only)', () => {
      const board = createEmptyBoard();
      board[0][1] = EnCellState.X;
      board[1][1] = EnCellState.X;
      const expectedResult = { score: 14, depth: 0, x: -1, y: -1 };
      verifyMiniMaxForBoard(board, EnCellState.X, 0, expectedResult);
    });

    it('score for board with win for X in one move and 1 depth', () => {
      const board = createEmptyBoard();
      board[0][1] = EnCellState.X;
      board[1][1] = EnCellState.X;
      const expectedResult = { score: 1000, depth: 1, x: 2, y: 1 };
      verifyMiniMaxForBoard(board, EnCellState.X, 1, expectedResult);
    });

    it('score for board with win for X in one move and 15 depth (impossibly many moves)', () => {
      const board = createEmptyBoard();
      board[0][1] = EnCellState.X;
      board[1][1] = EnCellState.X;
      const expectedResult = { score: 1000, depth: 1, x: 2, y: 1 };
      // We found winning move immediately at depth 1.
      // Algo finds exactly same winning move later, at higher depth.
      // There is literally no reason to reuse same move later.
      //const invalidResult = { score: 1000, depth: 5, x: 2, y: 1 };
      verifyMiniMaxForBoard(board, EnCellState.X, 15, expectedResult);
    });

    //

    it('score for board in win state', () => {
      const board = createEmptyBoard();
      board[0][0] = EnCellState.X;
      board[1][1] = EnCellState.X;
      board[2][2] = EnCellState.X;
      const expectedResult = { score: 1000, depth: 0, x: -1, y: -1 };
      // draw is at depth 0, no need to go deeper
      verifyMiniMaxForBoard(board, EnCellState.X, 15, expectedResult);
    });

    it('score for board in draw state (no move possible)', () => {
      const board = createFilledBoard(EnCellState.X);
      board[0][1] = EnCellState.O; // ensure it is draw
      board[0][2] = EnCellState.O;
      board[1][0] = EnCellState.O;
      board[2][1] = EnCellState.O;
      board[2][2] = EnCellState.O;
      const expectedResult = { score: 0, depth: 0, x: -1, y: -1 };
      // draw is at depth 0, no need to go deeper
      verifyMiniMaxForBoard(board, EnCellState.X, 15, expectedResult);
    });
  });
});
