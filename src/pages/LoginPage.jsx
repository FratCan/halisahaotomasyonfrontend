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
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { loginApp } from "../api/AuthApi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setIsLoading(true);
      setValidated(true);
      setError("");

      // 🎯 Artık userRole loginApp'ten geliyor!
      const data = await loginApp(email, password);

      console.log("Kullanıcı Rolü (API'den gelen):", data.userRole);

      if (data.userRole !== "Owner") {
        setError("Sadece işletme sahipleri giriş yapabilir.");
        return;
      }

      // Rol uygunsa login ve navigate
      login(data);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Giriş başarısız. Lütfen bilgilerinizi kontrol ediniz."
      );
    } finally {
      setIsLoading(false);
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
                  <LogIn size={32} />
                </div>
              </div>
              <h2 className="fw-bold mb-0">Hesabınıza Giriş Yapın</h2>
              <p className="text-muted mb-0">Devam etmek için lütfen giriş yapın</p>
            </Card.Header>
            
            <Card.Body className="p-4 p-md-5">
              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="formEmail">
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

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label className="form-label">Şifre</Form.Label>
                  <div className="password-input-group">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="form-control-lg"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={20} className="text-secondary" />
                      ) : (
                        <Eye size={20} className="text-secondary" />
                      )}
                    </button>
                    <Form.Control.Feedback type="invalid">
                      Şifreniz en az 6 karakter olmalıdır.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    label="Beni hatırla"
                    className="remember-me"
                  />
                  <Link
                    to="/forgot-password"
                    className="forgot-password-link"
                  >
                    Şifremi unuttum
                  </Link>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100 auth-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : (
                    <LogIn size={18} className="me-2" />
                  )}
                  Giriş Yap
                </Button>

                <div className="divider my-4">
                  <span className="divider-text">veya</span>
                </div>

                <div className="text-center mt-3">
                  <span className="text-muted">Hesabınız yok mu? </span>
                  <Link
                    to="/register"
                    className="register-link"
                  >
                    Kayıt ol
                  </Link>
                </div>
              </Form>
            </Card.Body>
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
        
        .password-input-group {
          position: relative;
        }
        
        .password-toggle-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
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
          color: #6c757d;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }
        
        .forgot-password-link:hover {
          color: #0d6efd;
          text-decoration: underline;
        }
        
        .register-link {
          color: #0d6efd;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }
        
        .register-link:hover {
          text-decoration: underline;
        }
        
        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: #6c757d;
        }
        
        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid #dee2e6;
        }
        
        .divider-text {
          padding: 0 1rem;
        }
        
        .remember-me .form-check-input:checked {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }
      `}</style>
    </Container>
  );
}