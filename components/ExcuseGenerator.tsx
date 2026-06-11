"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  generateExcuse,
  getPlausibilityLabel,
  SITUATIONS,
} from "@/lib/excuses";
import {
  clearSavedExcuse,
  loadSavedExcuse,
  saveExcuse,
} from "@/lib/storage";
import type { GeneratedExcuse, SituationId } from "@/lib/types";

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function ExcuseGenerator() {
  const [selected, setSelected] = useState<SituationId>("work_late");
  const [excuse, setExcuse] = useState<GeneratedExcuse | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [excuseRevealKey, setExcuseRevealKey] = useState(0);
  const generateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelGenerate = useCallback(() => {
    if (generateTimeoutRef.current !== null) {
      window.clearTimeout(generateTimeoutRef.current);
      generateTimeoutRef.current = null;
    }
    setGenerating(false);
  }, []);

  useEffect(() => {
    const saved = loadSavedExcuse();
    if (saved) {
      setExcuse(saved);
      setSelected(saved.situationId);
    }
  }, []);

  useEffect(() => {
    if (excuse) {
      saveExcuse(excuse);
    }
  }, [excuse]);

  useEffect(() => {
    return () => {
      if (generateTimeoutRef.current !== null) {
        window.clearTimeout(generateTimeoutRef.current);
      }
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleGenerate = useCallback(() => {
    cancelGenerate();
    setGenerating(true);
    setCopied(false);
    setCopyFailed(false);

    const situationId = selected;

    generateTimeoutRef.current = window.setTimeout(() => {
      generateTimeoutRef.current = null;
      setExcuse(generateExcuse(situationId));
      setExcuseRevealKey((key) => key + 1);
      setGenerating(false);
    }, 420);
  }, [selected, cancelGenerate]);

  const handleCopy = useCallback(async () => {
    if (!excuse) return;

    const situation = SITUATIONS.find((item) => item.id === excuse.situationId);
    const lines = [
      situation ? `Ситуация: ${situation.title}` : null,
      "",
      excuse.text,
      "",
      `Правдоподобность: ${excuse.plausibility}%`,
    ].filter((line) => line !== null) as string[];
    const message = lines.join("\n");

    const ok = await copyToClipboard(message);

    if (copyTimeoutRef.current !== null) {
      window.clearTimeout(copyTimeoutRef.current);
    }

    if (ok) {
      setCopied(true);
      setCopyFailed(false);
      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 2400);
    } else {
      setCopied(false);
      setCopyFailed(true);
      copyTimeoutRef.current = window.setTimeout(() => setCopyFailed(false), 2400);
    }
  }, [excuse]);

  const handleSelectSituation = useCallback(
    (situationId: SituationId) => {
      cancelGenerate();
      setSelected(situationId);
      setExcuse(null);
      clearSavedExcuse();
      setCopied(false);
      setCopyFailed(false);
    },
    [cancelGenerate],
  );

  const plausibility = excuse ? getPlausibilityLabel(excuse.plausibility) : null;

  const generateLabel = generating ? (
    <>
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-900/20 border-t-slate-900" />
      Придумываем...
    </>
  ) : excuse ? (
    <>Ещё одну</>
  ) : (
    <>✨ Сгенерировать отмазку</>
  );

  const copyLabel = copied
    ? "✓ Скопировано!"
    : copyFailed
      ? "Не удалось"
      : "📋 Скопировать";

  return (
    <div className="relative mx-auto w-full max-w-3xl pb-24 sm:pb-0">
      <header className="mb-6 animate-fade-in-up text-center sm:mb-10">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200 sm:mb-3 sm:px-4 sm:py-1.5 sm:text-sm">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-300" />
          Без нейросетей — чистая выдумка
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Генератор отмазок
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-violet-200/80 sm:mt-4 sm:text-lg">
          Выберите ситуацию — получите креативную отмазку с рейтингом правдоподобности.
        </p>
      </header>

      <section className="mb-4 sm:mb-8">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-300/70 sm:mb-4 sm:text-sm">
          Что случилось?
        </h2>
        <div className="scrollbar-none scroll-edge-fade -mx-1 -my-2 flex snap-x snap-mandatory items-center gap-2 overflow-x-auto px-1 py-4 pr-3 sm:mx-0 sm:my-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:px-0 sm:py-0 sm:pr-0 lg:grid-cols-3">
          {SITUATIONS.map((situation, index) => {
            const active = selected === situation.id;
            return (
              <button
                key={situation.id}
                type="button"
                aria-pressed={active}
                onClick={() => handleSelectSituation(situation.id)}
                style={{ animationDelay: `${index * 60}ms` }}
                className={[
                  "group animate-fade-in-up shrink-0 border text-left transition-all duration-300 ease-out",
                  "snap-start flex items-center gap-2 rounded-xl px-3 py-2.5",
                  "sm:shrink sm:flex-col sm:items-start sm:rounded-2xl sm:p-4",
                  "hover:-translate-y-0.5 active:scale-[0.98] sm:active:scale-[0.98]",
                  active
                    ? "border-amber-300/60 bg-white/12 shadow-[0_0_24px_rgba(251,191,36,0.12)] sm:scale-[1.02] sm:shadow-[0_0_40px_rgba(251,191,36,0.12)]"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-block shrink-0 text-lg transition-transform duration-300 sm:text-2xl",
                    active ? "scale-110" : "group-hover:scale-105",
                  ].join(" ")}
                >
                  {situation.emoji}
                </span>
                <span className="min-w-0">
                  <p className="whitespace-nowrap text-sm font-semibold text-white sm:mt-3 sm:whitespace-normal">
                    {situation.title}
                  </p>
                  <p className="mt-1 hidden text-sm text-violet-200/70 sm:block">
                    {situation.description}
                  </p>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="mb-4 hidden justify-center sm:mb-8 sm:flex">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 px-8 py-4 text-base font-bold text-slate-950 transition duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(251,191,36,0.35)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-80"
        >
          {generating && (
            <span className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="absolute inset-y-0 w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            </span>
          )}
          <span className="relative z-10 flex items-center gap-2">
            {generating ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-900/20 border-t-slate-900" />
                Придумываем...
              </>
            ) : (
              <>✨ Сгенерировать отмазку</>
            )}
          </span>
        </button>
      </div>

      <section
        aria-live="polite"
        aria-atomic="true"
        className={[
          "rounded-3xl border border-white/10 bg-white/6 p-4 backdrop-blur-md transition-all duration-500 ease-out sm:p-8",
          excuse ? "opacity-100 translate-y-0" : "opacity-60 translate-y-1",
          generating && excuse ? "scale-[0.99] opacity-80" : "",
        ].join(" ")}
      >
        {!excuse ? (
          <div className="py-10 text-center">
            <p className="animate-float text-5xl">🎭</p>
            <p className="mt-4 text-lg text-violet-200/70">
              Нажмите кнопку — и отмазка появится здесь
            </p>
          </div>
        ) : (
          <div key={excuseRevealKey} className="animate-fade-in-up">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-violet-300/70">
                  Ваша отмазка
                </p>
                <p className="mt-2 text-lg leading-relaxed text-white sm:text-xl">
                  {excuse.text}
                </p>
              </div>
            </div>

            <div className="mb-6 animate-scale-in rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm text-violet-200/70">Рейтинг правдоподобности</p>
                  <p className="font-display text-3xl font-bold text-white">
                    {excuse.plausibility}
                    <span className="text-lg text-violet-200/70">%</span>
                  </p>
                </div>
                {plausibility && (
                  <span
                    style={{ animationDelay: "120ms" }}
                    className={[
                      "animate-scale-in rounded-full px-3 py-1 text-sm font-medium",
                      plausibility.tone === "high" && "bg-emerald-400/15 text-emerald-200",
                      plausibility.tone === "mid" && "bg-amber-400/15 text-amber-200",
                      plausibility.tone === "low" && "bg-rose-400/15 text-rose-200",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {plausibility.label}
                  </span>
                )}
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className={[
                    "h-full rounded-full transition-[width] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    excuse.plausibility >= 75
                      ? "bg-gradient-to-r from-emerald-400 to-teal-300"
                      : excuse.plausibility >= 60
                        ? "bg-gradient-to-r from-amber-300 to-orange-300"
                        : "bg-gradient-to-r from-rose-400 to-fuchsia-400",
                  ].join(" ")}
                  style={{ width: `${excuse.plausibility}%` }}
                />
              </div>
            </div>

            <div className="hidden flex-col gap-3 sm:flex sm:flex-row">
              <button
                type="button"
                onClick={handleCopy}
                className={[
                  "flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-semibold transition-all duration-300",
                  copied
                    ? "scale-[1.02] bg-emerald-100 text-emerald-900"
                    : copyFailed
                      ? "bg-rose-100 text-rose-900"
                      : "bg-white text-slate-900 hover:bg-violet-50",
                ].join(" ")}
              >
                {copied
                  ? "✓ Скопировано!"
                  : copyFailed
                    ? "Не удалось скопировать"
                    : "📋 Скопировать и отправить"}
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="rounded-2xl border border-white/15 px-5 py-4 text-base font-medium text-white transition hover:bg-white/8 disabled:opacity-60"
              >
                Ещё одну
              </button>
            </div>
          </div>
        )}
      </section>

      <p className="mt-8 text-center text-sm text-violet-300/50">
        Используйте ответственно. Мы не несём ответственности за разговоры с HR.
      </p>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#120a24]/90 px-4 py-3 backdrop-blur-lg pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
        <div className="mx-auto flex w-full max-w-3xl gap-2">
          {excuse && (
            <button
              type="button"
              onClick={handleCopy}
              className={[
                "flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300",
                copied
                  ? "bg-emerald-100 text-emerald-900"
                  : copyFailed
                    ? "bg-rose-100 text-rose-900"
                    : "bg-white text-slate-900 active:bg-violet-50",
              ].join(" ")}
            >
              {copyLabel}
            </button>
          )}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className={[
              "group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 font-bold text-slate-950 transition active:scale-[0.98] disabled:cursor-wait disabled:opacity-80",
              excuse ? "px-5 py-3.5 text-sm" : "flex-1 px-4 py-3.5 text-sm",
            ].join(" ")}
          >
            {generating && (
              <span className="pointer-events-none absolute inset-0 overflow-hidden">
                <span className="absolute inset-y-0 w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/45 to-transparent" />
              </span>
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {generateLabel}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
