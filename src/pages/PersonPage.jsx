import React, { useEffect, useState } from "react";
import axios from "axios";
import { update_password, updateOwner } from "../api/AuthApi";
import { 
  Button, 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Spinner,
  ListGroup,
  Alert,
  Modal 
} from "react-bootstrap";
import { FaUser, FaKey, FaCalendarAlt, FaMapMarkerAlt, FaEdit } from "react-icons/fa";

const PersonPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [validated, setValidated] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    city: "",
    town: "",
    birthday: ""
  });
  const [editMessage, setEditMessage] = useState("");

  // fetchUserData fonksiyonunu useEffect dışına taşı
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setError("Giriş yapmanız gerekiyor.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://halisaha.up.railway.app/api/Auth/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(response.data);
      // Edit formunu kullanıcı verileriyle doldur
      setEditForm({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        userName: response.data.userName,
        email: response.data.email,
        city: response.data.city,
        town: response.data.town,
        birthday: response.data.birthday.split('T')[0] // Tarih formatını düzelt
      });
    } catch (err) {
      const message =
        typeof err.response?.data === "object"
          ? err.response.data.Message || "Veriler alınamadı."
          : err.response?.data || "Veriler alınamadı.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      await update_password({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage("Şifre başarıyla güncellendi!");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setValidated(false);
    } catch (err) {
      const errorMessage =
        typeof err.response?.data === "object"
          ? err.response.data.Message || "Şifre güncellenirken bir hata oluştu."
          : err.response?.data || "Şifre güncellenirken bir hata oluştu.";

      setPasswordMessage(errorMessage);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateOwner({
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        userName: editForm.userName,
        email: editForm.email,
        city: editForm.city,
        town: editForm.town,
        birthday: editForm.birthday
      });

      setUserData(updatedUser);
      setEditMessage("Bilgiler başarıyla güncellendi!");
      fetchUserData(); // Güncellenen verileri tekrar çek
      setTimeout(() => {
        setShowEditModal(false);
        setEditMessage("");
      }, 1500);
    } catch (err) {
      const errorMessage =
        typeof err.response?.data === "object"
          ? err.response.data.Message || "Güncelleme sırasında bir hata oluştu."
          : err.response?.data || "Güncelleme sırasında bir hata oluştu.";

      setEditMessage(errorMessage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1 className="text-center mb-4">Profil Bilgileri</h1>

          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <FaUser className="me-2" />
                <strong>Kişisel Bilgiler</strong>
              </div>
              <Button 
                variant="light" 
                size="sm" 
                onClick={() => setShowEditModal(true)}
              >
                <FaEdit className="me-1" /> Düzenle
              </Button>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col sm={4} className="fw-bold">Ad:</Col>
                    <Col sm={8}>{userData.firstName}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col sm={4} className="fw-bold">Soyad:</Col>
                    <Col sm={8}>{userData.lastName}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col sm={4} className="fw-bold">Kullanıcı Adı:</Col>
                    <Col sm={8}>{userData.userName}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col sm={4} className="fw-bold">Email:</Col>
                    <Col sm={8}>{userData.email}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col sm={4} className="fw-bold">Rol:</Col>
                    <Col sm={8}><span className="badge bg-info">{userData.role}</span></Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col sm={4} className="fw-bold">
                      <FaMapMarkerAlt className="me-1" />
                      Şehir:
                    </Col>
                    <Col sm={8}>{userData.city}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col sm={4} className="fw-bold">İlçe:</Col>
                    <Col sm={8}>{userData.town}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col sm={4} className="fw-bold">
                      <FaCalendarAlt className="me-1" />
                      Doğum Tarihi:
                    </Col>
                    <Col sm={8}>{new Date(userData.birthday).toLocaleDateString()}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <FaKey className="me-2" />
              <strong>Şifre Değiştir</strong>
            </Card.Header>
            <Card.Body>
              <Form noValidate validated={validated} onSubmit={handlePasswordChange}>
                <Form.Group className="mb-3">
                  <Form.Label>Mevcut Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                  />
                  <Form.Control.Feedback type="invalid">
                    Lütfen mevcut şifrenizi giriniz
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Yeni Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                  />
                  <Form.Control.Feedback type="invalid">
                    Şifre en az 6 karakter olmalıdır
                  </Form.Control.Feedback>
                  <Form.Text muted>
                    Şifreniz en az 6 karakter uzunluğunda olmalıdır
                  </Form.Text>
                </Form.Group>
                
                <div className="d-grid">
                  <Button variant="success" type="submit" size="lg">
                    Şifreyi Güncelle
                  </Button>
                </div>
              </Form>
              
              {passwordMessage && (
                <Alert 
                  variant={passwordMessage.includes("başarı") ? "success" : "danger"} 
                  className="mt-4"
                >
                  {passwordMessage}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bilgi Güncelleme Modalı */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Bilgileri Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ad</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Soyad</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kullanıcı Adı</Form.Label>
                  <Form.Control
                    type="text"
                    name="userName"
                    value={editForm.userName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Şehir</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={editForm.city}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>İlçe</Form.Label>
                  <Form.Control
                    type="text"
                    name="town"
                    value={editForm.town}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Doğum Tarihi</Form.Label>
              <Form.Control
                type="date"
                name="birthday"
                value={editForm.birthday}
                onChange={handleInputChange}
              />
            </Form.Group>

            {editMessage && (
              <Alert 
                variant={editMessage.includes("başarı") ? "success" : "danger"} 
                className="mt-2"
              >
                {editMessage}
              </Alert>
            )}

            <div className="d-grid">
              <Button variant="primary" type="submit" size="lg">
                Bilgileri Güncelle
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PersonPage;