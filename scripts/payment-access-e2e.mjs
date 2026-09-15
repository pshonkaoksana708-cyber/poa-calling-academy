import assert from "node:assert/strict";

const appOrigin = process.env.E2E_APP_ORIGIN ?? "http://127.0.0.1:3014";
const mockOrigin = process.env.E2E_MOCK_ORIGIN ?? "http://127.0.0.1:4014";

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

console.log("PASS: local Robokassa/Resend E2E for all three logistics packages");
