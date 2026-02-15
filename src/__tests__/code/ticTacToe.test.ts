import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { fillLegalMove } from '../../code/legalMoves.ts';
import { createGameState, EnCellState, type LegalMove } from '../../code/types.ts';

function verifyMove(actual: LegalMove, expected: LegalMove) {
  expect(actual.who).toBe(expected.who);
  expect(actual.x).toBe(expected.x);
  expect(actual.y).toBe(expected.y);
  expect(actual.win, `Win mismatch`).toBe(expected.win);
  expect(actual.preventLoss, `PreventLoss mismatch`).toBe(expected.preventLoss);
  expect(actual.lineUp, `LineUp mismatch`).toBe(expected.lineUp);

  expect(actual.score, `Score mismatch`).toBe(expected.score);
  expect(actual.weight, `Weight mismatch`).toBe(expected.weight);
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
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 0, // Should be 0 when calcScore is false.
        score: 0, // Should be 0 when calcScore is false.
        win: false, // Default value when calcScore is false.
        preventLoss: false, // Default value when calcScore is false.
        lineUp: 0, // Default value when calcScore is false.
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
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 10, // same as score
        score: 10, // basic score
        win: false,
        preventLoss: false,
        lineUp: 0,
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
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 50, // same as score
        score: 50, // score for center cell
        win: false,
        preventLoss: false,
        lineUp: 0,
      }
      verifyMove(actualMove, expectedMove);
    });
  });

  describe('Line up situations', () => {
    it('detects minimal lineup', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.X;
      const who = EnCellState.X;
      const x = 0;
      const y = 2;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 35, // same as score
        score: 35, // lineup provides bonus to score
        win: false,
        preventLoss: false,
        lineUp: 1,
      }
      verifyMove(actualMove, expectedMove);
    });

    it('detects double lineup that is not winning move', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![2] = EnCellState.X;
      gameState.value.board.cells[2]![2] = EnCellState.X;
      const who = EnCellState.X;
      const x = 0;
      const y = 0;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 60, // same as score
        score: 60, // lineup provides bonus to score
        win: false,
        preventLoss: false,
        lineUp: 2,
      }
      verifyMove(actualMove, expectedMove);
    });

    it('detects triple lineup that is not winning move', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![2] = EnCellState.X;
      gameState.value.board.cells[2]![2] = EnCellState.X;
      gameState.value.board.cells[2]![0] = EnCellState.X;
      const who = EnCellState.X;
      const x = 0;
      const y = 0;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 85, // same as score
        score: 85, // lineup provides bonus to score
        win: false,
        preventLoss: false,
        lineUp: 3,
      }
      verifyMove(actualMove, expectedMove);
    });

    it('detects NO lineup', () => {
      const gameState = ref(createGameState())
      gameState.value.board.cells[0]![0] = EnCellState.X;
      gameState.value.board.cells[0]![1] = EnCellState.O; // prevents lineup from counting
      const who = EnCellState.X;
      const x = 0;
      const y = 2;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 10, // same as score
        score: 10, // no lineup bonus
        win: false,
        preventLoss: false,
        lineUp: 0,
      }
      verifyMove(actualMove, expectedMove);
    });
  });

  describe('Win situations', () => {
    it('detects winning move: | vertical line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.X;
      gameState.value.board.cells[0]![1] = EnCellState.X;
      const who = EnCellState.X;
      const x = 0;
      const y = 2;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 1060, // same as score
        score: 1060, // winning move has big score bonus
        win: true,
        preventLoss: false,
        lineUp: 2,
      }
      verifyMove(actualMove, expectedMove);
    });

    it('detects not winning move: | vertical line', () => {
      // exactly same as "detects winning move: | vertical line", but naughts are making move
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.X;
      gameState.value.board.cells[0]![1] = EnCellState.X;
      const who = EnCellState.O;
      const x = 0;
      const y = 2;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 110, // same as score
        score: 110, // score higher if it prevents opponent's win
        win: false,
        preventLoss: true,
        lineUp: 0,
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
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 1060, // same as score
        score: 1060,
        win: true,
        preventLoss: false,
        lineUp: 2,
      }
      verifyMove(actualMove, expectedMove)
    });

    it('detects winning move: / cross line', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![2] = EnCellState.O;
      gameState.value.board.cells[1]![1] = EnCellState.O;
      const who = EnCellState.O;
      const x = 2;
      const y = 0;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 1060, // same as score
        score: 1060,
        win: true,
        preventLoss: false,
        lineUp: 2,
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
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 1100, // same as score
        score: 1100,
        win: true,
        preventLoss: false,
        lineUp: 2,
      }
      verifyMove(actualMove, expectedMove)
    });
  });
});
