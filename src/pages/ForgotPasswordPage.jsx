import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { MailCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { forgot_password } from "../api/AuthApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    try {
      await forgot_password(email);
      setSubmitted(true);
      setError("");
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 3000);
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyiniz.");
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
                  <MailCheck size={32} />
                </div>
              </div>
              <h2 className="fw-bold mb-0">Şifre Sıfırlama</h2>
              <p className="text-muted mb-0">Kayıtlı e-posta adresinizi girin</p>
            </Card.Header>

            <Card.Body className="p-4 p-md-5">
              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              )}

              {submitted ? (
                <Alert variant="success" className="text-center">
                  Eğer bu e-posta adresi sistemimizde kayıtlıysa,
                  şifre yenileme bağlantısı gönderildi. <br />
                  Yönlendiriliyorsunuz...
                </Alert>
              ) : (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="formEmail">
                    <Form.Label className="form-label">
                      E-posta Adresiniz
                    </Form.Label>
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

                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="w-100 auth-btn"
                  >
                    Şifre Sıfırlama Linki Gönder
                  </Button>

                  <div className="text-center mt-4">
                    <Link to="/login" className="forgot-password-link">
                      Giriş sayfasına dön
                    </Link>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Aynı stiller */}
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

        .forgot-password-link {
          color: #0d6efd;
          text-decoration: none;
          font-weight: 500;
        }

        .forgot-password-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </Container>
  );
}
