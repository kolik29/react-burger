import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIngredient } from "../types/Ingredient";

const initialState: IIngredient[] = [];

export const currentIngredientSlice = createSlice({
    name: "currentIngredient",
    initialState,
    reducers: {
        setCurrentIngredient(state, action: PayloadAction<IIngredient[]>) {
            return action.payload;
        },
    },
});