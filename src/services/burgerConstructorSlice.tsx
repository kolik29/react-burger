import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIngredient } from "../types/Ingredient";

const initialState: IIngredient[] = [];

export const burgerConstructorSlice = createSlice({
    name: "burgerConstructor",
    initialState,
    reducers: {
        addIngredient(state, action: PayloadAction<IIngredient[]>) {
            return action.payload;
        },
        removeIngredient(state) {
            return initialState;
        },
    },
});