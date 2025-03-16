import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import seasonsReducer from "./slices/seasonsSlice";
import appReducer from "./slices/appSlice";

export const store = configureStore({
  reducer: {
    appState: appReducer,
    users: usersReducer,
    seasons: seasonsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
