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

    // "+" kartına tıklayınca
    const handleCreateClick = () => {
        // Yeni, boş bir saha objesi
        setSelectedField({
        name: "",
        width: 0,
        height: 0,
        capacity: 0,
        hours: "08:00 - 09:00",
        isIndoor: false,
        hasCamera: false,
        lightingAvailable: false,
        isAvailable: false,
        allDays: [],
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

    // Düzenle butonuna tıklayınca
    const handleEditClick = (id) => {
        const fresh = fields.find((f) => f.id === id);
        setSelectedField(fresh);
        setIsCreateMode(false);
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

    // Gün toggle
    const toggleDay = (day) => {
        setDaysAvailable((prev) => ({ ...prev, [day]: !prev[day] }));
    };

    // Saat seçenekleri
    const hourOptions = Array.from(
        { length: 15 },
        (_, i) => `${(8 + i).toString().padStart(2, "0")}:00`
    );

    // Var olan saha güncelleme
    const handleFieldUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;
        const updatedField = {
        ...selectedField,
        name: form.name.value,
        hours: `${form.startHour.value} - ${form.endHour.value}`,
        pricePerHour: Number(form.price.value),
        capacity: Number(form.capacity.value),
        width: Number(form.width.value),
        height: Number(form.height.value),
        isIndoor: form.indoor.checked,
        hasCamera: form.camera.checked,
        lightingAvailable: form.lighted.checked,
        isAvailable: formAvailable,
        allDays: WEEK_DAYS.filter((day) => daysAvailable[day]),
        // Fotoğraf dosyası yerine dosya adı ya da URL gönderiliyor
        photos: photoFile ? photoFile.name : selectedField.photos,
        };

        try {
        await updateField(updatedField);
        await fetchFields();
        handleCloseModal();
        } catch (err) {
        console.error("Güncelleme hatası:", err);
        }
    };

    // Yeni saha oluşturma
    const handleFieldCreate = async (e) => {
        e.preventDefault();

        const form = e.target;

        // facilityId değişkenini projenize göre belirleyin:
        const facilityId = 1; // veya props’dan, context’ten geldiği değer
        const newField = {
        facilityId,
        name: form.name.value,
        hours: `${form.startHour.value} - ${form.endHour.value}`,
        pricePerHour: Number(form.price.value),
        capacity: Number(form.capacity.value),
        width: Number(form.width.value),
        height: Number(form.height.value),
        isIndoor: form.indoor.checked,
        hasCamera: form.camera.checked,
        lightingAvailable: form.lighted.checked,
        isAvailable: formAvailable,
        allDays: WEEK_DAYS.filter((day) => daysAvailable[day]),
        // Eğer gerçek dosya upload etmiyorsanız:
        photos: photoFile ? photoFile.name : "",

        // enum değeri: Swagger’da 0…n arasında; örnek:
        floorType: 0, // 0=Grass, 1=Artificial vs.
        };

        try {
        await createField(newField);
        await fetchFields();
        handleCloseModal();
        } catch (err) {
        console.error(
            "Oluşturma hatası:",
            err.response?.status,
            err.response?.data
        );
        }
    };
    //Saha silme
    const handleFieldDelete = async (e) => {
        e.preventDefault();
        const f = fields.find(
        (f) => f.name.trim().toLowerCase() === deleteName.trim().toLowerCase()
        );
        if (!f) {
        setDeleteError("Bu isimde bir saha bulunamadı.");
        return;
        }
        try {
        await deleteField(f.id);
        await fetchFields();
        setShowDeleteModal(false);
        } catch (err) {
        console.error("Silme hatası:", err.response?.status, err.response?.data);
        setDeleteError("Silme başarısız oldu.");
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
            {/* Oluşturma Kartı */}
            <Col md={4} className="d-flex justify-content-center mb-4">
            <Card
                bg="success"
                text="white"
                style={{
                width: "100%",
                height: "200px",
                cursor: "pointer",
                opacity: 0.7,
                }}
                className="d-flex align-items-center justify-content-center"
                onClick={handleCreateClick}
            >
                <Card.Body>
                <h1 className="text-center">+</h1>
                <div className="text-center">Saha Ekle</div>
                </Card.Body>
            </Card>
            </Col>

            {/* Silme Kartı */}
            <Col md={4} className="d-flex justify-content-center mb-4">
            <Card
                bg="danger"
                text="white"
                style={{
                width: "100%",
                height: "200px",
                cursor: "pointer",
                opacity: 0.8,
                }}
                className="d-flex align-items-center justify-content-center"
                onClick={() => {
                setDeleteName("");
                setDeleteError("");
                setShowDeleteModal(true);
                }}
            >
                <Card.Body>
                <h1 className="text-center">−</h1>
                <div className="text-center">Saha Sil</div>
                </Card.Body>
            </Card>
            </Col>
        </Row>

        {/* Ekleme / Düzenleme Modalı */}
        {showModal && selectedField && (
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
                <Form.Group controlId="photos">
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
                <Form.Group controlId="startHour" className="mt-2">
                    <Form.Label>Başlangıç Saati</Form.Label>
                    <Form.Select
                    name="startHour"
                    defaultValue={selectedField.hours.split(" - ")[0]}
                    >
                    {hourOptions.map((h) => (
                        <option key={h} value={h}>
                        {h}
                        </option>
                    ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="endHour" className="mt-2">
                    <Form.Label>Bitiş Saati</Form.Label>
                    <Form.Select
                    name="endHour"
                    defaultValue={selectedField.hours.split(" - ")[1]}
                    >
                    {hourOptions.map((h) => (
                        <option key={h} value={h}>
                        {h}
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

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Form onSubmit={handleFieldDelete}>
            <Modal.Header closeButton>
                <Modal.Title>Saha Sil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="deleteName">
                <Form.Label>Silinecek Saha Adı</Form.Label>
                <Form.Control
                    type="text"
                    value={deleteName}
                    onChange={(e) => setDeleteName(e.target.value)}
                    placeholder="Saha adını girin"
                    required
                />
                </Form.Group>
                {deleteError && (
                <div className="text-danger mt-2">{deleteError}</div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                >
                İptal
                </Button>
                <Button variant="danger" type="submit">
                Sil
                </Button>
            </Modal.Footer>
            </Form>
        </Modal>
        </>
    );
    }

    export default FieldsPage;
