import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  CircularProgress,
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
import DataInput from "./DataInput";

const Predictions = ({ model, targetVariable }) => {
  const { predictionData } = useReport();
  const [loading, setLoading] = useState(true);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [answers, setAnswers] = useState({});
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    if (predictionData) {
      setLoading(false);
    }
  }, [predictionData]);

  const handleButtonClick = async () => {
    setLoadingPrediction(true);
    try {
      console.log(answers, model);
      const response = await fetch(process.env.REACT_APP_API_URL + "/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          model,
          predictionData,
        }),
      });
      const data = await response.json();
      setPrediction(data["prediction"]);
      setLoadingPrediction(false);
    } catch (error) {
      console.log("error in Predictions:", error);
    }
  };

  const isButtonDisabled = () => {
    const predictionKeys = Object.keys(predictionData);
    const answerKeys = Object.keys(answers);

    if (predictionKeys.length !== answerKeys.length) {
      return true;
    }

    for (let key of predictionKeys) {
      if (!answers[key] || answers[key] === "") {
        return true;
      }
    }

    return false;
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography sx={{ pb: 1 }}>Ingrese los siguientes datos</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ pb: 3 }}>
            Se introducirán solo las variables más relacionadas a la que se
            desea predecir según el modelo entrenado
          </Typography>
          <Stack spacing={3} justifyContent="center" alignItems="center">
            {Object.entries(predictionData).map(([title, type], i) => (
              <DataInput
                key={i}
                title={title}
                type={type}
                setAnswers={setAnswers}
              />
            ))}
            <Button
              variant="contained"
              onClick={handleButtonClick}
              disabled={isButtonDisabled()}
            >
              Predecir
            </Button>
            {loadingPrediction && <CircularProgress />}
            {prediction && !loadingPrediction && (
              <Stack justifyContent="center" alignItems="center">
                <Typography>{targetVariable}:</Typography>
                <Typography variant="h6">{prediction}</Typography>
              </Stack>
            )}
          </Stack>
        </>
      )}
    </>
  );
};

export default Predictions;
