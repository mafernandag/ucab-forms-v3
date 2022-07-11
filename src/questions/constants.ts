export const TEXT = "text";
export const TEXTAREA = "textarea";
export const RADIO = "radio";
export const CHECKBOX = "checkbox";
export const SELECT = "select";
export const SORTABLE = "sortable";
export const SLIDER = "slider";
export const RATING = "rating";
export const EMOJI = "emoji";
export const DATE = "date";
export const TIME = "time";
export const DATETIME = "datetime";
export const FILE = "file";

export const compatibility = {
  [TEXT]: [TEXT, TEXTAREA, RADIO, SELECT],
  [TEXTAREA]: [TEXT, TEXTAREA, RADIO, SELECT],
  [RADIO]: [TEXT, TEXTAREA, RADIO, SELECT],
  [CHECKBOX]: [CHECKBOX],
  [SELECT]: [TEXT, TEXTAREA, RADIO, SELECT],
  [SORTABLE]: [SORTABLE],
  [SLIDER]: [TEXT, TEXTAREA, RADIO, SELECT, SLIDER, RATING, EMOJI],
  [RATING]: [TEXT, TEXTAREA, RADIO, SELECT, SLIDER, RATING, EMOJI],
  [EMOJI]: [TEXT, TEXTAREA, RADIO, SELECT, SLIDER, RATING, EMOJI],
  [DATE]: [DATE, TIME, DATETIME],
  [TIME]: [DATE, TIME, DATETIME],
  [DATETIME]: [DATE, TIME, DATETIME],
  [FILE]: [FILE],
};

export const defaultQuestion = {
  title: "Pregunta sin título",
  type: TEXT,
  required: false,
  specialType: "",
};

export const defaultOption = "Opción 1";

export const DEFAULT_LABEL = "Respuestas";

export const BACKGROUND_COLORS = [
  "rgba(255, 64, 129, 0.2)",
  "rgba(0, 230, 118, 0.2)",
  "rgba(255, 241, 118, 0.2)",
  "rgba(132, 255, 255, 0.2)",
  "rgba(179, 136, 255, 0.2)",
  "rgba(255, 145, 128, 0.2)",
  "rgba(83, 109, 254, 0.2)",
  "rgba(29, 233, 182, 0.2)",
  "rgba(186, 104, 200, 0.2)",
  "rgba(244, 143, 177, 0.2)",
  "rgba(255, 204, 128, 0.2)",
  "rgba(124, 77, 255, 0.2)",
  "rgba(204, 255, 144, 0.2)",
];

export const BORDER_COLORS = [
  "rgba(255, 64, 129, 1)",
  "rgba(0, 230, 118, 1)",
  "rgba(255, 241, 118, 1)",
  "rgba(132, 255, 255, 1)",
  "rgba(179, 136, 255, 1)",
  "rgba(255, 145, 128, 1)",
  "rgba(83, 109, 254, 1)",
  "rgba(29, 233, 182, 1)",
  "rgba(186, 104, 200, 1)",
  "rgba(244, 143, 177, 1)",
  "rgba(255, 204, 128, 1)",
  "rgba(124, 77, 255, 1)",
  "rgba(204, 255, 144, 1)",
];
