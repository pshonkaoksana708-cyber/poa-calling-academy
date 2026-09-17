import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const appOrigin = "http://127.0.0.1:3014";
const mockOrigin = "http://127.0.0.1:4014";
const ownerSmokeSecret =
  "e2e-owner-smoke-secret-with-at-least-32-characters";
const testEnvironment = {
  ...process.env,
  ACCESS_EMAIL_FROM: "POA Calling <access@example.com>",
  ACCESS_TOKEN_SECRET: "e2e-access-token-secret-with-at-least-32-characters",
  E2E_APP_ORIGIN: appOrigin,
  E2E_MOCK_ORIGIN: mockOrigin,
  MOCK_APP_ORIGIN: appOrigin,
  MOCK_PORT: "4014",
  NEXT_PUBLIC_SITE_URL: appOrigin,
  NEXT_TELEMETRY_DISABLED: "1",
  NODE_ENV: "development",
  OWNER_PAYMENT_SMOKE_SECRET: ownerSmokeSecret,
  RESEND_API_KEY: "e2e-resend-api-key",
  RESEND_API_URL: `${mockOrigin}/emails`,
  ROBOKASSA_IS_TEST: "false",
  ROBOKASSA_MERCHANT_LOGIN: "e2e-merchant",
  ROBOKASSA_OP_STATE_URL: `${mockOrigin}/Merchant/WebService/Service.asmx/OpStateExt`,
  ROBOKASSA_PASSWORD_1: "e2e-password-one",
  ROBOKASSA_PASSWORD_2: "e2e-password-two",
  ROBOKASSA_PAYMENT_URL_OVERRIDE: `${mockOrigin}/Merchant/Index.aspx`,
};
const children = [];

function start(command, args) {
  const child = spawn(command, args, {
    env: testEnvironment,
    stdio: "inherit",
  });

  children.push(child);
  return child;
}

async function waitForServer(url, child, label) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(`${label} exited with code ${child.exitCode}`);
    }

    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      // The server has not started listening yet.
    }

    await delay(250);
  }

  throw new Error(`${label} did not become ready`);
}

function waitForExit(child) {
  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`test process exited with code ${code} (${signal ?? "no signal"})`));
    });
  });
}

try {
  const mock = start(process.execPath, ["scripts/robokassa-e2e-mock.mjs"]);
  await waitForServer(`${mockOrigin}/test-state`, mock, "payment mock");

  const app = start(process.execPath, [
    "node_modules/next/dist/bin/next",
    "dev",
    "-p",
    "3014",
  ]);
  await waitForServer(appOrigin, app, "Next.js app");

  const tests = start(process.execPath, ["scripts/payment-access-e2e.mjs"]);
  await waitForExit(tests);
} finally {
  for (const child of children.reverse()) {
    if (child.exitCode === null) {
      child.kill("SIGTERM");
    }
  }
}
