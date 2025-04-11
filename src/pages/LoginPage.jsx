import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Card} from 'react-bootstrap';
import { Link ,useNavigate} from 'react-router-dom';

function RegisterPage() {

const navigate = useNavigate();  // useNavigate hook'unu çağırın

    const handleLogout = () => {
        // Burada çıkış işlemini gerçekleştirmeniz gerekebilir (örneğin token silme)
        navigate('/home');  // Kullanıcıyı login sayfasına yönlendir
    };


    return (
        <Container className="d-flex justify-content-center align-items-center my-5">
            <Row className="w-100">
                <Col xl={10} md={6} lg={6} className="mx-auto">
                    <Card className="p-2 shadow" bg='light' style={{fontSize:"20px"}}>
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Giriş Yap</Card.Title>
                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>E Posta Adresi</Form.Label>
                                    <Form.Control type="email" placeholder="E-posta girin" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Şifre</Form.Label>
                                    <Form.Control type="password" placeholder="Şifre" />
                                </Form.Group>
                                <Button variant="primary" type="submit" block onClick={handleLogout}>
                                    Giriş Yap
                                </Button>
                                <Link to="/home"></Link>
                            </Form>
                            <br></br>
                            <p>Hesabın yok mu ?</p>
                            <Link to="/register" className="btn btn-primary">
                                Kayıt Ol
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default RegisterPage;
