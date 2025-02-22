import { AccountCircle } from "@mui/icons-material";
import { Badge } from "@mui/material";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

const UserIcon = () => {
  const status = useNetworkStatus();

  const color = status === "online" ? "#44b700" : "orange";

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
      sx={{
        "& .MuiBadge-badge": {
          backgroundColor: color,
          color,
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
          "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
          },
        },
        "@keyframes ripple": {
          "0%": {
            transform: "scale(.8)",
            opacity: 1,
          },
          "100%": {
            transform: "scale(2.4)",
            opacity: 0,
          },
        },
      }}
    >
      <AccountCircle />
    </Badge>
  );
};

export default UserIcon;
