import assert from "node:assert/strict";

process.env.ACCESS_TOKEN_SECRET ??=
  "local-course-access-matrix-secret-32-characters";

const {
  createAccessToken,
  getAccessibleBlockCount,
  validateAccessTokenForPrograms,
} = await import("../lib/course-access.ts");

const DAY_SECONDS = 24 * 60 * 60;
const professions = ["supply", "logistics", "hr", "tourism", "ai"];
const packages = [
  { slug: "basic", entitledBlocks: 1 },
  { slug: "pro", entitledBlocks: 2 },
  { slug: "full", entitledBlocks: 3 },
];
const days = [0, 6, 7, 13, 14];
const blockUnlockDays = [0, 7, 14];

function expectedAccess(entitledBlocks, day, blockNumber) {
  return (
    blockNumber <= entitledBlocks && day >= blockUnlockDays[blockNumber - 1]
  );
}

function allowedProgramSlugs(profession, blockNumber) {
  const allowedPackages =
    blockNumber === 1
      ? ["basic", "pro", "full"]
      : blockNumber === 2
        ? ["pro", "full"]
        : ["full"];

  return allowedPackages.map(
    (packageSlug) => `${profession}/package/${packageSlug}`,
  );
}

function expectedAccessibleCount(entitledBlocks, day) {
  let count = 0;

  for (let blockNumber = 1; blockNumber <= entitledBlocks; blockNumber += 1) {
    if (day >= blockUnlockDays[blockNumber - 1]) {
      count = blockNumber;
    }
  }

  return count;
}

const rows = [];
const routeCases = [];
let assertionCount = 0;

for (const profession of professions) {
  for (const purchasePackage of packages) {
    const results = [];

    for (const day of days) {
      const paidAt = new Date(Date.now() - day * DAY_SECONDS * 1000 - 2_000);
      const token = createAccessToken({
        email: "matrix@example.com",
        paidAt: paidAt.toISOString(),
        programSlug: `${profession}/package/${purchasePackage.slug}`,
        purchaseId: `matrix-${profession}-${purchasePackage.slug}-${day}`,
      });
      let payload;
      const blockResults = [];

      for (const blockNumber of [1, 2, 3]) {
        const validation = validateAccessTokenForPrograms(
          token,
          allowedProgramSlugs(profession, blockNumber),
          { requiredBlock: blockNumber },
        );
        const expected = expectedAccess(
          purchasePackage.entitledBlocks,
          day,
          blockNumber,
        );

        assert.equal(
          validation.ok,
          expected,
          `${profession}/${purchasePackage.slug}, day ${day}, block ${blockNumber}`,
        );
        assertionCount += 1;
        blockResults.push(validation.ok ? "open" : "closed");
        routeCases.push({
          blockNumber,
          day,
          expected,
          packageSlug: purchasePackage.slug,
          profession,
          token,
        });

        if (validation.ok) {
          payload = validation.payload;
        }
      }

      if (!payload) {
        const blockOneValidation = validateAccessTokenForPrograms(
          token,
          allowedProgramSlugs(profession, 1),
        );
        assert.equal(blockOneValidation.ok, true);
        payload = blockOneValidation.payload;
      }

      assert.equal(
        getAccessibleBlockCount(
          payload,
          Math.floor(paidAt.getTime() / 1000) + day * DAY_SECONDS,
        ),
        expectedAccessibleCount(purchasePackage.entitledBlocks, day),
        `${profession}/${purchasePackage.slug}, day ${day}, accessible count`,
      );
      assertionCount += 1;
      results.push(`d${day}:${blockResults.join("/")}`);
    }

    rows.push(
      `${profession.padEnd(9)} ${purchasePackage.slug.padEnd(5)} ${results.join("  ")}`,
    );
  }
}

console.log(rows.join("\n"));
console.log(`PASS: 15 combinations, ${days.length} days, ${assertionCount} assertions`);

const baseUrlArgument = process.argv.find((argument) =>
  argument.startsWith("--base-url="),
);

if (baseUrlArgument) {
  const baseUrl = baseUrlArgument.slice("--base-url=".length).replace(/\/$/, "");
  const routeSuffixes = {
    1: "lesson-1",
    2: "block-2/lesson-1",
    3: "block-3/lesson-1",
  };
  let routeAssertionCount = 0;

  for (const routeCase of routeCases) {
    const url = `${baseUrl}/course/${routeCase.profession}/basic/${
      routeSuffixes[routeCase.blockNumber]
    }?token=${encodeURIComponent(routeCase.token)}`;
    const response = await fetch(url, { redirect: "manual" });
    let finalResponse = response;

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      const setCookie = response.headers.get("set-cookie");

      assert.ok(location, `${url} redirect must include Location`);
      finalResponse = await fetch(new URL(location, url), {
        headers: setCookie
          ? { Cookie: setCookie.split(";", 1)[0] }
          : undefined,
      });
    }

    assert.equal(finalResponse.status, 200, `${url} must render successfully`);
    const html = await finalResponse.text();
    const denied =
      html.includes("Нет доступа к уроку") ||
      html.includes("Этот уровень не входит в приобретённый пакет");

    assert.equal(
      denied,
      !routeCase.expected,
      `${routeCase.profession}/${routeCase.packageSlug}, day ${
        routeCase.day
      }, direct block ${routeCase.blockNumber}`,
    );
    routeAssertionCount += 1;
  }

  console.log(
    `PASS: ${routeAssertionCount} direct protected-route assertions at ${baseUrl}`,
  );
}
