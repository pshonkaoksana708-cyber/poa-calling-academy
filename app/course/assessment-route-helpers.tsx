import { AssessmentOverview } from "@/components/assessments/AssessmentOverview";
import { AssessmentTest } from "@/components/assessments/AssessmentTest";
import { AssessmentUnavailable } from "@/components/assessments/AssessmentUnavailable";
import { FinalProjectPage } from "@/components/assessments/FinalProjectPage";
import {
  getBlockTestAssessment,
  getFinalExamAssessment,
  getFinalProjectAssessment,
  getProfessionAssessments,
} from "@/data/assessments";
import { getProfession } from "@/data/professions";
import {
  getCourseTokenAccess,
  PackageAccessDenied,
  validateCourseBlockAccess,
} from "@/app/course/course-access-control";
import { getLogisticsAccessToken } from "@/lib/course-access-session";

type AssessmentUtilityRouteProps = {
  routeSlug: string;
  searchParams: Promise<{
    token?: string;
  }>;
  slug: string;
};

function appendToken(href: string, token?: string) {
  const separator = href.includes("?") ? "&" : "?";

  return token ? `${href}${separator}token=${encodeURIComponent(token)}` : href;
}

function blockReviewHref(slug: string, blockNumber: number) {
  if (blockNumber === 1) {
    return `/course/${slug}/basic/lesson-1`;
  }

  return `/course/${slug}/basic/block-${blockNumber}/lesson-1`;
}

export async function renderAssessmentUtilityRoute({
  routeSlug,
  searchParams,
  slug,
}: AssessmentUtilityRouteProps) {
  const blockTestMatch = routeSlug.match(/^block-(\d)-test$/);

  if (
    routeSlug !== "assessment" &&
    routeSlug !== "final-project" &&
    routeSlug !== "final-exam" &&
    !blockTestMatch
  ) {
    return null;
  }

  const profession = getProfession(slug);

  if (!profession) {
    return null;
  }

  const { token: queryToken } = await searchParams;
  const token =
    slug === "logistics"
      ? await getLogisticsAccessToken(queryToken)
      : queryToken;
  const navigationToken = slug === "logistics" ? undefined : token;
  const courseAccess = getCourseTokenAccess(slug, token);

  if (!courseAccess.ok || courseAccess.blockCount === 0) {
    return (
      <PackageAccessDenied
        professionSlug={slug}
        token={navigationToken}
        validation={
          courseAccess.ok
            ? validateCourseBlockAccess(slug, token, 1)
            : courseAccess.validation
        }
      />
    );
  }

  if (routeSlug === "assessment") {
    return (
      <AssessmentOverview
        assessments={getProfessionAssessments(slug)}
        maxBlockNumber={courseAccess.blockCount}
        professionTitle={profession.title}
        slug={slug}
        token={navigationToken}
      />
    );
  }

  if (blockTestMatch) {
    const blockNumber = Number(blockTestMatch[1]);

    const blockAccess = validateCourseBlockAccess(
      slug,
      token,
      blockNumber as 1 | 2 | 3,
    );

    if (!blockAccess.ok) {
      return (
        <PackageAccessDenied
          professionSlug={slug}
          token={navigationToken}
          validation={blockAccess}
        />
      );
    }

    const assessment = getBlockTestAssessment(slug, blockNumber);
    const backHref = appendToken(
      `/course/${slug}/basic/assessment`,
      navigationToken,
    );
    const nextHref =
      blockNumber === 1
        ? `/course/${slug}/basic/block-2/lesson-1`
        : blockNumber === 2
          ? `/course/${slug}/basic/block-3/lesson-1`
          : `/course/${slug}/basic/final-project`;

    if (!assessment) {
      return (
        <AssessmentUnavailable
          backHref={backHref}
          title={`Тест после Блока ${blockNumber}`}
        />
      );
    }

    return (
      <AssessmentTest
        assessment={assessment}
        backHref={backHref}
        nextHref={appendToken(nextHref, navigationToken)}
        nextLabel={
          blockNumber === 3
            ? "Перейти к итоговому проекту"
            : `Перейти к Блоку ${blockNumber + 1}`
        }
        reviewHref={appendToken(
          blockReviewHref(slug, blockNumber),
          navigationToken,
        )}
      />
    );
  }

  if (routeSlug === "final-project") {
    const finalProjectAccess = validateCourseBlockAccess(slug, token, 3);

    if (!finalProjectAccess.ok) {
      return (
        <PackageAccessDenied
          professionSlug={slug}
          token={navigationToken}
          validation={finalProjectAccess}
        />
      );
    }

    const assessment = getFinalProjectAssessment(slug);
    const backHref = appendToken(
      `/course/${slug}/basic/assessment`,
      navigationToken,
    );

    if (!assessment) {
      return (
        <AssessmentUnavailable backHref={backHref} title="Итоговый проект" />
      );
    }

    return (
      <FinalProjectPage
        assessment={assessment}
        backHref={backHref}
        nextHref={appendToken(
          `/course/${slug}/basic/final-exam`,
          navigationToken,
        )}
      />
    );
  }

  const assessment = getFinalExamAssessment(slug);
  const backHref = appendToken(
    `/course/${slug}/basic/assessment`,
    navigationToken,
  );

  const finalExamAccess = validateCourseBlockAccess(slug, token, 3);

  if (!finalExamAccess.ok) {
    return (
      <PackageAccessDenied
        professionSlug={slug}
        token={navigationToken}
        validation={finalExamAccess}
      />
    );
  }

  if (!assessment) {
    return (
      <AssessmentUnavailable backHref={backHref} title="Финальный экзамен" />
    );
  }

  return (
    <AssessmentTest
      assessment={assessment}
      backHref={backHref}
      nextHref={appendToken(
        `/course/${slug}/basic/completed?package=professional`,
        navigationToken,
      )}
      nextLabel="Завершить программу"
      reviewHref={backHref}
    />
  );
}
