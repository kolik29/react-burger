import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";
import { IIngredient } from "../types/Ingredient";

export const setSelectedIngredients = createAction<IIngredient>('burgerConstructor/setSelectedIngredients');

const initialState: IIngredient[] = [];

export const burgerConstructorReducer = createReducer<IIngredient[]>(
  initialState,
  (builder) => {
    builder
      .addCase(setSelectedIngredients, (state: IIngredient[], action: PayloadAction<IIngredient>): IIngredient[] => {
        if (action.payload.type === 'bun') {
          return [
            ...state.filter((ingredient: IIngredient) => ingredient.type !== 'bun'),
            action.payload
          ]
        }

        return [...state, action.payload];
      })
  }
)