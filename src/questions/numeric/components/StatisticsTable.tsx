import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface Props {
  labels: string[];
  statistics: Array<{
    label: string;
    values: string[];
  }>;
}

const SimpleTable = ({ labels, statistics }: Props) => {
  return (
    <TableContainer sx={{ maxHeight: 600 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            {labels.map((label) => (
              <TableCell align="center" key={label}>
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {statistics.map((statistic, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center" variant="head">
                {statistic.label}
              </TableCell>
              {statistic.values.map((value, j) => (
                <TableCell align="center" key={j}>
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SimpleTable;
