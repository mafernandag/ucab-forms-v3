import { useRef } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Box,
  Stack,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { QRCodeSVG } from "qrcode.react";

const SendDialog = ({ open, setOpen }) => {
  const qrCodeRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    setOpen(false);
  };

  const formUrl = window.location.href.replace("edit", "answer");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      enqueueSnackbar("URL copiada al portapapeles", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("No se pudo copiar la URL", { variant: "error" });
    }
  };

  const getSvgUrl = (svg) => {
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(blob);
    return svgUrl;
  };

  const download = (url, fileName) => {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSvg = (svg, fileName) => {
    const svgUrl = getSvgUrl(svg);
    download(svgUrl, fileName);
  };

  const downloadPng = (svg, fileName) => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      const svgUrl = getSvgUrl(svg);
      const img = new Image();
      img.src = svgUrl;

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const imgUrl = canvas.toDataURL("image/png");
        download(imgUrl, fileName);
      };
    }
  };

  const handleDownloadSvg = () => {
    const svg = qrCodeRef.current?.querySelector("svg");
    if (svg) {
      downloadSvg(svg, "QR.svg");
    }
  };

  const handleDownloadPng = () => {
    const svg = qrCodeRef.current?.querySelector("svg");
    if (svg) {
      downloadPng(svg, "QR.png");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Enviar Encuesta</DialogTitle>
      <DialogContent>
        <Box
          ref={qrCodeRef}
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <QRCodeSVG value={formUrl} />
          <Stack>
            <Button size="small" onClick={handleDownloadPng}>
              Descargar PNG
            </Button>
            <Button size="small" onClick={handleDownloadSvg}>
              Descargar SVG
            </Button>
          </Stack>
        </Box>
        <TextField
          variant="standard"
          fullWidth
          defaultValue={formUrl}
          onFocus={(e) => e.target.select()}
          InputProps={{
            readOnly: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cerrar</Button>
        <Button onClick={handleCopy}>Copiar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendDialog;
