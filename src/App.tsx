import { RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { router } from "./Routes";
import { RootState } from "./redux/store";
import CustomSnackBar from "./components/CustomSnackBar";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useEffect } from "react";
import { getMatches, getSeasons, getUsers } from "./api";
import { setUsers } from "./redux/slices/usersSlice";
import { setSeasons } from "./redux/slices/seasonsSlice";
import { MATCH_TYPE, SEASON, USER } from "./Types";
import { useQuery } from "@tanstack/react-query";

const getInitData = async (): Promise<{
  usersData: USER[];
  seasonsData: SEASON[];
  matchesData: MATCH_TYPE[];
}> => {
  const { data: usersData, status: userReqStatus } = await getUsers();
  const { data: seasonsData, status: seasonReqStatus } = await getSeasons();
  const { data: matchesData, status: matchesReqStatus } = await getMatches();

  if (
    userReqStatus !== 200 &&
    seasonReqStatus !== 200 &&
    matchesReqStatus !== 200
  ) {
    throw new Error("Failed to init data");
  }

  return {
    usersData,
    seasonsData,
    matchesData,
  };
};

const App = () => {
  const { darkMode } = useSelector((state: RootState) => state.appState);
  const dispatch = useDispatch();
  const { data: initaData } = useQuery<{
    usersData: USER[];
    seasonsData: SEASON[];
  }>({
    queryKey: ["initData"],
    queryFn: getInitData,
  });

  /**
   * Initial data fetch and send to store
   */
  useEffect(() => {
    if (initaData) {
      dispatch(setUsers(initaData.usersData));
      dispatch(setSeasons(initaData.seasonsData));
    }
  }, [dispatch, initaData]);

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
