import { Button } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";

const UploadCSVButton = ({ inputId, onChange }) => {
  const id = "upload-button-" + inputId;

  const handleChange = (e) => {
    if (e.target.files) {
      onChange && onChange(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <label htmlFor={id}>
      <input
        style={{ display: "none" }}
        id={id}
        multiple={false}
        type="file"
        accept=".csv"
        onChange={handleChange}
      />
      <Button variant="contained" startIcon={<UploadIcon />} component="span">
        Cargar archivo
      </Button>
    </label>
  );
};

export default UploadCSVButton;
