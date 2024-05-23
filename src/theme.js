import { createTheme } from "@mui/material/styles";

const commonSettings = {
  shadows: ["none"],
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 400,
    },
  },
};

export const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'light',
    primary: {
      main: "#4361ee",
    },
    background: {
      default: "#F5F5F5",
    },
    text: {
      primary: "#000000", 
    },
  },
});

export const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: "#4361ee",
    },
    background: {
      default: "#333333",
    },
    text: {
      primary: "#ffffff", 
    },
  },
});