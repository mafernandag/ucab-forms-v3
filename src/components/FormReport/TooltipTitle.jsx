import { Stack, Typography, Tooltip } from "@mui/material";
import { HelpOutline as HelpIcon } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

const TooltipTitle = ({ title, tooltip, size, color }) => {
  return (
    <Stack direction={"row"} spacing={1} alignItems="center">
      <Typography variant={size} color={color}>
        {title}
      </Typography>
      <Tooltip title={tooltip}>
        <HelpIcon fontSize="small" />
      </Tooltip>
    </Stack>
  );
};

export default TooltipTitle;
