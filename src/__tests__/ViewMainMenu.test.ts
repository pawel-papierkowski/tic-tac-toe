import { describe, it, expect } from 'vitest';
import { mountWithModel } from './utils/mounting.ts';

import { createGameState } from './../../src/code/data/types.ts';
import { EnDifficulty, EnWhoFirst } from './../../src/code/data/enums.ts';

import ViewMainMenu from '@/components/ViewMainMenu.vue';

describe('ViewMainMenu', () => {
  it('displays "difficulty" setting', () => {
    const gameState = createGameState();
    const { wrapper } = mountWithModel(ViewMainMenu, gameState);

    const comboBox = wrapper.find('[data-testid="select-difficulty"]');
    expect(comboBox.html()).toContain('Easy - Random moves');
    expect(comboBox.html()).toContain('Medium - Sometimes strategic');
    expect(comboBox.html()).toContain('Hard - Occasional mistakes');
    expect(comboBox.html()).toContain('Impossible - Perfect play');
  });

  it('can change "difficulty" selection', async () => {
    const gameState = createGameState();
    const { wrapper, modelRef: gameStateRef } = mountWithModel(ViewMainMenu, gameState);
    const comboBox = wrapper.find('[data-testid="select-difficulty"]');

    // Set a specific value (adjust based on your enum values)
    await comboBox.setValue(2); // For "Hard" (if using numeric enum)

    // Verify the value changed for this element...
    expect((comboBox.element as HTMLSelectElement).value).toBe('2');
    // ...and for game state.
    expect(gameStateRef.value.settings.difficulty).toBe(EnDifficulty.Hard);
  });

  it('displays "who is first" setting', () => {
    const gameState = createGameState();
    const { wrapper } = mountWithModel(ViewMainMenu, gameState);

    const comboBox = wrapper.find('[data-testid="select-whoFirst"]');
    expect(comboBox.html()).toContain('Random');
    expect(comboBox.html()).toContain('Human');
    expect(comboBox.html()).toContain('AI');
  });

  it('can change "who is first" selection', async () => {
    const gameState = createGameState();
    const { wrapper, modelRef: gameStateRef } = mountWithModel(ViewMainMenu, gameState);
    const comboBox = wrapper.find('[data-testid="select-whoFirst"]');

    // Set a specific value (adjust based on your enum values)
    await comboBox.setValue(1); // For "Human"

    // Verify the value changed for this element...
    expect((comboBox.element as HTMLSelectElement).value).toBe('1');
    // ...and for game state.
    expect(gameStateRef.value.settings.whoFirst).toBe(EnWhoFirst.Human);
  });

  it('displays start button', () => {
    const gameState = createGameState();
    const { wrapper } = mountWithModel(ViewMainMenu, gameState);

    const button = wrapper.find('[data-testid="button-start"]');
    expect(button.text()).toBe('Start Game');
  });
});
