import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";
import { IIngredient } from "../types/Ingredient";

export const setCurrentIngredient = createAction<IIngredient>('currentIngredient/setCurrentIngredient');
export const resetCurrentIngredient = createAction('currentIngredient/resetCurrentIngredient');

export const initialState: IIngredient | null = null;

export const currentIngredientReducer = createReducer<IIngredient | null>(
  initialState,
  (builder) => {
    builder
      .addCase(setCurrentIngredient, (state: IIngredient | null, action: PayloadAction<IIngredient>): IIngredient => {
        return action.payload;
      })
      .addCase(resetCurrentIngredient, (): null => {
        return null;
      })
  }
)