import { ThemeProvider, createTheme } from "@mui/material/styles";
import colors from "../theme/colors";

const CustomThemeProvider = ({ children, formTheme }) => {
  return (
    <ThemeProvider
      theme={(theme) =>
        createTheme({
          ...theme,
          palette: {
            ...theme.palette,
            primary: {
              main: colors.main[formTheme.main],
              light: colors.light[formTheme.main][formTheme.background],
              dark: colors.dark[formTheme.main][formTheme.background],
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
