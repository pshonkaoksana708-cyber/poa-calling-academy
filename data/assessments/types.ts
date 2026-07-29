export type AssessmentType = "block-test" | "final-exam" | "final-project";

export type QuestionType =
  | "single-choice"
  | "multiple-choice"
  | "true-false"
  | "open-answer"
  | "case";

export type AssessmentOption = {
  id: string;
  text: string;
};

export type AssessmentQuestion = {
  id: string;
  type: QuestionType;
  text: string;
  options?: AssessmentOption[];
  correctAnswer?: string;
  correctAnswers?: string[];
  explanation?: string;
  points: number;
  requiresManualReview?: boolean;
};

export type ProjectSection = {
  id: string;
  title: string;
  blocks: string[];
};

export type Assessment = {
  id: string;
  professionSlug: string;
  type: AssessmentType;
  blockNumber?: number;
  title: string;
  description: string;
  instructions: string[];
  questions?: AssessmentQuestion[];
  projectSections?: ProjectSection[];
  passingScore?: number;
  estimatedMinutes?: number;
  attemptsAllowed?: number;
  sourcePath?: string;
  requiresManualReview?: boolean;
};

export type ProfessionAssessments = {
  professionSlug: string;
  assessments: Assessment[];
};
