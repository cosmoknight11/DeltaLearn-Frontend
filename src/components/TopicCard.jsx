import { Card, Badge, Button } from "react-bootstrap";
import { FiCheck, FiPlus, FiSettings, FiClock } from "react-icons/fi";

const TOPIC_ICONS = {
  dsa: "🧮",
  "current-affairs": "📰",
  "system-design": "🏗️",
};

function formatTime(timeStr) {
  if (!timeStr) return "09:30 AM";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export default function TopicCard({ topic, subscription, onSubscribe, onConfigure }) {
  const icon = TOPIC_ICONS[topic.slug] || topic.icon || "📚";
  const isSubscribed = !!subscription;

  return (
    <Card className="h-100 fade-in">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex align-items-start gap-3 mb-3">
          <div className="topic-icon">{icon}</div>
          <div className="flex-grow-1">
            <h5 className="mb-1 text-white">{topic.name}</h5>
            <p className="text-muted small mb-0">{topic.description}</p>
          </div>
        </div>

        {topic.modules && topic.modules.length > 0 && (
          <div className="mb-3">
            <small className="text-muted d-block mb-1">Curriculum</small>
            <div className="d-flex flex-wrap gap-1">
              {topic.modules.slice(0, 4).map((m) => (
                <Badge key={m.id} bg="" className="bg-dl-dark border-dl border fw-normal small">
                  {m.title}
                </Badge>
              ))}
              {topic.modules.length > 4 && (
                <Badge bg="" className="bg-dl-dark border-dl border fw-normal small">
                  +{topic.modules.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="d-flex align-items-center gap-3 text-muted small mb-3">
          {topic.total_days && <span>~{topic.total_days} days</span>}
          {isSubscribed && subscription.preferred_time && (
            <span className="d-flex align-items-center gap-1">
              <FiClock size={12} /> {formatTime(subscription.preferred_time)}
            </span>
          )}
        </div>

        <div className="mt-auto d-flex gap-2">
          {isSubscribed ? (
            <>
              <Button variant="outline-primary" size="sm" className="flex-grow-1" disabled>
                <FiCheck className="me-1" /> Subscribed
              </Button>
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => onConfigure(subscription)}
                title="Configure"
              >
                <FiSettings />
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="flex-grow-1"
              onClick={() => onSubscribe(topic.id)}
            >
              <FiPlus className="me-1" /> Subscribe
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
