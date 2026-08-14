import { notFound } from "next/navigation";

import { renderAssessmentUtilityRoute } from "@/app/course/assessment-route-helpers";
import { noIndexRobots } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: noIndexRobots,
  title: "Итоговый проект | Специалист по международной логистике",
};

type LogisticsAssessmentRouteProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function LogisticsFinalProjectRoutePage({
  searchParams,
}: LogisticsAssessmentRouteProps) {
  const assessmentRoute = await renderAssessmentUtilityRoute({
    routeSlug: "final-project",
    searchParams,
    slug: "logistics",
  });

  if (!assessmentRoute) {
    notFound();
  }

  return assessmentRoute;
}
