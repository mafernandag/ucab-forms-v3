import { useState } from "react";
import {
  Box,
  BoxProps,
  Rating,
  RatingProps,
  SxProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { emojiLabels } from "../constants";
import IconContainer from "./IconContainer";

interface Props {
  value?: number;
  onChange?: (value: number | "") => void;
  readOnly?: boolean;
  disabled?: boolean;
  emojiProps?: RatingProps;
  typographyProps?: TypographyProps;
  boxProps?: BoxProps;
  boxSx?: SxProps;
}

const Emoji = ({
  value,
  onChange,
  readOnly,
  disabled,
  emojiProps,
  typographyProps,
  boxProps,
  boxSx,
}: Props) => {
  const [hover, setHover] = useState(-1);

  const handleChange = (e: React.SyntheticEvent, value: number | null) => {
    setHover(-1);
    onChange?.(value || "");
  };

  const handleChangeActive = (e: React.SyntheticEvent, value: number) => {
    setHover(value);
  };

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 2, ...boxSx }}
      {...boxProps}
    >
      <Rating
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        onChangeActive={handleChangeActive}
        IconContainerComponent={IconContainer}
        highlightSelectedOnly
        disabled={disabled}
        {...emojiProps}
      />
      {value !== undefined && (
        <Typography {...typographyProps}>
          {emojiLabels[hover !== -1 ? hover : value]}
        </Typography>
      )}
    </Box>
  );
};

export default Emoji;
