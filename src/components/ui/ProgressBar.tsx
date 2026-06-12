type ProgressBarProps = {
  value: number;
  max: number;
  label?: string;
  color?: "blue" | "red";
};

export function ProgressBar({
  value,
  max,
  label,
  color = "blue",
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const barColor = color === "blue" ? "bg-eat-blue" : "bg-eat-red";

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex justify-between text-xs text-eat-muted">
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-eat-soft">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
