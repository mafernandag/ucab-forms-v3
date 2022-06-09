export const calculateNewIndex = (documents, documentId) => {
  const i = documents.findIndex((q) => q.id === documentId);
  let newIndex;

  if (documents.length === 0) {
    newIndex = 0;
  } else if (i === documents.length - 1 || i === -1) {
    newIndex = documents[documents.length - 1].index + 1;
  } else {
    newIndex = (documents[i].index + documents[i + 1].index) / 2;
  }

  return newIndex;
};
