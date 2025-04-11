import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import './NavBar.css';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { Link,useNavigate } from "react-router-dom";

function NavBar() {


	const navigate = useNavigate();  // useNavigate hook'unu çağırın

    const handleLogout = () => {
        // Burada çıkış işlemini gerçekleştirmeniz gerekebilir (örneğin token silme)
        navigate('/login');  // Kullanıcıyı login sayfasına yönlendir
    };


	return (
		<Navbar expand="lg" variant="dark">
			<Container>
				<Navbar.Brand as={Link} to="/home" href="#home" className="navbar-brand-text">
				<Image src="/ball.png" alt="Top" width={35} height={35} className="me-2" />
					Online Halısaham
				</Navbar.Brand>
				<Nav className="ms-auto">
					<Nav.Link as={Link} to="/facilities" href="#facility" className="nav-link-text" >
						Tesis Bilgileri
					</Nav.Link>
					<Nav.Link as={Link} to="/reservation" href="#reservation" className="nav-link-text">
						Rezervasyon
					</Nav.Link>
					<Nav.Link href="#pricing" className="nav-link-text">
						Ödemeler
					</Nav.Link>
					<Nav.Link href="#announcement" className=" nav-link-text">
						Duyurular
					</Nav.Link>
				</Nav>
				<Nav className="ms-auto">
						<Button variant="warning" size="lg" onClick={handleLogout}>Çıkış Yap</Button>
						<Link to="/login"></Link>
				</Nav>
			</Container>
		</Navbar>
	);
}

export default NavBar;
