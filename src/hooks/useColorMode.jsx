import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useMediaQuery } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import getTheme from "../theme";

const ColorModeContext = createContext();

const useColorMode = () => {
  return useContext(ColorModeContext);
};

const ColorModeProvider = ({ children }) => {
  const prefersLightMode = useMediaQuery("(prefers-color-scheme: light)");

  const [colorMode, setColorMode] = useState(() => {
    const userColorMode = localStorage.getItem("colorMode");
    const isValidColorMode = ["light", "dark"].includes(userColorMode);

    if (isValidColorMode) {
      return userColorMode;
    }

    return prefersLightMode ? "light" : "dark";
  });

  const toggleColorMode = useCallback(() => {
    setColorMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("colorMode", newMode);
      return newMode;
    });
  }, []);

  const theme = useMemo(() => getTheme(colorMode), [colorMode]);

  const [formTheme, setFormTheme] = useState({
    main: theme.palette.primary.main,
  });

  return (
    <ColorModeContext.Provider
      value={{
        colorMode,
        toggleColorMode,
        formTheme,
        setFormTheme,
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export { useColorMode, ColorModeProvider };
