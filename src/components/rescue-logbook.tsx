import { MetricCard } from "@/components/metric-card";
import { RecommendationBadge } from "@/components/recommendation-badge";
import type { RescueLogEntry } from "@/lib/types";

type RescueLogbookProps = {
  entries: RescueLogEntry[];
  hydrated: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function RescueLogbook({
  entries,
  hydrated,
}: RescueLogbookProps) {
  const totals = {
    repair: entries.filter((entry) => entry.recommendation === "repair").length,
    reuse: entries.filter((entry) => entry.recommendation === "reuse").length,
    recycle: entries.filter((entry) => entry.recommendation === "recycle").length,
  };

  return (
    <section className="logbook-shell" id="logbook">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Rescue log</span>
          <h2>Local history you can demo in one glance</h2>
        </div>
        <p>
          Every saved case stays in this browser only. That keeps the MVP
          simple, fast and fully usable without any backend.
        </p>
      </div>

      <div className="stats-grid">
        <MetricCard label="Total rescues" value={entries.length} tone="accent" />
        <MetricCard label="Repair plans" value={totals.repair} />
        <MetricCard label="Reuse calls" value={totals.reuse} />
        <MetricCard label="Recycling routes" value={totals.recycle} />
      </div>

      {hydrated && entries.length > 0 ? (
        <div className="log-grid">
          {entries.map((entry) => (
            <article className="log-card" key={`${entry.id}-${entry.savedAt}`}>
              <div className="log-card-top">
                <div>
                  <span className="log-date">{formatDate(entry.savedAt)}</span>
                  <h3>{entry.objectName}</h3>
                  <p className="log-meta">{entry.categoryLabel}</p>
                </div>
                <RecommendationBadge recommendation={entry.recommendation} />
              </div>
              <p className="log-diagnosis">{entry.diagnosis}</p>
              <div className="log-footer">
                <span>{entry.recoveredLife}</span>
                <span>{entry.difficulty} effort</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <article className="panel empty-logbook">
          <span className="eyebrow">Nothing saved yet</span>
          <h3>Your rescued objects will appear here</h3>
          <p>
            Save the first evaluation and the app will start counting repairs,
            reuse ideas and recycling routes automatically.
          </p>
        </article>
      )}
    </section>
  );
}
