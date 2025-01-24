import { describe, it, expect } from 'vitest';
import { initialState, orderReducer, setOrder } from './orderReducer';

describe('orderReducer', () => {
  it('должен возвращать initalState', () => {
    const state = orderReducer(undefined, { type: undefined });
    expect(state).toBe(initialState);
  });

  it('должен обрабатывать действие setOrder и обновлять состояние', () => {
    const payload = '123456';
    const action = setOrder(payload);
    const state = orderReducer(initialState, action);
    expect(state).toBe(payload);
  });

  it('должен корректно обрабатывать несколько последовательных действий setOrder', () => {
    const firstPayload = '123456';
    const secondPayload = '654321';

    let state = orderReducer(undefined, { type: undefined });
    expect(state).toBe(initialState);

    state = orderReducer(state, setOrder(firstPayload));
    expect(state).toBe(firstPayload);

    state = orderReducer(state, setOrder(secondPayload));
    expect(state).toBe(secondPayload);
  });
});
