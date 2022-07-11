import { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { questionTypesConfig } from "../../../../questions/config";
import { BaseQuestion } from "../../../../questions/types";
import { getSectionLabels, isEmpty } from "../../../../questions/utils";
import { Section } from "../../../../types";
import Card from "../../../Card";
import { DEFAULT_LABEL } from "../../../../questions/constants";

interface Props {
  answer?: Record<string, any>;
  section: Section;
  question: BaseQuestion;
}

const AnswerCard = ({ answer, section, question }: Props) => {
  const type = question.type;
  const ResponseByPerson = questionTypesConfig[type].ResponseByPerson;
  const sectionLabels = getSectionLabels(section);

  const isEmptyAnswer = useMemo(() => {
    return sectionLabels.every((label) => isEmpty(answer?.[label]));
  }, [answer, sectionLabels]);

  return (
    <Card>
      <Typography gutterBottom>{question.title}</Typography>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          Respuesta
        </Typography>
        {isEmptyAnswer ? (
          <Typography variant="body2" fontStyle="italic">
            Respuesta vacía
          </Typography>
        ) : (
          sectionLabels.map((label) => (
            <Box key={label}>
              {label !== DEFAULT_LABEL && (
                <Typography variant="body2" fontWeight={500}>
                  {label}
                </Typography>
              )}
              {!isEmpty(answer?.[label]) ? (
                <ResponseByPerson question={question} value={answer![label]} />
              ) : (
                <Typography>-</Typography>
              )}
            </Box>
          ))
        )}
      </Stack>
    </Card>
  );
};

export default AnswerCard;
