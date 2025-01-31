import { describe, it, expect } from 'vitest';
import {
  initialState,
  scrollbarTabsReducer,
  setTab,
} from './scrollbarTabsReducer';

describe('scrollbarTabsReducer', () => {
  it('должен возвращать initial state', () => {
    const state = scrollbarTabsReducer(undefined, { type: '@@INIT' });
    expect(state).toBe(initialState);
  });

  it('должен устанавливать новую вкладку с помощью setTab', () => {
    const newTab = 'sauces';

    const state = scrollbarTabsReducer(initialState, setTab(newTab));

    expect(state).toBe(newTab);
  });

  it('должен корректно изменять состояние, если новая вкладка передана несколько раз', () => {
    const firstTab = 'sauces';
    const secondTab = 'mains';

    let state = scrollbarTabsReducer(initialState, setTab(firstTab));
    expect(state).toBe(firstTab);

    state = scrollbarTabsReducer(state, setTab(secondTab));
    expect(state).toBe(secondTab);
  });

  it('должен не изменять состояние, если вкладка такая же, как текущая', () => {
    const sameTab = 'buns';

    const state = scrollbarTabsReducer(initialState, setTab(sameTab));
    expect(state).toBe(sameTab);
  });
});
