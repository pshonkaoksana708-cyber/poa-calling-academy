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

  const { token } = await searchParams;

  if (routeSlug === "assessment") {
    return (
      <AssessmentOverview
        assessments={getProfessionAssessments(slug)}
        professionTitle={profession.title}
        slug={slug}
        token={token}
      />
    );
  }

  if (blockTestMatch) {
    const blockNumber = Number(blockTestMatch[1]);
    const assessment = getBlockTestAssessment(slug, blockNumber);
    const backHref = appendToken(`/course/${slug}/basic/assessment`, token);
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
        nextHref={appendToken(nextHref, token)}
        nextLabel={
          blockNumber === 3
            ? "Перейти к итоговому проекту"
            : `Перейти к Блоку ${blockNumber + 1}`
        }
        reviewHref={appendToken(blockReviewHref(slug, blockNumber), token)}
      />
    );
  }

  if (routeSlug === "final-project") {
    const assessment = getFinalProjectAssessment(slug);
    const backHref = appendToken(`/course/${slug}/basic/assessment`, token);

    if (!assessment) {
      return (
        <AssessmentUnavailable backHref={backHref} title="Итоговый проект" />
      );
    }

    return (
      <FinalProjectPage
        assessment={assessment}
        backHref={backHref}
        nextHref={appendToken(`/course/${slug}/basic/final-exam`, token)}
      />
    );
  }

  const assessment = getFinalExamAssessment(slug);
  const backHref = appendToken(`/course/${slug}/basic/assessment`, token);

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
        token,
      )}
      nextLabel="Завершить программу"
      reviewHref={backHref}
    />
  );
}
