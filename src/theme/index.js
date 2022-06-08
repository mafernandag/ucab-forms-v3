import { createTheme } from "@mui/material/styles";

const getTheme = (mode) => {
  return createTheme({
    typography: {
      fontFamily: "Poppins",
    },
    components: {
      ...(mode === "light"
        ? {
            MuiAppBar: {
              styleOverrides: {
                colorPrimary: {
                  backgroundColor: "#042F3E",
                },
              },
            },
            MuiCssBaseline: {
              styleOverrides: {
                body: {
                  backgroundColor: "#fffafa",
                },
              },
            },
          }
        : {
            MuiCssBaseline: {
              styleOverrides: {
                body: {
                  backgroundColor: "#0a0a0a",
                },
              },
            },
          }),
    },
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              main: "#13B5EA",
              contrastText: "#fff",
            },
          }
        : {
            primary: {
              main: "#6bc4eb",
            },
          }),
    },
  });
};

export default getTheme;
