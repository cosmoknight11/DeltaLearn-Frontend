import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FiBook, FiMail, FiCalendar, FiClock,
  FiZap, FiRefreshCw, FiTarget, FiArrowRight,
} from "react-icons/fi";
import { subscriptions as subApi, history as histApi } from "../api/endpoints";
import DigestCard from "../components/DigestCard";
import { useAuth } from "../context/AuthContext";

// ── Philosophy pillars shown to everyone ─────────────────────────────
const PILLARS = [
  {
    icon: <FiZap size={20} />,
    title: "One topic. Every day.",
    body: "No syllabus anxiety. Each morning you get one focused, deep-dive on a subtopic — small enough to read in 10 minutes, rich enough to actually learn something.",
  },
  {
    icon: <FiRefreshCw size={20} />,
    title: "Never the same thing twice.",
    body: "An AI picks a fresh subtopic each day from a pool of 30+, so over weeks you naturally cover the entire subject without repetition or boredom.",
  },
  {
    icon: <FiTarget size={20} />,
    title: "Tailored to how you learn.",
    body: "Set your difficulty, write a custom prompt, choose your delivery time. The AI uses your preferences to shape every email — not a generic newsletter.",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [subs, setSubs] = useState([]);
  const [digests, setDigests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [subRes, histRes] = await Promise.all([
          subApi.list(),
          histApi.list(),
        ]);
        setSubs(subRes.data.results || subRes.data);
        setDigests((histRes.data.results || histRes.data).slice(0, 6));
      } catch { /* handled by interceptor */ }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  const hasActivity = subs.length > 0 || digests.length > 0;
  const firstName = user?.first_name || user?.email?.split("@")[0] || "";

  return (
    <div className="fade-in">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className="dl-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <div className="dl-hero-badge mb-3">
                <FiZap size={12} className="me-1" /> AI-powered daily learning
              </div>
              <h1 className="dl-hero-title">
                {hasActivity
                  ? <>Good to see you{firstName ? `, ${firstName}` : ""}.<br /><span className="text-accent">Keep the streak going.</span></>
                  : <>Learn something real,<br /><span className="text-accent">every single day.</span></>
                }
              </h1>
              <p className="dl-hero-sub">
                DeltaLearn delivers one sharp, AI-generated learning digest to your inbox each morning —
                personalised to your level, your schedule, and what you actually want to master.
              </p>
              {!hasActivity && (
                <Link to="/topics">
                  <Button variant="primary" size="lg" className="dl-hero-cta">
                    Start learning <FiArrowRight className="ms-2" />
                  </Button>
                </Link>
              )}
            </Col>
            <Col lg={5} className="d-none d-lg-flex justify-content-end">
              <div className="dl-hero-visual">
                <div className="dl-email-preview">
                  <div className="dl-ep-header">
                    <span className="dl-ep-dot" />
                    <span className="dl-ep-dot" />
                    <span className="dl-ep-dot" />
                  </div>
                  <div className="dl-ep-subject">📚 Today: Binary Search Trees — in-order traversal</div>
                  <div className="dl-ep-line w-75" />
                  <div className="dl-ep-line w-100" />
                  <div className="dl-ep-line w-90" />
                  <div className="dl-ep-line w-60" />
                  <div className="dl-ep-code">
                    <span className="dl-ep-line w-50 mt-2" />
                    <span className="dl-ep-line w-80" />
                    <span className="dl-ep-line w-40" />
                  </div>
                  <div className="dl-ep-line w-70 mt-2" />
                  <div className="dl-ep-line w-55" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">

        {/* ── Philosophy pillars ────────────────────────────────────── */}
        <Row className="g-3 mb-5">
          {PILLARS.map((p) => (
            <Col key={p.title} xs={12} md={4}>
              <Card className="h-100 dl-pillar-card">
                <Card.Body className="p-4">
                  <div className="dl-pillar-icon mb-3">{p.icon}</div>
                  <h6 className="text-white fw-semibold mb-2">{p.title}</h6>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.65 }}>{p.body}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ── Active subscriptions quick-view ──────────────────────── */}
        {subs.length > 0 && (
          <div className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="text-white mb-0">Your topics</h5>
              <Link to="/topics" className="text-accent text-decoration-none small">
                Manage <FiArrowRight size={12} className="ms-1" />
              </Link>
            </div>
            <Row className="g-2">
              {subs.map((sub) => {
                const topic = sub.topic_detail;
                return (
                  <Col key={sub.id} xs={12} sm={6} md={4}>
                    <Card className="dl-sub-chip">
                      <Card.Body className="d-flex align-items-center gap-3 py-3 px-3">
                        <span className="topic-icon" style={{ fontSize: "1.3rem" }}>
                          {topic?.icon || "📖"}
                        </span>
                        <div className="flex-grow-1 min-w-0">
                          <div className="text-white fw-medium text-truncate">{topic?.name}</div>
                          <div className="text-muted small d-flex align-items-center gap-2">
                            <Badge
                              bg=""
                              style={{
                                background: sub.is_active ? "rgba(31,125,83,0.2)" : "rgba(100,100,100,0.2)",
                                color: sub.is_active ? "#4ade80" : "#888",
                                fontSize: "0.65rem",
                              }}
                            >
                              {sub.is_active ? "active" : "paused"}
                            </Badge>
                            {sub.preferred_time && (
                              <span className="d-flex align-items-center gap-1">
                                <FiClock size={10} /> {sub.preferred_time}
                              </span>
                            )}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        )}

        {/* ── Recent digests ────────────────────────────────────────── */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="text-white mb-0">
              {digests.length > 0 ? "Recent digests" : "Your inbox is empty for now"}
            </h5>
            {digests.length > 0 && (
              <Link to="/digests" className="text-accent text-decoration-none small">
                View all <FiArrowRight size={12} className="ms-1" />
              </Link>
            )}
          </div>

          {digests.length === 0 ? (
            <Card className="dl-empty-state">
              <Card.Body className="text-center py-5 px-4">
                <FiCalendar size={36} className="text-muted mb-3" />
                <h6 className="text-white mb-2">No digests yet</h6>
                <p className="text-muted small mb-4" style={{ maxWidth: 320, margin: "0 auto 1rem" }}>
                  Subscribe to a topic and your first email digest will arrive at your chosen time tomorrow morning.
                </p>
                {subs.length === 0 && (
                  <Link to="/topics">
                    <Button variant="primary" size="sm">
                      <FiBook className="me-2" /> Browse topics
                    </Button>
                  </Link>
                )}
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-3">
              {digests.map((d) => (
                <Col key={d.id} xs={12} md={6}>
                  <DigestCard digest={d} />
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* ── How it works — shown to new users ────────────────────── */}
        {!hasActivity && (
          <div className="dl-how-it-works mt-2 mb-4 p-4">
            <h5 className="text-white mb-4 text-center">How it works</h5>
            <Row className="g-3 text-center">
              {[
                { step: "01", icon: <FiBook size={18} />, label: "Pick topics", desc: "Choose from DSA, System Design, Current Affairs and more." },
                { step: "02", icon: <FiTarget size={18} />, label: "Set preferences", desc: "Difficulty level, custom prompt, and daily delivery time." },
                { step: "03", icon: <FiMail size={18} />, label: "Get your digest", desc: "A fresh, AI-generated email lands in your inbox every morning." },
              ].map((s) => (
                <Col key={s.step} xs={12} md={4}>
                  <div className="dl-step">
                    <div className="dl-step-num">{s.step}</div>
                    <div className="dl-step-icon my-2">{s.icon}</div>
                    <div className="text-white fw-medium mb-1">{s.label}</div>
                    <p className="text-muted small mb-0">{s.desc}</p>
                  </div>
                </Col>
              ))}
            </Row>
            <div className="text-center mt-4">
              <Link to="/topics">
                <Button variant="primary">
                  Get started <FiArrowRight className="ms-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}

      </Container>
    </div>
  );
}
