import { Section } from "../types";

export const defaultSection: Omit<Section, "id"> = {
  title: "Sección sin título",
  description: "Sin descripción",
  labels: [],
  hideCard: false,
  dynamicLabels: false,
  dynamicLabelsSection: null,
  dynamicLabelsSectionLabel: null,
  dynamicLabelsQuestion: null,
  iterable: false,
  prefix: "",
};
