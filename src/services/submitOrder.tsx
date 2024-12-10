import { createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '../utils/request';
import { OrderResponse } from '../types/Order';
import { setOrder } from './orderReducer';

export const submitOrder = createAsyncThunk<
  string,
  { ingredientIds: string[]; accessToken: string },
  { rejectValue: string }
>(
  'order/submitOrder',
  async ({ ingredientIds, accessToken }, { dispatch, rejectWithValue }) => {
    try {
      const result = await request<OrderResponse>('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
        body: JSON.stringify({ ingredients: ingredientIds }),
      });

      dispatch(setOrder(result.order.number));
      return result.order.number;
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      return rejectWithValue('Ошибка при создании заказа');
    }
  }
);
