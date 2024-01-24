import { useState } from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  useMediaQuery,
  LinearProgress,
} from "@mui/material";
import {
  ContentCopy,
  Delete as DeleteIcon,
  Menu as MenuIcon,
  MoreVert,
  PaletteRounded as PaletteIcon,
  People as PeopleIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Header from "../Header";

const FormReportHeader = ({ setOpenDrawer }) => {
  const theme = useTheme();
  const toggleDrawer = () => {
    setOpenDrawer((openDrawer) => !openDrawer);
  };

  return (
    <>
      <Header
        leftIcons={
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        }
      />
      {/* {loadingData && <LinearProgress sx={{ zIndex: 9999 }} />} */}
    </>
  );
};

export default FormReportHeader;
