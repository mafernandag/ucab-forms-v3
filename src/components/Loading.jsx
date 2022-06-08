import { Box } from "@mui/material";
import { keyframes } from "@mui/system";
import { useColorMode } from "../hooks/useColorMode";
import logoWhite from "../assets/logo-ucab-forms-white.svg";
import logoBlack from "../assets/logo-ucab-forms-black.svg";

const blink = keyframes`
  0% {
    opacity: 0;
  }
  50%, {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const Loading = () => {
  const { colorMode } = useColorMode();

  const logo = colorMode === "light" ? logoBlack : logoWhite;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        animation: `${blink} 2s infinite ease`,
        p: 2,
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="logo"
        sx={{ width: "100%", maxWidth: "md" }}
      />
    </Box>
  );
};

export default Loading;
