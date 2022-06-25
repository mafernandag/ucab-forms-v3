import { Container } from "@mui/material";
import { useColorMode } from "../../hooks/useColorMode";
import { SortableStatProps } from "./types";

// TODO: Improve UI

const Stat = ({ answers, question }: SortableStatProps) => {
  const { colorMode } = useColorMode();

  const borderColor = colorMode === "light" ? "black" : "white";

  return (
    <Container maxWidth="sm">
      <table
        style={{
          width: "100%",
          border: `1px solid ${borderColor}`,
          borderRadius: "4px",
          padding: "8px",
        }}
      >
        <tbody>
          <tr>
            <td />
            {question.options.map((o, i) => (
              <td style={{ fontWeight: "bold" }} key={i}>
                {i + 1}
              </td>
            ))}
          </tr>
          {question.options.map((option, i) => (
            <tr key={i}>
              <td style={{ fontWeight: "bold" }}>{option}</td>
              {question.options.map((o, j) => (
                <td key={j}>
                  {answers.filter((a) => a[question.id]?.[j] === option).length}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export default Stat;
