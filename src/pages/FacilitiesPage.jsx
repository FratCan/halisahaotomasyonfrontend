import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Form, Button } from "react-bootstrap";
import { getFacilities, updateFacility } from "../api/FacilityApi";
import FacilityCard from "../Components/FacilityCard";

function FacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const data = await getFacilities();
      setFacilities(data);
    } catch (err) {
      console.error("Facilities çekilemedi:", err);
    }
  };

  const handleEditClick = (id) => {
    const fresh = facilities.find((f) => f.id === id);
    setSelectedFacility(fresh);
    setPhotoPreview(fresh.photos || "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFacility(null);
    setPhotoFile(null);
    setPhotoPreview("");
  };

  const handleFacilityUpdate = async (e) => {
    e.preventDefault();
    if (!selectedFacility) return;
  
    const elems = e.target.elements;
    const updatedData = {
      name:           elems.name.value,
      email:          elems.email.value,
      location:       elems.location.value,
      addressDetails: elems.addressDetails.value,
      totalFields:    Number(elems.totalFields.value),
      phone:          elems.phone.value,
      bankAccountInfo: elems.bankAccountInfo.value,
      transport:      elems.transport.checked,
      uniform:        elems.uniform.checked,
      hasCafeteria:   elems.hasCafeteria.checked,
      hotwater:       elems.hotwater.checked,
      hasShower:      elems.hasShower.checked,
      hasToilet:      elems.hasToilet.checked,
      shoes:          elems.shoes.checked,
      eldiven:        elems.eldiven.checked,
      // photos: skip for now
    };
  
    console.log("🔄 Updating facility", selectedFacility.id, updatedData);
  
    try {
      const result = await updateFacility(selectedFacility.id, updatedData);
      console.log("✅ API returned:", result);
      await fetchFacilities();      // reload list
      handleCloseModal();
    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err.message);
    }
  };
  

  return (
    <>
      <h2 className="text-center my-4">Tesis</h2>
      <Row xs={1} md={2} className="g-5 justify-content-center" style={{ padding: 10 }}>
        {facilities.map((f) => (
          <Col key={f.id} className="d-flex justify-content-center">
            <FacilityCard facility={f} onEdit={() => handleEditClick(f.id)} />
          </Col>
        ))}
      </Row>

      {showModal && selectedFacility && (
        <Modal show onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Tesis Düzenle: {selectedFacility.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleFacilityUpdate}>
              <Row>
                <Col>
                  <Form.Group controlId="photos" className="mb-3">
                    <Form.Label>Fotoğraf</Form.Label>
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Saha"
                        style={{ width: "100%", marginBottom: 10 }}
                      />
                    )}
                    <Form.Control
                      name="photoFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setPhotoFile(file);
                          setPhotoPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Adı</Form.Label>
                    <Form.Control
                      name="name"
                      type="text"
                      defaultValue={selectedFacility.name}
                    />
                  </Form.Group>

                  <Form.Group controlId="email" className="mb-3">
                    <Form.Label>E-Mail</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      defaultValue={selectedFacility.email || ""}
                    />
                  </Form.Group>

                  <Form.Group controlId="location" className="mb-3">
                    <Form.Label>Konum</Form.Label>
                    <Form.Control
                      name="location"
                      type="text"
                      defaultValue={selectedFacility.location}
                    />
                  </Form.Group>

                  <Form.Group controlId="addressDetails" className="mb-3">
                    <Form.Label>Adres Detay</Form.Label>
                    <Form.Control
                      name="addressDetails"
                      type="text"
                      defaultValue={selectedFacility.addressDetails}
                    />
                  </Form.Group>

                  <Form.Group controlId="totalFields" className="mb-3">
                    <Form.Label>Saha Sayısı</Form.Label>
                    <Form.Control
                      name="totalFields"
                      type="number"
                      defaultValue={selectedFacility.totalFields}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group controlId="phone" className="mb-3">
                    <Form.Label>Telefon</Form.Label>
                    <Form.Control
                      name="phone"
                      type="text"
                      defaultValue={selectedFacility.phone}
                    />
                  </Form.Group>

                  <Form.Group controlId="bankAccountInfo" className="mb-3">
                    <Form.Label>Banka Hesap Bilgisi</Form.Label>
                    <Form.Control
                      name="bankAccountInfo"
                      type="text"
                      defaultValue={selectedFacility.bankAccountInfo || ""}
                    />
                  </Form.Group>

                  <Form.Group controlId="transport" className="mb-2">
                    <Form.Check
                      name="transport"
                      type="checkbox"
                      label="Ulaşım"
                      defaultChecked={selectedFacility.transport}
                    />
                  </Form.Group>

                  <Form.Group controlId="eldiven" className="mb-2">
                    <Form.Check
                      name="eldiven"
                      type="checkbox"
                      label="Eldiven"
                      defaultChecked={selectedFacility.eldiven}
                    />
                  </Form.Group>

                  <Form.Group controlId="uniform" className="mb-2">
                    <Form.Check
                      name="uniform"
                      type="checkbox"
                      label="Forma"
                      defaultChecked={selectedFacility.uniform}
                    />
                  </Form.Group>

                  <Form.Group controlId="hasCafeteria" className="mb-2">
                    <Form.Check
                      name="hasCafeteria"
                      type="checkbox"
                      label="Kafe"
                      defaultChecked={selectedFacility.hasCafeteria}
                    />
                  </Form.Group>

                  <Form.Group controlId="hotwater" className="mb-2">
                    <Form.Check
                      name="hotwater"
                      type="checkbox"
                      label="Sıcak Su"
                      defaultChecked={selectedFacility.hotwater}
                    />
                  </Form.Group>

                  <Form.Group controlId="hasShower" className="mb-2">
                    <Form.Check
                      name="hasShower"
                      type="checkbox"
                      label="Duş"
                      defaultChecked={selectedFacility.hasShower}
                    />
                  </Form.Group>

                  <Form.Group controlId="hasToilet" className="mb-2">
                    <Form.Check
                      name="hasToilet"
                      type="checkbox"
                      label="Tuvalet"
                      defaultChecked={selectedFacility.hasToilet}
                    />
                  </Form.Group>

                  <Form.Group controlId="shoes" className="mb-2">
                    <Form.Check
                      name="shoes"
                      type="checkbox"
                      label="Ayakkabı"
                      defaultChecked={selectedFacility.shoes}
                    />
                  </Form.Group>
                </Col>
              </Row>

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
