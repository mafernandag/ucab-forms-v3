import { Button } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";

const UploadButton = ({ inputId, onChange, multiple, disabled }) => {
  const id = "upload-button-" + inputId;

  return (
    <label htmlFor={id}>
      <input
        style={{ display: "none" }}
        id={id}
        multiple={multiple}
        type="file"
        disabled={disabled}
        onChange={(e) => {
          onChange(e.target.files);
          e.target.value = "";
        }}
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
