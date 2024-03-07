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
  const { cleanedData, modelProcessed } = useReport();
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));
  //const [testAccuracy, setTestAccuracy] = useState(null);

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
      <Container
        sx={{ py: 3, width: "100%", overflowX: "hidden" }}
        maxWidth="xl"
      >
        {children}
      </Container>
    </Box>
  );
};

export default DrawerLayout;
