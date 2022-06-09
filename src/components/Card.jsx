import { Card as MuiCard } from "@mui/material";

const Card = ({ sx, ...props }) => {
  return <MuiCard sx={{ p: 3, ...sx }} variant="outlined" {...props} />;
};

export default Card;
