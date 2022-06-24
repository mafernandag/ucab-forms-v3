import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { Card, Stack, Typography } from "@mui/material";
import { DragHandle as DragHandleIcon } from "@mui/icons-material";
import { arrayMoveImmutable } from "array-move";

// TODO: Use a different library to make this sortable
const SortableItem = SortableElement(({ value }) => {
  return (
    <Card
      sx={{
        p: 2,
        cursor: "move",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography>{value}</Typography>
      <DragHandleIcon />
    </Card>
  );
});

const SortableListContainer = SortableContainer(({ items }) => {
  return (
    <Stack spacing={1}>
      {items.map((value, index) => (
        <SortableItem key={index} index={index} value={value} />
      ))}
    </Stack>
  );
});

const SortableList = ({ items, onChange }) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newItems = arrayMoveImmutable(items, oldIndex, newIndex);
    onChange(newItems);
  };

  return (
    <SortableListContainer items={items} onSortEnd={onSortEnd} lockAxis="y" />
  );
};

export default SortableList;
