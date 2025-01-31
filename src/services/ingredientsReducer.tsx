import { createAction, createAsyncThunk, createReducer, PayloadAction } from "@reduxjs/toolkit";
import { IIngredient } from "../types/Ingredient";
import { request } from "../utils/request";

export const setIngredients = createAction<IIngredient[]>('ingredients/get');

export const initialState: IIngredient[] = [];

export const ingredientsReducer = createReducer<IIngredient[]>(
  initialState,
  (builder) => {
    builder
      .addCase(setIngredients, (_state: IIngredient[], action: PayloadAction<IIngredient[]>): IIngredient[] => {
        return action.payload;
      })
  }
);

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data = await request<{ data: IIngredient[] }>('/api/ingredients');
      dispatch(setIngredients(data.data));
    } catch (error) {
      console.error('Ошибка при загрузке ингредиентов:', error);
      return rejectWithValue('Не удалось загрузить ингредиенты');
    }
  }
);