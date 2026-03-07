import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar expand="lg" className="py-2 sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 fw-bold">
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
            <polygon points="32,6 4,58 60,58" stroke="#1F7D53" strokeWidth="4" fill="#255F38" opacity="0.9"/>
            <polygon points="32,20 16,50 48,50" fill="#0a0a0a"/>
          </svg>
          <span className="text-accent">Delta</span>
          <span className="text-white">Learn</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="dl-nav" className="border-0" />
        <Navbar.Collapse id="dl-nav">
          {user ? (
            <>
              <Nav className="me-auto">
                <Nav.Link
                  as={Link}
                  to="/"
                  className={isActive("/") ? "text-white" : ""}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/topics"
                  className={isActive("/topics") ? "text-white" : ""}
                >
                  Topics
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/digests"
                  className={isActive("/digests") ? "text-white" : ""}
                >
                  Digests
                </Nav.Link>
              </Nav>
              <Nav className="align-items-center gap-2">
                <Nav.Link as={Link} to="/profile" className="d-flex align-items-center gap-1">
                  <FiUser size={16} />
                  <span className="d-none d-md-inline">{user.email || user.username}</span>
                </Nav.Link>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-1"
                >
                  <FiLogOut size={14} /> Logout
                </Button>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <Button as={Link} to="/login" variant="primary" size="sm">
                Sign In
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
