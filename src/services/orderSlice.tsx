import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrder } from "../types/Order";

const initialState: IOrder[] = [];

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setOrder(state, action: PayloadAction<IOrder[]>) {
            return action.payload;
        },
        clearOrder(state) {
            return initialState;
        },
    }
});