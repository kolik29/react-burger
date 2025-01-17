import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrdersState } from '../types/Order';

const initialState: OrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<{ orders: Order[]; total: number; totalToday: number }>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
  },
});

export const { setOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
