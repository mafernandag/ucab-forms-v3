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
import { useParams } from "react-router-dom";
import { useReport } from "../../hooks/useReport";

const FormReportHeader = ({ setOpenDrawer }) => {
  const theme = useTheme();
  const { reportId } = useParams();
  const { loading } = useReport();
  const toggleDrawer = () => {
    setOpenDrawer((openDrawer) => !openDrawer);
  };

  return (
    <>
      <Header
        leftIcons={
          reportId ? null : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          )
        }
      />
    </>
  );
};

export default FormReportHeader;
