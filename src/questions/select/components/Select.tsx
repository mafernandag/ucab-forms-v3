import { Select as MuiSelect, SelectProps } from "@mui/material";

const Select = (props: SelectProps<string>) => {
  const renderValue = (value: string) => value || "Selecciona una opción";

  return <MuiSelect renderValue={renderValue} {...props} />;
};

export default Select;
