import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import FieldCard from "../Components/FieldCard";
import {
  getFields,
  updateField,
  createField,
  deleteField,
  uploadFieldPhotos,
} from "../api/FieldsApi";

import { getFacilities } from "../api/FacilityApi";

// Haftanın günlerini sabit tutuyoruz
const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function FieldsPage({ facilityId, setFacilityId }) {
  console.log("FieldsPage rendered with facilityId:", facilityId);
  const [fields, setFields] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteName, setDeleteName] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [daysAvailable, setDaysAvailable] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [formAvailable, setFormAvailable] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [fieldNameToDelete, setFieldNameToDelete] = useState("");
  const [facilities, setFacilities] = useState([]);

  const [weeklyOpenings, setWeeklyOpenings] = useState(
    WEEK_DAYS.map((_, i) => ({
      dayOfWeek: i,
      startTime: "08:00:00",
      endTime: "23:00:00",
    }))
  );

  const [exceptions, setExceptions] = useState([]);

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

  // localStorage'dan id'yi al
  useEffect(() => {
    const idFromStorage = localStorage.getItem("selectedFacilityId");
    console.log("Local'dan gelen id:", idFromStorage);
    if (idFromStorage) setFacilityId(idFromStorage);
  }, []);

  // id geldikten sonra verileri çek
  useEffect(() => {
    if (facilityId) {
      console.log("Veri çekiliyor, id:", facilityId);
      fetchFields();
    }
  }, [facilityId]);

  const fetchFields = async () => {
    try {
      const data = await getFields(facilityId);
      setFields(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fields çekilemedi:", err);
    }
  };
  // Düzenle butonuna tıklayınca
  const handleEditClick = (id) => {
    const fresh = fields.find((f) => f.id === id);
    setSelectedField(fresh);
    setPhotoPreview(
      fresh.photoUrls?.[0]
        ? `https://halisaha.up.railway.app/${fresh.photoUrls[0]}`
        : ""
    );
  setWeeklyOpenings(
  Array.isArray(fresh.weeklyOpenings)
    ? fresh.weeklyOpenings.map((w) => ({
        dayOfWeek: w.dayOfWeek,
        startTime: w.startTime,
        endTime: w.endTime,
      }))
    : WEEK_DAYS.map((_, i) => ({
        dayOfWeek: i,
        startTime: "08:00:00",
        endTime: "23:00:00",
      }))
);


    setExceptions(
      Array.isArray(fresh.exceptions)
        ? fresh.exceptions.map((ex) => ({
            date: ex.date?.slice(0, 10),
            isOpen: ex.isOpen,
          }))
        : []
    );

    const newDaysAvailable = WEEK_DAYS.reduce(
      (acc, day) => ({
        ...acc,
        [day]:
          Array.isArray(fresh.openingDays) && fresh.openingDays.includes(day),
      }),
      {}
    );

    setDaysAvailable(newDaysAvailable);
    setFormAvailable(fresh.isAvailable);
    setIsCreateMode(false);
    setShowModal(true);
  };

  // "+" kartına tıklayınca
  const handleCreateClick = () => {
    setSelectedField({
      facilityId: facilityId, // facilityId burada kullanılıyor
      name: "",
      width: 0,
      height: 0,
      capacity: 0,
      floorType: 0,
      hours: "",
      isIndoor: false,
      hasCamera: false,
      lightingAvailable: false,
      isAvailable: false,
      openingDays: [],
      photos: "",
    });
    // Gün seçimini sıfırla
    setDaysAvailable(
      WEEK_DAYS.reduce((acc, d) => ({ ...acc, [d]: false }), {})
    );
    setFormAvailable(false);
    setPhotoPreview("");
    setPhotoFile(null);
    setIsCreateMode(true);
    setShowModal(true);
  };
  // Modal kapatma
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedField(null);
    setPhotoFile(null);
    setPhotoPreview("");
    setIsCreateMode(false);
  };
  const handleOpenDeleteModal = () => {
    setFieldNameToDelete("");
    setShowDeleteModal(true);
  };
  // Gün toggle
  const toggleDay = (day) => {
    const newDays = { ...daysAvailable, [day]: !daysAvailable[day] };
    setDaysAvailable(newDays);

    // Eğer tüm günler kapatıldıysa isAvailable'ı false yap
    if (Object.values(newDays).every((day) => !day)) {
      setFormAvailable(false);
    }
  };

  const handleAvailabilityChange = (e) => {
    const isChecked = e.target.checked;
    setFormAvailable(isChecked);

    if (isChecked) {
      // Eğer açılıyorsa tüm günleri aç
      setDaysAvailable(
        WEEK_DAYS.reduce((acc, d) => ({ ...acc, [d]: true }), {})
      );
    } else {
      // Eğer kapatılıyorsa tüm günleri kapat
      setDaysAvailable(
        WEEK_DAYS.reduce((acc, d) => ({ ...acc, [d]: false }), {})
      );
    }
  };
  // Saat seçenekleri
  const hourOptions = Array.from(
    { length: 17 },
    (_, i) => `${(8 + i).toString().padStart(2, "0")}:00`
  );
  // Yeni saha oluşturma
  const handleFieldCreate = async (e) => {
    e.preventDefault();

    if (!facilityId) {
      console.error("FacilityId bulunamadı, saha eklenemez!");
      return;
    }

    const form = e.target;
    const data = {
      facilityId: facilityId,
      name: form.name.value,
      pricePerHour: Number(form.price.value),
      capacity: Number(form.capacity.value),
      width: Number(form.width.value),
      height: Number(form.height.value),
      isIndoor: form.indoor.checked,
      hasCamera: form.camera.checked,
      lightingAvailable: form.lighted.checked,
      isAvailable: formAvailable,
      openingDays: WEEK_DAYS.filter((day) => daysAvailable[day]),
      floorType: form.floorType.checked ? 1 : 0,
      weeklyOpenings: weeklyOpenings,
      exceptions: exceptions.map((ex) => ({
        date: new Date(ex.date).toISOString(),
        isOpen: ex.isOpen ?? false,
      })),
    };

    console.log("🔄 Adding fields", data);

    try {
      const newField = await createField(data);

      // Fotoğraf varsa yükle
      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);

        await uploadFieldPhotos(newField.id, formData);
        console.log("✅ Fotoğraf yüklendi.");
      }

      // 🚀 Fields'ı güncelle
      await fetchFields();

      // Modalı kapat
      handleCloseModal();
    } catch (err) {
      console.error(
        "❌ Saha ekleme başarısız:",
        err.response?.data || err.message
      );
    }
  };
  // Var olan saha güncelleme
  const handleFieldUpdate = async (e) => {
    e.preventDefault();
    if (!selectedField) return;
    const form = e.target.elements;
    const updatedData = {
      name: form.name.value,
      pricePerHour: Number(form.price.value),
      capacity: Number(form.capacity.value),
      width: Number(form.width.value),
      height: Number(form.height.value),
      isIndoor: form.indoor.checked,
      hasCamera: form.camera.checked,
      lightingAvailable: form.lighted.checked,
      isAvailable: formAvailable,
      openingDays: WEEK_DAYS.filter((day) => daysAvailable[day]),
      photoUrls: selectedField.photoUrls || [],
      floorType: form.floorType.checked ? 1 : 0,
      weeklyOpenings: weeklyOpenings,
      exceptions: exceptions.map((ex) => ({
        date: new Date(ex.date).toISOString(),
        isOpen: ex.isOpen ?? false,
      })),
    };

    console.log("🔄 Updating field", selectedField.id, updatedData);

    try {
      // 1. Fotoğraf var mı kontrol et
      if (photoFile) {
        const photoFormData = new FormData();
        photoFormData.append("photo", photoFile);

        // uploadFacilityPhotos fonksiyonuyla sadece fotoğrafı yükle
        await uploadFieldPhotos(selectedField.id, photoFormData);
        console.log("✅ Fotoğraf yüklendi.");
      }

      // 2. Diğer alanları update et
      await updateField(selectedField.id, updatedData);
      console.log("✅ Saha bilgileri güncellendi.");

      await fetchFields();
      handleCloseModal();
    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err.message);
    }
  };

  //Saha silme
  const handleFieldDelete = async (e) => {
    e.preventDefault();
    const fieldsToDelete = fields.find(
      (f) => f.name.toLowerCase() === fieldNameToDelete.trim().toLowerCase()
    );
    if (!fieldsToDelete) {
      alert("Bu isimde bir tesis bulunamadı!");
      return;
    }
    try {
      await deleteField(fieldsToDelete.id);
      await fetchFields();
      setShowDeleteModal(false);
    } catch (err) {
      console.error("❌ Silme başarısız:", err.response?.data || err.message);
    }
  };

  return (
    <>
      <Container style={{ padding: 40 }}>
        <h2 className="text-center my-4">Saha Bilgisi</h2>
        <Form.Group className="mb-4" controlId="facilitySelector">
          <Form.Label>Bir Tesis Seçin:</Form.Label>
          <Form.Select
            value={facilityId || ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              setFacilityId(selectedId);
              localStorage.setItem("selectedFacilityId", selectedId);
            }}
          >
            <option value="">Tesis Seçin</option>
            {facilities.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Mevcut Sahaları Listele */}
        {Array.from({ length: Math.ceil(fields.length / 3) }).map((_, ri) => (
          <Row key={ri} className="mb-4 justify-content-center">
            {fields.slice(ri * 3, ri * 3 + 3).map((field) => (
              <Col
                key={field.id}
                md={4}
                className="d-flex justify-content-center"
              >
                <FieldCard
                  field={field}
                  onEdit={() => handleEditClick(field.id)}
                  showEditButton
                />
              </Col>
            ))}
          </Row>
        ))}
      </Container>

      {/* Silme ve Ekleme Butonları */}
      <Row className="mb-4 justify-content-center">
        <div className="text-center mt-5 mb-4">
          <Button
            variant="danger"
            className="me-3"
            onClick={() => setShowDeleteModal(true)}
            type="button"
          >
            Saha Sil
          </Button>
          <Button
            variant="success"
            onClick={handleCreateClick}
            type="button"
            disabled={!facilityId}
          >
            Yeni Saha Ekle
          </Button>
        </div>
      </Row>

      {/* Ekleme / Düzenleme Modalı */}
      {showModal && (
        <Modal show onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isCreateMode
                ? "Yeni Saha Ekle"
                : `Saha Düzenle: ${selectedField.name}`}
            </Modal.Title>
          </Modal.Header>

          <Form onSubmit={isCreateMode ? handleFieldCreate : handleFieldUpdate}>
            <Modal.Body>
              {/* Fotoğraf */}
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

              {/* Adı */}
              <Form.Group controlId="name" className="mt-2">
                <Form.Label>Adı</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  defaultValue={selectedField.name}
                />
              </Form.Group>

              {/* Kapasite */}
              <Form.Group controlId="capacity" className="mt-2">
                <Form.Label>Kapasite</Form.Label>
                <Form.Control
                  name="capacity"
                  type="number"
                  defaultValue={selectedField.capacity}
                />
              </Form.Group>

              {/* Boyut */}
              <Row className="mt-2">
                <Col>
                  <Form.Group controlId="width">
                    <Form.Label>En (m)</Form.Label>
                    <Form.Control
                      name="width"
                      type="number"
                      defaultValue={selectedField.width}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="height">
                    <Form.Label>Boy (m)</Form.Label>
                    <Form.Control
                      name="height"
                      type="number"
                      defaultValue={selectedField.height}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* Fiyat */}
              <Form.Group controlId="price" className="mt-2">
                <Form.Label>Fiyat</Form.Label>
                <Form.Control
                  name="price"
                  type="number"
                  defaultValue={selectedField.pricePerHour}
                />
              </Form.Group>

<h5 className="mt-3">🗓️ Haftalık Açılış Saatleri</h5>

{weeklyOpenings.map((item, index) => (
  <Row key={index} className="mb-2 align-items-center">
    <Col md={3}>
      <Form.Label className="fw-semibold">
        {WEEK_DAYS[item.dayOfWeek]}
      </Form.Label>
    </Col>

    <Col md={3}>
      <Form.Control
        type="time"
        value={item.startTime?.slice(0, 5) || ""}
        onChange={(e) => {
          const updated = [...weeklyOpenings];
          updated[index].startTime = e.target.value + ":00";
          setWeeklyOpenings(updated);
        }}
      />
    </Col>

    <Col md={3}>
      <Form.Control
        type="time"
        value={item.endTime?.slice(0, 5) || ""}
        onChange={(e) => {
          const updated = [...weeklyOpenings];
          updated[index].endTime = e.target.value + ":00";
          setWeeklyOpenings(updated);
        }}
      />
    </Col>

    <Col md={3}>
      <Button
        variant="danger"
        onClick={() => {
          const updated = weeklyOpenings.filter((_, i) => i !== index);
          setWeeklyOpenings(updated);
        }}
        disabled={weeklyOpenings.length <= 1}
      >
        Sil
      </Button>
    </Col>
  </Row>
))}

<Button
  variant="secondary"
  className="mt-2"
  onClick={() => {
    const usedDays = weeklyOpenings.map((x) => x.dayOfWeek);
    const nextDay = WEEK_DAYS.findIndex((_, i) => !usedDays.includes(i));
    if (nextDay !== -1) {
      setWeeklyOpenings([
        ...weeklyOpenings,
        {
          dayOfWeek: nextDay,
          startTime: "08:00:00",
          endTime: "23:00:00",
        },
      ]);
    }
  }}
  disabled={weeklyOpenings.length >= 7}
>
  + Gün Ekle
</Button>


              <h5 className="mt-4">📌 Kapalı Günler</h5>
              {exceptions.map((ex, i) => (
                <Row key={i} className="mb-2">
                  <Col md={8}>
                    <Form.Control
                      type="date"
                      value={ex.date}
                      onChange={(e) => {
                        const updated = [...exceptions];
                        updated[i].date = e.target.value;
                        setExceptions(updated);
                      }}
                    />
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="danger"
                      onClick={() => {
                        const filtered = exceptions.filter((_, j) => j !== i);
                        setExceptions(filtered);
                      }}
                    >
                      Kaldır
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button
                variant="secondary"
                className="mt-2"
                onClick={() =>
                  setExceptions([...exceptions, { date: "", isOpen: false }])
                }
              >
                + Kapalı Gün Ekle
              </Button>

              {/* Checkbox’lar */}
              <Form.Group as={Row} controlId="indoor" className="mt-3">
                <Form.Label column sm={3}>
                  Kapalı Alan
                </Form.Label>
                <Col sm={9}>
                  <Form.Check
                    name="indoor"
                    type="checkbox"
                    defaultChecked={selectedField.isIndoor}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="camera" className="mt-2">
                <Form.Label column sm={3}>
                  Kamera
                </Form.Label>
                <Col sm={9}>
                  <Form.Check
                    name="camera"
                    type="checkbox"
                    defaultChecked={selectedField.hasCamera}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="floorType" className="mt-2">
                <Form.Label column sm={3}>
                  Çim Tipi
                </Form.Label>
                <Col sm={9}>
                  <Form.Check
                    name="floorType"
                    type="checkbox"
                    defaultChecked={selectedField.floorType}
                  />
                </Col>
              </Form.Group>
              <Form.Group controlId="lighted" className="mt-2">
                <Form.Check
                  name="lighted"
                  type="checkbox"
                  label="Aydınlatmalı"
                  defaultChecked={selectedField.lightingAvailable}
                />
              </Form.Group>

              {/* Mevcut ve Günler */}
              <Form.Group controlId="available" className="mt-2">
                <Form.Check
                  type="checkbox"
                  label="Mevcut"
                  checked={formAvailable}
                  onChange={handleAvailabilityChange}
                />
              </Form.Group>

              {formAvailable && (
                <div className="mt-3">
                  <Form.Label>Çalışma Günleri</Form.Label>
                  <div>
                    {WEEK_DAYS.map((day) => (
                      <Form.Check
                        inline
                        key={day}
                        id={`day_${day}`}
                        label={day}
                        type="checkbox"
                        checked={daysAvailable[day]}
                        onChange={() => toggleDay(day)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Kapat
              </Button>
              <Button variant="primary" type="submit">
                {isCreateMode ? "Oluştur" : "Kaydet"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}

      {/* Saha Silme Modalı */}
      {showDeleteModal && (
        <Modal show onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Saha Sil</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleFieldDelete}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="fieldNameToDelete">
                <Form.Label>Silmek istediğiniz sahayı seçin:</Form.Label>
                <Form.Select
                  value={fieldNameToDelete}
                  onChange={(e) => setFieldNameToDelete(e.target.value)}
                >
                  <option value="">Bir saha seçin</option>
                  {fields.map((f) => (
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
                disabled={!fieldNameToDelete}
              >
                Sil
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
}

export default FieldsPage;
