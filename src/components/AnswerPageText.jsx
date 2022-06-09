import { Box, Container, Typography } from "@mui/material";
import Lottie from "lottie-react";
import Header from "./Header";
import Card from "./Card";
import notFoundAnimation from "../assets/not-found.json";

const AnswerPageText = ({ children }) => {
  return (
    <Box>
      <Header />
      <Container maxWidth="md" sx={{ p: 3 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
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
