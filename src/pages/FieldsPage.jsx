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

    function FieldsPage() {
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

    // Sayfa yüklendiğinde verileri çek
    useEffect(() => {
        fetchFields();
    }, []);

    const fetchFields = async () => {
        try {
        const data = await getFields();
        setFields(data);
        } catch (err) {
        console.error("Fields çekilemedi:", err);
        }
    };

    // Düzenle butonuna tıklayınca
    const handleEditClick = (id) => {
        const fresh = fields.find((f) => f.id === id);
        setSelectedField(fresh);
        setPhotoPreview(
        fresh.photoUrls?.[0] ? `http://localhost:5021/${fresh.photoUrls[0]}` : ""
        );

        const newDaysAvailable = WEEK_DAYS.reduce(
            (acc, day) => ({
              ...acc,
              [day]: fresh.openingDays.includes(day),
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
        // Yeni, boş bir saha objesi
        setSelectedField({
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
        setDaysAvailable((prev) => ({ ...prev, [day]: !prev[day] }));
    };

    // Saat seçenekleri
    const hourOptions = Array.from(
        { length: 17 },
        (_, i) => `${(8 + i).toString().padStart(2, "0")}:00`
    );
    // Yeni saha oluşturma
    const handleFieldCreate = async (e) => {
        e.preventDefault();

        const form = e.target;
        const data = {
        facilityId: 1,
        name: form.name.value,
        startTime: `${form.StartTime.value}`,
        endTime: `${form.EndTime.value}`,
        pricePerHour: Number(form.price.value),
        capacity: Number(form.capacity.value),
        width: Number(form.width.value),
        height: Number(form.height.value),
        isIndoor: form.indoor.checked,
        hasCamera: form.camera.checked,
        lightingAvailable: form.lighted.checked,
        isAvailable: formAvailable,
        openingDays: WEEK_DAYS.filter((day) => daysAvailable[day]),
        photos: photoFile ? photoFile.name : "",
        floorType: form.floorType.checked ? 1 : 0,
        };

        console.log("🔄 Adding fields", data);

        try {
        // 1. Önce yeni tesisi oluştur
        const newField = await createField(data);

        // 2. Eğer fotoğraf seçildiyse fotoğrafı ayrıca yükle
        if (photoFile) {
            const formData = new FormData();
            formData.append("photo", photoFile);

            await uploadFieldPhotos(newField.id, formData);
            console.log("✅ Fotoğraf yüklendi.");
        }

        // 3. Güncel listeyi çek
        await fetchFields();

        // 4. Modalı kapat
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
        startTime: `${form.StartTime.value}`,
        endTime: `${form.EndTime.value}`,
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
        <Container style={{ padding: 10 }}>
            <h2 className="text-center my-5">Futbol Sahaları</h2>

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

        <Row className="mb-4 justify-content-center">
            {/* Silme ve Ekleme Butonları */}
            <div className="text-center mt-5 mb-4">
            <Button
                variant="danger"
                className="me-3"
                onClick={handleOpenDeleteModal}
                type="button"
            >
                Saha Sil
            </Button>
            <Button variant="success" onClick={handleCreateClick} type="button">
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

                {/* Saatler */}
                {/* Başlangıç Saati */}
                    <Form.Group controlId="StartTime" className="mt-2">
                    <Form.Label>Başlangıç Saati</Form.Label>
                    <Form.Select name="StartTime" defaultValue={selectedField.StartTime || "08:00"}>
                        {hourOptions.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                        ))}
                    </Form.Select>
                    </Form.Group>

                    {/* Bitiş Saati */}
                    <Form.Group controlId="EndTime" className="mt-2">
                    <Form.Label>Bitiş Saati</Form.Label>
                    <Form.Select name="EndTime" defaultValue={selectedField.EndTime || "23:00"}>
                        {hourOptions.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                        ))}
                    </Form.Select>
                    </Form.Group>
                {/* Fiyat */}
                <Form.Group controlId="price" className="mt-2">
                    <Form.Label>Fiyat</Form.Label>
                    <Form.Control
                    name="price"
                    type="number"
                    defaultValue={selectedField.pricePerHour}
                    />
                </Form.Group>

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
        {/* Buraya Select dropdown'u ekliyoruz */}
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

        {deleteError && (
          <p className="text-danger">{deleteError}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          İptal
        </Button>
        <Button variant="danger" type="submit" disabled={!fieldNameToDelete}>
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
