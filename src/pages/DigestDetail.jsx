import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Spinner, Badge } from "react-bootstrap";
import { FiArrowLeft, FiCalendar } from "react-icons/fi";
import { history as histApi } from "../api/endpoints";
import DOMPurify from "dompurify";

export default function DigestDetail() {
  const { id } = useParams();
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await histApi.detail(id);
        setDigest(data);
      } catch { /* interceptor */ }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!digest) {
    return (
      <Container className="py-5 text-center text-muted">
        Digest not found.{" "}
        <Link to="/digests" className="text-primary">
          Go back
        </Link>
      </Container>
    );
  }

  const date = new Date(digest.sent_at);
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Container className="py-4 fade-in" style={{ maxWidth: 800 }}>
      <Link to="/digests" className="text-primary text-decoration-none d-inline-flex align-items-center gap-1 mb-3">
        <FiArrowLeft /> Back to Digests
      </Link>

      <Card>
        <Card.Header className="bg-dl-dark border-dl">
          <h4 className="text-white mb-2">{digest.subject}</h4>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="text-muted small d-flex align-items-center gap-1">
              <FiCalendar size={13} /> {dateStr}
            </span>
            {digest.topics_included?.map((t) => (
              <Badge key={t} bg="primary" className="fw-normal">
                {t}
              </Badge>
            ))}
          </div>
        </Card.Header>
        <Card.Body className="digest-content p-4">
          {digest.body_html ? (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(digest.body_html, {
                  ALLOWED_TAGS: [
                    "h1","h2","h3","h4","h5","h6","p","a","ul","ol","li",
                    "strong","em","b","i","br","hr","div","span","img",
                    "table","thead","tbody","tr","th","td","blockquote",
                    "code","pre","sub","sup",
                  ],
                  ALLOWED_ATTR: [
                    "href","target","rel","src","alt","class","style",
                    "width","height",
                  ],
                  ALLOW_DATA_ATTR: false,
                }),
              }}
            />
          ) : (
            <p className="text-muted">
              Content not available for this digest. It may have been sent before content storage was enabled.
            </p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
