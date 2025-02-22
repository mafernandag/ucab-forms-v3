import { Typography } from "@mui/material";
import { useForm } from "../../../hooks/useForm";
import AllQuestionsPreview from "./AllQuestionsPreview";
import SelectableCard from "./SelectableCard";
import RequiredMark from "../../RequiredMark";

const EditQuestion = ({ question, setOpenDrawer }) => {
  const { currentQuestionId, setCurrentQuestionId } = useForm();

  const handleClick = () => {
    setCurrentQuestionId(question.id);
    setOpenDrawer(true);
  };

  return (
    <SelectableCard
      onClick={handleClick}
      selected={question.id === currentQuestionId}
    >
      <Typography mb={2}>
        {question.title}
        <RequiredMark question={question} />
      </Typography>
      <AllQuestionsPreview question={question} />
    </SelectableCard>
  );
};

export default EditQuestion;
