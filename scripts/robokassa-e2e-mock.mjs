import { createHash } from "node:crypto";
import { createServer } from "node:http";

const port = Number(process.env.MOCK_PORT ?? 4010);
const appOrigin = process.env.MOCK_APP_ORIGIN ?? "http://127.0.0.1:3000";
const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN ?? "e2e-merchant";
const password1 = process.env.ROBOKASSA_TEST_PASSWORD_1 ?? "e2e-password-one";
const password2 = process.env.ROBOKASSA_TEST_PASSWORD_2 ?? "e2e-password-two";
const paymentAgeDaysByPackage = {
  basic: Number(process.env.MOCK_BASIC_PAYMENT_AGE_DAYS ?? 0),
  pro: Number(process.env.MOCK_PRO_PAYMENT_AGE_DAYS ?? 7),
  full: Number(process.env.MOCK_FULL_PAYMENT_AGE_DAYS ?? 14),
};
const operations = new Map();
const emails = new Map();

function md5(value) {
  return createHash("md5").update(value).digest("hex");
}

function shpSuffix(searchParams) {
  return [...searchParams.entries()]
    .filter(([key]) => key.startsWith("Shp_"))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `:${key}=${value}`)
    .join("");
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function json(response, status, value) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(value));
}

function paymentSignature(searchParams) {
  const receipt = searchParams.get("Receipt");
  const receiptPart = receipt ? `:${receipt}` : "";

  return md5(
    `${searchParams.get("MerchantLogin")}:${searchParams.get("OutSum")}:${searchParams.get("InvId")}${receiptPart}:${password1}${shpSuffix(searchParams)}`,
  );
}

function resultSignature(operation) {
  return md5(
    `${operation.outSum}:${operation.invId}:${password2}${shpSuffix(operation.params)}`,
  );
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);

  if (url.pathname === "/reset") {
    operations.clear();
    emails.clear();
    return json(response, 200, { ok: true });
  }

  if (url.pathname === "/test-state") {
    return json(response, 200, {
      operations: [...operations.values()].map((operation) => ({
        invId: operation.invId,
        outSum: operation.outSum,
        packageSlug: operation.params.get("Shp_package"),
        stateCode: operation.stateCode,
        stateDate: operation.stateDate,
      })),
      emails: [...emails.values()],
    });
  }

  if (url.pathname === "/emails" && request.method === "POST") {
    const body = JSON.parse(await readBody(request));
    const idempotencyKey = request.headers["idempotency-key"];

    if (!idempotencyKey) {
      return json(response, 400, { message: "missing idempotency key" });
    }

    if (!emails.has(idempotencyKey)) {
      emails.set(idempotencyKey, {
        idempotencyKey,
        to: body.to,
        subject: body.subject,
        accessLink: body.html?.match(/href="([^"]+)"/)?.[1],
      });
    }

    return json(response, 200, { id: idempotencyKey });
  }

  if (
    url.pathname === "/Merchant/WebService/Service.asmx/OpStateExt"
  ) {
    const invId = url.searchParams.get("InvoiceID");
    const signature = url.searchParams.get("Signature") ?? "";
    const expected = md5(`${merchantLogin}:${invId}:${password2}`);
    const operation = operations.get(invId);

    if (signature.toLowerCase() !== expected) {
      response.writeHead(200, { "Content-Type": "application/xml" });
      return response.end(
        "<OperationStateResponse><Result><Code>1</Code></Result></OperationStateResponse>",
      );
    }

    if (!operation) {
      response.writeHead(200, { "Content-Type": "application/xml" });
      return response.end(
        "<OperationStateResponse><Result><Code>3</Code></Result></OperationStateResponse>",
      );
    }

    response.writeHead(200, { "Content-Type": "application/xml" });
    return response.end(
      `<OperationStateResponse><Result><Code>0</Code></Result><State><Code>${operation.stateCode}</Code><RequestDate>${operation.stateDate}</RequestDate><StateDate>${operation.stateDate}</StateDate></State><Info><OutSum>${operation.outSum}</OutSum></Info></OperationStateResponse>`,
    );
  }

  if (url.pathname === "/Merchant/Index.aspx") {
    if (
      url.searchParams.get("MerchantLogin") !== merchantLogin ||
      url.searchParams.get("SignatureValue")?.toLowerCase() !==
        paymentSignature(url.searchParams)
    ) {
      response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      return response.end("invalid payment signature");
    }

    const invId = url.searchParams.get("InvId");
    operations.set(invId, {
      invId,
      outSum: url.searchParams.get("OutSum"),
      params: new URLSearchParams(url.searchParams),
      stateCode: 5,
      stateDate: new Date().toISOString(),
    });
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return response.end(`<!doctype html><html lang="ru"><body>
      <h1>Тестовая Robokassa</h1>
      <p>Счёт ${invId}, пакет ${url.searchParams.get("Shp_package")}, сумма ${url.searchParams.get("OutSum")} ₽</p>
      <form method="post" action="/complete?InvId=${invId}"><button type="submit">Подтвердить оплату</button></form>
    </body></html>`);
  }

  if (url.pathname === "/complete" && request.method === "POST") {
    const invId = url.searchParams.get("InvId");
    const operation = operations.get(invId);

    if (!operation) {
      response.writeHead(404);
      return response.end("unknown operation");
    }

    if (operation.stateCode !== 100) {
      operation.stateCode = 100;
      const packageAgeDays =
        paymentAgeDaysByPackage[operation.params.get("Shp_package")];
      operation.stateDate = new Date(
        Date.now() - packageAgeDays * 24 * 60 * 60 * 1000,
      ).toISOString();
    }
    const callbackParams = new URLSearchParams({
      OutSum: operation.outSum,
      InvId: operation.invId,
      SignatureValue: resultSignature(operation),
    });

    for (const [key, value] of operation.params.entries()) {
      if (key.startsWith("Shp_")) {
        callbackParams.set(key, value);
      }
    }

    const callback = await fetch(`${appOrigin}/api/payment/result`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: callbackParams,
    });
    const callbackText = await callback.text();

    if (!callback.ok || callbackText !== `OK${invId}`) {
      response.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
      return response.end(`callback failed: ${callback.status} ${callbackText}`);
    }

    response.writeHead(303, {
      Location: `${appOrigin}/payment/success?InvId=${invId}`,
    });
    return response.end();
  }

  response.writeHead(404);
  response.end("not found");
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`Robokassa/Resend E2E mock listening on http://127.0.0.1:${port}\n`);
});
