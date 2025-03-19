import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import seasonsReducer from "./slices/seasonsSlice";
import playerReducer from "./slices/playerSlice";
import appReducer from "./slices/appSlice";

export const store = configureStore({
  reducer: {
    appState: appReducer,
    users: usersReducer,
    seasons: seasonsReducer,
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
