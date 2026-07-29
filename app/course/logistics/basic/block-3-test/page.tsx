import { notFound } from "next/navigation";

import { renderAssessmentUtilityRoute } from "@/app/course/assessment-route-helpers";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Тест после Блока 3 | Специалист по международной логистике",
};

type LogisticsAssessmentRouteProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function LogisticsBlock3TestRoutePage({
  searchParams,
}: LogisticsAssessmentRouteProps) {
  const assessmentRoute = await renderAssessmentUtilityRoute({
    routeSlug: "block-3-test",
    searchParams,
    slug: "logistics",
  });

  if (!assessmentRoute) {
    notFound();
  }

  return assessmentRoute;
}
