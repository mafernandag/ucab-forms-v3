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
  rows: Record<string, string>[];
}

const SimpleTable = ({ labels, rows }: Props) => {
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
          {rows.map((row, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center" variant="head">
                {i + 1}
              </TableCell>
              {labels.map((label) => (
                <TableCell align="center" key={label}>
                  {row[label]}
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
