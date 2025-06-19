import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { Link, useNavigate } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useState } from "react";
import { BellFill } from "react-bootstrap-icons";
import { useAuth } from "../Context/AuthContext";
import Notification from "./Notification";
import { analyzeComments } from "../api/AiApi";

function NavBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout(); // kullanıcıyı sistemden at
    navigate("/login"); // login sayfasına yönlendir
  };

  const handleNotificationToggle = () =>
    setShowNotifications(!showNotifications);
  const handleNotificationClose = () => setShowNotifications(false);
const [showSuggestions, setShowSuggestions] = useState(false);
const [suggestions, setSuggestions] = useState([]);

  return (
    <>
      <Navbar
        expand="md"
        variant="dark"
        style={{
          backgroundColor: "#0d1128",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          padding: "0.5rem 0",
        }}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/home"
            style={{
              fontSize: "1.6rem",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}
          >
            <Image
              src="/ball.png"
              alt="Top"
              width={40}
              height={40}
              className="me-2"
              style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.5))" }}
            />
            Online Halısaham
          </Navbar.Brand>

          <Nav className="ms-auto fs-5">
            <NavDropdown
              title="Bilgiler"
              id="basic-nav-dropdown"
              className="mx-3"
              style={{
                color: "#ffffff",
                fontWeight: "500",
              }}
            >
              <NavDropdown.Item as={Link} to="/facility">
                Tesis
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/fields">
                Sahalar
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              as={Link}
              to="/reservation"
              className="mx-3"
              style={{
                color: "#ffffff",
                fontWeight: "500",
                transition: "all 0.2s ease",
                ":hover": {
                  color: "#f8f9fa",
                },
              }}
            >
              Rezervasyon
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/payment"
              className="mx-3"
              style={{
                color: "#ffffff",
                fontWeight: "500",
                transition: "all 0.2s ease",
              }}
            >
              Ödemeler
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/personal-info"
              className="mx-3"
              style={{
                color: "#ffffff",
                fontWeight: "500",
                transition: "all 0.2s ease",
              }}
            >
              Kişisel Bilgiler
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            <Button
  variant="outline-info"
  className="me-3"
  onClick={async () => {
    try {
      const result = await analyzeComments();
      setSuggestions(result);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Öneri alınamadı:", err);
    }
  }}
>
  Öneri Al
</Button>

            <Button
              variant="outline-light"
              className="mx-3"
              onClick={handleNotificationToggle}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                padding: "0",
              }}
            >
              <BellFill size={18} />
            </Button>
            <Button
              variant="warning"
              size="md"
              onClick={handleLogout}
              style={{
                fontWeight: "500",
                padding: "0.375rem 1.25rem",
              }}
            >
              Çıkış Yap
            </Button>
          </Nav>
        </Container>
      </Navbar>
      <Offcanvas
  show={showSuggestions}
  onHide={() => setShowSuggestions(false)}
  placement="end"
  style={{
    zIndex: 9999,
    borderTopLeftRadius: "15px",
    borderBottomLeftRadius: "15px",
    overflow: "hidden",
    boxShadow: "-4px 0px 15px rgba(0,0,0,0.25)",
    width: "300px",
  }}
>
  <Offcanvas.Header closeButton>
    <Offcanvas.Title>Öneriler</Offcanvas.Title>
  </Offcanvas.Header>
  <Offcanvas.Body style={{ overflowY: "auto" }}>
    {suggestions.length > 0 ? (
      <ul style={{ padding: 0, listStyle: "none" }}>
        {suggestions.map((item, index) => (
          <li
            key={index}
            style={{
              backgroundColor: "#f8f9fa",
              borderLeft: "4px solid #17a2b8",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p>Öneri bulunamadı.</p>
    )}
  </Offcanvas.Body>
</Offcanvas>

      <Notification
        show={showNotifications}
        handleClose={handleNotificationClose}
      />
    </>
  );
}

export default NavBar;
