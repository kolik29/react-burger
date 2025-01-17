import { combineReducers } from "redux";
import { burgerConstructorReducer } from "./burgerConstructorReducer";
import { orderReducer } from "./orderReducer";
import { currentIngredientReducer } from "./currentIngredientReducer";
import { ingredientsReducer } from "./ingredientsReducer";
import { scrollbarTabsReducer } from "./scrollbarTabsReduces";
import authReducer from "./authReducer";
import { socketMiddleware } from "./socketMddleware";
import ordersReducer from './ordersReducer';
import userOrdersReducer from './userOrdersReducer';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  currentIngredient: currentIngredientReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  scrollbarTab: scrollbarTabsReducer,
  auth: authReducer,
  socketMiddleware: socketMiddleware,
  orders: ordersReducer,
  userOrders: userOrdersReducer
})