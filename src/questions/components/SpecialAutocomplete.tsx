import { MenuItem, TextField } from "@mui/material";

interface SpecialType {
  value: string;
  label: string;
}

const specialTypes: SpecialType[] = [
  {
    value: "name",
    label: "Nombre completo",
  },
  {
    value: "given-name",
    label: "Nombre",
  },
  {
    value: "family-name",
    label: "Apellido",
  },
  {
    value: "email",
    label: "Email",
  },
  {
    value: "tel",
    label: "Teléfono",
  },
  {
    value: "country-name",
    label: "País",
  },
  {
    value: "street-address",
    label: "Dirección",
  },
  {
    value: "postal-code",
    label: "Código postal",
  },
  {
    value: "organization",
    label: "Organización",
  },
  {
    value: "organization-title",
    label: "Profesión",
  },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const SpecialAutocomplete = ({ value, onChange }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
  };

  return (
    <TextField
      select
      variant="standard"
      label="Autocompletado especial"
      value={value}
      onChange={handleChange}
    >
      <MenuItem value="">Ninguno</MenuItem>
      {specialTypes.map((type) => (
        <MenuItem key={type.value} value={type.value}>
          {type.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SpecialAutocomplete;
