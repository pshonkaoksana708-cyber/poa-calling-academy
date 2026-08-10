export type PracticeAssignment = {
  id: string;
  title: string;
  description: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
};

export type AdditionalMaterial = {
  id: string;
  title: string;
  description: string;
  format: "template" | "checklist" | "example" | "reading" | "table";
};

export type StructuredLessonContent = {
  intro: string[];
  outcomes: string[];
  studyPlan: string[];
  authorAdvice: string;
  summary: string[];
};

export type QuizOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
};

export type EducationalQuiz = {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
};

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  content: string[];
  structuredContent?: StructuredLessonContent;
  practice?: string;
  practiceAssignments?: PracticeAssignment[];
  checklist?: ChecklistItem[];
  additionalMaterials?: AdditionalMaterial[];
};

export type ProgramModule = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  completedTitle?: string;
  completedItems?: string[];
  finalQuiz?: EducationalQuiz;
};

export type LearningResult = {
  skills: string[];
  tasks: string[];
  workplaces: string[];
};

export type ProfessionLevel = {
  slug: string;
  title: string;
  label: string;
  duration: string;
  price: string;
  level: "basic" | "practice" | "pro";
  description: string;
  result: string;
  learningResult: LearningResult;
  modules: ProgramModule[];
  checklist?: ChecklistItem[];
  additionalMaterials?: AdditionalMaterial[];
  finalSummary?: string;
  quote?: {
    text: string;
    author: string;
    role: string;
  };
};

export type PurchasePackage = {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  includedLevelSlugs: string[];
  includes: string[];
  result: string;
  bestFor: string;
  featured?: boolean;
  badge?: string;
};

export type CareerStep = {
  label?: string;
  title: string;
  description: string;
};

export type AccessRules = {
  tokenScope: "level" | "package";
  tokenTtlDays: number;
  delivery: "email";
  requiresPayment: true;
};

export type Profession = {
  slug: string;
  title: string;
  direction: string;
  description: string;
  audience: string[];
  outcome: string;
  learningResult: LearningResult;
  careerPath: CareerStep[];
  packages: PurchasePackage[];
  levels: ProfessionLevel[];
  accessRules: AccessRules;
};
