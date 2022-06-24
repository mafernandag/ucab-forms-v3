import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { useForm } from "../../../hooks/useForm";
import { useUser } from "../../../hooks/useUser";
import { addComment } from "../../../api/responses";

const Comments = ({ response, question }) => {
  const { form } = useForm();
  const [myComment, setMyComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const user = useUser();

  const comments = response.comments[question.id] || [];

  const handleAddComment = (e) => {
    e.preventDefault();

    setCommenting(true);

    const comment = {
      text: myComment,
      author: user.name,
      commentedAt: new Date(),
    };

    const newComments = {
      ...response.comments,
      [question.id]: [...comments, comment],
    };

    addComment(form.id, response.id, newComments);

    setMyComment("");
    setCommenting(false);
  };

  return (
    <Card variant="outlined">
      <Accordion sx={{ background: "transparent", boxShadow: "none" }}>
        <AccordionSummary sx={{ px: 3 }} expandIcon={<ExpandMoreIcon />}>
          <Typography>Comentarios</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 3 }}>
          <Stack spacing={2}>
            {!comments.length && (
              <Typography>No hay comentarios para esta respuesta</Typography>
            )}
            {comments.map((comment, i) => (
              <Box key={i}>
                <Typography>{comment.text}</Typography>
                <Typography
                  align="left"
                  variant="caption"
                  color="text.secondary"
                >
                  {comment.author} -{" "}
                  {format(comment.commentedAt.toDate(), "dd/MM/yyyy, hh:mm a")}
                </Typography>
              </Box>
            ))}
            <Stack direction="row" spacing={2}>
              <Avatar
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                }}
              >
                {user.name[0]}
              </Avatar>
              <Stack
                component="form"
                onSubmit={handleAddComment}
                spacing={1.5}
                flexGrow={1}
              >
                <TextField
                  placeholder="Tu comentario..."
                  variant="standard"
                  fullWidth
                  multiline
                  value={myComment}
                  onChange={(e) => setMyComment(e.target.value)}
                />
                <Button
                  type="submit"
                  disabled={!myComment || commenting}
                  sx={{ alignSelf: "flex-end" }}
                  variant="contained"
                >
                  Comentar
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default Comments;
