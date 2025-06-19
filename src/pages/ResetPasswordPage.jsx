// Güncellenmiş ResetPasswordPage
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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { reset_password } from "../api/AuthApi";
import { KeyRound } from "lucide-react";

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
      setEmail(location.state.email);
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
        navigate("/login");
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
    <Container fluid className="auth-page">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="auth-card shadow-lg">
            <Card.Header className="auth-card-header text-center py-4">
              <div className="logo-container mb-3">
                <div className="logo-icon">
                  <KeyRound size={32} />
                </div>
              </div>
              <h3 className="fw-bold mb-0">Şifreyi Sıfırla</h3>
              <p className="text-muted mb-0">Yeni şifrenizi belirleyin</p>
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
                    <Form.Label className="form-label">E-posta Adresi</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="ornek@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="form-control-lg"
                    />
                    <Form.Control.Feedback type="invalid">
                      Lütfen geçerli bir e-posta adresi giriniz.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formCode">
                    <Form.Label className="form-label">Doğrulama Kodu</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="E-posta ile gelen kodu giriniz"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      className="form-control-lg"
                    />
                    <Form.Control.Feedback type="invalid">
                      Lütfen doğrulama kodunu giriniz.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formNewPassword">
                    <Form.Label className="form-label">Yeni Şifre</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={10}
                      className="form-control-lg"
                    />
                    <Form.Control.Feedback type="invalid">
                      Şifreniz en az 10 karakter olmalıdır.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      className="fw-bold auth-btn"
                    >
                      Şifreyi Sıfırla
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>

            <Card.Footer className="py-3 bg-white text-center">
              <div className="text-muted">
                Giriş ekranına geri dön?{' '}
                <Link to="/login" className="text-primary text-decoration-none">
                  Giriş Yap
                </Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .auth-page {
          background-color: #f8f9fa;
          background-image: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
        }

        .auth-card {
          border: none;
          border-radius: 12px;
          overflow: hidden;
        }

        .auth-card-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-bottom: none;
        }

        .logo-container {
          display: flex;
          justify-content: center;
        }

        .logo-icon {
          background-color: rgba(255, 255, 255, 0.2);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-label {
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .auth-btn {
          padding: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .auth-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </Container>
  );
}
