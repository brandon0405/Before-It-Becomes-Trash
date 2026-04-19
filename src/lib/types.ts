export type Recommendation = "repair" | "reuse" | "recycle" | "discard";

export type Difficulty = "easy" | "medium" | "hard";

export type IssueType =
  | "mechanical"
  | "power"
  | "sound"
  | "fabric"
  | "performance"
  | "surface"
  | "safety"
  | "unknown";

export type CategoryId =
  | "headphones"
  | "chargers"
  | "mouse"
  | "keyboard"
  | "backpack"
  | "chair"
  | "blender"
  | "shoes"
  | "clothing"
  | "lamp";

export interface FailurePattern {
  label: string;
  keywords: string[];
  diagnosis: string;
  recommendation: Recommendation;
  difficulty: Difficulty;
  actions: string[];
  recoveredMonths: [number, number];
  avoidedImpact: string;
}

export interface CategoryProfile {
  id: CategoryId;
  label: string;
  description: string;
  materialFocus: string;
  commonFailures: FailurePattern[];
  defaultRecommendation: Recommendation;
  defaultDifficulty: Difficulty;
  recoverableMonths: [number, number];
  ecoMessage: string;
  quickActions: string[];
  recyclingHint: string;
  reuseIdea: string;
}

export interface EvaluationInput {
  objectName: string;
  categoryId: CategoryId;
  issueType: IssueType;
  details: string;
}

export interface RescueAssessment {
  id: string;
  objectName: string;
  categoryId: CategoryId;
  categoryLabel: string;
  issueType: IssueType;
  diagnosis: string;
  recommendation: Recommendation;
  difficulty: Difficulty;
  suggestedActions: string[];
  avoidedImpact: string;
  recoveredLife: string;
  ecoMessage: string;
  matchReason: string;
  createdAt: string;
}

export interface RescueLogEntry extends RescueAssessment {
  savedAt: string;
}
