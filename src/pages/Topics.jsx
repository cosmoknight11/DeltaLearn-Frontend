import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { topics as topicApi, subscriptions as subApi } from "../api/endpoints";
import TopicCard from "../components/TopicCard";
import ConfigureModal from "../components/ConfigureModal";
import toast from "react-hot-toast";

export default function Topics() {
  const [allTopics, setAllTopics] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [configSub, setConfigSub] = useState(null);

  const load = useCallback(async () => {
    try {
      const [tRes, sRes] = await Promise.all([topicApi.list(), subApi.list()]);
      setAllTopics(tRes.data.results || tRes.data);
      setSubs(sRes.data.results || sRes.data);
    } catch { /* interceptor handles */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubscribe = async (topicId) => {
    try {
      await subApi.create(topicId);
      toast.success("Subscribed!");
      load();
    } catch (err) {
      const msg = err.response?.data?.topic?.[0] || "Failed to subscribe";
      toast.error(msg);
    }
  };

  const subMap = {};
  subs.forEach((s) => {
    subMap[s.topic_detail?.id || s.topic] = s;
  });

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4 fade-in">
      <div className="mb-4">
        <h3 className="fw-bold text-white mb-1">Topics</h3>
        <p className="text-muted mb-0">Subscribe to topics you want to learn. Content is delivered daily.</p>
      </div>

      <Row className="g-3">
        {allTopics.map((topic) => (
          <Col key={topic.id} xs={12} md={6} lg={4}>
            <TopicCard
              topic={topic}
              subscription={subMap[topic.id]}
              onSubscribe={handleSubscribe}
              onConfigure={setConfigSub}
            />
          </Col>
        ))}
      </Row>

      {allTopics.length === 0 && (
        <div className="text-center py-5 text-muted">
          No topics available yet. Check back soon!
        </div>
      )}

      <ConfigureModal
        show={!!configSub}
        onHide={() => setConfigSub(null)}
        subscription={configSub}
        onUpdated={load}
      />
    </Container>
  );
}
