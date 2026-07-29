import type { Assessment } from "@/data/assessments/types";
import { supplyAssessments } from "@/data/assessments/supply";
import { hrAssessments } from "@/data/assessments/hr";
import { tourismAssessments } from "@/data/assessments/tourism";
import { logisticsAssessments } from "@/data/assessments/logistics";
import { aiAssessments } from "@/data/assessments/ai";

export const allAssessments = [
  ...supplyAssessments,
  ...hrAssessments,
  ...tourismAssessments,
  ...logisticsAssessments,
  ...aiAssessments,
] satisfies Assessment[];

export function getProfessionAssessments(professionSlug: string) {
  return allAssessments.filter((assessment) => assessment.professionSlug === professionSlug);
}

export function getBlockTestAssessment(professionSlug: string, blockNumber: number) {
  return allAssessments.find((assessment) => assessment.professionSlug === professionSlug && assessment.type === "block-test" && assessment.blockNumber === blockNumber);
}

export function getFinalExamAssessment(professionSlug: string) {
  return allAssessments.find((assessment) => assessment.professionSlug === professionSlug && assessment.type === "final-exam");
}

export function getFinalProjectAssessment(professionSlug: string) {
  return allAssessments.find((assessment) => assessment.professionSlug === professionSlug && assessment.type === "final-project");
}
