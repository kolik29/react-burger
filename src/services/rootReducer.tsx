import { combineReducers } from "redux";
import { burgerConstructorSlice } from "./burgerConstructorSlice";
import { orderSlice } from "./orderSlice";
import { currentIngredientSlice } from "./currentIngredientSlice";
import { ingredientsSlice } from "./ingredientsSlice";

export const rootReducer = combineReducers({
    ingredients: ingredientsSlice.reducer,
    currentIngredient: currentIngredientSlice.reducer,
    burgerConstructor: burgerConstructorSlice.reducer,
    order: orderSlice.reducer
})