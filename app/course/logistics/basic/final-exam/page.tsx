import { notFound } from "next/navigation";

import { renderAssessmentUtilityRoute } from "@/app/course/assessment-route-helpers";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Финальный экзамен | Специалист по международной логистике",
};

type LogisticsAssessmentRouteProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function LogisticsFinalExamRoutePage({
  searchParams,
}: LogisticsAssessmentRouteProps) {
  const assessmentRoute = await renderAssessmentUtilityRoute({
    routeSlug: "final-exam",
    searchParams,
    slug: "logistics",
  });

  if (!assessmentRoute) {
    notFound();
  }

  return assessmentRoute;
}
