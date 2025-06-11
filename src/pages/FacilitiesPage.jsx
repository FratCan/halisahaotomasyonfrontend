import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Form, Button } from "react-bootstrap";
import {
  getFacilities,
  updateFacility,
  deleteFacility,
  createFacility,
  uploadFacilityPhotos,
} from "../api/FacilityApi";
import FacilityCard from "../Components/FacilityCard";
import FieldCard from "../Components/FieldCard";

function FacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  //  const [deleteName, setDeleteName] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [facilityNameToDelete, setFacilityNameToDelete] = useState("");
  const [showFieldsModal, setShowFieldsModal] = useState(false);
  const [fieldsFacility, setFieldsFacility] = useState(null); // { name, fields[] }
  // FacilitiesPage fonksiyonunun başında, diğer useState’lerin yanında:
const [showFieldEditor, setShowFieldEditor] = useState(false);
const [editingField, setEditingField] = useState(null);


  // Tıklandığında modalı aç
  const handleViewFields = (facility) => {
    setFieldsFacility(facility); // hem adı hem fields dizisi geliyor
    setShowFieldsModal(true);
  };

  // OwnerId'yi localStorage'dan al
  const ownerId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    if (ownerId) {
      fetchFacilities(ownerId);
    }
  }, [ownerId]);

  const fetchFacilities = async (ownerId) => {
    try {
      // Belirli bir id'ye ait tesisi çekmek için id parametresi gönderin
      const data = await getFacilities(ownerId);
      console.log(data);
      setFacilities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Facility çekilemedi:", err);
    }
  };

  const handleEditClick = (id) => {
    const fresh = facilities.find((f) => f.id === id);
    setSelectedFacility(fresh);
    setPhotoPreview(
      fresh.photoUrls?.[0]
        ? `https://halisaha.up.railway.app/${fresh.photoUrls[0]}`
        : ""
    );

    setIsCreating(false);
    setShowModal(true);
  };

  const handleCreateClick = () => {
    setSelectedFacility(null);
    setIsCreating(true);
    setPhotoPreview("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFacility(null);
    setPhotoFile(null);
    setPhotoPreview("");
    setIsCreating(false);
  };
  const handleFieldEditClick = (field) => {
    setEditingField(field);
    setShowFieldEditor(true);
  };

  const handleFacilitySubmit = async (e) => {
    e.preventDefault();
    const elems = e.target.elements;

    const facilityData = {
      ownerId, // localStorage'dan gelen ownerId'yi burada kullan!
      name: elems.name.value,
      email: elems.email.value,
      location: elems.location.value,
      addressDetails: elems.addressDetails.value,
      phone: elems.phone.value,
      bankAccountInfo: elems.bankAccountInfo.value,
      city: elems.city.value,
      town: elems.town.value,
      description: elems.description.value,
      hasCafeteria: elems.hasCafeteria.checked,
      hasShower: elems.hasShower.checked,
      hasToilet: elems.hasToilet.checked,
      hasSecurityCameras: elems.hasSecurityCameras,
      hasTransportService: elems.hasTransportService,
      hasParking: elems.hasParking,
      equipments: [],
    };

    console.log("🔄 Adding facility", facilityData);

    try {
      // 1. Önce yeni tesisi oluştur
      const newFacility = await createFacility(facilityData);

      // 🌟 facilityId'yi localStorage'a kaydet
      localStorage.setItem("selectedFacilityId", newFacility.id);
      console.log(
        "📦 selectedFacilityId localStorage'a kaydedildi:",
        newFacility.id
      );
      // 2. Eğer fotoğraf seçildiyse fotoğrafı ayrıca yükle
      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);

        await uploadFacilityPhotos(newFacility.id, formData);
        console.log("✅ Fotoğraf yüklendi.");
      }

      // 3. Güncel listeyi çek
      await fetchFacilities();

      // 4. Modalı kapat
      handleCloseModal();
    } catch (err) {
      console.error(
        "❌ Tesis ekleme başarısız:",
        err.response?.data || err.message
      );
    }
  };

  const handleFacilityUpdate = async (e) => {
    e.preventDefault();
    if (!selectedFacility) return;

    const elems = e.target.elements;

    const updatedData = {
      name: elems.name.value,
      email: elems.email.value,
      location: elems.location.value,
      addressDetails: elems.addressDetails.value,
      phone: elems.phone.value,
      bankAccountInfo: elems.bankAccountInfo.value,
      city: elems.city.value,
      town: elems.town.value,
      description: elems.description.value,
      hasCafeteria: elems.hasCafeteria.checked,
      hasShower: elems.hasShower.checked,
      hasToilet: elems.hasToilet.checked,
      hasSecurityCameras: elems.hasSecurityCameras.checked,
      hasTransportService: elems.hasTransportService.checked,
      hasParking: elems.hasParking.checked,
      fields: [],
      equipments: [],
      photoUrls: selectedFacility.photoUrls || [],
    };

    console.log("🔄 Updating facility", selectedFacility.id, updatedData);

    try {
      // Fotoğraf varsa yükle
      if (photoFile) {
        const photoFormData = new FormData();
        photoFormData.append("photo", photoFile);
        await uploadFacilityPhotos(selectedFacility.id, photoFormData);
        console.log("✅ Fotoğraf yüklendi.");
      }

      // Diğer alanları update et
      await updateFacility(selectedFacility.id, updatedData);
      console.log("✅ Tesis bilgileri güncellendi.");

      // 🔥🔥 Güncel verileri yeniden çek
      await fetchFacilities(ownerId);

      handleCloseModal();
    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err.message);
    }
  };

  const handleOpenDeleteModal = () => {
    setFacilityNameToDelete("");
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    const facilityToDelete = facilities.find(
      (f) => f.name.toLowerCase() === facilityNameToDelete.trim().toLowerCase()
    );
    if (!facilityToDelete) {
      alert("Bu isimde bir tesis bulunamadı!");
      return;
    }
    try {
      await deleteFacility(facilityToDelete.id);

      // 🔥 ownerId parametresini geçirerek fetch yap
      await fetchFacilities(ownerId);

      setShowDeleteModal(false);
    } catch (err) {
      console.error("❌ Silme başarısız:", err.response?.data || err.message);
    }
  };

  console.log("Facilities verisi:", facilities);

  return (
    <>
      <h2 className="text-center my-4">Tesis Bilgisi</h2>

      <Row xs={1} className="justify-content-center text-center  g-0 px-5">
        {facilities.map((f) => (
          <FacilityCard
            facility={f}
            onEdit={() => handleEditClick(f.id)}
            onViewFields={handleViewFields}
          ></FacilityCard>
        ))}
      </Row>

      <div className="text-center mt-5 mb-4">
        <Button
          variant="danger"
          className="me-3"
          onClick={handleOpenDeleteModal}
        >
          Tesis Sil
        </Button>
        <Button variant="success" onClick={handleCreateClick}>
          Yeni Tesis Ekle
        </Button>
      </div>

      {/* Tesis Ekleme/Düzenleme Modal */}
      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              {isCreating
                ? "Yeni Tesis Ekle"
                : `Tesis Düzenle: ${selectedFacility?.name}`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              onSubmit={
                isCreating ? handleFacilitySubmit : handleFacilityUpdate
              }
            >
              <Row className="">
                <Col>
                  <Form.Group controlId="photos" className="mb-3">
                    <Form.Label>Fotoğraf</Form.Label>
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Saha"
                        style={{
                          width: "100%",
                          maxHeight: "300px",
                          objectFit: "cover",
                        }}
                        className="mb-3"
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
                </Col>
                <Col>
                  <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Adı</Form.Label>
                    <Form.Control
                      name="name"
                      type="text"
                      defaultValue={selectedFacility?.name || ""}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="email" className="mb-3">
                    <Form.Label>E-Mail</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      defaultValue={selectedFacility?.email || ""}
                    />
                  </Form.Group>

                  <Form.Group controlId="location" className="mb-3">
                    <Form.Label>Konum</Form.Label>
                    <Form.Control
                      name="location"
                      type="text"
                      defaultValue={selectedFacility?.location || ""}
                    />
                  </Form.Group>

                  <Form.Group controlId="addressDetails" className="mb-3">
                    <Form.Label>Adres Detay</Form.Label>
                    <Form.Control
                      name="addressDetails"
                      type="text"
                      defaultValue={selectedFacility?.addressDetails || ""}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="phone" className="mb-3">
                    <Form.Label>Telefon</Form.Label>
                    <Form.Control
                      name="phone"
                      type="text"
                      defaultValue={selectedFacility?.phone || ""}
                    />
                  </Form.Group>

                  <Form.Group controlId="bankAccountInfo" className="mb-3">
                    <Form.Label>Banka Hesap Bilgisi</Form.Label>
                    <Form.Control
                      name="bankAccountInfo"
                      type="text"
                      defaultValue={selectedFacility?.bankAccountInfo || ""}
                    />
                  </Form.Group>

                  <Form.Group controlId="city" className="mb-3">
                    <Form.Label>Şehir</Form.Label>
                    <Form.Control
                      name="city"
                      type="text"
                      defaultValue={selectedFacility?.city || ""}
                    />
                  </Form.Group>

                  <Form.Group controlId="town" className="mb-3">
                    <Form.Label>İlçe</Form.Label>
                    <Form.Control
                      name="town"
                      type="text"
                      defaultValue={selectedFacility?.town || ""}
                    />
                  </Form.Group>

                  <Form.Group controlId="description" className="mb-3">
                    <Form.Label>Açıklama</Form.Label>
                    <Form.Control
                      name="description"
                      type="text"
                      defaultValue={selectedFacility?.description || ""}
                    />
                  </Form.Group>

                  {/* Checkboxlar */}
                  <Row>
                    <Col>
                      <Form.Group controlId="hasCafeteria" className="mb-2">
                        <Form.Check
                          name="hasCafeteria"
                          type="checkbox"
                          label="Kafeterya"
                          defaultChecked={
                            selectedFacility?.hasCafeteria || false
                          }
                        />
                      </Form.Group>

                      <Form.Group controlId="hasShower" className="mb-2">
                        <Form.Check
                          name="hasShower"
                          type="checkbox"
                          label="Duş"
                          defaultChecked={selectedFacility?.hasShower || false}
                        />
                      </Form.Group>

                      <Form.Group controlId="hasToilet" className="mb-2">
                        <Form.Check
                          name="hasToilet"
                          type="checkbox"
                          label="Tuvalet"
                          defaultChecked={selectedFacility?.hasToilet || false}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group
                        controlId="hasSecurityCameras"
                        className="mb-2"
                      >
                        <Form.Check
                          name="hasSecurityCameras"
                          type="checkbox"
                          label="Kamera"
                          defaultChecked={
                            selectedFacility?.hasSecurityCameras || false
                          }
                        />
                      </Form.Group>

                      <Form.Group
                        controlId="hasTransportService"
                        className="mb-2"
                      >
                        <Form.Check
                          name="hasTransportService"
                          type="checkbox"
                          label="Ulaşım Hizmeti"
                          defaultChecked={
                            selectedFacility?.hasTransportService || false
                          }
                        />
                      </Form.Group>

                      <Form.Group controlId="hasParking" className="mb-2">
                        <Form.Check
                          name="hasParking"
                          type="checkbox"
                          label="Park Alanı"
                          defaultChecked={selectedFacility?.hasParking || false}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <div className="text-center mt-4">
                <Button variant="primary" type="submit">
                  {isCreating ? "Kaydet" : "Güncelle"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {/* Tesis Silme Modal */}
      {showDeleteModal && (
        <Modal show onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Tesis Sil</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleConfirmDelete}>
            <Modal.Body>
              {/* Buraya Select dropdown'u ekliyoruz */}
              <Form.Group className="mb-3" controlId="fieldNameToDelete">
                <Form.Label>Silmek istediğiniz tesisi seçin:</Form.Label>
                <Form.Select
                  value={facilityNameToDelete}
                  onChange={(e) => setFacilityNameToDelete(e.target.value)}
                >
                  <option value="">Bir tesis seçin</option>
                  {facilities.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {deleteError && <p className="text-danger">{deleteError}</p>}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                İptal
              </Button>
              <Button
                variant="danger"
                type="submit"
                disabled={!facilityNameToDelete}
              >
                Sil
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}

      {showFieldsModal && (
        <Modal show onHide={() => setShowFieldsModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>{fieldsFacility?.name} - Saha Listesi</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {fieldsFacility?.fields?.length ? (
              <Row xs={1} sm={2} md={3} className="g-3">
                {fieldsFacility.fields.map((field) => (
                  <Col key={field.id}>
                    <FieldCard
                      field={field}
                      onEdit={() => handleFieldEditClick(field)}
                      showEditButton={true}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <p>Bu tesise ait saha tanımı bulunamadı.</p>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowFieldsModal(false)}
            >
              Kapat
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default FacilitiesPage;
