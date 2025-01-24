import { describe, it, expect } from 'vitest';
import ordersReducer, {
    initialState,
    setOrders,
    fetchOrderByNumber,
  } from './ordersReducer';
import { Order } from '../types/Order';

describe('ordersReducer', () => {
  it('должен возвращать initial state', () => {
    const state = ordersReducer(undefined, { type: undefined });
    expect(state).toEqual(initialState);
  });

  it('должен обновлять заказы с помощью setOrders', () => {
    const orders: Order[] = [
      {
        _id: '1',
        number: 123,
        name: 'Order 123',
        status: 'done',
        ingredients: ['ingredient1', 'ingredient2'],
        createdAt: '2025-01-01T12:00:00Z',
      },
    ];

    const action = setOrders({
      orders,
      total: 1,
      totalToday: 1,
      key: 'all',
    });

    const state = ordersReducer(initialState, action);

    expect(state.all.orders).toEqual(orders);
    expect(state.all.total).toBe(1);
    expect(state.all.totalToday).toBe(1);
    expect(state.all.loading).toBe(false);
    expect(state.all.error).toBeNull();
  });

  it('должен обрабатывать pending состояние fetchOrderByNumber', () => {
    const action = fetchOrderByNumber.pending('', { number: 123, key: 'user' });

    const state = ordersReducer(initialState, action);

    expect(state.user.loading).toBe(true);
    expect(state.user.error).toBeNull();
  });

  it('должен обрабатывать fulfilled состояние fetchOrderByNumber', () => {
    const order: Order = {
      _id: '1',
      number: 123,
      name: 'Order 123',
      status: 'done',
      ingredients: ['ingredient1', 'ingredient2'],
      createdAt: '2025-01-01T12:00:00Z',
    };

    const action = fetchOrderByNumber.fulfilled(order, '', { number: 123, key: 'user' });

    const state = ordersReducer(initialState, action);

    expect(state.user.orders[0]).toEqual(order);
    expect(state.user.total).toBe(1);
    expect(state.user.loading).toBe(false);
  });

  it('должен обрабатывать rejected состояние fetchOrderByNumber', () => {
    const action = fetchOrderByNumber.rejected(
      { message: 'Ошибка при загрузке заказа' },
      '',
      { number: 123, key: 'user' }
    );

    const state = ordersReducer(initialState, action);

    expect(state.user.loading).toBe(false);
    expect(state.user.error).toBe('Ошибка при загрузке заказа');
  });
});
