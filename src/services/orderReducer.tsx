import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";

export const setOrder = createAction<string>('order/setOrder');

export const initialState: string = '';

export const orderReducer = createReducer<string>(
  initialState,
  (builder) => {
    builder
      .addCase(setOrder, (state: string, action: PayloadAction<string>): string => {
        return action.payload;
      })
  }
)