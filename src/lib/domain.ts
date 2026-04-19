export type Recommendation = "repair" | "reuse" | "recycle" | "discard";

export interface ItemFormInput {
  name: string;
  category: string;
  damageDescription: string;
  approximateAge?: string;
  currentState: string;
}

export interface AnalysisResult {
  probableDiagnosis: string;
  recommendation: Recommendation;
  justification: string;
  suggestedSteps: string[];
  difficulty: string;
  ecoImpact: string;
  recoveredLife: string;
}

export interface HistoryEntry {
  rescueActionId: string;
  itemId: string;
  analysisId: string;
  itemName: string;
  category: string;
  recommendation: Recommendation;
  status: string;
  createdAt: string;
  probableDiagnosis: string;
  badgeLabel: string | null;
  blockchainSignature: string | null;
  blockchainExplorerUrl: string | null;
}

export interface StatsSummary {
  totalRescued: number;
  repairCount: number;
  reuseCount: number;
  recycleCount: number;
  discardCount: number;
  badgesEarned: number;
  latestRescues: Array<{
    rescueActionId: string;
    itemName: string;
    recommendation: Recommendation;
    createdAt: string;
  }>;
}
