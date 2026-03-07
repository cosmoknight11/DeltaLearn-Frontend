import { ProgressBar as BSProgress } from "react-bootstrap";

export default function ModuleProgress({ progressData, modules }) {
  if (!modules || modules.length === 0) return null;

  const completed = progressData.filter((p) => p.status === "completed").length;
  const total = modules.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div className="d-flex justify-content-between small mb-1">
        <span className="text-muted">
          {completed} / {total} modules
        </span>
        <span className="text-accent">{pct}%</span>
      </div>
      <BSProgress
        now={pct}
        style={{ height: 6, backgroundColor: "var(--dl-elevated)" }}
        variant=""
        className="rounded-pill"
      >
        <BSProgress
          now={pct}
          style={{ backgroundColor: "var(--dl-green)" }}
          className="rounded-pill"
        />
      </BSProgress>
    </div>
  );
}
