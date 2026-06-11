<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Генератор отмазок

Одностраничный веб-сервис на **vinext** (Next.js 16 App Router поверх Vite). Пользователь выбирает ситуацию, получает креативную отмазку с рейтингом правдоподобности и может скопировать текст.

## Стек

| Слой | Технология |
|------|------------|
| Runtime / сборка | **vinext** (основной), Next.js 16.2.9 (зависимость API) |
| UI | React 19, TypeScript |
| Стили | Tailwind CSS v4 (`@import "tailwindcss"`) |
| Шрифт | Rubik через `next/font/google` (latin + cyrillic) |
| Деплой (опционально) | `vinext deploy` → Cloudflare Workers |

**Важно:** для разработки и сборки используйте `npm run dev` / `build` / `start` — это **vinext**, не `next dev`. Скрипты `dev:next`, `build:next`, `start:next` — запасной вариант на чистом Next.js.

## Команды

```bash
npm run dev      # vinext dev (HMR), обычно http://localhost:3000
npm run build    # production build → dist/
npm run start    # локальный production-сервер
npm run lint     # eslint
```

## Структура проекта

```
app/
  layout.tsx       # корневой layout, metadata, шрифт Rubik, lang="ru"
  page.tsx         # главная: фон с градиентными blob'ами + ExcuseGenerator
  globals.css      # Tailwind v4, CSS-переменные темы
components/
  ExcuseGenerator.tsx   # "use client" — весь интерактив UI
lib/
  types.ts         # SituationId, Situation, ExcuseTemplate, GeneratedExcuse
  excuses.ts       # ситуации, шаблоны отмазок, generateExcuse()
vite.config.ts   # plugins: [vinext()]
```

## Как работает генерация

- **Без бэкенда и без AI** — чисто на клиенте.
- Шаблоны в `lib/excuses.ts` с плейсхолдерами `{minutes}`, `{floor}`, `{pet}` и т.д.
- `generateExcuse(situationId)` выбирает случайный шаблон, подставляет переменные, добавляет jitter к `plausibility` (±8, clamp 35–99).
- `getPlausibilityLabel()` возвращает подпись и тон шкалы (high / mid / low).
- Искусственная задержка 420 ms в UI при генерации — только для анимации.

### Ситуации (`SituationId`)

| id | Название |
|----|----------|
| `work_late` | Опоздал на работу |
| `homework` | Не сделал домашку |
| `birthday` | Забыл про день рождения |

Чтобы добавить ситуацию: расширить `SituationId`, массив `SITUATIONS`, объект `EXCUSES` и при необходимости `VARIABLES` в `lib/excuses.ts`.

## UI и дизайн

- Язык интерфейса: **русский**.
- Тёмная тема: фон `#120a24`, градиентные «blob'ы» (fuchsia / amber / violet) в `app/page.tsx`.
- Кнопка копирования формирует текст: ситуация + отмазка + процент правдоподобности → `navigator.clipboard.writeText`.
- Для полноэкранного фона использовать **`min-h-svh`**, не `min-h-full`: процентная высота в flex-цепочке не гарантирует заполнение viewport при коротком контенте.

## Соглашения при изменениях

- Минимальный diff; не трогать лишнее.
- Новая интерактивность — client component (`"use client"`), server components по умолчанию в `app/`.
- Стили — Tailwind inline-классы, как в существующих компонентах.
- Импорты через alias `@/*`.
- Не добавлять `.md`-файлы и тесты без явной просьбы пользователя.
- Не коммитить секреты (`.env`, ключи API).

## Ограничения vinext

- Экспериментальный проект; ~94% API Next.js 16.
- `next/image` — частичная поддержка; локальные SVG в `public/` работают.
- Google Fonts грузятся через CDN/runtime vinext, не self-hosted.
- Основная цель деплоя — Cloudflare Workers; для других платформ — Nitro plugin.

## Полезные ссылки

- [vinext docs](https://cloudflare-vinext.mintlify.app/introduction)
- [vinext GitHub](https://github.com/cloudflare/vinext)
