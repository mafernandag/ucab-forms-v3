import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

const ResultGraph = ({
  imgUrl,
  loadingGraphs,
  title,
  description,
  imgStyle,
}) => {
  return (
    <Box>
      <Typography>{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ pt: 1, pb: 3 }}>
        {description}
      </Typography>
      <Box textAlign="center">
        {loadingGraphs ? (
          <CircularProgress />
        ) : (
          <img src={imgUrl} alt={title} style={imgStyle} />
        )}
      </Box>
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
