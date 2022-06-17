import Card from "../Card";

const SelectableCard = ({ selected, ...props }) => {
  return (
    <Card
      sx={{ cursor: "pointer" }}
      elevation={selected ? 5 : 0}
      variant={selected ? "elevation" : "outlined"}
      {...props}
    />
  );
};

export default SelectableCard;
