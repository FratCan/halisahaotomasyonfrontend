import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Card,
  InputGroup,
} from "react-bootstrap";
import FieldCard from "../Components/FieldCard";
import {
  getFields,
  updateField,
  createField,
  deleteField,
  uploadFieldPhotos,
} from "../api/FieldsApi";
import FacilitySelect from "../Components/FacilitySelect";
import { getFacilities } from "../api/FacilityApi";
import { getReservations } from "../api/ReservationApi";
import { hasWeeklyConflict } from "../utils/hasweeklycontrol"; // Haftalık çatışma kontrolü için fonksiyon
// Haftanın günlerini sabit tutuyoruz


const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
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
  const [exceptions, setExceptions] = useState([]);
  const [weeklyOpenings, setWeeklyOpenings] = useState([]);
  const dedupeWeekly = (arr) =>
    arr.filter(
      (v, i, a) => a.findIndex((t) => t.dayOfWeek === v.dayOfWeek) === i
    );

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
    const storedFacilityId = localStorage.getItem("selectedFacilityId");

    if (storedFacilityId) {
      const fetchAndCheckFacility = async () => {
        const facilities = await getFacilities(ownerId);
        setFacilities(facilities);

        const isOwned = facilities?.some(
          (f) => f.id === Number(storedFacilityId)
        );

        if (!isOwned) {
          console.log("Başka kullanıcıya ait tesis, sıfırlanıyor...");
          localStorage.removeItem("selectedFacilityId");
          setFacilityId(""); // veya null
        } else {
          setFacilityId(storedFacilityId);
        }
      };

      fetchAndCheckFacility();
    }
  }, [ownerId]);

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
  useEffect(() => {
    console.log("WeeklyOpenings mount:", weeklyOpenings);
  }, [weeklyOpenings]);

  // Düzenle butonuna tıklayınca
  const handleEditClick = (id) => {
    const fresh = fields.find((f) => f.id === id);
    setSelectedField(fresh);

    setPhotoPreview(
      fresh.photoUrls?.[0]
        ? `https://halisaha.up.railway.app/${fresh.photoUrls[0]}`
        : ""
    );

    /*──── weeklyOpenings: string → index dönüşümü ────*/
    setWeeklyOpenings(
      dedupeWeekly(
        Array.isArray(fresh.weeklyOpenings)
          ? fresh.weeklyOpenings
              .map((w) => {
                const idx =
                  typeof w.dayOfWeek === "number"
                    ? w.dayOfWeek // zaten 0-6
                    : WEEK_DAYS.findIndex(
                        (d) =>
                          d.toLowerCase() === String(w.dayOfWeek).toLowerCase() // "Monday" → 1
                      );
                return idx === -1
                  ? null // eşleşmezse at
                  : { ...w, dayOfWeek: idx };
              })
              .filter(Boolean) // null’ları sil
          : WEEK_DAYS.map((_, i) => ({
              dayOfWeek: i,
              startTime: "08:00:00",
              endTime: "23:00:00",
            }))
      )
    );

    /*──── exceptions & diğer state’ler ────*/
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
    console.log("handleCreateClick: weeklyOpenings öncesi:", weeklyOpenings);

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
      photos: "",
    });
    // Gün seçimini sıfırla
    setDaysAvailable(
      WEEK_DAYS.reduce((acc, d) => ({ ...acc, [d]: false }), {})
    );
    setWeeklyOpenings(
      dedupeWeekly(
        WEEK_DAYS.map((_, i) => ({
          dayOfWeek: i,
          startTime: "08:00:00",
          endTime: "23:00:00", //kapanma saati
        }))
      )
    );
    console.log("handleCreateClick: weeklyOpenings sonrası:", weeklyOpenings);
    setFormAvailable(false);
    setPhotoPreview("");
    setPhotoFile(null);
    setIsCreateMode(true);
    setShowModal(true);
  };
const handleAddException = async () => {
  const newDate = prompt("Kapatmak istediğiniz tarihi (yyyy-mm-dd) girin:");
  if (!newDate) return;

  const selectedDate = new Date(newDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Sadece gün karşılaştırması için

  if (selectedDate < today) {
    alert("❌ Geçmiş tarihler kapalı gün olarak eklenemez.");
    return;
  }

  try {
    let hasReservation = false;

    for (const field of fields) {
      const resList = await getReservations(field.id);
      const exists = resList.some(
        (r) => r.slotStart?.slice(0, 10) === newDate
      );

      if (exists) {
        hasReservation = true;
        break;
      }
    }

    if (hasReservation) {
      alert("❌ Bu tarihte mevcut rezervasyon olduğu için kapatılamaz.");
      return;
    }

    if (!exceptions.find((ex) => ex.date === newDate)) {
      setExceptions([...exceptions, { date: newDate, isOpen: false }]);
    } else {
      alert("⚠️ Bu tarih zaten eklenmiş.");
    }
  } catch (err) {
    console.error("Rezervasyon kontrolü sırasında hata:", err);
  }
};


  // Modal kapatma
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedField(null);
    setPhotoFile(null);
    setPhotoPreview("");
    setIsCreateMode(false);
    setWeeklyOpenings([]); // <-- EKLE!
    setExceptions([]);
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
      floorType: form.floorType.checked ? 1 : 0,
      hasTribune: form.tribune.checked,
      hasScoreBoard: form.scoreBoard.checked,
      weeklyOpenings: dedupeWeekly(weeklyOpenings),
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

      /* 1️⃣  ÖNCE rezervasyonları al */
  let reservations = [];
  try {
    reservations = await getReservations(selectedField.id);   // {slotStart, slotEnd}
  } catch (err) {
    console.error("Rezervasyonlar getirilemedi:", err);
  }

  /* 2️⃣  Yeni saatlerin rezervasyonla çakışmadığını doğrula */
  if (hasWeeklyConflict(dedupeWeekly(weeklyOpenings), reservations)) {
    alert(
      "❌ Seçtiğiniz haftalık açılış saati aralıkları mevcut rezervasyonları kapsamıyor!"
    );
    return; // kaydetme
  }
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
      hasTribune: form.tribune.checked,
      hasScoreBoard: form.scoreBoard.checked,
      weeklyOpenings: dedupeWeekly(weeklyOpenings),
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
        <FacilitySelect
          ownerId={ownerId}
          facilityId={facilityId}
          onChange={setFacilityId}
        />
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
        <Modal show onHide={handleCloseModal} dialogClassName="modal-xl">
          <Modal.Header closeButton>
            <Modal.Title>
              {isCreateMode
                ? "Yeni Saha Ekle"
                : `Saha Düzenle: ${selectedField.name}`}
            </Modal.Title>
          </Modal.Header>

          <Form onSubmit={isCreateMode ? handleFieldCreate : handleFieldUpdate}>
            <Modal.Body>
              <Row>
                <Col>
                  {" "}
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
                      required
                    />
                  </Form.Group>
                  {/* Kapasite */}
                  <Form.Group controlId="capacity" className="mt-2">
                    <Form.Label>Kapasite</Form.Label>
                    <Form.Control
                      name="capacity"
                      type="number"
                      defaultValue={selectedField.capacity || 10}
                      required
                      min="10"
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
                    <InputGroup>
                      <Form.Control
                        name="price"
                        type="number"
                        defaultValue={selectedField.pricePerHour}
                        required
                        min="0"
                      />
                      <InputGroup.Text>TL</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  {" "}
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
                            const updated = weeklyOpenings.filter(
                              (w) => w.dayOfWeek !== item.dayOfWeek // 🔥 sadece bu günü sil
                            );
                            setWeeklyOpenings(updated);
                          }}
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
                      const used = weeklyOpenings.map((w) => w.dayOfWeek);
                      const next = WEEK_DAYS.findIndex(
                        (_, i) => !used.includes(i)
                      );
                      if (next !== -1) {
                        setWeeklyOpenings(
                          dedupeWeekly([
                            ...weeklyOpenings,
                            {
                              dayOfWeek: next,
                              startTime: "08:00:00",
                              endTime: "23:00:00",
                            },
                          ])
                        );
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
                            const filtered = exceptions.filter(
                              (_, j) => j !== i
                            );
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
                    onClick={handleAddException}
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
                  <Form.Group as={Row} controlId="lighted" className="mt-2">
                    <Form.Label column sm={3}>
                      Aydınlatmalı
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Check
                        name="lighted"
                        type="checkbox"
                        defaultChecked={selectedField.lightingAvailable}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="scoreBoard" className="mt-2">
                    <Form.Label column sm={3}>
                      Skor Tabelası
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Check
                        name="scoreBoard"
                        type="checkbox"
                        defaultChecked={selectedField.hasScoreBoard}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="tribune" className="mt-2">
                    <Form.Label column sm={3}>
                      Türübün
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Check
                        name="tribune"
                        type="checkbox"
                        defaultChecked={selectedField.hasTribune}
                      />
                    </Col>
                  </Form.Group>
                  {/* Mevcut ve Günler */}
                  <Form.Group as={Row} controlId="available" className="mt-2">
                    <Form.Label column sm={3}>
                      Mevcut
                    </Form.Label>

                    <Col sm={9}>
                      <Form.Check
                        name="available"
                        type="checkbox"
                        checked={formAvailable}
                        onChange={(e) => {
                          const isOn = e.target.checked;
                          setFormAvailable(isOn);
                          if (isOn) {
                            // Mevcut açılınca tüm günleri true yap
                            setDaysAvailable(
                              WEEK_DAYS.reduce(
                                (acc, d) => ({ ...acc, [d]: true }),
                                {}
                              )
                            );
                          }
                        }}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
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
