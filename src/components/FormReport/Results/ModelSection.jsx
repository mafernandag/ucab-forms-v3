import { Box, Stack, Typography, Button, Tooltip } from "@mui/material";
import { HelpOutline as HelpIcon } from "@mui/icons-material";
import { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ModelContext } from "./SelectModel";

const ModelSection = ({
  category,
  tooltip,
  models,
  setSelectedModel,
  setModelCategory,
}) => {
  const handleButtonClick = (id) => {
    setSelectedModel(id);
    setModelCategory(category);
  };

  return (
    <Box sx={{ paddingTop: "12px", width: "100%" }}>
      <Stack spacing={2} sx={{ width: "75%" }}>
        <Stack spacing={1} direction={"row"} alignItems="center">
          <Typography>{category}</Typography>
          <Tooltip title={tooltip}>
            <HelpIcon fontSize="small" />
          </Tooltip>
        </Stack>

        {models.map((model) => (
          <Button
            key={model.id} // Add a unique "key" prop
            onClick={() => handleButtonClick(model.id)} // Pass a function reference to onClick
            sx={{ height: "50px" }}
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
