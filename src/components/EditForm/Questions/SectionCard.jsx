import { Typography } from "@mui/material";
import { useForm } from "../../../hooks/useForm";
import SelectableCard from "./SelectableCard";

const SectionCard = ({ section, setOpenDrawer }) => {
  const { isSectionSelected, setSectionSelected } = useForm();

  const handleClick = () => {
    setSectionSelected(true);
    setOpenDrawer(true);
  };

  return (
    <SelectableCard onClick={handleClick} selected={isSectionSelected}>
      <Typography variant="h6" mb={1}>
        {section.title}
      </Typography>
      <Typography>{section.description}</Typography>
    </SelectableCard>
  );
};

export default SectionCard;
