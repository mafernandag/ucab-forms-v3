import { BaseQuestion } from "../../questions/types";
import { Section } from "../../types";

export interface Page {
  section: Section;
  label: string;
  questions: BaseQuestion[];
}
