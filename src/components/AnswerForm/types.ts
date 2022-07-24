import { BaseQuestion } from "../../questions/types";
import { Section } from "../../types";

export interface Page {
  title: string;
  subtitle: string;
  section: Section;
  label: string;
  questions: BaseQuestion[];
  number: number;
}
