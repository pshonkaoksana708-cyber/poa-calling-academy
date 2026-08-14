import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssessmentUnavailable } from "@/components/assessments/AssessmentUnavailable";
import { FinalProjectPage } from "@/components/assessments/FinalProjectPage";
import { getFinalProjectAssessment } from "@/data/assessments";
import { getProfession } from "@/data/professions";
import { getSupplyTokenAccess, PackageAccessDenied } from "@/app/course/supply-access-control";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

type FinalProjectRouteProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

function appendToken(href: string, token?: string) {
  return token ? `${href}?token=${encodeURIComponent(token)}` : href;
}

export default async function FinalProjectRoute({
  params,
  searchParams,
}: FinalProjectRouteProps) {
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
