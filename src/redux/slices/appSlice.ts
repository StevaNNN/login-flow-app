import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface APP_STATE {
  dialogOpened: boolean;
  editMode: boolean;
  darkMode: boolean;
  confirmDialogOpened: boolean;
  snackBar: {
    message: string;
    autoHideDuration?: number;
    anchorOrigin?: {
      vertical: "top" | "bottom";
      horizontal: "left" | "center" | "right";
    };
    open?: boolean;
  };
}

const initialState: APP_STATE = {
  dialogOpened: false,
  editMode: false,
  confirmDialogOpened: false,
  snackBar: {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
    autoHideDuration: 3000,
    message: "",
    open: false,
  },
  darkMode: JSON.parse(localStorage.getItem("darkMode") || "false"),
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
    setConfirmationDialogState: (
      state,
      action: PayloadAction<APP_STATE["confirmDialogOpened"]>
    ) => {
      state.confirmDialogOpened = action.payload;
    },
    setEditMode: (state, action: PayloadAction<APP_STATE["editMode"]>) => {
      state.editMode = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<APP_STATE["darkMode"]>) => {
      localStorage.setItem("darkMode", JSON.stringify(action.payload));
      state.darkMode = action.payload;
    },
    setSnackBar: (state, action: PayloadAction<APP_STATE["snackBar"]>) => {
      state.snackBar = {
        ...state.snackBar,
        ...action.payload,
        open: !!action.payload.message,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setDialogState,
  setEditMode,
  setDarkMode,
  setConfirmationDialogState,
  setSnackBar,
} = appSlice.actions;

export default appSlice.reducer;
