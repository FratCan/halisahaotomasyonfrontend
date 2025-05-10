import { Card, Button, Row, Col } from "react-bootstrap";

const FacilityCard = ({ facility, equipments,onEdit }) => {
  return (
    <Card
      bg="light"
      style={{ width: "1000px", boxShadow: "10px 8px 12px rgba(0,0,0,0.1)" }}
    >
      <Row className="g-0">
        <Col md={5}>
          <Card.Img
            className="p-2"
            variant="top"
            src={
              facility.photoUrls?.[0]
                ? `http://localhost:5021/${facility.photoUrls[0]}`
                : ""
            }
            alt={facility.name}
            style={{
              height: "75%",
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
              <strong>Açıklama:</strong> {facility.description} <br />
              <strong>Şehir:</strong> {facility.city} <br />
              <strong>İlçe:</strong> {facility.town} <br />
              <strong>Telefon:</strong> {facility.phone} <br />
              <strong>E-Mail:</strong> {facility.email} <br />
              <strong>Banka Bilgisi:</strong> {facility.bankAccountInfo} <br />
              <strong>Konum:</strong> {facility.location} <br />
              <strong>Adres Detayı:</strong> {facility.addressDetails} <br />
              <br />
              <strong>Ekipmanlar</strong>
              <ul>
                {equipments?.map((equipment, index) => (
                  <li key={index}>
                    <strong>Adı:</strong> {equipment.name} <br />
                    <strong>Kiralanabilir:</strong>{" "}
                    {equipment.isRentable ? "Evet" : "Hayır"} <br />
                    <strong>Fiyat:</strong> {equipment.price} TL <br />
                    <strong>Miktar:</strong> {equipment.quantity} <br />
                    <strong>Fotoğraf:</strong>{" "}
                    {equipment.photo ? (
                      <img
                        src={equipment.photo}
                        alt={equipment.name}
                        style={{ width: "100px", height: "100px" }}
                      />
                    ) : (
                      <span>Fotoğraf mevcut değil</span>
                    )}
                    <br />
                    <strong>Açıklama:</strong> {equipment.description} <br />
                    <br />
                  </li>
                ))}
              </ul>
              <strong>Kafe:</strong>{" "}
              <span style={{ color: facility.hasCafeteria ? "green" : "red" }}>
                {facility.hasCafeteria ? "Evet" : "Hayır"}
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
};

export default FacilityCard;
