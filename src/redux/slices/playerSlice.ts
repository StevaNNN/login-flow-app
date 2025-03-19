import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SEASON, USER } from "../../Types";

export interface USER_STATE {
  seasons: SEASON[];
  userData: USER;
}

export const initialState: USER_STATE = {
  seasons: [],
  userData: {
    role: "player",
    _id: "",
  },
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setSeasonsUserPlayed: (
      state,
      action: PayloadAction<USER_STATE["seasons"]>
    ) => {
      state.seasons = action.payload;
    },
    setUserData: (state, action: PayloadAction<USER_STATE["userData"]>) => {
      state.userData = action.payload;
    },
    setUserFullName: (state, action: PayloadAction<string>) => {
      state.userData.fullName = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userData.userName = action.payload;
    },
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.userData.email = action.payload;
    },
  },
});

export const {
  setSeasonsUserPlayed,
  setUserData,
  setUserFullName,
  setUserName,
  setUserEmail,
} = playerSlice.actions;

export default playerSlice.reducer;
