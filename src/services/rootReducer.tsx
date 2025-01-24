import { combineReducers } from "redux";
import { burgerConstructorReducer } from "./burgerConstructorReducer";
import { orderReducer } from "./orderReducer";
import { currentIngredientReducer } from "./currentIngredientReducer";
import { ingredientsReducer } from "./ingredientsReducer";
import { scrollbarTabsReducer } from "./scrollbarTabsReducer";
import authReducer from "./authReducer";
import ordersReducer from "./ordersReducer";

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  currentIngredient: currentIngredientReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  scrollbarTab: scrollbarTabsReducer,
  auth: authReducer,
  orders: ordersReducer,
})