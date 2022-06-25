import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import {
  CheckboxResponseByPersonProps,
  CheckboxResponseByQuestionProps,
} from "../types";

type Props = CheckboxResponseByPersonProps | CheckboxResponseByQuestionProps;

const CheckboxResponse = ({ value }: Props) => {
  return (
    <FormGroup>
      {value.map((option, i) => (
        <FormControlLabel
          key={i}
          disabled
          checked
          control={<Checkbox />}
          label={<Typography>{option}</Typography>}
        />
      ))}
    </FormGroup>
  );
};

export default CheckboxResponse;
