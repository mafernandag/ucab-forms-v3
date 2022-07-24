import { useForm } from "../../../../hooks/useForm";
import { addCommentToResponse } from "../../../../api/responses";
import Comments from "../Comments";

const ResponseComments = ({ response, question }) => {
  const { form } = useForm();
  const comments = response.comments[question.id] || [];

  const addComment = (comment) => {
    const newComments = {
      ...response.comments,
      [question.id]: [...comments, comment],
    };

    addCommentToResponse(form.id, response.id, newComments);
  };

  return (
    <Comments comments={comments} addComment={addComment} type="respuesta" />
  );
};

export default ResponseComments;
