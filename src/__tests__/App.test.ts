import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import App from '../App.vue';

/** Note by default game starts in main menu. */
describe('App', () => {
  it('displays the game title in correct location', () => {
    const wrapper = mount(App);
    // via CSS selector
    expect(wrapper.find('header > h1').text()).toBe('TIC TAC TOE');
  });

  it('displays footer with creator in correct location', () => {
    const wrapper = mount(App);
    // finding element
    const footer = wrapper.find('footer');
    expect(footer.exists()).toBe(true);
    expect(footer.text()).toContain('Paweł Papierkowski');
  });
});
