import React, { useEffect } from "react";
import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setSnackBar } from "../redux/slices/appSlice";

const CustomSnackBar: React.FC<SnackbarProps> = () => {
  const dispatch = useDispatch();
  const { autoHideDuration, message, ...rest } = useSelector(
    (state: RootState) => state.appState.snackBar
  );

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(setSnackBar({ message: "" }));
      }, autoHideDuration);
    }
  }, [dispatch, autoHideDuration, message]);
  return (
    <Snackbar autoHideDuration={autoHideDuration} message={message} {...rest} />
  );
};

export default CustomSnackBar;
