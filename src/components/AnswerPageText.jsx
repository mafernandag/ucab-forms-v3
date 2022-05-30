import { Box, Card, Container, Typography } from "@mui/material";
import Lottie from "lottie-react";
import Header from "./Header";
import notFoundAnimation from "../assets/not-found.json";

const AnswerPageText = ({ children }) => {
  return (
    <Box>
      <Header />
      <Container maxWidth="md" sx={{ p: 3 }}>
        <Card
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          variant="outlined"
        >
          <Box sx={{ width: "40vmin" }}>
            <Lottie animationData={notFoundAnimation} loop />
          </Box>
          <Typography align="center" variant="h6">
            {children}
          </Typography>
        </Card>
      </Container>
    </Box>
  );
};

export default AnswerPageText;
