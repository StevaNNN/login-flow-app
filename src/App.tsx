import { RouterProvider } from "react-router-dom";
import { router } from "./Routes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import { CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

const App = () => {
  const { darkMode, snackBar } = useSelector(
    (state: RootState) => state.appState
  );

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
    },
  });

  console.log(snackBar);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <Snackbar {...snackBar} />
    </ThemeProvider>
  );
};

export default App;
