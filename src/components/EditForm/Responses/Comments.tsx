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
import { Comment } from "../../../types";
import { useUser } from "../../../hooks/useUser";
import { formatDateTime } from "../../../utils/dates";

interface Props {
  comments: Comment[];
  type: string;
  addComment: (comment: Comment) => void;
}

const Comments = ({ comments, type, addComment }: Props) => {
  const user = useUser();
  const [myComment, setMyComment] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMyComment(e.target.value);
  };

  const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const comment = {
      text: myComment,
      author: user.name,
      commentedAt: new Date(),
    };

    addComment(comment);
    setMyComment("");
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
              <Typography>No hay comentarios para esta {type}</Typography>
            )}
            {comments.map((comment, i) => (
              <Box key={i}>
                <Typography>{comment.text}</Typography>
                <Typography
                  align="left"
                  variant="caption"
                  color="text.secondary"
                >
                  {comment.author} - {formatDateTime(comment.commentedAt)}
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
                spacing={2}
                flexGrow={1}
              >
                <TextField
                  placeholder="Tu comentario..."
                  variant="standard"
                  fullWidth
                  multiline
                  value={myComment}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  disabled={!myComment}
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
