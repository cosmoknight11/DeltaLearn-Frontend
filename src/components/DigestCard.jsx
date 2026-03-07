import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiMail, FiAlertCircle, FiCalendar } from "react-icons/fi";

export default function DigestCard({ digest }) {
  const date = new Date(digest.sent_at);
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const isSent = digest.status === "sent";

  return (
    <Link to={`/digests/${digest.id}`} className="text-decoration-none">
      <Card className="mb-2 fade-in">
        <Card.Body className="d-flex align-items-center gap-3 py-3">
          <div className="timeline-dot" />

          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="text-white fw-medium">{digest.subject}</span>
              <Badge bg={isSent ? "primary" : "danger"} className="fw-normal">
                {isSent ? "Delivered" : "Failed"}
              </Badge>
            </div>
            <div className="d-flex align-items-center gap-3 text-muted small">
              <span className="d-flex align-items-center gap-1">
                <FiCalendar size={12} /> {dateStr} at {timeStr}
              </span>
              <span className="d-flex align-items-center gap-1">
                {isSent ? <FiMail size={12} /> : <FiAlertCircle size={12} />}
                {digest.topics_included?.join(", ")}
              </span>
            </div>
          </div>

          <span className="text-muted">&rsaquo;</span>
        </Card.Body>
      </Card>
    </Link>
  );
}
