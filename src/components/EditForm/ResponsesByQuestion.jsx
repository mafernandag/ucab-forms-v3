import { useState } from "react";
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
import { useForm } from "../../hooks/useForm";
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
import { getResponseCountText } from "../../utils/stats";
import Card from "../Card";
import Slider from "../Slider";
import Rating from "../Rating";
import FilesResponse from "./FilesResponse";

const ResponsesByQuestion = () => {
  const { responses, questions } = useForm();
  const [page, setPage] = useState(1);

  const question = questions[page - 1];
  const answers = responses.map((r) => r.answers);

  const answersWithStats = () => {
    const responseCount = {};

    answers.forEach((response) => {
      let value = response[question.id];

      if (question.type === CHECKBOX) {
        if (!value) {
          value = [];
        }
        value = [...value].sort();
      } else if (question.type === DATE && value) {
        value = format(value.toDate(), "dd/MM/yyyy");
      } else if (question.type === DATETIME && value) {
        value = format(value.toDate(), "dd/MM/yyyy hh:mm a");
      } else if (question.type === TIME && value) {
        value = format(value.toDate(), "hh:mm a");
      }

      if (question.type === FILE && !value) {
        value = [];
      }

      if (!value) {
        value = "";
      }

      value = JSON.stringify(value);

      if (responseCount[value]) {
        responseCount[value]++;
      } else {
        responseCount[value] = 1;
      }
    });

    const sortedResponseCount = Object.entries(responseCount).sort(
      ([valueA, countA], [valueB, countB]) => countB - countA
    );

    return sortedResponseCount.map(([value, count]) => ({
      value: JSON.parse(value),
      count,
    }));
  };

  const renderItem = (item) => {
    let title = "";

    if (item.type === "page") {
      title = questions[item.page - 1].title;
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

  const renderValue = (value) => {
    if (question.type === CHECKBOX) {
      return (
        <FormGroup>
          {value.map((option, i) => (
            <FormControlLabel
              key={i}
              disabled
              checked={true}
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

    return <Typography>{value}</Typography>;
  };

  return (
    <Box>
      <Stack spacing={2}>
        <Pagination
          count={questions.length}
          page={page}
          onChange={(e, p) => setPage(p)}
          color="primary"
          shape="rounded"
          renderItem={renderItem}
        />
        <Card>
          <Typography fontSize="h6.fontSize">{question.title}</Typography>
        </Card>
        {answersWithStats.map((response, i) => (
          <Card key={i}>
            <Box sx={{ mb: 1 }}>
              {response.value === "" ||
              response.value === undefined ||
              response.value === null ||
              response.value.length === 0 ? (
                <Typography fontStyle="italic">Respuesta vacía</Typography>
              ) : (
                renderValue(response.value)
              )}
            </Box>
            <Typography color="text.secondary" variant="caption">
              {getResponseCountText(response.count)}
            </Typography>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default ResponsesByQuestion;
