import { Navigate } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
