import type { Recommendation } from "@/lib/types";

type RecommendationBadgeProps = {
  recommendation: Recommendation;
};

const COPY: Record<Recommendation, string> = {
  repair: "Repair",
  reuse: "Reuse",
  recycle: "Recycle",
  discard: "Discard",
};

export function RecommendationBadge({
  recommendation,
}: RecommendationBadgeProps) {
  return (
    <span className={`recommendation-badge recommendation-${recommendation}`}>
      {COPY[recommendation]}
    </span>
  );
}
