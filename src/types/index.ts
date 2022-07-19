import { BaseQuestion } from "../questions/types";

export interface Section {
  id: string;
  title: string;
  description: string;
  labels: string[];
  hideCard: boolean;
  dynamicLabels: boolean;
  dynamicLabelsSection: string | null;
  dynamicLabelsSectionLabel: string | null;
  dynamicLabelsQuestion: string | null;
  iterable: boolean;
}

export interface Form {
  id: string;
  author: {
    id: string;
    email: string;
    name: string;
  };
  title: string;
  description: string;
  createdAt: Date;
  responses: number;
  collaborators: Array<{
    id: string;
    email: string;
    name: string;
  }>;
  settings: {
    allowResponses: boolean;
    maxResponses: number | "";
    onlyOneResponse: boolean;
    startDate: Date | null;
    endDate: Date | null;
    randomOrder: boolean;
  };
}

export interface FormToRespond extends Form {
  sections: Section[];
  questions: BaseQuestion[];
}
