export interface Section {
  id: string;
  title: string;
  description: string;
  labels: string[];
  hideCard: boolean;
  dynamicLabels: boolean;
  dynamicLabelsSection: string;
  dynamicLabelsSectionLabel: string;
  dynamicLabelsQuestion: string;
}
