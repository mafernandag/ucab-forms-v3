import { Box, Container, Drawer, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useForm } from "../../hooks/useForm";
import EditQuestion from "./questions/EditQuestion";
import EditSection from "./questions/EditSection";

const drawerWidth = 350;

const DrawerLayout = ({ open, setOpen, children }) => {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));
  const { currentQuestionId, isSectionSelected } = useForm();

  return (
    <Box sx={{ display: "flex" }}>
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
          {currentQuestionId && <EditQuestion setOpenDrawer={setOpen} />}
          {isSectionSelected && <EditSection setOpenDrawer={setOpen} />}
        </Box>
      </Drawer>
      <Container sx={{ p: 3, overflowX: "hidden" }} maxWidth="md">
        {children}
      </Container>
    </Box>
  );
};

export default DrawerLayout;
