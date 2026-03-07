import { useState, useEffect } from "react";
import { Container, Spinner, Button } from "react-bootstrap";
import { history as histApi } from "../api/endpoints";
import DigestCard from "../components/DigestCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Digests() {
  const [digests, setDigests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await histApi.list(page);
        setDigests(data.results || data);
        setHasNext(!!data.next);
      } catch { /* interceptor */ }
      setLoading(false);
    };
    load();
  }, [page]);

  return (
    <Container className="py-4 fade-in" style={{ maxWidth: 720 }}>
      <div className="mb-4">
        <h3 className="fw-bold text-white mb-1">Your Digests</h3>
        <p className="text-muted mb-0">Click on any digest to view the full content</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : digests.length === 0 ? (
        <div className="text-center py-5 text-muted">
          No digests yet. Subscribe to topics and they&apos;ll arrive at 9:30 AM!
        </div>
      ) : (
        <>
          {digests.map((d) => (
            <DigestCard key={d.id} digest={d} />
          ))}

          <div className="d-flex justify-content-between mt-3">
            <Button
              variant="outline-light"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <FiChevronLeft /> Previous
            </Button>
            <span className="text-muted small align-self-center">Page {page}</span>
            <Button
              variant="outline-light"
              size="sm"
              disabled={!hasNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <FiChevronRight />
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
