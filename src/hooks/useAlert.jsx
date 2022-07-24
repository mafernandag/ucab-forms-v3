import { createContext, useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const AlertContext = createContext();

const useAlert = () => {
  return useContext(AlertContext);
};

const AlertProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [fullWidth, setFullWidth] = useState(true);
  const [action, setAction] = useState();

  const openAlert = ({ title, message, action, fullWidth }) => {
    setOpen(true);
    setTitle(title);
    setMessage(message);
    setFullWidth(fullWidth ?? true);
    setAction(() => action);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    action();
    setOpen(false);
  };

  return (
    <AlertContext.Provider value={openAlert}>
      {children}
      <Dialog
        open={open}
        keepMounted={false}
        fullWidth={fullWidth}
        maxWidth="sm"
        onClose={handleClose}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleClick}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </AlertContext.Provider>
  );
};

export { useAlert, AlertProvider };
