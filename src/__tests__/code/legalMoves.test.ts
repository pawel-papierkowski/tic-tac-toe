import { describe, it } from 'vitest';
import { ref } from 'vue';
import { assertMove } from '../utils/assertions.ts';

import { fillLegalMove, } from '../../code/legalMoves.ts';
import { createGameState, EnCellState, type LegalMove } from '../../code/types.ts';

describe('Tests of legal moves.', () => {
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
      assertMove(actualMove, expectedMove);
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
      assertMove(actualMove, expectedMove);
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
      assertMove(actualMove, expectedMove);
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
      assertMove(actualMove, expectedMove);
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
      assertMove(actualMove, expectedMove);
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
      assertMove(actualMove, expectedMove);
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
      assertMove(actualMove, expectedMove);
    });
  });

  describe('Win situations', () => {
    it('detects winning move: | vertical line left', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![0] = EnCellState.O;
      gameState.value.board.cells[0]![1] = EnCellState.O;
      const who = EnCellState.O;
      const x = 0;
      const y = 2;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 100060, // same as score
        score: 100060, // winning move has big score bonus
        win: true,
        preventLoss: false,
        lineUp: 2,
      }
      assertMove(actualMove, expectedMove);
    });

    it('detects winning move: | vertical line middle', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[1]![1] = EnCellState.X;
      gameState.value.board.cells[1]![2] = EnCellState.X;
      const who = EnCellState.X;
      const x = 1;
      const y = 0;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 100060, // same as score
        score: 100060, // winning move has big score bonus
        win: true,
        preventLoss: false,
        lineUp: 2,
      }
      assertMove(actualMove, expectedMove);
    });

    it('detects winning move: | vertical line right', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[2]![0] = EnCellState.X;
      gameState.value.board.cells[2]![2] = EnCellState.X;
      const who = EnCellState.X;
      const x = 2;
      const y = 1;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 100060, // same as score
        score: 100060, // winning move has big score bonus
        win: true,
        preventLoss: false,
        lineUp: 2,
      }
      assertMove(actualMove, expectedMove);
    });

    it('detects winning move: - horizontal line top', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[1]![0] = EnCellState.X;
      gameState.value.board.cells[2]![0] = EnCellState.X;
      const who = EnCellState.X;
      const x = 0;
      const y = 0;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 100060, // same as score
        score: 100060,
        win: true,
        preventLoss: false,
        lineUp: 2,
      }
      assertMove(actualMove, expectedMove)
    });

    it('detects winning move: - horizontal line middle', () => {
      const gameState = ref(createGameState());
      gameState.value.board.cells[0]![1] = EnCellState.X;
      gameState.value.board.cells[2]![1] = EnCellState.X;
      const who = EnCellState.X;
      const x = 1;
      const y = 1;

      const actualMove = fillLegalMove(gameState, who, x, y, true);
      const expectedMove: LegalMove = {
        who: who,
        x: x,
        y: y, // always same
        weight: 100100, // same as score
        score: 100100,
        win: true,
        preventLoss: false,
        lineUp: 2,
      }
      assertMove(actualMove, expectedMove)
    });

    it('detects winning move: - horizontal line bottom', () => {
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
        weight: 100060, // same as score
        score: 100060,
        win: true,
        preventLoss: false,
        lineUp: 2,
      }
      assertMove(actualMove, expectedMove)
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
        weight: 100060, // same as score
        score: 100060,
        win: true,
        preventLoss: false,
        lineUp: 2,
      }
      assertMove(actualMove, expectedMove);
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
        weight: 100100, // same as score
        score: 100100,
        win: true,
        preventLoss: false,
        lineUp: 2,
      }
      assertMove(actualMove, expectedMove)
    });

    it('detects NOT winning move: | vertical line', () => {
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
        weight: 1010, // same as score
        score: 1010, // score higher if it prevents opponent's win
        win: false,
        preventLoss: true,
        lineUp: 0,
      }
      assertMove(actualMove, expectedMove);
    });
  });
});
