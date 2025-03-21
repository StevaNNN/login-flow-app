import { RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { router } from "./Routes";
import { RootState } from "./redux/store";
import CustomSnackBar from "./components/CustomSnackBar";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useEffect } from "react";
import { getSeasons, getUsers } from "./api";
import { setUsers } from "./redux/slices/usersSlice";
import { setSeasons } from "./redux/slices/seasonsSlice";

const App = () => {
  const { darkMode } = useSelector((state: RootState) => state.appState);
  const dispatch = useDispatch();

  /**
   * Initial data fetch and send to store
   */
  useEffect(() => {
    const initData = async () => {
      try {
        const userResponse = await getUsers();
        const seasonResponse = await getSeasons();
        dispatch(setUsers(userResponse.data));
        dispatch(setSeasons(seasonResponse.data));
      } catch (err) {
        console.error(err);
      }
    };
    initData();
  }, [dispatch]);

  /**
   * Configuring MUI theme
   */
  const theme = createTheme({
    shape: {
      borderRadius: 12,
    },
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    components: {
      MuiDialogTitle: {
        styleOverrides: {
          root: ({ theme }) => ({
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            paddingRight: theme.spacing(3),
            paddingLeft: theme.spacing(3),
          }),
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: ({ theme }) => ({
            gap: theme.spacing(3),
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            paddingRight: theme.spacing(3),
            paddingLeft: theme.spacing(3),
            "& > :not(style) ~ :not(style)": {
              marginLeft: 0,
            },
          }),
        },
      },
      MuiDialogContent: {
        defaultProps: {
          dividers: true,
          sx: { display: "flex", flexDirection: "column", gap: 2 },
        },
      },
      MuiTextField: {
        defaultProps: {
          slotProps: {
            inputLabel: {
              shrink: true,
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <CustomSnackBar />
    </ThemeProvider>
  );
};

export default App;
