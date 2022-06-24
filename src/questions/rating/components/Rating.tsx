import { useState } from "react";
import {
  Box,
  BoxProps,
  Rating as MuiRating,
  RatingProps,
  SxProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { ratingLabels } from "../constants";

interface Props {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  ratingProps?: RatingProps;
  typographyProps?: TypographyProps;
  boxProps?: BoxProps;
  boxSx?: SxProps;
}

const Rating = ({
  value,
  onChange,
  readOnly,
  ratingProps,
  typographyProps,
  boxProps,
  boxSx,
}: Props) => {
  const [hover, setHover] = useState(-1);

  const handleChange = (e: React.SyntheticEvent, value: number | null) => {
    setHover(-1);
    onChange?.(value || 0);
  };

  const handleChangeActive = (e: React.SyntheticEvent, value: number) => {
    setHover(value);
  };

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 2, ...boxSx }}
      {...boxProps}
    >
      <MuiRating
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        onChangeActive={handleChangeActive}
        {...ratingProps}
      />
      <Typography {...typographyProps}>
        {ratingLabels[hover !== -1 ? hover : value]}
      </Typography>
    </Box>
  );
};

export default Rating;
