import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { socketMiddleware } from "./socketMiddleware";
import { wsActions } from "../actions/WsActions";

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(socketMiddleware('wss://norma.nomoreparties.space', wsActions)),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch