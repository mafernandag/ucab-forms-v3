import { IconContainerProps } from "@mui/material";
import {
  SentimentDissatisfied,
  SentimentSatisfied,
  SentimentSatisfiedAlt,
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
} from "@mui/icons-material";

interface CustomIcons {
  [index: number]: React.ReactElement;
}

const customIcons: CustomIcons = {
  1: <SentimentVeryDissatisfied />,
  2: <SentimentDissatisfied />,
  3: <SentimentSatisfied />,
  4: <SentimentSatisfiedAlt />,
  5: <SentimentVerySatisfied />,
};

const IconContainer = (props: IconContainerProps) => {
  const { value, ...rest } = props;
  return <span {...rest}>{customIcons[value]}</span>;
};

export default IconContainer;
