import { Box, SvgIcon, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo-ucab.svg";
import { useUser } from "../hooks/useUser";

const HeaderLogo = ({ sx, ...props }) => {
  const user = useUser();

  return (
    <Box
      component={Link}
      to={user ? "/dashboard" : "/login"}
      sx={{
        display: "flex",
        alignItems: "center",
        color: "inherit",
        textDecoration: "none",
        ...sx,
      }}
      {...props}
    >
      <SvgIcon sx={{ mx: 1 }}>
        <Logo />
      </SvgIcon>
      <Typography variant="h6" component="h1" align="center">
        UCAB Forms
      </Typography>
    </Box>
  );
};

export default HeaderLogo;
