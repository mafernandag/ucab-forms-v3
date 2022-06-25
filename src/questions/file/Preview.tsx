import { UploadButton } from "./components";
import { FilePreviewProps } from "./types";

const Preview = ({ question }: FilePreviewProps) => {
  return <UploadButton inputId={question.id} disabled />;
};

export default Preview;
