import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Типы для заказов (можете переиспользовать из своих types/Order.ts)
interface IUserOrder {
  _id: string;
  number: number;
  name: string;
  status: string;       // 'done' | 'pending' | 'created' и т.п.
  createdAt: string;
  ingredients: string[];
}

interface IUserOrdersState {
  orders: IUserOrder[];
}

const initialState: IUserOrdersState = {
  orders: [],
};

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Ловим экшен, который диспатчит наше socketMiddleware,
    // например 'WS_GET_USER_ORDERS' (название можете выбрать любое).
    builder.addCase('WS_GET_USER_ORDERS', (state, action: PayloadAction<any>) => {
      // Предположим, что в action.payload лежит объект вида:
      // { success: boolean, orders: IUserOrder[], ... }
      const data = action.payload;
      console.log(data)
      if (data.success) {
        state.orders = data.orders;
      }
    });
  },
});

export default userOrdersSlice.reducer;
