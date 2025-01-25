import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";

export const setTab = createAction<string>('scrollbarTabs/setTab');

export const initialState: string = 'buns';

export const scrollbarTabsReducer = createReducer<string>(
  initialState,
  (builder) => {
    builder
    .addCase(setTab, (_state: string, action: PayloadAction<string>): string => {
      return action.payload;
    })
  }
)