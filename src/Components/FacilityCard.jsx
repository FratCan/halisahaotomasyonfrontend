import { Card, Button, Row, Col, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";

import {
  getEquipments,
  deleteEquipment,
  createEquipments,
  updateEquipment,
} from "../api/EquipmentsApi";

const FacilityCard = ({ facility, onEdit }) => {
  const [equipments, setEquipments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    isRentable: false,
  });
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  useEffect(() => {
    async function fetchEquipments() {
      try {
        const data = await getEquipments(facility.id); // <<< BURAYA facility.id EKLE
        console.log("Gelen ekipmanlar:", data);
        setEquipments(data);
      } catch (error) {
        console.error("Ekipmanlar alınamadı:", error);
      }
    }

    if (facility?.id) {
      fetchEquipments();
    }
  }, [facility?.id]); // <<< BURADA DA facility.id'ye bağımlı olsun

  const handleDelete = async (equipmentId) => {
    if (!facility?.id) {
      console.error("Facility ID yok, silme işlemi yapılamaz.");
      return;
    }

    try {
      await deleteEquipment(facility.id, equipmentId);
      // Başarıyla silindiyse, listedeki ekipmanı çıkar
      setEquipments((prev) => prev.filter((e) => e.id !== equipmentId));
    } catch (error) {
      console.error("Ekipman silinirken bir hata oluştu:", error);
    }
  };

  const handleAddEquipment = async () => {
    try {
      await createEquipments(facility.id, newEquipment);
      setShowAddModal(false);
      setNewEquipment({
        name: "",
        price: "",
        quantity: "",
        description: "",
        isRentable: false,
      });
      const data = await getEquipments(facility.id); // Ekipmanları yeniden çek
      setEquipments(data);
    } catch (error) {
      console.error("Ekipman eklenirken hata:", error);
    }
  };

  const handleEditEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setShowEditModal(true);
  };

  const handleUpdateEquipment = async () => {
    try {
      await updateEquipment(
        facility.id,
        selectedEquipment.id,
        selectedEquipment
      );
      setShowEditModal(false);
      setSelectedEquipment(null);
      reloadEquipments();
    } catch (error) {
      console.error("Ekipman güncellenirken hata:", error);
    }
  };

  const resetNewEquipment = () => {
    setNewEquipment({
      name: "",
      price: "",
      quantity: "",
      description: "",
      isRentable: false,
    });
  };

  const reloadEquipments = async () => {
    const data = await getEquipments(facility.id);
    setEquipments(data);
  };
  return (
    <Card
      bg="light"
      className="p-3"
      style={{
        height: "100%",
        boxShadow: "10px 8px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Card.Body>
        <Row className="g-3 align-items-start">
          <Col md={3} className="d-flex justify-content-center">
            <Card.Img
              className="p-2"
              variant="top"
              src={
                facility.photoUrls?.[0]
                  ? `https://halisaha.up.railway.app/${facility.photoUrls[0]}`
                  : ""
              }
              alt={facility.name}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </Col>

          <Col md={4}>
            <Card.Title
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "black",
              }}
            >
              {facility.name}
            </Card.Title>

            <Card.Text
              style={{ fontSize: "18px", color: "#333", marginTop: 20 }}
            >
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "140px" }}>Şehir:</strong>{" "}
                {facility.city}
              </div>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "140px" }}>İlçe:</strong>{" "}
                {facility.town}
              </div>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "140px" }}>Adres Detayı:</strong>{" "}
                {facility.addressDetails}
              </div>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "140px" }}>Telefon:</strong>{" "}
                {facility.phone}
              </div>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "140px" }}>E-Mail:</strong>{" "}
                {facility.email}
              </div>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "140px" }}>Banka Bilgisi:</strong>{" "}
                {facility.bankAccountInfo}
              </div>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "140px" }}>Açıklama:</strong>{" "}
                {facility.description}
              </div>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "140px" }}>Kafe:</strong>
                <span
                  style={{ color: facility.hasCafeteria ? "green" : "red" }}
                >
                  {facility.hasCafeteria ? "Evet" : "Hayır"}
                </span>
              </div>
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <strong style={{ width: "140px" }}>Duş:</strong>
                <span style={{ color: facility.hasShower ? "green" : "red" }}>
                  {facility.hasShower ? "Evet" : "Hayır"}
                </span>
              </div>
              <div style={{ display: "flex" }}>
                <strong style={{ width: "140px" }}>Tuvalet:</strong>
                <span style={{ color: facility.hasToilet ? "green" : "red" }}>
                  {facility.hasToilet ? "Evet" : "Hayır"}
                </span>
              </div>
              <div style={{ display: "flex" }}>
                <strong style={{ width: "140px" }}>Kamera:</strong>
                <span style={{ color: facility.hasSecurityCameras ? "green" : "red" }}>
                  {facility.hasSecurityCameras ? "Evet" : "Hayır"}
                </span>
              </div>
              <div style={{ display: "flex" }}>
                <strong style={{ width: "140px" }}>Ulaşım:</strong>
                <span style={{ color: facility.hasTransportService ? "green" : "red" }}>
                  {facility.hasTransportService ? "Evet" : "Hayır"}
                </span>
              </div>
              <div style={{ display: "flex" }}>
                <strong style={{ width: "140px" }}>Park:</strong>
                <span style={{ color: facility.hasParking ? "green" : "red" }}>
                  {facility.hasParking ? "Evet" : "Hayır"}
                </span>
              </div>
            </Card.Text>

            <Button
              variant="primary"
              style={{ width: "100%" }}
              onClick={() => onEdit(facility)}
            >
              Düzenle
            </Button>
          </Col>
          <Col md={5}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Card.Title
                style={{ fontSize: "24px", fontWeight: "bold", color: "black" }}
              >
                Ekipmanlar
              </Card.Title>
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowAddModal(true)}
              >
                + Ekle
              </Button>
            </div>

            <Card.Text style={{ fontSize: "16px", color: "#000000" }}>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="table table-bordered table-sm">
                  <thead>
                    <tr>
                      <th>Ad</th>
                      <th>Fiyat</th>
                      <th>Miktar</th>
                      <th>Açıklama</th>
                      <th>Kiralanabilir</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipments.map((equipment) => (
                      <tr key={equipment.id}>
                        <td>{equipment.name}</td>
                        <td>{equipment.price}₺</td>
                        <td>{equipment.quantity}</td>
                        <td>{equipment.description}</td>
                        <td>{equipment.isRentable ? "Evet" : "Hayır"}</td>
                        <td>
                          <div className="d-flex">
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditEquipment(equipment)}
                            >
                              Düzenle
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(equipment.id)}
                            >
                              Sil
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Text>
          </Col>
        </Row>

        {/* Ekipman Ekle Modalı */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Yeni Ekipman Ekle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Form alanları */}
              <Form.Group className="mb-3">
                <Form.Label>Ad</Form.Label>
                <Form.Control
                  type="text"
                  value={newEquipment.name}
                  onChange={(e) =>
                    setNewEquipment({ ...newEquipment, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fiyat</Form.Label>
                <Form.Control
                  type="number"
                  value={newEquipment.price}
                  onChange={(e) =>
                    setNewEquipment({ ...newEquipment, price: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Miktar</Form.Label>
                <Form.Control
                  type="number"
                  value={newEquipment.quantity}
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      quantity: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Açıklama</Form.Label>
                <Form.Control
                  type="text"
                  value={newEquipment.description}
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Kiralanabilir mi?"
                  checked={newEquipment.isRentable}
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      isRentable: e.target.checked,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              İptal
            </Button>
            <Button variant="primary" onClick={handleAddEquipment}>
              Ekle
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Ekipman Düzenle Modalı */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Ekipman Düzenle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEquipment && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Ad</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedEquipment.name}
                    onChange={(e) =>
                      setSelectedEquipment({
                        ...selectedEquipment,
                        name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Fiyat</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedEquipment.price}
                    onChange={(e) =>
                      setSelectedEquipment({
                        ...selectedEquipment,
                        price: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Miktar</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedEquipment.quantity}
                    onChange={(e) =>
                      setSelectedEquipment({
                        ...selectedEquipment,
                        quantity: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Açıklama</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedEquipment.description}
                    onChange={(e) =>
                      setSelectedEquipment({
                        ...selectedEquipment,
                        description: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Kiralanabilir mi?"
                    checked={selectedEquipment.isRentable}
                    onChange={(e) =>
                      setSelectedEquipment({
                        ...selectedEquipment,
                        isRentable: e.target.checked,
                      })
                    }
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              İptal
            </Button>
            <Button variant="primary" onClick={handleUpdateEquipment}>
              Güncelle
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default FacilityCard;
