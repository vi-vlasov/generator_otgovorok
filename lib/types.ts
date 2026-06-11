export type SituationId =
  | "work_late"
  | "homework"
  | "birthday"
  | "meeting"
  | "no_reply"
  | "deadline";

export type Situation = {
  id: SituationId;
  title: string;
  emoji: string;
  description: string;
};

export type ExcuseTemplate = {
  text: string;
  plausibility: number;
};

export type GeneratedExcuse = {
  text: string;
  plausibility: number;
  situationId: SituationId;
};
