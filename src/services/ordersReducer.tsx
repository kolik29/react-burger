import { createAction, createAsyncThunk, createReducer, PayloadAction } from '@reduxjs/toolkit';
import { request } from '../utils/request';
import { Order, OrdersState } from '../types/Order';
import { WS_ON_MESSAGE } from '../actions/WsActions';

export const initialState: OrdersState = {
  all: {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null,
  },
  user: {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null,
  }
};

export const fetchOrderByNumber = createAsyncThunk<
  Order,
  { number: number; key: string },
  { rejectValue: string }
>(
  'orders/fetchOrderByNumber',
  async (number, thunkAPI) => {
    try {
      const response = await request<{ order: Order }>(`/api/orders/${number}`, {
        method: 'GET',
      });
      return response.order;
    } catch (error) {
      return thunkAPI.rejectWithValue('Не удалось загрузить заказ');
    }
  }
);

export const setOrders = createAction<{ orders: Order[]; total: number; totalToday: number; key: string }>('orders/setOrders');

const ordersReducer = createReducer<OrdersState>(initialState, (builder) => {
  builder
    .addCase(setOrders, (state, action: PayloadAction<{ orders: Order[]; total: number; totalToday: number; key: string }>) => {
      const { orders, total, totalToday, key } = action.payload;
      
      if (!state[key]) {
        state[key] = { orders: [], total: 0, totalToday: 0, loading: false, error: null };
      }

      state[key].orders = orders;
      state[key].total = total;
      state[key].totalToday = totalToday;
      state[key].loading = false;
      state[key].error = null;
    })
    .addCase(
      WS_ON_MESSAGE,
      (state, action: PayloadAction<{ orders: Order[]; total: number; totalToday: number; key: string }>) => {
        const { orders, total, totalToday, key } = action.payload;

        if (!state[key]) {
          state[key] = { orders: [], total: 0, totalToday: 0, loading: false, error: null };
        }

        state[key].orders = orders;
        state[key].total = total;
        state[key].totalToday = totalToday;
        state[key].loading = false;
        state[key].error = null;
      }
    )
    .addCase(fetchOrderByNumber.pending, (state, action) => {
      const key = action.meta.arg.key;

      if (!state[key]) {
        state[key] = { orders: [], total: 0, totalToday: 0, loading: false, error: null };
      }

      state[key].loading = true;
      state[key].error = null;
    })
    .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
      const key = action.meta.arg.key;

      if (!state[key]) {
        state[key] = { orders: [], total: 0, totalToday: 0, loading: false, error: null };
      }

      state[key].orders.unshift(action.payload);
      state[key].total += 1;
      state[key].loading = false;
    })
    .addCase(fetchOrderByNumber.rejected, (state, action) => {
      const key = action.meta.arg.key;

      if (!state[key]) {
        state[key] = { orders: [], total: 0, totalToday: 0, loading: false, error: null };
      }

      state[key].loading = false;
      state[key].error = action.payload || 'Ошибка при загрузке заказа';
    });
});

export default ordersReducer;

export type { OrdersState, Order };

export const selectOrderByNumber = (
  orders: Order[],
  orderNumber: number
): Order | undefined => {
  if (!orders || orders.length === 0) {
    return undefined;
  }
  return orders.find((order) => {
    if (!order) {
      return undefined;
    }
    return order.number === orderNumber;
  });
};
