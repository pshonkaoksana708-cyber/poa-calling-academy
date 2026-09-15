import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssessmentOverview } from "@/components/assessments/AssessmentOverview";
import { getProfessionAssessments } from "@/data/assessments";
import { getProfession } from "@/data/professions";
import {
  getCourseTokenAccess,
  PackageAccessDenied,
  validateCourseBlockAccess,
} from "@/app/course/course-access-control";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

type AssessmentPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function AssessmentPage({
  params,
  searchParams,
}: AssessmentPageProps) {
  const { slug } = await params;
  const { token } = await searchParams;
  const profession = getProfession(slug);

  if (!profession) {
    notFound();
  }

  const courseAccess = getCourseTokenAccess(slug, token);

  if (!courseAccess.ok || courseAccess.blockCount === 0) {
    return (
      <PackageAccessDenied
        professionSlug={slug}
        token={token}
        validation={
          courseAccess.ok
            ? validateCourseBlockAccess(slug, token, 1)
            : courseAccess.validation
        }
      />
    );
  }

  return (
    <AssessmentOverview
      assessments={getProfessionAssessments(slug)}
      maxBlockNumber={courseAccess.blockCount}
      professionTitle={profession.title}
      slug={slug}
      token={token}
    />
  );
}
