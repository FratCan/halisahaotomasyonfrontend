import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { Link, useNavigate } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavBar() {
	const navigate = useNavigate();

	const handleLogout = () => {
		navigate('/login');
	};

	return (
		<Navbar
		expand="md"
		variant="dark"
		style={{
			backgroundColor: "#101446",
		}}
		>
		<Container>
			<Navbar.Brand
			as={Link}
			to="/home"
			style={{
				fontSize: "1.8rem",
				color: "#ffffff",
				display: "flex",
				alignItems: "center"
			}}
			>
			<Image src="/ball.png" alt="Top" width={45} height={45} className="me-2" />
			Online Halısaham
			</Navbar.Brand>
			<Nav className="ms-auto fs-5">
			<NavDropdown
				title="Bilgiler"
				id="basic-nav-dropdown"
				className="mx-5" // boşluk eklendi
				style={{
				color: "#ffffff",
				}}
			>
				<NavDropdown.Item as={Link} to="/facility">Tesis</NavDropdown.Item>
				<NavDropdown.Item as={Link} to="/fields">Sahalar</NavDropdown.Item>
			</NavDropdown>

			<Nav.Link
				as={Link}
				to="/reservation"
				className="mx-5" // boşluk eklendi
				style={{
				color: "#ffffff",
				transition: "color 0.1s ease"
				}}
			>
				Rezervasyon
			</Nav.Link>

			<Nav.Link
				href="#pricing"
				className="mx-5" // boşluk eklendi
				style={{
				color: "#ffffff",
				transition: "color 0.1s ease"
				}}
			>
				Ödemeler
			</Nav.Link>

			<Nav.Link
				as={Link}
				to="/announcement"
				className="mx-5" // boşluk eklendi
				style={{
				color: "#ffffff",
				transition: "color 0.1s ease"
				}}
			>
				Duyurular
			</Nav.Link>
			</Nav>


			<Nav className="ms-auto">
			<Button variant="warning" size="md" onClick={handleLogout}>
				Çıkış Yap
			</Button>
			</Nav>
		</Container>
		</Navbar>
    );
}

export default NavBar;
