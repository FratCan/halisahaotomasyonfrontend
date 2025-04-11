import React, { useState } from "react";
import {Container,Card,Button,Modal,Form,Row,Col,} from "react-bootstrap";
import FieldCard from "../Components/FieldCard";
import { useFieldContext } from "../Components/FieldContext"; // Import the context

function FacilitiesPage() {
  const {facilities,updateFacility } = useFieldContext(); // Access state and methods from context
  const [showModal, setShowModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const handleEditClick = (field, facility) => {
      setSelectedFacility(facility);
      setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFacility(null);
  };

  const handleFacilityUpdate = (e) => {
    e.preventDefault();
    const updatedFacility = {
      ...selectedFacility,
      name: e.target.name.value,
      phone: e.target.phone.value,
      transport: e.target.transport.checked,
      uniform: e.target.uniform.checked,
      cafe: e.target.cafe.checked,
      hotwater: e.target.hotwater.checked,
      shower: e.target.shower.checked,
      toilet: e.target.toilet.checked,
      shoes: e.target.shoes.checked,
      eldiven: e.target.eldiven.checked,
    };

    updateFacility(updatedFacility); // Use updateFacility from context
    handleCloseModal();
  };

  return (
    <>
      <h2 className="text-center my-4">Tesis</h2>
      <Row
        xs={1}
        md={2}
        className="g-5 justify-content-center"
        style={{ padding: 10 }}
      >
        {facilities.map((facility, idx) => (
          <Col key={idx} className="d-flex justify-content-center">
            <Card
              bg="light"
              border="primary"
              style={{
                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Row className="g-0">
                <Col md={5}>
                  <Card.Img className="p-2"
                    variant="top"
                    src={facility.image}
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
                      <strong>Servis:</strong>{" "}
                      <span style={{ color: facility.transport ? "green" : "red" }}>
                        {facility.transport ? "Evet" : "Hayır"}
                      </span>{" "}
                      <br />
                      <strong>Forma:</strong>{" "}
                      <span style={{ color: facility.uniform ? "green" : "red" }}>
                        {facility.uniform ? "Evet" : "Hayır"}
                      </span>{" "}
                      <br />
                      <strong>Eldiven:</strong>{" "}
                      <span style={{ color: facility.eldiven ? "green" : "red" }}>
                        {facility.eldiven ? "Evet" : "Hayır"}
                      </span>{" "}
                      <br />
                      <strong>Kafe:</strong>{" "}
                      <span style={{ color: facility.cafe ? "green" : "red" }}>
                        {facility.cafe ? "Evet" : "Hayır"}
                      </span>{" "}
                      <br />
                      <strong>Sıcak Su:</strong>{" "}
                      <span style={{ color: facility.hotwater ? "green" : "red" }}>
                        {facility.hotwater ? "Evet" : "Hayır"}
                      </span>{" "}
                      <br />
                      <strong>Duş:</strong>{" "}
                      <span style={{ color: facility.shower ? "green" : "red" }}>
                        {facility.shower ? "Evet" : "Hayır"}
                      </span>{" "}
                      <br />
                      <strong>Tuvalet:</strong>{" "}
                      <span style={{ color: facility.toilet ? "green" : "red" }}>
                        {facility.toilet ? "Evet" : "Hayır"}
                      </span>{" "}
                      <br />
                      <strong>Ayakkabı:</strong>{" "}
                      <span style={{ color: facility.shoes ? "green" : "red" }}>
                        {facility.shoes ? "Evet" : "Hayır"}
                      </span>
                    </Card.Text>
                    <Button
                      variant="primary"
                      style={{ width: "100%" }}
                      onClick={() => handleEditClick(null, facility)}
                    >
                      Düzenle
                    </Button>
                  </Card.Body>
                </Col>
              </Row>
          </Card>
          </Col>
        ))}
      </Row>

      {showModal && selectedFacility && (
  <Modal show={showModal} onHide={handleCloseModal}>
    <Modal.Header closeButton>
      <Modal.Title>Tesis Düzenle: {selectedFacility.name}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={handleFacilityUpdate}>
        <Form.Group controlId="name">
          <Form.Label>Adı</Form.Label>
          <Form.Control type="text" defaultValue={selectedFacility.name} />
        </Form.Group>

        <Form.Group controlId="phone">
          <Form.Label>Telefon</Form.Label>
          <Form.Control type="text" defaultValue={selectedFacility.phone} />
        </Form.Group>

        <Form.Group controlId="transport">
          <Form.Check
            type="checkbox"
            label="Ulaşım"
            defaultChecked={selectedFacility.transport}
          />
        </Form.Group>

        <Form.Group controlId="eldiven">
          <Form.Check
            type="checkbox"
            label="Eldiven"
            defaultChecked={selectedFacility.eldiven}
          />
        </Form.Group>

        <Form.Group controlId="uniform">
          <Form.Check
            type="checkbox"
            label="Forma"
            defaultChecked={selectedFacility.uniform}
          />
        </Form.Group>

        <Form.Group controlId="cafe">
          <Form.Check
            type="checkbox"
            label="Kafe"
            defaultChecked={selectedFacility.cafe}
          />
        </Form.Group>

        <Form.Group controlId="hotwater">
          <Form.Check
            type="checkbox"
            label="Sıcak Su"
            defaultChecked={selectedFacility.hotwater}
          />
        </Form.Group>

        <Form.Group controlId="shower">
          <Form.Check
            type="checkbox"
            label="Duş"
            defaultChecked={selectedFacility.shower}
          />
        </Form.Group>

        <Form.Group controlId="toilet">
          <Form.Check
            type="checkbox"
            label="Tuvalet"
            defaultChecked={selectedFacility.toilet}
          />
        </Form.Group>

        <Form.Group controlId="shoes">
          <Form.Check
            type="checkbox"
            label="Ayakkabı"
            defaultChecked={selectedFacility.shoes}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Kaydet
        </Button>
      </Form>
    </Modal.Body>
  </Modal>
)}

    </>
  );
}

export default FacilitiesPage;
