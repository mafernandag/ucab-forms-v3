import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";

import React from "react";
import ReactDOM from "react-dom";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import esLocale from "date-fns/locale/es";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import ScrollToTop from "./components/ScrollToTop";
import { ColorModeProvider } from "./hooks/useColorMode";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <ColorModeProvider>
      <CssBaseline enableColorScheme />
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
        <SnackbarProvider>
          <BrowserRouter>
            <ScrollToTop />
            <App />
          </BrowserRouter>
        </SnackbarProvider>
      </LocalizationProvider>
    </ColorModeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
