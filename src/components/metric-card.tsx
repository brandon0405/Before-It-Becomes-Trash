type MetricCardProps = {
  label: string;
  value: number;
  tone?: "default" | "accent";
};

export function MetricCard({ label, value, tone = "default" }: MetricCardProps) {
  return (
    <article className={`metric-card ${tone === "accent" ? "metric-card-accent" : ""}`}>
      <span className="metric-value">{value}</span>
      <span className="metric-label">{label}</span>
    </article>
  );
}
