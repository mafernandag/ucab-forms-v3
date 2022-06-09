import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import Lottie from "lottie-react";
import { getFormOnce } from "../api/forms";
import Header from "../components/Header";
import Card from "../components/Card";
import AnswerPageText from "../components/AnswerPageText";
import doneAnimation from "../assets/done.json";

const Sent = () => {
  const { id: formId } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getForm = async () => {
      const form = await getFormOnce(formId);
      setForm(form);

      setLoading(false);
    };

    getForm();
  }, [formId]);

  if (loading) {
    return (
      <Box>
        <Header />
        <LinearProgress />
      </Box>
    );
  }

  if (!form) {
    return <AnswerPageText>No se encontró la encuesta</AnswerPageText>;
  }

  const sentText = window.navigator.onLine ? "Enviada" : "Por Enviar";

  const successText = window.navigator.onLine
    ? "Hemos recibido tu respuesta con éxito."
    : "Tu respuesta será enviada cuando tengas conexión.";

  return (
    <Box>
      <Header />
      <Container sx={{ p: 3 }} maxWidth="md">
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography align="center" variant="h5">
            {sentText}
          </Typography>
          <Box sx={{ width: "40vmin" }}>
            <Lottie animationData={doneAnimation} />
          </Box>
          <Typography align="center" mb={2}>
            ¡Gracias por tu colaboración! {successText}
          </Typography>
          {!form.settings.onlyOneResponse && (
            <Button
              variant="contained"
              component={Link}
              to={`/forms/answer/${formId}`}
            >
              Enviar otra respuesta
            </Button>
          )}
        </Card>
      </Container>
    </Box>
  );
};

export default Sent;
