import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { socketMiddleware } from "./socketMddleware";

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // полностью выключаем проверки
    }).concat(
      socketMiddleware('/orders/all')
    ),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
