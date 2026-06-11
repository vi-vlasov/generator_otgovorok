import type { ExcuseTemplate, GeneratedExcuse, Situation, SituationId } from "./types";

export const SITUATIONS: Situation[] = [
  {
    id: "work_late",
    title: "Опоздал на работу",
    emoji: "⏰",
    description: "Босс уже смотрит на часы",
  },
  {
    id: "homework",
    title: "Не сделал домашку",
    emoji: "📚",
    description: "Завтра сдача, а тетрадь пустая",
  },
  {
    id: "birthday",
    title: "Забыл про день рождения",
    emoji: "🎂",
    description: "Поздравление уже должно было быть",
  },
  {
    id: "meeting",
    title: "Не пришёл на встречу",
    emoji: "📅",
    description: "В календаре красная точка, а вас нет",
  },
  {
    id: "no_reply",
    title: "Не ответил на сообщение",
    emoji: "💬",
    description: "Три галочки, ноль реакции",
  },
  {
    id: "deadline",
    title: "Просрочил дедлайн",
    emoji: "🔥",
    description: "Срок вышел, задача — нет",
  },
];

const VARIABLES: Record<string, string[]> = {
  minutes: ["17", "23", "31", "42", "58"],
  floor: ["7", "9", "12", "14", "18"],
  neighbor: ["сверху", "снизу", "слева", "справа"],
  pet: ["кошка", "собака", "попугай", "хомяк"],
  pet_action_alarm: [
    "кошка сбросила будильник с тумбочки",
    "собака сбросила будильник с тумбочки",
    "попугай сбросил будильник с тумбочки",
    "хомяк сбросил будильник с тумбочки",
  ],
  pet_action_homework: [
    "Кошка решила, что мой конспект — это новый вид игрушки",
    "Собака решила, что мой конспект — это новый вид игрушки",
    "Попугай решил, что мой конспект — это новый вид игрушки",
    "Хомяк решил, что мой конспект — это новый вид игрушки",
  ],
  extra_percent: ["15", "20", "25", "30", "40"],
  duration: ["3 часа", "5 часов", "7 часов", "12 часов", "сутки"],
  app: ["Яндекс.Карты", "2ГИС", "Google Maps", "Citymapper"],
  teacher: ["Ивановна", "Петровна", "Сергеевна", "Алексеевна"],
  gift: ["книгу", "наушники", "сертификат в SPA", "набор для барбекю"],
  messenger: ["Telegram", "WhatsApp", "Slack", "корпоративную почту"],
  project: ["отчёт", "презентацию", "ТЗ", "макет", "прототип"],
};

type Person = { name: string; gender: "m" | "f" };

const PEOPLE: Record<string, Person[]> = {
  friend: [
    { name: "Маша", gender: "f" },
    { name: "Дима", gender: "m" },
    { name: "Катя", gender: "f" },
    { name: "Оля", gender: "f" },
    { name: "Петя", gender: "m" },
  ],
  colleague: [
    { name: "Андрей", gender: "m" },
    { name: "Лена", gender: "f" },
    { name: "Максим", gender: "m" },
    { name: "Юля", gender: "f" },
  ],
};

const EXCUSES: Record<SituationId, ExcuseTemplate[]> = {
  work_late: [
    {
      text: "Утром сломался лифт на {floor} этаже — пришлось спускаться пешком с ноутбуком и сумкой. Вышел на {minutes} минут позже обычного, скрин из чата соседей могу переслать.",
      plausibility: 78,
    },
    {
      text: "На выезде из двора стояла пробка из-за ДТП — {app} показывал +{minutes} мин. Я даже сфотографировал экран на случай, если спросят.",
      plausibility: 85,
    },
    {
      text: "Сосед {neighbor} затопил квартиру ночью — спасал технику и документы до утра. Без этого сегодня бы вообще не вышел.",
      plausibility: 72,
    },
    {
      text: "Автобус объехал остановку — водитель не открыл двери, пришлось догонять на следующем. Опоздание ровно {minutes} минут, не больше.",
      plausibility: 68,
    },
    {
      text: "Проснулся от того, что {pet_action_alarm}. Пока искал телефон под кроватью — потерял ещё {minutes} минут.",
      plausibility: 61,
    },
    {
      text: "В подъезде отключили свет — ключи упали в темноте, искал их с фонариком соседа. Зато нашёл и ключи, и причину опоздания.",
      plausibility: 74,
    },
  ],
  homework: [
    {
      text: "{pet_action_homework}. Успела сделать только половину, остальное восстанавливаю по памяти и фото с доски.",
      plausibility: 58,
    },
    {
      text: "Флешка с файлом прошла цикл в стиралке на 60° — выжила, но Word открывает её как «документ неизвестного формата». Работа была, просто технически недоступна.",
      plausibility: 52,
    },
    {
      text: "Вчера вечером отключили интернет на {minutes} минут — как раз когда я загружал задание в систему. Сохранил локально, но платформа так и не приняла файл.",
      plausibility: 66,
    },
    {
      text: "Родители попросили срочно помочь с документами — без меня никак. Домашку начал, но {teacher} видела только черновик в тетради.",
      plausibility: 71,
    },
    {
      text: "Перепутал тетради: аккуратно выписал всё в дневник по биологии вместо математики. Содержание верное, формат — не тот.",
      plausibility: 63,
    },
    {
      text: "Ноутбук обновился ночью и перезагрузился в момент сохранения. Файл есть, но в нём только заголовок и одна строка «TODO: доделать».",
      plausibility: 55,
    },
  ],
  birthday: [
    {
      text: "Я готовил сюрприз настолько секретно, что забыл поздравить вовремя — {gift} уже заказана, просто доставка на завтра. Это была часть плана, честно.",
      plausibility: 64,
    },
    {
      text: "Календарь синхронизировался криво после смены часового пояса — напоминание пришло, когда день уже закончился. Подарок в процессе, поздравление — сейчас.",
      plausibility: 59,
    },
    {
      text: "{friend} {friend:просил|просила} не спойлерить праздник и «не поздравлять раньше времени». Я буквально выполнил инструкцию — возможно, слишком буквально.",
      plausibility: 67,
    },
    {
      text: "Писал поздравление в заметках, телефон разрядился на 1%. Включил — заметка сохранилась только как «С днём...» без продолжения.",
      plausibility: 56,
    },
    {
      text: "Думал, что праздник завтра — перепутал дату в групповом чате. Уже заказал {gift}, так что забывание было временным, а не полным.",
      plausibility: 62,
    },
    {
      text: "Весь день был на совещаниях без телефона. Как только вышел — сразу написал. Лучше поздно, чем никогда, и подарок уже в пути.",
      plausibility: 73,
    },
  ],
  meeting: [
    {
      text: "Застрял на предыдущем созвоне — {colleague} {colleague:затянул|затянула} демо на {minutes} минут. Пытался предупредить в чате, но сообщение ушло только когда встреча уже закончилась.",
      plausibility: 76,
    },
    {
      text: "Календарь показал встречу на час раньше из-за автоконвертации часового пояса. Я был готов вовремя — просто к другому времени в голове.",
      plausibility: 58,
    },
    {
      text: "Лифт + пробка на выезде из двора съели ровно {minutes} минут. Зашёл в зум с телефона из такси, но камера там — отдельная драма.",
      plausibility: 71,
    },
    {
      text: "Думал, что встречу перенесли: в переписке {colleague} {colleague:написал|написала} «давайте сдвинем», а финальное подтверждение я пропустил. Моя вина — не увидел итоговый слот.",
      plausibility: 64,
    },
    {
      text: "Ноутбук решил обновиться за {minutes} минут до начала и перезагрузился без спроса. Зашёл с телефона, но там не открывался нужный файл.",
      plausibility: 62,
    },
    {
      text: "Попал в блокировку здания — пропуск не сработал, охрана сверяла списки. Формально опоздал на {minutes} минут, фактически бежал с первого этажа.",
      plausibility: 69,
    },
  ],
  no_reply: [
    {
      text: "Увидел сообщение, начал отвечать развёрнуто — отвлекли на срочный звонок. Черновик в {messenger} до сих пор лежит, недописанный до конца.",
      plausibility: 67,
    },
    {
      text: "Телефон был в режиме «не беспокоить» после ночной презентации. Уведомление пришло, а я увидел его только через {duration} — не игнор, а режим выживания.",
      plausibility: 61,
    },
    {
      text: "Ждал, пока проверю цифры, чтобы не отвечать «ок» вслепую. Сверил данные с {colleague} — ответ получился точнее, но позже.",
      plausibility: 74,
    },
    {
      text: "Сообщение упало в папку «Другое» в почте — классика корпоративного фильтра. Нашёл только когда искал соседний тред.",
      plausibility: 66,
    },
    {
      text: "Писал ответ, {messenger} завис на отправке — крутил спиннер, потом приложение закрылось. Текст не сохранился, это бесит сильнее, чем молчание.",
      plausibility: 55,
    },
    {
      text: "Хотел ответить нормально, а не одним словом — собирал мысли. Получилось через {duration}, зато без «давайте созвонимся» вместо ответа.",
      plausibility: 70,
    },
  ],
  deadline: [
    {
      text: "Задача оказалась на {extra_percent}% больше по объёму — в ТЗ не было блока с согласованиями. Сделал основное, финальную полировку доделаю сегодня до вечера.",
      plausibility: 68,
    },
    {
      text: "Ждал данные от {colleague} — пришли за {duration} до дедлайна. Без них {project} собрать было нельзя, стартовал сразу как получил.",
      plausibility: 72,
    },
    {
      text: "Тестовый стенд лёг в день сдачи — деплой висел {minutes} минут. Код готов, в прод не попал только из-за инфраструктуры, не лени.",
      plausibility: 65,
    },
    {
      text: "Переприоритизировали спринт в середине недели — мой дедлайн сдвинули в переписке, но в трекере дата осталась старая. Я ориентировался на трекер.",
      plausibility: 59,
    },
    {
      text: "Нашёл баг в последний момент, который ломал весь сценарий. Лучше сдать на {duration} позже рабочее, чем отдать сломанное.",
      plausibility: 77,
    },
    {
      text: "Параллельно закрыл пожар от смежной команды — без этого сорвался бы релиз целиком. {project} чуть сдвинулся, зато критичный блок спасли.",
      plausibility: 71,
    },
  ],
};

function fillTemplate(text: string): string {
  const pickedPeople: Record<string, Person> = {};

  const getPerson = (key: string): Person => {
    if (!pickedPeople[key]) {
      const people = PEOPLE[key];
      if (!people?.length) return { name: `{${key}}`, gender: "m" };
      pickedPeople[key] = people[Math.floor(Math.random() * people.length)];
    }
    return pickedPeople[key];
  };

  return text.replace(
    /\{(\w+)(?::([^}|]+)\|([^}]+))?\}/g,
    (_, key: string, maleForm?: string, femaleForm?: string) => {
      if (key in PEOPLE) {
        const person = getPerson(key);
        if (maleForm && femaleForm) {
          return person.gender === "m" ? maleForm : femaleForm;
        }
        return person.name;
      }

      const options = VARIABLES[key];
      if (!options?.length) return `{${key}}`;
      return options[Math.floor(Math.random() * options.length)];
    },
  );
}

function jitter(value: number, range: number): number {
  const delta = Math.floor(Math.random() * (range * 2 + 1)) - range;
  return Math.min(99, Math.max(35, value + delta));
}

const FALLBACK_TEMPLATE: ExcuseTemplate = {
  text: "Технически я был готов объясниться, но генератор отмазок сейчас в творческом кризисе. Попробуйте ещё раз.",
  plausibility: 40,
};

const usedTemplateIndices = new Map<SituationId, Set<number>>();

function pickTemplate(situationId: SituationId): ExcuseTemplate {
  const templates = EXCUSES[situationId];

  if (!templates?.length) {
    return FALLBACK_TEMPLATE;
  }

  let used = usedTemplateIndices.get(situationId);

  if (!used) {
    used = new Set();
    usedTemplateIndices.set(situationId, used);
  }

  if (used.size >= templates.length) {
    used.clear();
  }

  const available = templates
    .map((_, index) => index)
    .filter((index) => !used!.has(index));
  const index = available[Math.floor(Math.random() * available.length)];

  used.add(index);
  return templates[index];
}

export function generateExcuse(situationId: SituationId): GeneratedExcuse {
  const template = pickTemplate(situationId);

  return {
    text: fillTemplate(template.text),
    plausibility: jitter(template.plausibility, 8),
    situationId,
  };
}

export function getPlausibilityLabel(score: number): { label: string; tone: "high" | "mid" | "low" } {
  if (score >= 75) return { label: "Почти незаметно", tone: "high" };
  if (score >= 60) return { label: "Рискованно, но жить можно", tone: "mid" };
  return { label: "Нужен талант актёра", tone: "low" };
}
