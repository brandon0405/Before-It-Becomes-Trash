import { CATEGORY_PROFILES } from "@/lib/mock-data";
import type {
  CategoryProfile,
  EvaluationInput,
  FailurePattern,
  Recommendation,
  RescueAssessment,
} from "@/lib/types";

const SAFETY_KEYWORDS = [
  "smoke",
  "burn",
  "burning",
  "spark",
  "sparks",
  "shock",
  "humo",
  "quemado",
  "chispa",
  "electrico",
  "eléctrico",
];

const DISCARD_KEYWORDS = ["mold", "biohazard", "sharp shards", "moho", "infectado"];

const RECOMMENDATION_COPY: Record<Recommendation, string> = {
  repair: "Repair first",
  reuse: "Reuse creatively",
  recycle: "Recycle responsibly",
  discard: "Discard only as a last resort",
};

function countKeywordMatches(text: string, keywords: string[]) {
  return keywords.reduce((total, keyword) => {
    return total + (text.includes(keyword) ? 1 : 0);
  }, 0);
}

function getCategoryProfile(categoryId: EvaluationInput["categoryId"]): CategoryProfile {
  return (
    CATEGORY_PROFILES.find((profile) => profile.id === categoryId) ?? CATEGORY_PROFILES[0]
  );
}

function getBestFailureMatch(
  profile: CategoryProfile,
  normalizedText: string,
): FailurePattern | undefined {
  return profile.commonFailures
    .map((failure) => ({
      failure,
      score: countKeywordMatches(normalizedText, failure.keywords),
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)[0]?.failure;
}

function formatRecoveredLife([minMonths, maxMonths]: [number, number]) {
  if (minMonths === 0 && maxMonths === 0) {
    return "No safe recovery window detected from this failure pattern.";
  }

  if (maxMonths < 12) {
    return `${minMonths}-${maxMonths} more months of usable life`;
  }

  const minYears = (minMonths / 12).toFixed(minMonths % 12 === 0 ? 0 : 1);
  const maxYears = (maxMonths / 12).toFixed(maxMonths % 12 === 0 ? 0 : 1);

  return `${minYears}-${maxYears} more years of usable life`;
}

function buildFallbackDiagnosis(profile: CategoryProfile, issueType: EvaluationInput["issueType"]) {
  const issueContext: Record<EvaluationInput["issueType"], string> = {
    mechanical: "A physical joint, connector or moving part is likely taking the stress first.",
    power: "The issue may be isolated to power delivery, a detachable part or a worn contact point.",
    sound: "The core issue looks localized rather than total end-of-life.",
    fabric: "The material shell is likely failing before the full object has lost its value.",
    performance: "Wear on one small component is more likely than total failure.",
    surface: "This looks like wear that may be manageable without replacing the whole item.",
    safety: "Safety concerns deserve a cautious next step before continued use.",
    unknown: "The failure pattern is unclear, so a low-risk inspection comes first.",
  };

  return `${issueContext[issueType]} For this category, ${profile.label.toLowerCase()} often still have recoverable value.`;
}

function buildFallbackActions(profile: CategoryProfile, recommendation: Recommendation) {
  if (recommendation === "reuse") {
    return [profile.quickActions[0], profile.reuseIdea, profile.recyclingHint];
  }

  if (recommendation === "recycle") {
    return [profile.quickActions[0], profile.recyclingHint, "Separate reusable parts before the recycling drop-off if it is safe to do so."];
  }

  if (recommendation === "discard") {
    return [
      "Check one last time whether any safe reusable or recyclable part can be separated.",
      "Discard only after the object can no longer be repaired, reused or responsibly recycled.",
      "Document what failed so the replacement choice lasts longer next time.",
    ];
  }

  return profile.quickActions;
}

function buildFallbackImpact(profile: CategoryProfile, recommendation: Recommendation) {
  if (recommendation === "reuse") {
    return `A second-life use keeps ${profile.materialFocus} circulating a little longer before disposal becomes necessary.`;
  }

  if (recommendation === "recycle") {
    return `Routing ${profile.label.toLowerCase()} through the right waste stream gives ${profile.materialFocus} a better recovery path than mixed trash.`;
  }

  if (recommendation === "discard") {
    return `Even when disposal is unavoidable, checking safe recovery options first reduces needless waste from ${profile.materialFocus}.`;
  }

  return `A focused repair can delay replacement and keep ${profile.materialFocus} useful instead of turning into waste early.`;
}

function chooseRecommendation(
  profile: CategoryProfile,
  normalizedText: string,
  matchedFailure?: FailurePattern,
) {
  if (matchedFailure) {
    return matchedFailure.recommendation;
  }

  if (SAFETY_KEYWORDS.some((keyword) => normalizedText.includes(keyword))) {
    return profile.id === "backpack" || profile.id === "clothing" ? "discard" : "recycle";
  }

  if (DISCARD_KEYWORDS.some((keyword) => normalizedText.includes(keyword))) {
    return "discard";
  }

  return profile.defaultRecommendation;
}

export function analyzeObject(input: EvaluationInput): RescueAssessment {
  const profile = getCategoryProfile(input.categoryId);
  const normalizedText = `${input.objectName} ${input.details} ${input.issueType}`.toLowerCase();
  const matchedFailure = getBestFailureMatch(profile, normalizedText);
  const recommendation = chooseRecommendation(profile, normalizedText, matchedFailure);
  const recoveredMonths =
    matchedFailure?.recoveredMonths ??
    (recommendation === "recycle" || recommendation === "discard" ? [0, 0] : profile.recoverableMonths);

  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${input.categoryId}`,
    objectName: input.objectName.trim(),
    categoryId: input.categoryId,
    categoryLabel: profile.label,
    issueType: input.issueType,
    diagnosis: matchedFailure?.diagnosis ?? buildFallbackDiagnosis(profile, input.issueType),
    recommendation,
    difficulty:
      matchedFailure?.difficulty ??
      (recommendation === "recycle" || recommendation === "discard" ? "hard" : profile.defaultDifficulty),
    suggestedActions: matchedFailure?.actions ?? buildFallbackActions(profile, recommendation),
    avoidedImpact: matchedFailure?.avoidedImpact ?? buildFallbackImpact(profile, recommendation),
    recoveredLife: formatRecoveredLife(recoveredMonths),
    ecoMessage: profile.ecoMessage,
    matchReason: matchedFailure
      ? `Matched common failure: ${matchedFailure.label}.`
      : `Category baseline used. Recommended next move: ${RECOMMENDATION_COPY[recommendation]}.`,
    createdAt: new Date().toISOString(),
  };
}
