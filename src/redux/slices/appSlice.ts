import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface APP_STATE {
  dialogOpened: boolean;
  editMode: boolean;
  darkMode: boolean;
}

const initialState: APP_STATE = {
  dialogOpened: false,
  editMode: false,
  darkMode: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setDialogState: (
      state,
      action: PayloadAction<APP_STATE["dialogOpened"]>
    ) => {
      state.dialogOpened = action.payload;
    },
    setEditMode: (state, action: PayloadAction<APP_STATE["editMode"]>) => {
      state.editMode = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<APP_STATE["darkMode"]>) => {
      state.darkMode = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDialogState, setEditMode, setDarkMode } = appSlice.actions;

export default appSlice.reducer;
