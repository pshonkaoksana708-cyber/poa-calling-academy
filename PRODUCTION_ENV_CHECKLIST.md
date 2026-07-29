# PRODUCTION ENV CHECKLIST

Дата проверки: 29 июля 2026

## Текущая ситуация

- Файлы `.env*` в корне проекта не найдены.
- Production-домен в коде жёстко не задан.
- SEO URL строится через переменные:
  - `NEXT_PUBLIC_SITE_URL`
  - `SITE_URL`
- Защищённый доступ к урокам использует:
  - `ACCESS_TOKEN_SECRET`
- В production нельзя оставлять fallback-секрет:
  - `development-only-change-this-access-token-secret`

## Обязательные переменные для production

| Переменная | Где используется | Текущее значение | Что указать перед запуском |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts` | Не задано в `.env` | Полный публичный URL сайта после выбора домена, например `https://...` |
| `SITE_URL` | fallback для metadata, robots, sitemap | Не задано в `.env` | Можно указать то же значение, что и `NEXT_PUBLIC_SITE_URL`, если хостинг использует server-only env |
| `ACCESS_TOKEN_SECRET` | `lib/course-access.ts` | Не задано в `.env`; в dev используется fallback | Сильный случайный секрет для подписи access-token в production |
| `NODE_ENV` | Next.js runtime и локальный preview-доступ | Управляется Next.js | На хостинге должно быть `production` |

## Рекомендуемые переменные после подключения внешних сервисов

Эти переменные сейчас не используются приложением напрямую, но понадобятся при подключении реальной отправки заявок, оплаты и писем:

| Группа | Возможные переменные | Назначение |
|---|---|---|
| Почта | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Отправка писем с доступом и уведомлений |
| Формы/CRM | `CRM_API_URL`, `CRM_API_KEY` | Передача заявок во внешнюю CRM |
| Оплата | `PAYMENT_PROVIDER`, `PAYMENT_SHOP_ID`, `PAYMENT_SECRET_KEY`, `PAYMENT_WEBHOOK_SECRET` | Приём оплаты и проверка webhook |
| Сертификаты | `CERTIFICATE_REGISTRY_SECRET` или отдельный backend key | Защита реестра сертификатов при расширении MVP |

## Что проверить после подключения домена

- `NEXT_PUBLIC_SITE_URL` содержит реальный production-домен без localhost.
- `/robots.txt` показывает `Sitemap: https://.../sitemap.xml`.
- `/sitemap.xml` содержит абсолютные production URL.
- Open Graph image строится от production-домена.
- Проверить preview ссылки:
  - `/`
  - `/profession/supply`
  - `/verify`
  - `/certificate/DEMO-2026-000001`

## Статус

Готово к настройке env на хостинге. Перед публикацией обязательно добавить реальный домен и `ACCESS_TOKEN_SECRET`.
