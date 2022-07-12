import { ThemeProvider, createTheme } from "@mui/material/styles";

const CustomThemeProvider = ({ children, formTheme }) => {
  return (
    <ThemeProvider
      theme={(theme) =>
        createTheme({
          ...theme,
          palette: {
            ...theme.palette,
            primary: {
              main: formTheme.main
                ? formTheme.main
                : theme.palette.primary.main,
              light: formTheme.light,
              dark: formTheme.dark,
            },
          },
        })
      }
    >
      {children}
    </ThemeProvider>
  );
};

export default CustomThemeProvider;
