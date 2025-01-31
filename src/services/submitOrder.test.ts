import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { orderReducer } from './orderReducer';
import { submitOrder } from './submitOrder';

const setupStore = () =>
  configureStore({
    reducer: {
      order: orderReducer,
    },
  });

describe('submitOrder', () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    store = setupStore();
  });

  it('должен успешно создать заказ', async () => {
    const ingredientIds = ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'];
    const accessToken = 'access-token-123';

    const result = await store.dispatch(submitOrder({ ingredientIds, accessToken })).unwrap();

    expect(result).toBe('987654');

    const state = store.getState().order;
    expect(state).toBe('987654');
  });
});
