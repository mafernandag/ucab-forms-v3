import { useState } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useForm } from "../../hooks/useForm";
import { getResponseCountText } from "../../utils/stats";
import ResponsesSummary from "./ResponsesSummary";
import ResponsesByPerson from "./ResponsesByPerson";
import ResponsesByQuestion from "./ResponsesByQuestion";
import ResponsesTable from "./ResponsesTable";

const Responses = () => {
  const { responses, questions } = useForm();
  const [view, setView] = useState("summary");

  if (!questions.length) {
    return <Typography>No hay preguntas</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <ToggleButtonGroup
          color="primary"
          value={view}
          exclusive
          onChange={(event, value) => setView(value)}
        >
          <ToggleButton sx={{ px: { sm: 2, lg: 3 } }} value="summary">
            Resumen
          </ToggleButton>
          <ToggleButton sx={{ px: { sm: 2, lg: 3 } }} value="table">
            Tabla
          </ToggleButton>
          <ToggleButton sx={{ px: { sm: 2, lg: 3 } }} value="question">
            Pregunta
          </ToggleButton>
          <ToggleButton sx={{ px: { sm: 2, lg: 3 } }} value="person">
            Persona
          </ToggleButton>
        </ToggleButtonGroup>
        <Typography fontSize="h6.fontSize">
          {getResponseCountText(responses.length)}
        </Typography>
      </Box>
      {responses.length === 0 ? (
        <Typography ml={1}>No hay respuestas</Typography>
      ) : (
        <>
          {view === "summary" && <ResponsesSummary />}
          {view === "question" && <ResponsesByQuestion />}
          {view === "person" && <ResponsesByPerson />}
          {view === "table" && <ResponsesTable />}
          {!view && (
            <Typography>
              Selecciona una opción para visualizar las respuestas
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default Responses;
