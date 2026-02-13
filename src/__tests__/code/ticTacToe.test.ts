import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { fillLegalMove } from '@/code/ticTacToe.ts';
import { createGameState, EnCellState } from '@/code/types.ts';

function verifyMove(actual : LegalMove, expected : LegalMove) {
    expect(actual.who).toBe(expected.who);
    expect(actual.x).toBe(expected.x);
    expect(actual.y).toBe(expected.y);
    expect(actual.score, `Score mismatch`).toBe(expected.score);
    expect(actual.win, `Win mismatch`).toBe(expected.win);
    expect(actual.preventLoss, `PreventLoss mismatch`).toBe(expected.preventLoss);
}

describe('Tests of fillLegalMove() function.', () => {
  describe('Scoring', () => {
    it('creates move without score calculation', () => {
      const gameState = ref(createGameState());
      // note game state is untouched (all cells are empty)
      const who = EnCellState.O;
      const x = 0;
      const y = 0;

      const actualMove = fillLegalMove(gameState, who, x, y, false);
      const expectedMove : LegalMove = {
        who: who, x: x, y: y, // always same
        score: 0, // Should be 0 when calcScore is false
        win: false, // Default value when calcScore is false
        preventLoss: false // Default value when calcScore is false
      }
      verifyMove(actualMove, expectedMove);
    });

    it('creates move with score calculation', () => {
      const gameState = ref(createGameState());
      // note game state is untouched (all cells are empty)
      const who = EnCellState.O;
      const x = 2;
      const y = 0;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove : LegalMove = {
        who: who, x: x, y: y, // always same
        score: 10, // basic score
        win: false,
        preventLoss: false
      }
      verifyMove(actualMove, expectedMove);
    });

    it('calculates correct score for center position', () => {
      const gameState = ref(createGameState());
      // note game state is untouched (all cells are empty)
      const who = EnCellState.X;
      const x = 1;
      const y = 1;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove : LegalMove = {
        who: who, x: x, y: y, // always same
        score: 50, // score for center cell
        win: false,
        preventLoss: false
      }
      verifyMove(actualMove, expectedMove);
    });
  });

  describe('Board situations', () => {
    it('detects winning move: | vertical line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.X;
      gameState.value.board.cells[0]![1] = EnCellState.X;
      const who = EnCellState.X;
      const x = 0;
      const y = 2;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove : LegalMove = {
        who: who, x: x, y: y, // always same
        score: 1010, // winning move has big score bonus
        win: true,
        preventLoss: false
      }
      verifyMove(actualMove, expectedMove);
    });

    it('detects not winning move: | vertical line', () => { // TODO fails rn
      // exactly same as "detects winning move: | vertical line", but naughts are making move
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.X;
      gameState.value.board.cells[0]![1] = EnCellState.X;
      const who = EnCellState.O;
      const x = 0;
      const y = 2;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove : LegalMove = {
        who: who, x: x, y: y, // always same
        score: 110, // score higher if it prevents opponent's win
        win: false,
        preventLoss: true
      }
      verifyMove(actualMove, expectedMove);
    });

    it('detects winning move: - horizontal line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![2] = EnCellState.O;
      gameState.value.board.cells[2]![2] = EnCellState.O;
      const who = EnCellState.O;
      const x = 1;
      const y = 2;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove : LegalMove = {
        who: who, x: x, y: y, // always same
        score: 1010,
        win: true,
        preventLoss: false
      }
      verifyMove(actualMove, expectedMove);
    });

    it('detects winning move: / cross line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![2] = EnCellState.O;
      gameState.value.board.cells[1]![1] = EnCellState.O;
      const who = EnCellState.O;
      const x = 2;
      const y = 0;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove : LegalMove = {
        who: who, x: x, y: y, // always same
        score: 1010,
        win: true,
        preventLoss: false
      }
      verifyMove(actualMove, expectedMove);
    });

    it('detects winning move: \\ cross line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.O;
      gameState.value.board.cells[2]![2] = EnCellState.O;
      const who = EnCellState.O;
      const x = 1;
      const y = 1;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove : LegalMove = {
        who: who, x: x, y: y, // always same
        score: 1050,
        win: true,
        preventLoss: false
      }
      verifyMove(actualMove, expectedMove);
    });
  });
});
