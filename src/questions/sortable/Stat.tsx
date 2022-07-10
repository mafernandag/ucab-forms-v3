import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getSectionLabels } from "../utils";
import { SortableStatProps } from "./types";

const Stat = ({ answers, section, question }: SortableStatProps) => {
  const sectionLabels = getSectionLabels(section);

  return (
    <>
      {sectionLabels.map((label) => (
        <TableContainer key={label} sx={{ maxHeight: 300 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={question.options.length + 1}>
                  {label}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                {question.options.map((o, i) => (
                  <TableCell align="center" key={i}>
                    {i + 1}º
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {question.options.map((option, i) => (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center" variant="head">
                    {option}
                  </TableCell>
                  {question.options.map((o, j) => (
                    <TableCell align="center" key={j}>
                      {
                        answers.filter(
                          (a) => a[question.id]?.[label]?.[j] === option
                        ).length
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </>
  );
};

export default Stat;
