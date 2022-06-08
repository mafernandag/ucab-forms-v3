import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Toolbar,
  Tooltip,
} from "@mui/material";
import {
  AccountCircle,
  Brightness4 as LightIcon,
  Brightness7 as DarkIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useColorMode } from "../hooks/useColorMode";
import { signOut } from "../api/auth";
import HeaderLogo from "./HeaderLogo";
import Notifications from "./Notifications";

const Header = ({ leftIcons, rightIcons, moreMenu }) => {
  const user = useUser();
  const theme = useTheme();
  const { colorMode, toggleColorMode } = useColorMode();

  const popupStateUser = usePopupState({
    variant: "popover",
    popupId: "user-menu",
  });

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {leftIcons}
            <HeaderLogo
              sx={{
                position: { sm: "absolute" },
                top: { sm: "50%" },
                left: { sm: "50%" },
                transform: { sm: "translate(-50%, -50%)" },
              }}
            />
          </Box>
          <Box>
            {rightIcons}
            {user ? (
              <>
                <Notifications />
                <Tooltip title="Usuario" arrow>
                  <IconButton
                    size="large"
                    color="inherit"
                    edge="end"
                    {...bindTrigger(popupStateUser)}
                  >
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
                <Menu {...bindMenu(popupStateUser)}>
                  <MenuItem onClick={popupStateUser.close}>
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    {user.name}
                  </MenuItem>
                  <MenuItem onClick={toggleColorMode}>
                    <ListItemIcon>
                      {colorMode === "light" ? (
                        <LightIcon fontSize="small" />
                      ) : (
                        <DarkIcon fontSize="small" />
                      )}
                    </ListItemIcon>
                    {colorMode === "light" ? "Modo oscuro" : "Modo claro"}
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={signOut}
                    sx={{ color: (theme) => theme.palette.error.main }}
                  >
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Cerrar sesión
                  </MenuItem>
                </Menu>
                {moreMenu}
              </>
            ) : (
              <>
                <Button
                  size="small"
                  variant="contained"
                  component={Link}
                  to="/login"
                  sx={{ mr: 1 }}
                >
                  Ingresar
                </Button>
                <Tooltip
                  arrow
                  title={colorMode === "light" ? "Modo oscuro" : "Modo claro"}
                >
                  <IconButton
                    size="large"
                    color="inherit"
                    edge="end"
                    onClick={toggleColorMode}
                  >
                    {colorMode === "light" ? <LightIcon /> : <DarkIcon />}
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Header;
