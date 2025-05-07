"use client"

import { useState } from "react"
import { Container, Row, Col, Form, Button, Card, Alert, InputGroup } from "react-bootstrap"
import { Eye, EyeOff, User, Mail, MapPin, Calendar } from "lucide-react"
import { Link } from 'react-router-dom'
import {registerApp} from '../api/AuthApi' // Register fonksiyonunu import et

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        city: "",
        town: "",
        birthDate: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [validated, setValidated] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
        })
    }
    
    const calculateAge = (birthDate) => {
        const birthDateObj = new Date(birthDate)
        const today = new Date()
        let age = today.getFullYear() - birthDateObj.getFullYear()
        const monthDifference = today.getMonth() - birthDateObj.getMonth()
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
            age--
        }
        return age
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault()
        const form = event.currentTarget

        if (form.checkValidity() === false) {
            event.stopPropagation()
            setValidated(true)
            return
        }

        const age = calculateAge(formData.birthDate)
        if (age < 18) {
            setError("18 yaşından küçük kullanıcılar kayıt olamaz.")
            return
        }
        setValidated(true)
        setError("")
        
        try {
            // Register işlemi
            const response = await registerApp(
                formData.firstName,
                formData.lastName,
                formData.username,
                formData.email,
                formData.city,
                formData.town,
                formData.birthDate,
                formData.password,
                formData.role.Owner
            )

            // Kayıt başarılı, burada kullanıcıyı yönlendirebilirsiniz veya başka işlemler yapabilirsiniz
            console.log("Kayıt başarılı:", response)
        } catch (error) {
            setError("Kayıt işlemi sırasında bir hata oluştu.")
            console.error("Kayıt hatası:", error)
        }
    }

    return (
        <Container fluid style={{ maxWidth: "3600px", width: "100%" }}  className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5 ">
        <Row className="justify-content-center w-100">
        <Col xs={12} sm={12} md={10} lg={10} xl={8}>
            <Card className="shadow-lg border-0 rounded-lg">
                <Card.Header className="bg-primary text-white text-center py-4">
                <h2 className="fw-bold mb-0">Online Halısaham</h2>
                </Card.Header>
                <Card.Body className="p-4 p-md-5">
                {error && <Alert variant="danger">{error}</Alert>}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label>Ad</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>
                            <User size={16} />
                            </InputGroup.Text>
                            <Form.Control
                            type="text"
                            name="firstName"
                            placeholder="Adınız"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            />
                            <Form.Control.Feedback type="invalid">Lütfen adınızı giriniz.</Form.Control.Feedback>
                        </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>Soyad</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            placeholder="Soyadınız"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Lütfen soyadınızı giriniz.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                    <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Kullanıcı Adı</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>@</InputGroup.Text>
                        <Form.Control
                        type="text"
                        name="username"
                        placeholder="Kullanıcı adınızı giriniz"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        />
                        <Form.Control.Feedback type="invalid">Lütfen bir kullanıcı adı giriniz.</Form.Control.Feedback>
                    </InputGroup>
                    </Form.Group>
                    </Col>
                    </Row>

                    <Row className="mb-3">
                    <Col md={4}>
                    <Form.Group className="mb-3" controlId="email">
                    <Form.Label>E-posta Adresi</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                        <Mail size={16} />
                        </InputGroup.Text>
                        <Form.Control
                        type="email"
                        name="email"
                        placeholder="E-posta adresinizi giriniz"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        />
                        <Form.Control.Feedback type="invalid">
                        Lütfen geçerli bir e-posta adresi giriniz.
                        </Form.Control.Feedback>
                    </InputGroup>
                    </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="city">
                        <Form.Label>Şehir</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>
                            <MapPin size={16} />
                            </InputGroup.Text>
                            <Form.Control
                            type="text"
                            name="city"
                            placeholder="Şehir"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            />
                            <Form.Control.Feedback type="invalid">Lütfen şehir giriniz.</Form.Control.Feedback>
                        </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
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
                        <Form.Control.Feedback type="invalid">Lütfen ilçe giriniz.</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    </Row>

                    <Row>
                        <Col md={4}>
                        <Form.Group className="mb-3" controlId="birthDate">
                    <Form.Label>Doğum Tarihi</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>
                        <Calendar size={16} />
                        </InputGroup.Text>
                        <Form.Control
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        required
                        />
                        <Form.Control.Feedback type="invalid">Lütfen doğum tarihinizi giriniz.</Form.Control.Feedback>
                    </InputGroup>
                    </Form.Group>
                        </Col>
                        <Col md={4}>
                        <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Şifre</Form.Label>
                    <InputGroup>
                        <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Şifrenizi giriniz"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                        />
                        <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                        <Form.Control.Feedback type="invalid">Şifreniz en az 8 karakter olmalıdır.</Form.Control.Feedback>
                    </InputGroup>
                    </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-4" controlId="agreeTerms">
                    <Form.Check
                        type="checkbox"
                        name="agreeTerms"
                        label="Kullanım şartlarını ve gizlilik politikasını kabul ediyorum"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        required
                        feedback="Bu alanı işaretlemeniz gerekmektedir."
                        feedbackType="invalid"
                    />
                    </Form.Group>

                    <div className="d-grid">
                    <Button variant="primary" type="submit" size="lg" className="fw-bold">
                        Kayıt Ol
                    </Button>
                    </div>
                </Form>
                </Card.Body>
                <Card.Footer className="py-3 bg-white text-center">
                <div className="text-muted">
                    Zaten bir hesabınız var mı?{" "}
                    <Link to="/login" className="text-primary text-decoration-none">
                    Giriş Yap
                    </Link>
                </div>
                </Card.Footer>
            </Card>
            </Col>
        </Row>
        </Container>
    )
}
