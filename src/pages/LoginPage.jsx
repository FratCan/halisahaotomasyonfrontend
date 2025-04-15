    import { useState } from "react"
    import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap"
    import { Eye, EyeOff } from "lucide-react"
    import { Link } from 'react-router-dom'
    import { useNavigate} from "react-router-dom";
    import {useAuth} from "../Context/AuthContext"

    export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [validated, setValidated] = useState(false)
    const [error, setError] = useState("")

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
            }
            login();
            setValidated(true);
            // giriş doğrulaması başarılıysa
            console.log("Login attempt with:", { email, password });
            // Başarılıysa yönlendir
            navigate("/home");
    };

    return (
        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center py-5" >
        <Row className="justify-content-center w-100">
            <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card  className="shadow-lg border-0 rounded-lg">
                <Card.Header className="bg-primary text-white text-center py-4">
                <h2 className="fw-bold mb-0">Online Halısaham</h2>
                </Card.Header>
                <Card.Body className="p-4 p-md-5">
                {error && <Alert variant="danger">{error}</Alert>}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-4" controlId="formEmail">
                    <Form.Label>E-posta Adresi</Form.Label>
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

                    <Form.Group className="mb-4" controlId="formPassword">
                    <Form.Label>Şifre</Form.Label>
                    <div className="position-relative">
                        <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Şifrenizi giriniz"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        />
                        <Button
                        variant="link"
                        className="position-absolute end-0 top-0 text-decoration-none"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ height: "100%", zIndex: 10 }}
                        >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                        <Form.Control.Feedback type="invalid">Şifreniz en az 6 karakter olmalıdır.</Form.Control.Feedback>
                    </div>
                    </Form.Group>

                    <Form.Group className="mb-4 d-flex justify-content-between align-items-center">
                    <Form.Check type="checkbox" id="rememberMe" label="Beni hatırla" />
                    <Link to="/forgot-password" className="text-primary text-decoration-none small">
                    Şifremi unuttum
                    </Link>

                    </Form.Group>

                    <div className="d-grid">
                        <Button variant="primary" type="submit" size="lg" className="fw-bold">
                            Giriş Yap
                        </Button>
                    </div>

                </Form>
                </Card.Body>
                <Card.Footer className="py-3 bg-white text-center">
                <div className="text-muted">
                    Hesabınız yok mu?{" "}
                    <Link to="/register" className="text-primary text-decoration-none">
                    Kayıt ol
                    </Link>
                </div>
                </Card.Footer>
            </Card>
            </Col>
        </Row>
        </Container>
    )
    }
