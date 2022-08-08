import {
  CHECKBOX,
  DATE,
  DATETIME,
  EMOJI,
  FILE,
  NUMERIC,
  RADIO,
  RATING,
  SELECT,
  SLIDER,
  SORTABLE,
  TEXT,
  TEXTAREA,
  TIME,
} from "./constants";
import { textConfig } from "./text";
import { checkboxConfig } from "./checkbox";
import { QuestionTypeConfig } from "./types";
import { textareaConfig } from "./textarea";
import { radioConfig } from "./radio";
import { selectConfig } from "./select";
import { sortableConfig } from "./sortable";
import { sliderConfig } from "./slider";
import { ratingConfig } from "./rating";
import { dateConfig } from "./date";
import { timeConfig } from "./time";
import { dateTimeConfig } from "./datetime";
import { fileConfig } from "./file";
import { emojiConfig } from "./emoji";
import { numericConfig } from "./numeric";

// TODO: See if 'string' can be replaced with 'QuestionType' or something
export const questionTypesConfig: Record<
  string,
  QuestionTypeConfig<any, any, any>
> = {
  [TEXT]: textConfig,
  [TEXTAREA]: textareaConfig,
  [NUMERIC]: numericConfig,
  [RADIO]: radioConfig,
  [CHECKBOX]: checkboxConfig,
  [SELECT]: selectConfig,
  [SORTABLE]: sortableConfig,
  [SLIDER]: sliderConfig,
  [RATING]: ratingConfig,
  [EMOJI]: emojiConfig,
  [DATE]: dateConfig,
  [TIME]: timeConfig,
  [DATETIME]: dateTimeConfig,
  [FILE]: fileConfig,
};

export const questionTypes = Object.keys(questionTypesConfig).map((key) => ({
  value: key,
  label: questionTypesConfig[key].label,
}));
