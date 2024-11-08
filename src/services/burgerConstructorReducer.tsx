import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";
import { IIngredient } from "../types/Ingredient";

export const setSelectedIngredients = createAction<IIngredient>('burgerConstructor/setSelectedIngredients');
export const removeSelectedIngredients = createAction<number>('burgerConstructor/removeSelectedIngredients');
export const reorderSelectedIngredients = createAction<IIngredient[]>('burgerConstructor/reorderSelectedIngredients'); // Новое действие для обновления порядка

const initialState: IIngredient[] = [];

export const burgerConstructorReducer = createReducer<IIngredient[]>(initialState, (builder) => {
  builder
    .addCase(setSelectedIngredients, (state: IIngredient[], action: PayloadAction<IIngredient>): IIngredient[] => {
      if (typeof action.payload._id === 'string') {
        if (action.payload.type === 'bun') {
          return [
            ...state.filter((ingredient: IIngredient) => ingredient.type !== 'bun'),
            action.payload
          ];
        }
  
        return [...state, action.payload];        
      } else {
        return state;
      }
    })
    .addCase(removeSelectedIngredients, (state: IIngredient[], action: PayloadAction<number>) => {
      return state.filter((ingredient: IIngredient, index: number) => {
        return index !== action.payload || ingredient.type === 'bun';
      });
    })
    .addCase(reorderSelectedIngredients, (state: IIngredient[], action: PayloadAction<IIngredient[]>) => {
      const currentBuns = state.filter((ingredient: IIngredient) => ingredient.type === 'bun');
      const currentIngredients = action.payload.filter((ingredient: IIngredient) => ingredient.type !== 'bun');

      return [
        ...currentBuns,
        ...currentIngredients
      ];
    });
});
