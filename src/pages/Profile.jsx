import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { auth as authApi } from "../api/endpoints";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, fetchProfile } = useAuth();
  const [form, setForm] = useState({
    email: "",
    timezone: "Asia/Kolkata",
    email_time: "09:30",
    is_email_active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email || "",
        timezone: user.profile?.timezone || "Asia/Kolkata",
        email_time: user.profile?.email_time || "09:30",
        is_email_active: user.profile?.is_email_active ?? true,
      });
    }
  }, [user]);

  const set = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authApi.updateProfile({
        email: form.email,
        profile: {
          timezone: form.timezone,
          email_time: form.email_time,
          is_email_active: form.is_email_active,
        },
      });
      await fetchProfile();
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="py-4 fade-in" style={{ maxWidth: 560 }}>
      <h3 className="fw-bold text-white mb-4">Profile Settings</h3>

      <Card>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small text-muted">Username</Form.Label>
              <Form.Control type="text" value={user?.username || ""} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small text-muted">Email</Form.Label>
              <Form.Control type="email" value={form.email} onChange={set("email")} required />
            </Form.Group>

            <Row className="g-3 mb-3">
              <Col>
                <Form.Group>
                  <Form.Label className="small text-muted">Timezone</Form.Label>
                  <Form.Select value={form.timezone} onChange={set("timezone")}>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="US/Eastern">US/Eastern (EST)</option>
                    <option value="US/Pacific">US/Pacific (PST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
                    <option value="UTC">UTC</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label className="small text-muted">Daily Email Time</Form.Label>
                  <Form.Control type="time" value={form.email_time} onChange={set("email_time")} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Check
                type="switch"
                label="Receive daily email digests"
                checked={form.is_email_active}
                onChange={set("is_email_active")}
                id="email-active-switch"
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? <Spinner size="sm" animation="border" /> : "Save Changes"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
