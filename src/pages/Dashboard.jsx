import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiBook, FiMail, FiTrendingUp, FiCalendar, FiClock } from "react-icons/fi";
import { subscriptions as subApi, history as histApi, progress as progApi } from "../api/endpoints";
import DigestCard from "../components/DigestCard";
import ModuleProgress from "../components/ProgressBar";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [subs, setSubs] = useState([]);
  const [digests, setDigests] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [subRes, histRes, progRes] = await Promise.all([
          subApi.list(),
          histApi.list(),
          progApi.list(),
        ]);
        setSubs(subRes.data.results || subRes.data);
        setDigests((histRes.data.results || histRes.data).slice(0, 7));
        setProgressData(progRes.data.results || progRes.data);
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

  const stats = [
    {
      icon: <FiBook />,
      label: "Subscriptions",
      value: subs.length,
      color: "#1F7D53",
    },
    {
      icon: <FiMail />,
      label: "Digests Received",
      value: digests.length,
      color: "#255F38",
    },
    {
      icon: <FiTrendingUp />,
      label: "Modules Completed",
      value: progressData.filter((p) => p.status === "completed").length,
      color: "#1F7D53",
    },
  ];

  return (
    <Container className="py-4 fade-in">
      <div className="mb-4">
        <h3 className="fw-bold text-white mb-1">
          Welcome back{user?.first_name ? `, ${user.first_name}` : ""}
        </h3>
        <p className="text-muted mb-0">Here&apos;s your learning overview</p>
      </div>

      {/* Stats row */}
      <Row className="g-3 mb-4">
        {stats.map((s) => (
          <Col key={s.label} xs={12} md={4}>
            <Card className="h-100">
              <Card.Body className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 44,
                    height: 44,
                    background: `${s.color}22`,
                    color: s.color,
                    fontSize: "1.2rem",
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <div className="text-white fw-bold fs-4">{s.value}</div>
                  <div className="text-muted small">{s.label}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        {/* Subscribed topics with progress */}
        <Col xs={12} lg={5}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="text-white mb-0">Your Topics</h5>
            <Link to="/topics" className="text-primary text-decoration-none small">
              Browse all &rsaquo;
            </Link>
          </div>

          {subs.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <FiBook size={32} className="text-muted mb-2" />
                <p className="text-muted mb-2">No subscriptions yet</p>
                <Link to="/topics" className="btn btn-primary btn-sm">
                  Explore Topics
                </Link>
              </Card.Body>
            </Card>
          ) : (
            subs.map((sub) => {
              const topic = sub.topic_detail;
              const topicProgress = progressData.filter(
                (p) => p.topic_name === topic?.name
              );
              return (
                <Card key={sub.id} className="mb-2">
                  <Card.Body>
                    <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                      <span className="fw-medium text-white">{topic?.name}</span>
                      <Badge bg={sub.is_active ? "primary" : "secondary"} className="fw-normal">
                        {sub.is_active ? "Active" : "Paused"}
                      </Badge>
                      <Badge bg="" className="bg-dl-dark border-dl border fw-normal">
                        {sub.difficulty_preference}
                      </Badge>
                      {sub.preferred_time && (
                        <span className="text-muted small d-flex align-items-center gap-1 ms-auto">
                          <FiClock size={11} /> {sub.preferred_time}
                        </span>
                      )}
                    </div>
                    {topic?.modules && (
                      <ModuleProgress
                        progressData={topicProgress}
                        modules={topic.modules}
                      />
                    )}
                  </Card.Body>
                </Card>
              );
            })
          )}
        </Col>

        {/* Recent digests */}
        <Col xs={12} lg={7}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="text-white mb-0">Recent Digests</h5>
            <Link to="/digests" className="text-primary text-decoration-none small">
              View all &rsaquo;
            </Link>
          </div>

          {digests.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <FiCalendar size={32} className="text-muted mb-2" />
                <p className="text-muted mb-0">
                  No digests yet. They arrive daily at 9:30 AM!
                </p>
              </Card.Body>
            </Card>
          ) : (
            digests.map((d) => <DigestCard key={d.id} digest={d} />)
          )}
        </Col>
      </Row>
    </Container>
  );
}
