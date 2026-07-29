import { notFound } from "next/navigation";
import { AssessmentOverview } from "@/components/assessments/AssessmentOverview";
import { getProfessionAssessments } from "@/data/assessments";
import { getProfession } from "@/data/professions";

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

  return (
    <AssessmentOverview
      assessments={getProfessionAssessments(slug)}
      professionTitle={profession.title}
      slug={slug}
      token={token}
    />
  );
}
