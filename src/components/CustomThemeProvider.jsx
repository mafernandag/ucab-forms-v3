import { useCallback, useMemo } from "react";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import colors from "../theme/colors";
import fonts from "../theme/fonts";
import { GlobalStyles } from "@mui/material";

const CustomThemeProvider = ({ form: rawForm, children }) => {
  const theme = useTheme();

  const form = useMemo(
    () => ({
      fontIndex: 0,
      headerColorIndex: 0,
      mainColorIndex: 0,
      backgroundColorIndex: 0,
      ...rawForm,
    }),
    [rawForm]
  );

  const getTheme = useCallback(
    (theme) => {
      const mode = theme.palette.mode;
      const themedColors = colors[mode];

      return createTheme({
        ...theme,
        typography: {
          fontFamily: fonts[form.fontIndex],
        },
        palette: {
          mode,
          primary: {
            main: themedColors.main[form.mainColorIndex],
            ...(mode === "light" && {
              contrastText: "#fff",
            }),
          },
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              colorPrimary: {
                backgroundColor:
                  mode === "light"
                    ? themedColors.header[form.headerColorIndex]
                    : "#121212",
              },
            },
          },
        },
      });
    },
    [form]
  );

  const backgroundOverride = useMemo(() => {
    const themedColors = colors["light"];

    const backgroundColors = themedColors.background.map(
      (color) => themedColors.main[form.mainColorIndex] + color
    );

    return (
      <GlobalStyles
        styles={{
          body: {
            backgroundColor:
              theme.palette.mode === "light"
                ? backgroundColors[form.backgroundColorIndex]
                : "#0a0a0a",
          },
        }}
      />
    );
  }, [form.backgroundColorIndex, form.mainColorIndex, theme.palette.mode]);

  return (
    <ThemeProvider theme={getTheme}>
      {backgroundOverride}
      {children}
    </ThemeProvider>
  );
};

export default CustomThemeProvider;
