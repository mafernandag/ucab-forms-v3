import { useForm } from "../../../../hooks/useForm";
import { addCommentToSection } from "../../../../api/sections";
import Comments from "../Comments";
import { Comment, Section } from "../../../../types";

interface Props {
  section: Section;
}

const SectionComments = ({ section }: Props) => {
  const { form } = useForm();
  const comments = section.comments;

  const addComment = (comment: Comment) => {
    addCommentToSection(form.id, section.id, comment);
  };

  return (
    <Comments comments={comments} addComment={addComment} type="sección" />
  );
};

export default SectionComments;
