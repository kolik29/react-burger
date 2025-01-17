// src/services/ordersSlice.ts (пример)

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { request } from '../utils/request';

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: string) => {
    // Пример GET-запроса
    // Ответ у norma.nomoreparties.space для /api/orders/:number
    const response: any = await request(`/api/orders/${number}`);
    if (!response.success) {
      throw new Error('Не удалось загрузить заказ');
    }
    // Возвращаем объект "order" (обычно там в ответе orders: [...])
    return response.orders[0];
  }
);

interface IOrder {
  _id: string;
  number: number;
  name: string;
  status: string;
  createdAt: string;
  ingredients: string[];
}

interface IOrdersState {
  orders: IOrder[];
  isLoading: boolean;
  error: boolean;
}

const initialState: IOrdersState = {
  orders: [],
  isLoading: false,
  error: false,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Пример ваших ручных reducers
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action: PayloadAction<IOrder>) => {
        state.isLoading = false;
        const fetchedOrder = action.payload;
        // Если у нас нет такого заказа, добавим в массив (или можем перезаписывать).
        // Или можно не класть его в `orders`, если это "список".
        const existing = state.orders.find(o => o._id === fetchedOrder._id);
        if (!existing) {
          state.orders.push(fetchedOrder);
        }
      })
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      });
  },
});

export default ordersSlice.reducer;
