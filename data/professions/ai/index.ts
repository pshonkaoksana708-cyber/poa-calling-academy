import type { Profession, ProfessionLevel } from "@/data/professions/types";
import { aiProfession as aiBaseProfession } from "@/data/professions/placeholders";
import { aiBlock1Lessons } from "@/data/professions/ai/lessons-block-1";
import { aiBlock2Lessons } from "@/data/professions/ai/lessons-block-2";
import { aiBlock3Lessons } from "@/data/professions/ai/lessons-block-3";

type AiLessons = typeof aiBlock1Lessons;

function createLevel(input: {
  slug: "basic" | "practice" | "pro";
  title: string;
  label: string;
  duration: string;
  description: string;
  result: string;
  moduleTitle: string;
  moduleDescription: string;
  lessons: AiLessons;
}): ProfessionLevel {
  return {
    slug: input.slug,
    title: input.title,
    label: input.label,
    duration: input.duration,
    price: "Открытие скоро",
    level: input.slug,
    description: input.description,
    result: input.result,
    learningResult: aiBaseProfession.learningResult,
    modules: [
      {
        id: `ai-${input.slug}-module`,
        title: input.moduleTitle,
        description: input.moduleDescription,
        lessons: input.lessons.map((lesson) => ({
          id: `ai-${input.slug}-lesson-${lesson.lessonNumber}`,
          title: lesson.title,
          duration: "Самостоятельное изучение",
          content: [
            "Полный материал урока открыт отдельной страницей образовательной программы.",
            `Маршрут: ${
              input.slug === "basic"
                ? `/course/ai/basic/lesson-${lesson.lessonNumber}`
                : input.slug === "practice"
                  ? `/course/ai/basic/block-2/lesson-${lesson.lessonNumber}`
                  : `/course/ai/basic/block-3/lesson-${lesson.lessonNumber}`
            }`,
          ],
        })),
      },
    ],
  };
}

const aiBasicLevel = createLevel({
  slug: "basic",
  title: "Базовый уровень",
  label: "Старт профессии",
  duration: "1 блок / 10 уроков",
  description:
    "Знакомство с искусственным интеллектом, базовые инструменты, простые запросы, первые тексты, идеи, документы и практические задания без технической перегрузки.",
  result:
    "Пользователь получит первичное понимание ИИ и сможет выполнять первые типовые задачи.",
  moduleTitle: "Блок 1. Фундамент AI и профессиональная работа с нейросетями",
  moduleDescription:
    "Базовый блок из 10 уроков для входа в профессию специалиста по искусственному интеллекту.",
  lessons: aiBlock1Lessons,
});

const aiPracticeLevel = createLevel({
  slug: "practice",
  title: "Практический уровень",
  label: "Рабочие процессы",
  duration: "2 блока / 20 уроков",
  description:
    "Практическое применение ИИ в рабочих задачах: тексты, изображения, файлы, таблицы, документы, анализ информации и подготовка материалов.",
  result:
    "Пользователь сможет применять ИИ в рабочих процессах и создавать практические материалы.",
  moduleTitle: "Блок 2. Практическое применение AI в профессиях и бизнесе",
  moduleDescription:
    "Второй блок из 10 уроков для развития прикладных навыков работы с AI в профессиях, бизнесе и рабочих процессах.",
  lessons: aiBlock2Lessons,
});

const aiProLevel = createLevel({
  slug: "pro",
  title: "Профессиональный уровень",
  label: "Самостоятельная роль",
  duration: "3 блока / 30 уроков",
  description:
    "Самостоятельная работа с ИИ-процессами: планирование задач, подготовка контента, анализ данных, автоматизация рутины и применение ИИ в проектах или бизнесе.",
  result:
    "Пользователь сможет самостоятельно выстраивать ИИ-процессы под свои задачи, проект или бизнес.",
  moduleTitle: "Блок 3. Профессия AI-специалиста и внедрение AI",
  moduleDescription:
    "Третий блок из 10 уроков для перехода к профессиональной работе с AI-инструментами и внедрению искусственного интеллекта.",
  lessons: aiBlock3Lessons,
});

export const aiProfession: Profession = {
  ...aiBaseProfession,
  levels: [aiBasicLevel, aiPracticeLevel, aiProLevel],
};
