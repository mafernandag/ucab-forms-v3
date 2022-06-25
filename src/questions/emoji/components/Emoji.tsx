import { useState } from "react";
import {
  Box,
  BoxProps,
  IconContainerProps,
  Rating,
  RatingProps,
  SxProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import {
  SentimentDissatisfied,
  SentimentSatisfied,
  SentimentSatisfiedAlt,
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
} from "@mui/icons-material";
import { emojiLabels } from "../constants";
import { flowRight } from "lodash";

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

const customIcons: {
  [index: string]: {
    icon: React.ReactElement;
    label: string;
  };
} = {
  1: {
    icon: <SentimentVeryDissatisfied />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfied />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfied />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAlt />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfied />,
    label: "Very Satisfied",
  },
};

const IconContainer = (props: IconContainerProps) => {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
};

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
