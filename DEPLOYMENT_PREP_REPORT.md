# DEPLOYMENT PREP REPORT

Проект: **POA CALLING — Академия профессионального развития**

Дата проверки: 2026-07-29

## 1. Готовность к GitHub

**Статус:** технически готов к созданию первого commit после финального просмотра владельцем.

Git уже инициализирован.

- Текущая ветка: `main`
- Состояние: `No commits yet on main`
- Все исходные файлы сейчас отображаются как untracked, потому что первого commit ещё не было.
- Remote GitHub не подключён.
- `git push` не выполнялся.

## 2. Готовность к Vercel

**Статус:** технически готов к импорту в Vercel как Next.js-проект.

Проверено:

- проект определяется как Next.js;
- `next.config.ts` не задаёт ошибочный `output directory`;
- отдельный сервер не требуется;
- `vercel.json` не требуется;
- публичные assets находятся в `public/`;
- ссылки на изображения проверены: отсутствующих `/images/...` файлов не найдено;
- production-домен в коде не захардкожен;
- `metadata`, `robots.ts` и `sitemap.ts` используют `NEXT_PUBLIC_SITE_URL` или `SITE_URL`.

## 3. Текущая ветка Git

`main`

## 4. Какие файлы изменены на этом этапе

Изменены или созданы только служебные файлы подготовки к публикации:

- `.gitignore`
- `.env.example`
- `DEPLOYMENT_PREP_REPORT.md`

Сайт, дизайн, страницы, курсы, уроки, тесты, сертификат, изображения и бизнес-логика доступа не изменялись.

## 5. Какие файлы не должны попасть в репозиторий

Проверено, что `.gitignore` исключает:

- `node_modules`
- `.next`
- `out`
- `dist`
- `.pnpm-store`
- `.env`
- `.env.local`
- `.env.production`
- `.env.*.local`
- `.DS_Store`
- `*.tsbuildinfo`
- `*.log`
- `*.tmp`
- `*-debug.png`
- `*-screenshot.png`
- `.vscode`
- `.idea`
- `.codex`
- `.agents`
- `.vercel`

Файл `.env.example` намеренно оставлен доступным для репозитория и не содержит настоящих секретов.

На диске найдены локальные папки:

- `.next`
- `.pnpm-store`
- `node_modules`

Они являются служебными и игнорируются Git.

## 6. Env-переменные для Vercel

Для временной публикации:

| Переменная | Обязательность | Значение |
|---|---:|---|
| `NEXT_PUBLIC_SITE_URL` | рекомендуется | временный URL Vercel после первого deploy или будущий production URL |
| `SITE_URL` | опционально | server-side fallback для sitemap/robots/metadata |

Для production-доступа к защищённым материалам:

| Переменная | Обязательность | Значение |
|---|---:|---|
| `ACCESS_TOKEN_SECRET` | обязательно перед реальным запуском доступа | сильный случайный секрет, задаётся только в Vercel Environment Variables |

Будущие интеграции, которые сейчас не подключаются:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`
- `CRM_API_URL`
- `CRM_API_KEY`
- `PAYMENT_PROVIDER`
- `PAYMENT_SHOP_ID`
- `PAYMENT_SECRET_KEY`
- `PAYMENT_WEBHOOK_SECRET`
- `CERTIFICATE_REGISTRY_SECRET`

Эти переменные не нужны для текущей временной публикации, если не подключаются почта, CRM, оплата и расширенная защита реестра сертификатов.

## 7. Найденные секреты

Реальные секреты, токены, API keys, пароли и приватные ключи в исходниках не обнаружены.

Найдены только:

- имя переменной `ACCESS_TOKEN_SECRET`;
- безопасный пустой шаблон в `.env.example`;
- development fallback `development-only-change-this-access-token-secret` в `lib/course-access.ts`;
- упоминания будущих env-переменных в технических отчётах.

Перед production нужно обязательно задать реальный `ACCESS_TOKEN_SECRET` в Vercel и не коммитить его в репозиторий.

## 8. Нужен ли vercel.json

**Нет.**

Текущая структура подходит для стандартного Vercel Next.js preset:

- Framework Preset: `Next.js`
- Build Command: оставить default или использовать script `build`
- Output Directory: оставить пустым/default
- Install Command: оставить default; Vercel определит пакетный менеджер по lock-файлу

## 9. Результаты проверок

Проверки выполнены локальными бинарями из `node_modules`, потому что в текущем Codex runtime команда `npm` недоступна в PATH.

| Проверка | Команда | Результат |
|---|---|---|
| TypeScript | `tsc --noEmit` | успешно |
| ESLint | `eslint .` | успешно |
| Production build | `next build` | успешно |
| Изображения | проверка всех `/images/...` ссылок | 41 ссылка, 0 отсутствующих файлов |

Production build:

- Next.js `15.5.19`
- Compile: успешно
- Type checking: успешно
- Static generation: успешно

## 10. Инструкция для владельца

### Шаг 1. Создать или выбрать репозиторий GitHub

Рекомендуется сначала создать private repository, затем открыть его публично только после финальной проверки.

### Шаг 2. Проверить локальный статус

```bash
git status
git status --ignored
```

Убедиться, что в commit не попадают:

- `.env`
- `.env.local`
- `.env.production`
- `.next`
- `node_modules`
- `.pnpm-store`
- `.vercel`
- `.codex`
- `.agents`
- debug/screenshot-файлы

### Шаг 3. Сделать первый commit

```bash
git add .
git commit -m "Prepare POA Calling platform for deployment"
```

### Шаг 4. Подключить GitHub remote

```bash
git remote add origin <github-repository-url>
git push -u origin main
```

Эти команды должен выполнить владелец проекта. На этом этапе автоматический `git push` не выполнялся.

### Шаг 5. Импортировать проект в Vercel

В Vercel:

1. Add New Project.
2. Import Git Repository.
3. Выбрать репозиторий POA CALLING.
4. Framework Preset: `Next.js`.
5. Build Command: оставить default или использовать `npm run build` / `pnpm run build` в зависимости от того, что предложит Vercel.
6. Output Directory: оставить default.
7. Install Command: оставить default.

### Шаг 6. Настроить env в Vercel

Для первого временного deploy можно не придумывать домен заранее.

Рекомендуемый порядок:

1. Сделать первый deploy.
2. Получить временный URL Vercel.
3. Добавить `NEXT_PUBLIC_SITE_URL` со значением временного URL.
4. Добавить `ACCESS_TOKEN_SECRET` перед реальным использованием защищённого доступа.
5. Redeploy.

### Шаг 7. Проверить временный сайт

После публикации проверить:

- `/`
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
- `/verify`
- `/robots.txt`
- `/sitemap.xml`
- `/certificate/DEMO-2026-000001`

### Шаг 8. Что не делать на этом этапе

- не подключать `poacalling.ru`;
- не подключать `poacalling.com`;
- не менять DNS;
- не подключать оплату;
- не подключать CRM;
- не подключать email-рассылки;
- не добавлять настоящие секреты в код или commit.

## Итог

Проект готов к созданию GitHub-репозитория и импорту в Vercel для временной публикации.

Для production-запуска владельцу нужно будет отдельно:

- выбрать и подтвердить настоящий домен;
- добавить `NEXT_PUBLIC_SITE_URL`;
- добавить `ACCESS_TOKEN_SECRET`;
- при необходимости подключить почту, CRM и оплату отдельными этапами.
