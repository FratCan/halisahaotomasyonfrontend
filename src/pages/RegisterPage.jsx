import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  MapPin,
  Calendar,
  Lock,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { Link } from "react-router-dom";
import { registerApp } from "../api/AuthApi";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: "Owner",
    city: "",
    town: "",
    birthDate: "",
    password: "",
    agreeTerms: false,
  });
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const age = calculateAge(formData.birthDate);
    if (age < 18) {
      setError("Kayıt için en az 18 yaşında olmalısınız.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await registerApp(
        formData.firstName,
        formData.lastName,
        formData.username,
        formData.email,
        formData.role,
        formData.city,
        formData.town,
        formData.birthDate,
        formData.password
      );

      console.log("Kayıt başarılı:", response);
      setSuccess("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);

      // Başarılı kayıt sonrası yönlendirme
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Kayıt işlemi sırasında bir hata oluştu. Lütfen bilgilerinizi kontrol edin."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Row className="g-0 min-vh-100">
        {/* Sol Sabit Panel */}
        <Col lg={5} className="register-sidebar">
          <div className="register-sidebar-content">
            <div className="logo-icon">
              <User size={48} />
            </div>
            <h1>Halısaha Rezervasyon Takip Uygulaması</h1>
            <p className="lead">Spor yapmanın en kolay yolu</p>
            <div className="features">
              <div className="feature-item">
                <div className="feature-icon">
                  <Calendar size={24} />
                </div>
                <div>Kolay rezervasyon takibi</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Lock size={24} />
                </div>
                <div>Güvenli ödeme takibi</div>
              </div>
            </div>

            <div className="auth-redirect">
              <span>Zaten hesabınız var mı?</span>
              <Link to="/login">
                <Button variant="outline-light">
                  <LogIn size={18} className="me-2" />
                  Giriş Yap
                </Button>
              </Link>
            </div>
          </div>
        </Col>

        {/* Sağ Form Panel */}
        <Col lg={7} className="register-form-col">
          <div className="register-form-container">
            <div className="register-form-header">
              <h2>Hesap Oluştur</h2>
              <br></br>
            </div>

            {error && (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            )}
            {success && (
  <Alert variant="success" className="text-center">
    {success}
  </Alert>
)}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="firstName">
                    <Form.Label>Ad</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <User size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="Adınız"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      Lütfen adınızı giriniz.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="lastName">
                    <Form.Label>Soyad</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      placeholder="Soyadınız"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Lütfen soyadınızı giriniz.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Kullanıcı Adı</Form.Label>
                <InputGroup>
                  <InputGroup.Text>@</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Kullanıcı adınız"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  Lütfen bir kullanıcı adı giriniz.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>E-posta</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <Mail size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  Lütfen geçerli bir e-posta adresi giriniz.
                </Form.Control.Feedback>
              </Form.Group>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="city">
                    <Form.Label>Şehir</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <MapPin size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="city"
                        placeholder="Şehir"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      Lütfen şehir giriniz.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="town">
                    <Form.Label>İlçe</Form.Label>
                    <Form.Control
                      type="text"
                      name="town"
                      placeholder="İlçe"
                      value={formData.town}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Lütfen ilçe giriniz.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="birthDate">
                    <Form.Label>Doğum Tarihi</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <Calendar size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        required
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      Lütfen doğum tarihinizi giriniz.
                    </Form.Control.Feedback>
                    {formData.birthDate && (
                      <div className="age-info">
                        Yaşınız: {calculateAge(formData.birthDate)}
                      </div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="password">
                    <Form.Label>Şifre</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <Lock size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="En az 8 karakter"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </Button>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      Şifreniz en az 8 karakter olmalıdır.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <br></br>
              <Button
                variant="primary"
                type="submit"
                size="lg"
                className="w-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                ) : (
                  <>
                    Kayıt Ol <ArrowRight size={18} className="ms-2" />
                  </>
                )}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>

      <style jsx>{`
        .register-page {
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        .register-sidebar {
          background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
          color: white;
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .register-sidebar-content {
          max-width: 400px;
          text-align: center;
        }

        .logo-icon {
          background-color: rgba(255, 255, 255, 0.2);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .register-sidebar h1 {
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .register-sidebar .lead {
          opacity: 0.9;
          margin-bottom: 3rem;
        }

        .features {
          text-align: left;
          margin: 3rem 0;
        }

        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .feature-icon {
          background-color: rgba(255, 255, 255, 0.1);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
        }

        .auth-redirect {
          margin-top: 3rem;
        }

        .auth-redirect span {
          display: block;
          margin-bottom: 1rem;
        }

        .register-form-col {
          background-color: white;
          height: 100vh;
          overflow-y: auto;
        }

        .register-form-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .register-form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .register-form-header h2 {
          font-weight: 700;
          color: #2c3e50;
        }

        .register-form-header p {
          color: #7f8c8d;
        }

        .age-info {
          font-size: 0.875rem;
          color: #7f8c8d;
          margin-top: 0.5rem;
        }

        @media (max-width: 992px) {
          .register-sidebar {
            position: relative;
            height: auto;
            padding: 3rem 1rem;
          }

          .register-form-col {
            height: auto;
            overflow-y: visible;
          }
        }
      `}</style>
    </div>
  );
}
