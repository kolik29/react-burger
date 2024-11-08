import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";
import { IIngredient } from "../types/Ingredient";

export const setIngredients = createAction<IIngredient[]>('ingredients/get');

const initialState: IIngredient[] = [];

export const ingredientsReducer = createReducer<IIngredient[]>(
  initialState,
  (builder) => {
    builder
      .addCase(setIngredients, (state: IIngredient[], action: PayloadAction<IIngredient[]>): IIngredient[] => {
        return action.payload;
      })
  }
);
