import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  CircularProgress,
  TextField,
  Card,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  HelpOutline as HelpIcon,
  ArrowBack as ArrowIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import TooltipTitle from "../TooltipTitle";
import { useParams } from "react-router-dom";
import { useReport } from "../../../hooks/useReport";

const DataInput = ({ title, type, setAnswers }) => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    setAnswers((answers) => ({
      ...answers,
      [title]: response,
    }));
  }, [response, setAnswers, title]);

  return (
    <>
      <Card elevation={0} variant="outlined" sx={{ p: 3, width: "100%" }}>
        <Stack spacing={2}>
          <Typography>{title}</Typography>
          {type === "numerical" ? (
            <TextField
              sx={{ width: "30%" }}
              variant="standard"
              type="number"
              inputProps={{
                step: "0.01",
              }}
              placeholder="Respuesta"
              onChange={(e) => setResponse(e.target.value)}
              error={response === ""}
              helperText={response === "" ? "Campo requerido" : ""}
            />
          ) : (
            <Box>
              <RadioGroup
                value={response}
                onChange={(event) => setResponse(event.target.value)}
              >
                {type.map((option, i) => (
                  <FormControlLabel
                    key={i}
                    control={<Radio />}
                    value={option}
                    label={<Typography>{option}</Typography>}
                  />
                ))}
              </RadioGroup>
            </Box>
          )}
        </Stack>
      </Card>
    </>
  );
};

export default DataInput;
