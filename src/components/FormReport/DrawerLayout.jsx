import { Box, Container, Drawer, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useForm } from "../../hooks/useForm";
import SelectModel from "./Sidebar/SelectModel";
import CleanDataDescription from "./Sidebar/CleanDataDescription";
import { useContext, useState, useEffect } from "react";
import { ReportContext } from "../../pages/PrepareData";
import ModelResults from "./Sidebar/ModelResults";

const drawerWidth = 550;

const DrawerLayout = ({ open, setOpen, children }) => {
  const { cleanedData, modelProcessed } = useContext(ReportContext);
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));
  const [testAccuracy, setTestAccuracy] = useState(null);

  return (
    <Box sx={{ display: "flex" }}>
      {cleanedData == null && (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant={upMd ? "permanent" : "temporary"}
          open={upMd ? true : open}
          onClose={() => setOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto", p: 2 }}>
            {cleanedData == null && <CleanDataDescription />}
            {/*  {cleanedData != null && (
            <SelectModel setTestAccuracy={setTestAccuracy} />
          )} */}
            {/* {modelProcessed && (
            <ModelResults
              testAccuracy={testAccuracy}
              setTestAccuracy={setTestAccuracy}
            />
          )} */}
          </Box>
        </Drawer>
      )}
      <Container sx={{ p: 3, overflowX: "hidden" }} maxWidth="md">
        {children}
      </Container>
    </Box>
  );
};

export default DrawerLayout;
