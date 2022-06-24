export const TEXT = "text";
export const TEXTAREA = "textarea";
export const RADIO = "radio";
export const CHECKBOX = "checkbox";
export const SELECT = "select";
export const SORTABLE = "sortable";
export const SLIDER = "slider";
export const RATING = "rating";
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
  [SLIDER]: [TEXT, TEXTAREA, RADIO, SELECT, SLIDER, RATING],
  [RATING]: [TEXT, TEXTAREA, RADIO, SELECT, SLIDER, RATING],
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
