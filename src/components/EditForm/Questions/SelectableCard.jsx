import Card from "../../Card";

const SelectableCard = ({ selected, sx, ...props }) => {
  return (
    <Card
      sx={{ cursor: "pointer", ...sx }}
      elevation={selected ? 5 : 0}
      variant={selected ? "elevation" : "outlined"}
      {...props}
    />
  );
};

export default SelectableCard;
