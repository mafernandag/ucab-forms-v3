import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const CustomThemeProvider = ({ children, formTheme }) => {
  return useMemo(
    () => (
      <ThemeProvider
        theme={(theme) =>
          createTheme({
            ...theme,
            palette: {
              ...theme.palette,
              primary: {
                main: formTheme.primary
                  ? formTheme.primary
                  : theme.palette.primary.main,
                light: formTheme.background,
              },
            },
          })
        }
      >
        {children}
      </ThemeProvider>
    ),
    [children, formTheme]
  );
};

export default CustomThemeProvider;
