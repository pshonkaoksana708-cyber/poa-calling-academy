import assert from "node:assert/strict";

const appOrigin = process.env.E2E_APP_ORIGIN ?? "http://127.0.0.1:3014";
const mockOrigin = process.env.E2E_MOCK_ORIGIN ?? "http://127.0.0.1:4014";
const ownerSmokeSecret = process.env.OWNER_PAYMENT_SMOKE_SECRET;

assert.ok(ownerSmokeSecret, "OWNER_PAYMENT_SMOKE_SECRET is required");

for (const origin of [appOrigin, mockOrigin]) {
  const url = new URL(origin);

  assert.ok(
    url.hostname === "127.0.0.1" || url.hostname === "localhost",
    `Refusing to run payment E2E against non-local origin: ${origin}`,
  );
}

const packageCases = [
  {
    slug: "basic",
    amount: "4900.00",
    expectedBlocks: [true, false, false],
  },
  {
    slug: "pro",
    amount: "7900.00",
    expectedBlocks: [true, true, false],
  },
  {
    slug: "full",
    amount: "11900.00",
    expectedBlocks: [true, true, true],
  },
];
const blockRoutes = [
  "lesson-1",
  "block-2/lesson-1",
  "block-3/lesson-1",
];

await fetch(`${mockOrigin}/reset`);

async function createOwnerSmokePayment(suffix) {
  const createResponse = await fetch(
    `${appOrigin}/api/payment/owner-smoke/create`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ownerSmokeSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: `owner-smoke-${suffix}@example.com` }),
    },
  );
  assert.equal(createResponse.status, 200, `create owner smoke ${suffix}`);

  const payment = await createResponse.json();
  const paymentUrl = new URL(payment.paymentUrl);

  assert.equal(paymentUrl.origin, mockOrigin);
  assert.equal(paymentUrl.searchParams.get("OutSum"), "1.00");
  assert.equal(paymentUrl.searchParams.get("Shp_owner_smoke"), "1");

  const checkoutResponse = await fetch(paymentUrl);
  assert.equal(checkoutResponse.status, 200, `checkout owner smoke ${suffix}`);

  return payment;
}

async function sendTestResult(invId, options) {
  const response = await fetch(`${mockOrigin}/test-result-callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invId, ...options }),
  });
  assert.equal(response.status, 200, `mock callback ${invId}`);

  return response.json();
}

async function readState() {
  return (await fetch(`${mockOrigin}/test-state`)).json();
}

for (const outSum of ["1.000000", "1.00"]) {
  const suffix = outSum.replace(".", "-");
  const payment = await createOwnerSmokePayment(suffix);
  const callback = await sendTestResult(payment.invId, { outSum });

  assert.deepEqual(callback, {
    status: 200,
    text: `OK${payment.invId}`,
  });

  const state = await readState();
  const email = state.emails.find(
    (item) => item.idempotencyKey === `course-access-${payment.invId}`,
  );
  assert.ok(email, `owner smoke email for OutSum=${outSum}`);

  console.log(`PASS: owner smoke accepts signed OutSum=${outSum}`);
}

{
  const payment = await createOwnerSmokePayment("wrong-amount");
  const callback = await sendTestResult(payment.invId, { outSum: "1.01" });

  assert.deepEqual(callback, { status: 400, text: "bad amount" });

  const state = await readState();
  assert.equal(
    state.emails.some(
      (item) => item.idempotencyKey === `course-access-${payment.invId}`,
    ),
    false,
  );

  console.log("PASS: owner smoke rejects signed OutSum=1.01");
}

{
  const payment = await createOwnerSmokePayment("wrong-signature");
  const callback = await sendTestResult(payment.invId, {
    outSum: "1.000000",
    invalidSignature: true,
  });

  assert.deepEqual(callback, { status: 400, text: "bad sign" });

  const state = await readState();
  assert.equal(
    state.emails.some(
      (item) => item.idempotencyKey === `course-access-${payment.invId}`,
    ),
    false,
  );

  console.log("PASS: owner smoke rejects an invalid SignatureValue");
}

for (const packageCase of packageCases) {
  const createResponse = await fetch(`${appOrigin}/api/payment/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
    },
    body: JSON.stringify({
      package: `logistics:${packageCase.slug}`,
      name: "Локальный тест",
      email: `e2e-${packageCase.slug}@example.com`,
      phone: "+70000000000",
    }),
  });
  assert.equal(createResponse.status, 200, `create ${packageCase.slug}`);
  const payment = await createResponse.json();
  const paymentUrl = new URL(payment.paymentUrl);

  assert.equal(paymentUrl.origin, mockOrigin, "payment must use local mock");
  assert.equal(paymentUrl.searchParams.get("OutSum"), packageCase.amount);
  assert.equal(paymentUrl.searchParams.get("Shp_package"), packageCase.slug);
  assert.ok(payment.paymentStatusToken);

  const checkoutResponse = await fetch(paymentUrl);
  assert.equal(checkoutResponse.status, 200, `checkout ${packageCase.slug}`);

  const completeResponse = await fetch(
    `${mockOrigin}/complete?InvId=${payment.invId}`,
    { method: "POST", redirect: "manual" },
  );
  assert.equal(completeResponse.status, 303, `complete ${packageCase.slug}`);

  const statusResponse = await fetch(`${appOrigin}/api/payment/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
    },
    body: JSON.stringify({
      invId: payment.invId,
      statusToken: payment.paymentStatusToken,
    }),
  });
  assert.equal(statusResponse.status, 200, `status ${packageCase.slug}`);
  assert.deepEqual(await statusResponse.json(), {
    confirmed: true,
    emailSent: true,
  });

  const state = await (await fetch(`${mockOrigin}/test-state`)).json();
  const operation = state.operations.find(
    (item) => String(item.invId) === String(payment.invId),
  );
  const email = state.emails.find(
    (item) => item.idempotencyKey === `course-access-${payment.invId}`,
  );

  assert.equal(operation.outSum, packageCase.amount);
  assert.equal(
    operation.resultOutSum,
    Number(packageCase.amount).toFixed(6),
  );
  assert.equal(operation.stateCode, 100);
  assert.ok(email?.accessLink, `access email ${packageCase.slug}`);

  const accessToken = new URL(email.accessLink).searchParams.get("token");
  assert.ok(accessToken);

  for (const [index, blockRoute] of blockRoutes.entries()) {
    const response = await fetch(
      `${appOrigin}/course/logistics/basic/${blockRoute}?token=${encodeURIComponent(
        accessToken,
      )}`,
    );
    assert.equal(response.status, 200);
    const html = await response.text();
    const denied = html.includes("Нет доступа к уроку");

    assert.equal(
      denied,
      !packageCase.expectedBlocks[index],
      `${packageCase.slug}, direct block ${index + 1}`,
    );
  }

  const repeatedStatus = await fetch(`${appOrigin}/api/payment/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
    },
    body: JSON.stringify({
      invId: payment.invId,
      statusToken: payment.paymentStatusToken,
    }),
  });
  assert.equal(repeatedStatus.status, 200);

  const repeatedState = await (await fetch(`${mockOrigin}/test-state`)).json();
  const matchingEmails = repeatedState.emails.filter(
    (item) => item.idempotencyKey === `course-access-${payment.invId}`,
  );
  assert.equal(matchingEmails.length, 1, `idempotent email ${packageCase.slug}`);

  console.log(
    `PASS: logistics/${packageCase.slug}, ${packageCase.amount}, payment + email + access`,
  );
}

console.log(
  "PASS: local Robokassa/Resend E2E for owner smoke and all three logistics packages",
);
