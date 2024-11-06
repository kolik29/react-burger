import { createAction, createReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const setOrder = createAction<string>('order/setOrder');

const initialState: string = '';

export const orderReducer = createReducer<string>(
  initialState,
  (builder) => {
    builder
      .addCase(setOrder, (state: string, action: PayloadAction<string>): string => {
        return action.payload;
      })
  }
)