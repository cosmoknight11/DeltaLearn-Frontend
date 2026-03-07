import { useState, useEffect } from "react";
import { Modal, Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { subscriptions as subApi } from "../api/endpoints";
import toast from "react-hot-toast";

export default function ConfigureModal({ show, onHide, subscription, onUpdated }) {
  const [prompt, setPrompt] = useState("");
  const [difficulty, setDifficulty] = useState("mixed");
  const [time, setTime] = useState("09:30");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (subscription) {
      setPrompt(subscription.custom_prompt || "");
      setDifficulty(subscription.difficulty_preference || "mixed");
      setTime(subscription.preferred_time || "09:30");
      setActive(subscription.is_active);
    }
  }, [subscription]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await subApi.update(subscription.id, {
        custom_prompt: prompt,
        difficulty_preference: difficulty,
        preferred_time: time,
        is_active: active,
      });
      toast.success("Subscription updated");
      onUpdated();
      onHide();
    } catch {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm("Unsubscribe from this topic?")) return;
    setSaving(true);
    try {
      await subApi.remove(subscription.id);
      toast.success("Unsubscribed");
      onUpdated();
      onHide();
    } catch {
      toast.error("Failed to unsubscribe");
    } finally {
      setSaving(false);
    }
  };

  if (!subscription) return null;

  return (
    <Modal show={show} onHide={onHide} centered data-bs-theme="dark">
      <Modal.Header closeButton className="border-dl bg-dl-dark">
        <Modal.Title className="fs-5">
          Configure — {subscription.topic_detail?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-surface">
        <Form.Group className="mb-3">
          <Form.Label className="small text-muted">Custom Prompt</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Leave blank for the default prompt..."
          />
          <Form.Text className="text-muted">
            Tell the AI how you want your daily content personalized.
          </Form.Text>
        </Form.Group>

        <Row className="g-3 mb-3">
          <Col>
            <Form.Group>
              <Form.Label className="small text-muted">Difficulty</Form.Label>
              <Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="mixed">Mixed</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label className="small text-muted">Delivery Time</Form.Label>
              <Form.Control
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group>
          <Form.Check
            type="switch"
            label="Receive daily emails for this topic"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            id="active-switch"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="border-dl bg-dl-dark d-flex justify-content-between">
        <Button variant="outline-danger" size="sm" onClick={handleRemove} disabled={saving}>
          Unsubscribe
        </Button>
        <div className="d-flex gap-2">
          <Button variant="outline-light" size="sm" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size="sm" animation="border" /> : "Save"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
