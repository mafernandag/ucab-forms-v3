import { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { questionTypesConfig } from "../../../../questions/config";
import { BaseQuestion } from "../../../../questions/types";
import { getSectionLabels, isEmpty } from "../../../../questions/utils";
import { Section } from "../../../../types";
import Card from "../../../Card";
import { DEFAULT_LABEL } from "../../../../questions/constants";
import { useForm } from "../../../../hooks/useForm";
import { isEmptyAnswer } from "../utils";

interface Props {
  answer?: Record<string, any[]>;
  section: Section;
  question: BaseQuestion;
}

const AnswerCard = ({ answer, section, question }: Props) => {
  const { questions } = useForm();
  const type = question.type;
  const ResponseByPerson = questionTypesConfig[type].ResponseByPerson;
  const sectionLabels = getSectionLabels(section, questions);

  const isWholeAnswerEmpty = useMemo(
    () => isEmptyAnswer(answer, sectionLabels),
    [answer, sectionLabels]
  );

  return (
    <Card>
      <Typography gutterBottom>{question.title}</Typography>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          Respuesta
        </Typography>
        {isWholeAnswerEmpty ? (
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
              {answer?.[label]?.length &&
              answer[label].every((value) => !isEmpty(value)) ? (
                answer[label].map((value, i) => (
                  <Box
                    key={i}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {section.iterable && (
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {section.prefix} {i + 1}:
                      </Typography>
                    )}
                    <Box flexGrow={1}>
                      <ResponseByPerson question={question} value={value} />
                    </Box>
                  </Box>
                ))
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
