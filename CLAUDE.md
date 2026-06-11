@AGENTS.md

# Генератор отмазок — кратко для Claude

**Что это:** одностраничный SPA «Генератор отмазок» — выбор ситуации → генерация отмазки → рейтинг правдоподобности → копирование в буфер.

**Главное правило:** проект работает на **vinext**, не на стандартном Next.js toolchain. `npm run dev` = `vinext dev`.

**Где править код:**

- UI и состояние → `components/ExcuseGenerator.tsx`
- Шаблоны и логика генерации → `lib/excuses.ts`, типы → `lib/types.ts`
- Layout / SEO / шрифт → `app/layout.tsx`
- Фон страницы → `app/page.tsx` (градиентные blob'ы + `min-h-svh`)

**Не делать без запроса:** бэкенд, AI-API, новые markdown-файлы, коммиты, деплой.

**Типичные задачи:**

- Новая ситуация → `SituationId` + `SITUATIONS` + `EXCUSES` в `lib/excuses.ts`
- Проблема с высотой фона на desktop → проверить `min-h-svh` на `html`, `body`, обёртке страницы
- Новый интерактивный блок → client component с `"use client"`
