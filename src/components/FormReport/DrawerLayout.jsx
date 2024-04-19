import { Box, Container, Drawer, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useForm } from "../../hooks/useForm";
import SelectModel from "./Results/SelectModel";
import CleanDataDescription from "./Sidebar/CleanDataDescription";
import { useContext, useState, useEffect } from "react";
import { ReportContext } from "../../pages/PrepareData";
import ModelResults from "./Results/ModelResults";
import { useReport } from "../../hooks/useReport";

const drawerWidth = 490;

const DrawerLayout = ({ open, setOpen, children }) => {
  const { cleanedData } = useReport();
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box sx={{ display: "flex" }}>
      {cleanedData == null && (
        <Drawer
          sx={{
            width: open ? drawerWidth : 0,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant={upMd ? "persistent" : "temporary"}
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto", p: 2 }}>
            {cleanedData == null && <CleanDataDescription />}
          </Box>
        </Drawer>
      )}
      <Container
        sx={{
          py: 3,
          width: "100%",
          overflowX: "hidden",
          flex: 1,
          transition: "flex 0.3s ease-in-out",
        }}
        maxWidth="xl"
        open={open}
      >
        {children}
      </Container>
    </Box>
  );
};

export default DrawerLayout;
