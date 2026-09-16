import { createHash, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN_SHA256 =
  "b9511953f97719a776a229b661c38e2763b3fbbbe21f90fee3d35018aab97e4c";
const EXPIRES_AT = Date.UTC(2026, 8, 18, 20, 59, 59);
const USED_COOKIE = "poa_owner_smoke_used";

type RouteContext = {
  params: Promise<{ token: string }>;
};

function isValidToken(token: string) {
  const received = Buffer.from(createHash("sha256").update(token).digest("hex"));
  const expected = Buffer.from(TOKEN_SHA256);

  return (
    Date.now() <= EXPIRES_AT &&
    received.length === expected.length &&
    timingSafeEqual(received, expected)
  );
}

function wasUsed(request: Request) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .some((item) => item.trim() === `${USED_COOKIE}=1`);
}

function htmlResponse(title: string, content: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="margin:0;background:#f8f6f2;color:#17324d;font-family:Arial,sans-serif"><main style="max-width:620px;margin:10vh auto;padding:32px"><section style="background:#fffdf8;border:1px solid rgba(23,50,77,.15);border-radius:24px;padding:32px"><h1 style="margin:0 0 16px;font-family:Georgia,serif">${title}</h1>${content}</section></main></body></html>`,
    {
      status,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Security-Policy":
          "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
        "Content-Type": "text/html; charset=utf-8",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    },
  );
}

function unavailableResponse() {
  return htmlResponse(
    "Ссылка недоступна",
    "<p style=\"line-height:1.6\">Временная ссылка недействительна, уже использована в этом браузере или истекла.</p>",
    410,
  );
}

export async function GET(request: Request, context: RouteContext) {
  const { token } = await context.params;

  if (!isValidToken(token) || wasUsed(request)) {
    return unavailableResponse();
  }

  return htmlResponse(
    "Проверка оплаты 1 ₽",
    `<p style="line-height:1.6">Введите email владельца. После нажатия откроется защищенная страница Robokassa с суммой 1 ₽.</p><form method="post" style="margin-top:24px"><label style="display:block;font-weight:700;margin-bottom:8px" for="email">Email для письма с доступом</label><input id="email" name="email" type="email" autocomplete="email" required style="box-sizing:border-box;width:100%;padding:14px;border:1px solid rgba(23,50,77,.25);border-radius:12px;font-size:16px"><button type="submit" style="margin-top:18px;width:100%;padding:15px;border:0;border-radius:999px;background:#17324d;color:white;font-size:16px;font-weight:700;cursor:pointer">Перейти к оплате 1 ₽</button></form>`,
  );
}

export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;

  if (!isValidToken(token) || wasUsed(request)) {
    return unavailableResponse();
  }

  const ownerSecret = process.env.OWNER_PAYMENT_SMOKE_SECRET?.trim() ?? "";

  if (ownerSecret.length < 32) {
    return htmlResponse(
      "Проверка временно недоступна",
      "<p style=\"line-height:1.6\">Production-секрет не подключен к текущему deployment.</p>",
      503,
    );
  }

  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return htmlResponse(
      "Некорректный email",
      "<p style=\"line-height:1.6\">Вернитесь назад и укажите корректный email.</p>",
      400,
    );
  }

  const createResponse = await fetch(
    new URL("/api/payment/owner-smoke/create", request.url),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ownerSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name: "Владелец проекта" }),
      cache: "no-store",
    },
  );
  const result = (await createResponse.json()) as { paymentUrl?: string };

  if (!createResponse.ok || !result.paymentUrl) {
    return htmlResponse(
      "Не удалось создать платеж",
      "<p style=\"line-height:1.6\">Обновите deployment и повторите попытку по исходной ссылке.</p>",
      502,
    );
  }

  return new Response(null, {
    status: 303,
    headers: {
      "Cache-Control": "no-store",
      Location: result.paymentUrl,
      "Referrer-Policy": "no-referrer",
      "Set-Cookie": `${USED_COOKIE}=1; Path=/owner-payment-smoke; Max-Age=172800; HttpOnly; Secure; SameSite=Strict`,
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}
