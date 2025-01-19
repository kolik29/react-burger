import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { socketMiddleware } from "./socketMiddleware";

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(socketMiddleware()),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch