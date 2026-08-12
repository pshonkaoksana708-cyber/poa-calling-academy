import { notFound } from "next/navigation";
import { AssessmentOverview } from "@/components/assessments/AssessmentOverview";
import { getProfessionAssessments } from "@/data/assessments";
import { getProfession } from "@/data/professions";
import { getSupplyTokenAccess, PackageAccessDenied } from "@/app/course/supply-access-control";

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

  const supplyAccess = slug === "supply" ? getSupplyTokenAccess(token) : null;

  if (supplyAccess && !supplyAccess.ok) {
    return <PackageAccessDenied token={token} />;
  }

  return (
    <AssessmentOverview
      assessments={getProfessionAssessments(slug)}
      maxBlockNumber={supplyAccess?.blockCount}
      professionTitle={profession.title}
      slug={slug}
      token={token}
    />
  );
}
