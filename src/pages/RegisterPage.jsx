import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';

function RegisterPage() {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Row className="w-100">
                <Col xl={10} md={6} lg={6} className="mx-auto">
                    <Card className="p-2 shadow" bg='light' style={{fontSize:"20px"}}>
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Kayıt Ol</Card.Title>
                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicName">
                                    <Form.Label>İsim</Form.Label>
                                    <Form.Control type="name" placeholder="İsim girin" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>E Posta Adresi</Form.Label>
                                    <Form.Control type="email" placeholder="E-posta girin" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Şifre</Form.Label>
                                    <Form.Control type="password" placeholder="Şifre" />
                                </Form.Group>
                                <Button variant="primary" type="submit" block>
                                    Kayıt Ol
                                </Button>
                            </Form>
                            <br></br>
                            <p>Zaten hasabın var mı ?</p>
                            <Link to="/login" className="btn btn-primary">
                                Giriş Yap
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default RegisterPage;
