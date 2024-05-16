import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Button,
  Card,
  Modal,
} from "@mui/material";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { useState } from "react";

const ResultGraph = ({
  imgUrl,
  loadingGraphs,
  title,
  description,
  imgStyle,
}) => {
  const [anchor, setAnchor] = useState(null);
  const handleClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
  };
  const open = Boolean(anchor);
  const id = open ? "popup" : undefined;

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between">
        <Typography>{title}</Typography>
        {title === "Árbol de Decisión" && (
          <>
            <Button size="small" onClick={handleClick}>
              ¿Como se interpreta?
            </Button>
            <BasePopup
              id={id}
              open={open}
              anchor={anchor}
              placement="bottom"
              sx={{ width: "40%" }}
            >
              <Card sx={{ p: 2 }} variant="outlined">
                <Typography variant="body2">
                  <ul>
                    <li>
                      <strong>Samples:</strong> Esta m&eacute;trica indica el
                      n&uacute;mero o proporci&oacute;n de <br /> ejemplos o
                      instancias de datos que se encuentran en ese <br /> nodo
                      espec&iacute;fico. Por ejemplo, "samples = 100%" significa{" "}
                      <br /> que ese nodo contiene el 100% de los ejemplos de
                      datos.
                    </li>
                    <li>
                      <strong>Value:</strong> Este valor generalmente representa
                      la distribuci&oacute;n <br /> de clases o etiquetas de
                      clasificaci&oacute;n en los ejemplos <br /> contenidos en
                      ese nodo. Por ejemplo, "value = [0.6, 0.4]" <br />{" "}
                      podr&iacute;a indicar que el 60% de los ejemplos en ese
                      nodo <br /> pertenecen a la clase A y el 40% a la clase B.
                    </li>
                    <li>
                      <strong>Class:</strong> Este campo muestra el nombre o
                      etiqueta de la clase <br />o categor&iacute;a a la que
                      pertenecen los ejemplos de ese <br /> nodo. Por ejemplo,
                      "class = verde" significa que los <br /> ejemplos en ese
                      nodo se clasifican como de la clase "verde".
                    </li>
                  </ul>
                  <p>
                    En los nodos hoja o terminales, la m&eacute;trica "value"
                    suele <br /> mostrar la distribuci&oacute;n final de las
                    clases para los ejemplos <br /> que llegaron a ese nodo
                    siguiendo las condiciones del &aacute;rbol.
                    <br /> La clase con el valor m&aacute;s alto es la
                    predicci&oacute;n para esos ejemplos.
                  </p>
                  <p>
                    En los nodos intermedios o de decisi&oacute;n, "value"
                    representa <br />
                    las distribuciones de clase actuales antes de la
                    pr&oacute;xima divisi&oacute;n
                    <br /> por condici&oacute;n. "Samples" indica cu&aacute;ntos
                    ejemplos se dividir&aacute;n
                    <br /> en el siguiente nivel.
                  </p>
                </Typography>
              </Card>
            </BasePopup>
          </>
        )}
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ pt: 1, pb: 3 }}>
        {description}
      </Typography>
      <Box textAlign="center" onClick={handleOpen}>
        {loadingGraphs ? (
          <CircularProgress />
        ) : (
          <img src={imgUrl} alt={title} style={imgStyle} />
        )}
      </Box>
      <Modal open={openModal} onClose={handleClose}>
        <Box
          onClick={handleClose}
          sx={{ height: "100%", alignContent: "center", textAlign: "center" }}
        >
          <img src={imgUrl} alt={title} style={{ height: "85%" }} />
        </Box>
      </Modal>
    </Box>
  );
};

ResultGraph.defaultProps = {
  imgStyle: {
    height: "auto",
    maxWidth: "70%",
  },
};

export default ResultGraph;
