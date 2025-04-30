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
import { Link, useNavigate } from "react-router-dom";
import { forgot_password } from "../api/AuthApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Navigasyon hooku ekliyoruz

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
      const response = await forgot_password(email);
      setSubmitted(true);
      setError("");

      // ✅ Başarılıysa 3 saniye sonra reset password sayfasına git
      setTimeout(() => {
        navigate("/reset-password", { state: { email } }); // email bilgisini state ile taşıyoruz
      }, 3000);

    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyiniz.");
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
              <h3 className="fw-bold mb-0">Şifremi Unuttum</h3>
            </Card.Header>
            <Card.Body className="p-4 p-md-5">
              {error && <Alert variant="danger">{error}</Alert>}
              {submitted ? (
                <Alert variant="success">
                  Eğer bu e-posta adresi sistemimizde kayıtlıysa, şifre yenileme bağlantısı gönderildi.<br />
                  Yönlendiriliyorsunuz...
                </Alert>
              ) : (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="formEmail">
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

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      className="fw-bold"
                    >
                      Şifre Sıfırlama Linki Gönder
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
            <Card.Footer className="py-3 bg-white text-center">
              <div className="text-muted">
                Giriş ekranına geri dön?{" "}
                <Link
                  to="/login"
                  className="text-primary text-decoration-none"
                >
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
