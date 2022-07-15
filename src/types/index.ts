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
}
