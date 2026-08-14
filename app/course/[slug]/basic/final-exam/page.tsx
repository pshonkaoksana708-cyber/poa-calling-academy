import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssessmentTest } from "@/components/assessments/AssessmentTest";
import { AssessmentUnavailable } from "@/components/assessments/AssessmentUnavailable";
import { getFinalExamAssessment } from "@/data/assessments";
import { getProfession } from "@/data/professions";
import { getSupplyTokenAccess, PackageAccessDenied } from "@/app/course/supply-access-control";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

type FinalExamPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

function appendToken(href: string, token?: string) {
  const separator = href.includes("?") ? "&" : "?";

  return token ? `${href}${separator}token=${encodeURIComponent(token)}` : href;
}

export default async function FinalExamPage({
  params,
  searchParams,
}: FinalExamPageProps) {
  const { slug } = await params;
  const { token } = await searchParams;
  const profession = getProfession(slug);

  if (!profession) {
    notFound();
  }

  if (slug === "supply") {
    const supplyAccess = getSupplyTokenAccess(token);

    if (!supplyAccess.ok || supplyAccess.blockCount < 3) {
      return <PackageAccessDenied token={token} />;
    }
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
