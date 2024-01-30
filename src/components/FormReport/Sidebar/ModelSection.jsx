import { Box, Stack, Typography, Button, Tooltip } from "@mui/material";
import { HelpOutline as HelpIcon } from "@mui/icons-material";
import { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ModelContext } from "./SelectModel";

const ModelSection = ({ category, tooltip, models, setSelectedModel }) => {
  const navigate = useNavigate();
  const { id: formId } = useParams();

  /* const handleModel = useCallback(
    async ({ id }) => {
      setSelectedModel(id);
      try {
        const response = await fetch("/model", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ modelId: id }),
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log("error:", error);
      }
    },
    [setSelectedModel]
  ); */

  return (
    <Box sx={{ paddingTop: "12px", width: "100%" }}>
      <Stack spacing={2} sx={{ width: "75%" }}>
        <Stack spacing={1} direction={"row"} alignItems="center">
          <Typography variant="body1">{category}</Typography>
          <Tooltip title={tooltip}>
            <HelpIcon fontSize="small" />
          </Tooltip>
        </Stack>

        {models.map((model) => (
          <Button
            key={model.id} // Add a unique "key" prop
            onClick={() => setSelectedModel(model.id)} // Pass a function reference to onClick
            sx={{ height: "60px" }}
            variant="outlined"
          >
            {model.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default ModelSection;
