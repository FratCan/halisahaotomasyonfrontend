import { Card, Button, Row, Col, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncementById,
  updateAnnouncement,
  uploadAnnouncementPhotos,
} from "../api/Announcement";
import {
  getEquipments,
  deleteEquipment,
  createEquipments,
  updateEquipment,
} from "../api/EquipmentsApi";

const FacilityCard = ({ facility, onEdit, facilityId, onViewFields }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedText, setEditedText] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editedEndDate, setEditedEndDate] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [showAllAnnouncementsModal, setShowAllAnnouncementsModal] =
    useState(false);
  const [showAddAnnouncementModal, setShowAddAnnouncementModal] =
    useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    quantity: "",
    description: "",
    isRentable: false,
  });

  const fetchAnnouncements = async () => {
    if (!facility?.id) return;
    try {
      const data = await getAnnouncements(facility.id);
      console.log("getAnnouncements gelen veri:", data);
      setAnnouncements(data);
    } catch (err) {
      console.error("Duyurular alınamadı:", err);
    }
  };

  const handleCreateClick = () => {
    setShowAddAnnouncementModal(true);
    setEditingIndex(null);
    setNewAnnouncement({
      title: "",
      content: "",
      quantity: "",
      description: "",
      isRentable: false,
    });
    setImage(null);
    setImagePreview(null);
    setEndDate("");
  };
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
  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      await deleteAnnouncementById(announcementId);
      setAnnouncements((prev) => prev.filter((a) => a.id !== announcementId));
    } catch (err) {
      console.error("Duyuru silinemedi:", err);
    }
  };

  const handleSubmit = async () => {
    if (!facility?.id) {
      setError("Tesis ID'si bulunamadı!");
      return;
    }

    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      setError("Lütfen hem başlık hem de içerik girin.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newAnnouncement.title);
    formData.append("content", newAnnouncement.content);
    formData.append("endTime", endDate || "");

    try {
      // 1. Ana duyuruyu kaydet
      const response = await createAnnouncement(facility.id, formData);
      const created = response.data || response;

      // 2. Görsel varsa ayrı yükle
      if (created?.id && image) {
        await uploadAnnouncementPhotos(created.id, [image]);
      }

      // 3. Listeye ekle ve formu sıfırla
      setAnnouncements((prev) => [created, ...prev]);
      setShowAddAnnouncementModal(false);
      setNewAnnouncement({
        facilityId: facilityId,
        title: "",
        content: "",
        quantity: "",
        description: "",
        isRentable: false,
      });
      setEndDate("");
      setImage(null);
      setImagePreview(null);
      setError("");
    } catch (err) {
      console.error("Duyuru gönderilemedi:", err);
      setError(`Duyuru gönderilemedi: ${err.message}`);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Önizleme oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const toggleCard = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const deleteAnnouncement = (idx) => {
    setAnnouncements(announcements.filter((_, i) => i !== idx));
    if (openIndex === idx) setOpenIndex(null);
  };

  const editAnnouncement = (idx) => {
    const ann = announcements[idx];
    setEditingIndex(idx);
    setEditedTitle(ann.title || "");
    setEditedText(ann.content || "");
    setEditedEndDate(ann.endTime ?? "");
    setImagePreview(ann.bannerUrl ?? "");
  };

  const saveEditedAnnouncement = async () => {
    const editedAnnouncement = announcements[editingIndex];
    if (!editedAnnouncement?.id) {
      console.error("Güncellenecek duyuru bulunamadı.");
      return;
    }

    const jsonBody = {
      title: editedTitle,
      content: editedText,
      endTime: editedEndDate || null,
    };

    try {
      const updated = await updateAnnouncement(editedAnnouncement.id, jsonBody);

      // Görsel varsa ayrıca yükle
      if (image) {
        await uploadAnnouncementPhotos(editedAnnouncement.id, [image]);
      }

      // local state'i güncelle
      const newAnnouncements = announcements.map((ann, i) =>
        i === editingIndex ? { ...updated, bannerUrl: imagePreview } : ann
      );
      setAnnouncements(newAnnouncements);

      // form ve state sıfırla
      setEditingIndex(null);
      setEditedTitle("");
      setEditedText("");
      setEditedEndDate("");
      setImage(null);
      setImagePreview(null);
      setNewAnnouncement({
        title: "",
        content: "",
        quantity: "",
        description: "",
        isRentable: false,
      });
      setShowAddAnnouncementModal(false);
    } catch (error) {
      console.error("Güncelleme sırasında hata:", error);
    }
  };

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
                <span
                  style={{
                    color: facility.hasSecurityCameras ? "green" : "red",
                  }}
                >
                  {facility.hasSecurityCameras ? "Evet" : "Hayır"}
                </span>
              </div>
              <div style={{ display: "flex" }}>
                <strong style={{ width: "140px" }}>Ulaşım:</strong>
                <span
                  style={{
                    color: facility.hasTransportService ? "green" : "red",
                  }}
                >
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
            <div
              className="d-grid gap-2 mt-4"
              style={{ gridTemplateColumns: "repeat(2, 1fr)", display: "grid" }}
            >
              <Button variant="primary" onClick={() => onEdit(facility)}>
                Düzenle
              </Button>

              <Button variant="info" onClick={() => onViewFields(facility)}>
                Sahaları Görüntüle
              </Button>

              <Button variant="success" onClick={handleCreateClick}>
                Duyuru Ekle
              </Button>

              <Button
                variant="warning"
                onClick={() => {
                  fetchAnnouncements();
                  setShowAllAnnouncementsModal(true);
                }}
              >
                Duyuruları Görüntüle
              </Button>
            </div>
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

        <Modal
          show={showAllAnnouncementsModal}
          onHide={() => setShowAllAnnouncementsModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Tüm Duyurular</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
            {announcements.length === 0 && <p>Henüz duyuru yok.</p>}
            {announcements.filter(Boolean).map((ann, idx) => (
              <Card key={ann.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Card.Title>{ann.title ?? "Başlık yok"}</Card.Title>
                      <Card.Text>{ann.content ?? "İçerik yok"}</Card.Text>

                      {ann.bannerUrl && (
                        <div style={{ marginBottom: 10 }}>
                          <img
                            src={`https://halisaha.up.railway.app/${ann.bannerUrl}`}
                            alt="Duyuru"
                            style={{
                              maxWidth: "200px",
                              maxHeight: "150px",
                              borderRadius: "8px",
                            }}
                          />
                        </div>
                      )}

                      {ann.endTime && (
                        <small className="text-muted">
                          Bitiş: {new Date(ann.endTime).toLocaleDateString()}
                        </small>
                      )}
                    </div>

                    <div className="d-flex gap-2">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => {
                          editAnnouncement(idx); // sadece bu satır yeterli
                          setShowAddAnnouncementModal(true);
                          setShowAllAnnouncementsModal(false);
                        }}
                      >
                        Düzenle
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                      >
                        Sil
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Modal.Body>
        </Modal>

        {/* Duyurular Ekle Modalı */}
        <Modal
          show={showAddAnnouncementModal}
          onHide={() => setShowAddAnnouncementModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Duyuru Ekle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Duyuru Başlığı</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    editingIndex !== null ? editedTitle : newAnnouncement.title
                  }
                  onChange={(e) =>
                    editingIndex !== null
                      ? setEditedTitle(e.target.value)
                      : setNewAnnouncement({
                          ...newAnnouncement,
                          title: e.target.value,
                        })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Duyuru İçeriği</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={
                    editingIndex !== null ? editedText : newAnnouncement.content
                  }
                  onChange={(e) =>
                    editingIndex !== null
                      ? setEditedText(e.target.value)
                      : setNewAnnouncement({
                          ...newAnnouncement,
                          content: e.target.value,
                        })
                  }
                />
              </Form.Group>

              <Form.Group controlId="announcementImage" className="mb-3">
                <Form.Label>Fotoğraf Ekle (isteğe bağlı)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Group>

              <Form.Group controlId="announcementEndDate" className="mb-3">
                <Form.Label>Bitiş Tarihi</Form.Label>
                <Form.Control
                  type="date"
                  value={
                    editingIndex !== null
                      ? editedEndDate?.slice(0, 10)
                      : endDate
                  }
                  onChange={(e) =>
                    editingIndex !== null
                      ? setEditedEndDate(e.target.value)
                      : setEndDate(e.target.value)
                  }
                />
              </Form.Group>

              {imagePreview && (
                <div className="mb-3">
                  <img
                    src={imagePreview}
                    alt="Önizleme"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={
                editingIndex !== null ? saveEditedAnnouncement : handleSubmit
              }
            >
              {editingIndex !== null ? "Kaydet" : "Oluştur"}
            </Button>
          </Modal.Footer>
        </Modal>

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
