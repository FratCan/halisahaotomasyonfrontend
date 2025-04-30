    import React from "react";
    import { Card, Button, Row, Col } from "react-bootstrap";

    const FacilityCard = ({ facility, onEdit }) => (
    <Card
        bg="light"
        style={{ width:"1000px",boxShadow: "10px 8px 12px rgba(0,0,0,0.1)" }}
    >
        <Row className="g-0">
        <Col md={5}>
            <Card.Img
            className="p-2"
            variant="top"
            src={facility.photos}
            alt={facility.name}
            style={{
                height: "100%",
                objectFit: "cover",
                borderTopLeftRadius: "0.25rem",
                borderBottomLeftRadius: "0.25rem",
            }}
            />
        </Col>
        <Col md={7}>
            <Card.Body>
            <Card.Title
                style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "black",
                }}
            >
                {facility.name}
            </Card.Title>
            <Card.Text style={{ fontSize: "18px", color: "#000000" }}>
                <strong>Telefon:</strong> {facility.phone} <br />
                <strong>E-Mail:</strong> {facility.email} <br />
                <strong>Banka Bilgisi:</strong> {facility.bankAccountInfo} <br />
                <strong>Konum:</strong> {facility.location} <br />
                <strong>Adres Detayı:</strong> {facility.addressDetails} <br />
                <strong>Saha Sayısı:</strong>{facility.totalFields}<br/>
                <strong>Servis:</strong>{" "}
                <span style={{ color: facility.transport ? "green" : "red" }}>
                {facility.transport ? "Evet" : "Hayır"}
                </span>
                <br />
                <strong>Forma:</strong>{" "}
                <span style={{ color: facility.uniform ? "green" : "red" }}>
                {facility.uniform ? "Evet" : "Hayır"}
                </span>
                <br />
                <strong>Eldiven:</strong>{" "}
                <span style={{ color: facility.eldiven ? "green" : "red" }}>
                {facility.eldiven ? "Evet" : "Hayır"}
                </span>
                <br />
                <strong>Kafe:</strong>{" "}
                <span style={{ color: facility.hasCafeteria ? "green" : "red" }}>
                {facility.hasCafeteria ? "Evet" : "Hayır"}
                </span>
                <br />
                <strong>Sıcak Su:</strong>{" "}
                <span style={{ color: facility.hotwater ? "green" : "red" }}>
                {facility.hotwater ? "Evet" : "Hayır"}
                </span>
                <br />
                <strong>Duş:</strong>{" "}
                <span style={{ color: facility.hasShower ? "green" : "red" }}>
                {facility.hasShower ? "Evet" : "Hayır"}
                </span>
                <br />
                <strong>Tuvalet:</strong>{" "}
                <span style={{ color: facility.hasToilet ? "green" : "red" }}>
                {facility.hasToilet ? "Evet" : "Hayır"}
                </span>
                <br />
                <strong>Ayakkabı:</strong>{" "}
                <span style={{ color: facility.hasShoes ? "green" : "red" }}>
                {facility.hasShoes ? "Evet" : "Hayır"}
                </span>
            </Card.Text>
            <Button
                variant="primary"
                style={{ width: "100%" }}
                onClick={() => onEdit(facility)}
            >
                Düzenle
            </Button>
            </Card.Body>
        </Col>
        </Row>
    </Card>
    );

    export default FacilityCard;
