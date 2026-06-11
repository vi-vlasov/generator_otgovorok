import { SITUATIONS } from "./excuses";
import type { GeneratedExcuse, SituationId } from "./types";

const STORAGE_KEY = "generator_otgovorok:last-excuse";

const VALID_SITUATION_IDS = new Set<SituationId>(
  SITUATIONS.map((situation) => situation.id),
);

function isSituationId(value: unknown): value is SituationId {
  return typeof value === "string" && VALID_SITUATION_IDS.has(value as SituationId);
}

function isGeneratedExcuse(value: unknown): value is GeneratedExcuse {
  if (!value || typeof value !== "object") return false;

  const excuse = value as GeneratedExcuse;

  return (
    typeof excuse.text === "string" &&
    excuse.text.length > 0 &&
    typeof excuse.plausibility === "number" &&
    excuse.plausibility >= 35 &&
    excuse.plausibility <= 99 &&
    isSituationId(excuse.situationId)
  );
}

export function loadSavedExcuse(): GeneratedExcuse | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    return isGeneratedExcuse(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveExcuse(excuse: GeneratedExcuse): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(excuse));
  } catch {
    // private mode, quota exceeded
  }
}

export function clearSavedExcuse(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
