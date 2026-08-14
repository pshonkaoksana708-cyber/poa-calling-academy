import { notFound } from "next/navigation";

import { renderAssessmentUtilityRoute } from "@/app/course/assessment-route-helpers";
import { noIndexRobots } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: noIndexRobots,
  title: "Тест после Блока 2 | Специалист по международной логистике",
};

type LogisticsAssessmentRouteProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function LogisticsBlock2TestRoutePage({
  searchParams,
}: LogisticsAssessmentRouteProps) {
  const assessmentRoute = await renderAssessmentUtilityRoute({
    routeSlug: "block-2-test",
    searchParams,
    slug: "logistics",
  });

  if (!assessmentRoute) {
    notFound();
  }

  return assessmentRoute;
}
