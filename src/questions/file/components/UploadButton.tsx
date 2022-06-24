import { Button } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";

interface Props {
  inputId: string;
  onChange?: (files: FileList) => void;
  multiple?: boolean;
  disabled?: boolean;
}

const UploadButton = ({ inputId, onChange, multiple, disabled }: Props) => {
  const id = "upload-button-" + inputId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onChange?.(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <label htmlFor={id}>
      <input
        style={{ display: "none" }}
        id={id}
        multiple={multiple}
        type="file"
        disabled={disabled}
        onChange={handleChange}
      />
      <Button
        disabled={disabled}
        variant="contained"
        startIcon={<UploadIcon />}
        component="span"
      >
        Cargar archivo{multiple ? "s" : ""}
      </Button>
    </label>
  );
};

export default UploadButton;
