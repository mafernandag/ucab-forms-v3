import { Card, Stack, Typography } from "@mui/material";
import { DragHandle as DragHandleIcon } from "@mui/icons-material";
import { SortablePreviewProps } from "./types";

const Preview = ({ question }: SortablePreviewProps) => {
  return (
    <Stack py={1} spacing={1.5}>
      {question.options.map((option, i) => (
        <Card
          key={i}
          variant="outlined"
          sx={{
            p: 2,
            color: "text.secondary",
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
