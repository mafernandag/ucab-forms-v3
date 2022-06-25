import { Card, Stack, Typography } from "@mui/material";
import { DragHandle as DragHandleIcon } from "@mui/icons-material";
import { SortablePreviewProps } from "./types";

const Preview = ({ question }: SortablePreviewProps) => {
  return (
    <Stack spacing={1}>
      {question.options.map((option, i) => (
        <Card
          key={i}
          sx={{
            p: 2,
            color: "text.disabled",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography>{option}</Typography>
          <DragHandleIcon />
        </Card>
      ))}
    </Stack>
  );
};

export default Preview;
