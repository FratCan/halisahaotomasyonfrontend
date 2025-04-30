import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { reset_password } from "../api/AuthApi";
import { useLocation } from "react-router-dom";
export default function ResetPasswordPage() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email); // ✅ eğer email geldiyse otomatik doldur
    }
  }, [location]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);

    if (!form.checkValidity()) {
      event.stopPropagation();
      return;
    }

    try {
      await reset_password({ email, code, newPassword });
      setSuccess(true);
      setError("");
      setTimeout(() => {
        navigate("/login"); // Başarılıysa login sayfasına yönlendir
      }, 3000);
    } catch (err) {
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Bir hata oluştu. Lütfen tekrar deneyiniz.");
      }
    }
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
    >
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={12} md={8} lg={6} xl={5}>
          <Card className="shadow-lg border-0 rounded-lg">
            <Card.Header className="bg-primary text-white text-center py-4">
              <h3 className="fw-bold mb-0">Şifreyi Sıfırla</h3>
            </Card.Header>
            <Card.Body className="p-4 p-md-5">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  Şifreniz başarıyla sıfırlandı! Yönlendiriliyorsunuz...
                </Alert>
              )}
              {!success && (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Kayıtlı E-posta Adresiniz</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="E-posta adresinizi giriniz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Lütfen geçerli bir e-posta adresi giriniz.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formCode">
                    <Form.Label>Doğrulama Kodu</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="E-posta ile gelen kodu giriniz"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Lütfen doğrulama kodunu giriniz.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formNewPassword">
                    <Form.Label>Yeni Şifreniz</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Yeni şifrenizi giriniz"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <Form.Control.Feedback type="invalid">
                      Şifreniz en az 6 karakter olmalıdır.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      className="fw-bold"
                    >
                      Şifreyi Sıfırla
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
            <Card.Footer className="py-3 bg-white text-center">
              <div className="text-muted">
                Giriş ekranına geri dön?{" "}
                <Link to="/login" className="text-primary text-decoration-none">
                  Giriş Yap
                </Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
