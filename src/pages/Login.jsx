import { useState } from "react";
import { Container, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { requestOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestOTP(email);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyOTP(email, code);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);
    try {
      await requestOTP(email);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to resend. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "85vh" }}>
      <div style={{ width: "100%", maxWidth: 400 }} className="fade-in">
        {/* Logo */}
        <div className="text-center mb-4">
          <svg width="52" height="52" viewBox="0 0 64 64" fill="none" className="mb-3">
            <polygon points="32,6 4,58 60,58" stroke="#1F7D53" strokeWidth="4" fill="#255F38" opacity="0.9" />
            <polygon points="32,20 16,50 48,50" fill="#0a0a0a" />
          </svg>
          <h2 className="fw-bold mb-1">
            <span className="text-accent">Delta</span>
            <span className="text-white">Learn</span>
          </h2>
          <p className="text-muted small">
            {step === "email"
              ? "Enter your email to get started"
              : `We sent a code to ${email}`}
          </p>
        </div>

        <Card>
          <Card.Body className="p-4">
            {error && (
              <Alert variant="danger" className="py-2 small mb-3">
                {error}
              </Alert>
            )}

            {step === "email" ? (
              <Form onSubmit={handleRequestOTP}>
                <Form.Group className="mb-4">
                  <Form.Label className="small text-muted">Email address</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoFocus
                      className="ps-5"
                    />
                    <FiMail
                      className="position-absolute text-muted"
                      style={{ left: 14, top: "50%", transform: "translateY(-50%)" }}
                    />
                  </div>
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : "Send Login Code"}
                </Button>
              </Form>
            ) : (
              <Form onSubmit={handleVerifyOTP}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted">6-digit code</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      required
                      autoFocus
                      className="ps-5 text-center fs-4 fw-bold letter-spacing-wide"
                      style={{ letterSpacing: "0.5em" }}
                    />
                    <FiLock
                      className="position-absolute text-muted"
                      style={{ left: 14, top: "50%", transform: "translateY(-50%)" }}
                    />
                  </div>
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading || code.length !== 6}>
                  {loading ? <Spinner size="sm" animation="border" /> : "Verify & Sign In"}
                </Button>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-muted text-decoration-none p-0"
                    onClick={() => { setStep("email"); setCode(""); setError(""); }}
                  >
                    <FiArrowLeft className="me-1" /> Change email
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-accent text-decoration-none p-0"
                    onClick={handleResend}
                    disabled={loading}
                  >
                    Resend code
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>

        <p className="text-center text-muted mt-3 small">
          No password needed — we&apos;ll email you a code every time.
        </p>
      </div>
    </Container>
  );
}
