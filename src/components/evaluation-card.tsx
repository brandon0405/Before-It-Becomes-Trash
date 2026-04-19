import { RecommendationBadge } from "@/components/recommendation-badge";
import type { RescueAssessment } from "@/lib/types";

type EvaluationCardProps = {
  assessment: RescueAssessment | null;
  onSave: () => void;
  canSave: boolean;
  saveLabel: string;
};

export function EvaluationCard({
  assessment,
  onSave,
  canSave,
  saveLabel,
}: EvaluationCardProps) {
  if (!assessment) {
    return (
      <article className="panel result-panel empty-panel">
        <div className="empty-illustration" />
        <span className="eyebrow">Assessment preview</span>
        <h3>Run one object through the evaluator</h3>
        <p>
          You will get a grounded diagnosis, the best next move, a realistic
          effort level and a small ecological reason not to give up on the
          object too quickly.
        </p>
      </article>
    );
  }

  return (
    <article className="panel result-panel">
      <div className="result-header">
        <div>
          <span className="eyebrow">Recommended next move</span>
          <h3>{assessment.objectName}</h3>
          <p className="result-subtitle">
            {assessment.categoryLabel} · {assessment.matchReason}
          </p>
        </div>
        <RecommendationBadge recommendation={assessment.recommendation} />
      </div>

      <div className="result-grid">
        <div className="result-card">
          <span className="result-label">Likely diagnosis</span>
          <p>{assessment.diagnosis}</p>
        </div>
        <div className="result-card">
          <span className="result-label">Estimated difficulty</span>
          <p>{assessment.difficulty}</p>
        </div>
        <div className="result-card">
          <span className="result-label">Life recovered</span>
          <p>{assessment.recoveredLife}</p>
        </div>
        <div className="result-card">
          <span className="result-label">Avoided impact</span>
          <p>{assessment.avoidedImpact}</p>
        </div>
      </div>

      <div className="steps-card">
        <span className="result-label">Suggested actions</span>
        <ol className="steps-list">
          {assessment.suggestedActions.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="note-card">
        <span className="result-label">Why this matters</span>
        <p>{assessment.ecoMessage}</p>
      </div>

      <button
        type="button"
        className="primary-button full-width"
        onClick={onSave}
        disabled={!canSave}
      >
        {saveLabel}
      </button>
    </article>
  );
}
