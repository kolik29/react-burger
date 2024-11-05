import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIngredient } from "../types/Ingredient";

const initialState: IIngredient[] = [];

export const ingredientsSlice = createSlice({
    name: "ingredients",
    initialState,
    reducers: {
        setIngredients(state, action: PayloadAction<IIngredient[]>) {
            return action.payload;
        },
    },
});