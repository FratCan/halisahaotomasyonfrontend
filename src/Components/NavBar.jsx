import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { Link, useNavigate } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useState } from "react";
import { BellFill } from "react-bootstrap-icons"; // Bildirim simgesi

function NavBar() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleNotificationToggle = () =>
    setShowNotifications(!showNotifications);
  const handleNotificationClose = () => setShowNotifications(false);

  return (
    <>
      <Navbar expand="md" variant="dark" style={{ backgroundColor: "#101446" }}>
        <Container>
          <Navbar.Brand
            as={Link}
            to="/home"
            style={{
              fontSize: "1.8rem",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              src="/ball.png"
              alt="Top"
              width={45}
              height={45}
              className="me-2"
            />
            Online Halısaham
          </Navbar.Brand>

          <Nav className="ms-auto fs-5">
            <NavDropdown
              title="Bilgiler"
              id="basic-nav-dropdown"
              className="mx-4"
              style={{ color: "#ffffff" }}
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
              className="mx-4"
              style={{ color: "#ffffff", transition: "color 0.1s ease" }}
            >
              Rezervasyon
            </Nav.Link>

            <Nav.Link
              href="#pricing"
              className="mx-4"
              style={{ color: "#ffffff", transition: "color 0.1s ease" }}
            >
              Ödemeler
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/announcement"
              className="mx-4"
              style={{ color: "#ffffff", transition: "color 0.1s ease" }}
            >
              Duyurular
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/personal-info"
              className="mx-4"
              style={{ color: "#ffffff", transition: "color 0.1s ease" }}
            >
              Kişisel Bilgiler
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            {/* 🔔 Bildirim Butonu */}
            <Button
              variant="outline-light"
              className="mx-4"
              onClick={handleNotificationToggle}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BellFill size={20} />
            </Button>
            <Button variant="warning" size="md" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* 🧾 Bildirim Sidebar (Offcanvas) */}
      <Offcanvas
        show={showNotifications}
        onHide={handleNotificationClose}
        placement="end"
        style={{
          borderTopLeftRadius: "20px",
          borderBottomLeftRadius: "20px",
          overflow: "hidden",
          boxShadow: "-4px 0px 10px rgba(0,0,0,0.2)",
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Bildirimler</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul>
            <li>⚽ Yeni maç rezervasyonu yapıldı</li>
            <li>🕒 Maç saatinize 1 saat kaldı</li>
            <li>📢 Yeni bir duyuru var</li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NavBar;
