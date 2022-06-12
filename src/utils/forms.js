export const calculateNewIndex = (documents, i) => {
  if (documents.length === 0) {
    return 0;
  }

  if (i === -1) {
    return documents[0].index - 1;
  }

  if (i === documents.length - 1) {
    return documents[i].index + 1;
  }

  return (documents[i].index + documents[i + 1].index) / 2;
};
