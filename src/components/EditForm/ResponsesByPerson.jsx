import { useMemo, useState } from "react";
import {
  Box,
  Card as MuiCard,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Pagination,
  PaginationItem,
  Tooltip,
  Typography,
  Stack,
} from "@mui/material";
import { format } from "date-fns";
import {
  CHECKBOX,
  FILE,
  DATE,
  DATETIME,
  SLIDER,
  SORTABLE,
  RATING,
  TIME,
} from "../../constants/questions";
import { useForm } from "../../hooks/useForm";
import Comments from "./Comments";
import Card from "../Card";
import Slider from "../Slider";
import Rating from "../Rating";
import FilesResponse from "./FilesResponse";

const Response = () => {
  const { responses, questions } = useForm();
  const [page, setPage] = useState(1);

  return useMemo(() => {
    const renderItem = (item) => {
      let title = "";

      if (item.type === "page") {
        title = format(
          responses[item.page - 1].submittedAt,
          "dd/MM/yyyy hh:mm a"
        );
      } else if (item.type === "previous") {
        title = "Anterior";
      } else if (item.type === "next") {
        title = "Siguiente";
      }

      return (
        <Tooltip title={title} arrow>
          <span>
            <PaginationItem {...item} />
          </span>
        </Tooltip>
      );
    };

    const renderValue = (value, question) => {
      if (question.type === CHECKBOX) {
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
      }

      if (question.type === SORTABLE) {
        return (
          <Stack spacing={1}>
            {value.map((option, i) => (
              <MuiCard key={i} sx={{ p: 2 }}>
                <Typography>{option}</Typography>
              </MuiCard>
            ))}
          </Stack>
        );
      }

      if (question.type === SLIDER) {
        return <Slider disabled question={question} value={value} />;
      }

      if (question.type === RATING) {
        return <Rating readOnly value={value} />;
      }

      if (question.type === FILE) {
        return <FilesResponse files={value} />;
      }

      let text = value;

      if (question.type === DATE) {
        text = format(value.toDate(), "dd/MM/yyyy");
      } else if (question.type === DATETIME) {
        text = format(value.toDate(), "dd/MM/yyyy hh:mm a");
      } else if (question.type === TIME) {
        text = format(value.toDate(), "hh:mm a");
      }

      return <Typography>{text}</Typography>;
    };

    const response = responses[page - 1];

    return (
      <Box>
        <Stack spacing={2}>
          <Pagination
            count={responses.length}
            page={page}
            onChange={(e, p) => setPage(p)}
            color="primary"
            shape="rounded"
            renderItem={renderItem}
          />
          <Typography align="right" variant="caption" color="text.secondary">
            Respondido el {format(response.submittedAt, "dd/MM/yyyy, hh:mm a")}
          </Typography>
          {response.location && (
            <Card>
              <Typography mb={2}>Ubicación</Typography>
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
                  pt: "75%",
                }}
              >
                <Box
                  component="iframe"
                  title="user-location"
                  src={`https://maps.google.com/maps?q=${response.location.latitude},${response.location.longitude}&hl=es;z=15&output=embed`}
                  allowFullScreen
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                />
              </Box>
            </Card>
          )}
          {questions.map((question) => (
            <Box>
              <Card key={question.id} sx={{ mb: 1 }}>
                <Typography gutterBottom>{question.title}</Typography>
                {response.answers[question.id] === "" ||
                response.answers[question.id] === null ||
                response.answers[question.id] === undefined ||
                response.answers[question.id]?.length === 0 ? (
                  <Typography fontStyle="italic">Respuesta vacía</Typography>
                ) : (
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary">
                      Respuesta
                    </Typography>
                    {renderValue(response.answers[question.id], question)}
                  </Stack>
                )}
              </Card>
              <Comments response={response} question={question} />
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }, [responses, page, questions]);
};

export default Response;
