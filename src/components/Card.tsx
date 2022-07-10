import { Card as MuiCard, CardProps } from "@mui/material";

const Card = ({ sx, ...props }: CardProps) => {
  return <MuiCard sx={{ p: 3, ...sx }} variant="outlined" {...props} />;
};

export default Card;
