# FINAL READY REPORT

Дата проверки: 29 июля 2026

## Что исправлено

### ESLint

- Добавлен script `lint` в `package.json`.
- Добавлены dev-зависимости:
  - `eslint`
  - `eslint-config-next`
  - `@next/eslint-plugin-next`
  - `typescript-eslint`
- Создан `eslint.config.mjs` на базе `eslint-config-next/core-web-vitals`.
- В ESLint исключены служебные/generated директории и файлы:
  - `.next/**`
  - `.pnpm-store/**`
  - `node_modules/**`
  - `out/**`
  - `dist/**`
  - `content-import/**`
  - `content-import /**`
  - `next-env.d.ts`
- Отключены только правила, конфликтующие с уже существующей рабочей архитектурой:
  - `@next/next/no-html-link-for-pages` — чтобы не менять существующую навигацию на `next/link`;
  - `react/display-name` — из-за несовместимости правила в связке React plugin / текущая конфигурация;
  - `react-hooks/set-state-in-effect` — чтобы не менять рабочую логику восстановления результата тестов из `localStorage`.

Результат прямой проверки:

```bash
eslint .
```

Статус: успешно.

Примечание по окружению: в текущей Codex-среде `npm` не доступен в PATH, а `pnpm run lint` через fallback-pnpm пытается пересоздавать `node_modules` и требует сетевой доступ. Поэтому фактическая lint-проверка выполнена напрямую через локальный бинарь ESLint.

### Бренд

- Основной бренд обновлён на `POA CALLING`.
- Пояснение сохранено как `Академия профессионального развития`.
- Проверены и обновлены:
  - metadata/Open Graph;
  - header;
  - footer;
  - hero;
  - юридические страницы;
  - сертификатные компоненты;
  - страницы курса;
  - author-поля снабжения;
  - брендовая вставка в AI-задании.

Контрольный поиск не нашёл:

- `Академия профессий`;
- `academy.ru`;
- `APR-2026-000001`;
- `Завершённый курс`.

### Сертификат

- Обновлён единый raster-шаблон сертификата:
  - `public/images/certificates/certificate-template.png`
- Из шаблона удалены:
  - старый URL `academy.ru/certificate`;
  - демонстрационный номер `APR-2026-000001`.
- В верхней части шаблона указан бренд:
  - `POA CALLING`;
  - `Академия профессионального развития`.
- Отдельная подпись поверх изображения не добавлялась.
- QR-код и визуальная структура сертификата сохранены.

### Изображения

Оптимизированы реально используемые тяжёлые изображения больше 2 МБ через JPEG-копии без изменения размеров:

- `public/images/hr/hr-basic.jpg` — используется вместо `public/images/hr/hr-basic.png`;
- `public/images/hr/hr-practice.jpg` — используется вместо `public/images/hr/hr-practice.png`;
- `public/images/hero/academy-og.jpg` — используется вместо тяжёлого Open Graph PNG.

Исходные PNG-файлы не удалялись, чтобы не потерять пользовательские assets без отдельного запроса на удаление.

### Overflow

Исправлены потенциальные переполнения длинных строк:

- hero-заголовок;
- H1 страниц профессий;
- карточки быстрых фактов;
- карточки карьерной траектории;
- заголовок блока сертификата.

## Проверки

### TypeScript

```bash
tsc --noEmit
```

Статус: успешно.

### ESLint

```bash
eslint .
```

Статус: успешно.

### Production Build

```bash
next build
```

Статус: успешно.

Сборка прошла без предупреждения о неподключённом Next ESLint config.

### Route Audit

Проверено 86 маршрутов курса и публичных страниц.

Статус: проблем 0.

Дополнительно после финальной сборки проверены ключевые маршруты:

- `/`
- `/robots.txt`
- `/sitemap.xml`
- `/privacy`
- `/offer`
- `/terms`
- `/verify`
- `/certificate/DEMO-2026-000001`
- `/profession/supply`
- `/profession/hr`
- `/profession/tourism`
- `/profession/logistics`
- `/profession/ai`
- `/course/supply/basic`
- `/course/hr/basic`
- `/course/tourism/basic`
- `/course/logistics/basic`
- `/course/ai/basic`
- `/course/ai/basic/block-1-test`
- `/course/logistics/basic/final-exam`
- произвольный несуществующий URL

Статус: проблем 0.

### Responsive Audit

Проверены ширины:

- desktop: 1440 px;
- tablet: 768 px;
- mobile: 390 px.

Проверенные страницы:

- `/`
- `/profession/logistics`
- `/profession/hr`
- `/course/ai/basic/assessment`
- `/certificate/DEMO-2026-000001`

Результат:

- горизонтального overflow нет;
- console errors нет.

## Изменённые файлы

- `package.json`
- `pnpm-lock.yaml`
- `eslint.config.mjs`
- `app/layout.tsx`
- `app/privacy/page.tsx`
- `app/offer/page.tsx`
- `app/terms/page.tsx`
- `app/course/[slug]/[level]/page.tsx`
- `app/profession/[slug]/page.tsx`
- `components/Header.tsx`
- `components/Footer.tsx`
- `components/Hero.tsx`
- `components/Certificate.tsx`
- `components/CertificateAccess.tsx`
- `components/CertificateCard.tsx`
- `components/CertificateSection.tsx`
- `components/SalaryCard.tsx`
- `components/CareerPath.tsx`
- `data/images.ts`
- `data/professions/supply/basic.ts`
- `data/professions/supply/practice.ts`
- `data/professions/supply/pro.ts`
- `data/professions/ai/lessons-block-3.ts`
- `public/images/certificates/certificate-template.png`

## Созданные файлы

- `eslint.config.mjs`
- `public/images/hr/hr-basic.jpg`
- `public/images/hr/hr-practice.jpg`
- `public/images/hero/academy-og.jpg`
- `FINAL_READY_REPORT.md`

## Осталось решить владельцу

- Утвердить реальный production-домен и задать `NEXT_PUBLIC_SITE_URL` / `SITE_URL`.
- Настроить production-секреты доступа после выбора хостинга.
- Решить, нужно ли удалять старые PNG-исходники, которые теперь не используются в runtime.

## Итог

Проект технически готов к следующему шагу публикации: сборка проходит, lint настроен, публичные маршруты отвечают, responsive-smoke чистый, сертификат и бренд приведены к текущему виду.
