    import React, { useState, useEffect } from "react";
    import {
        Form,
        Container,
        Row,
        Col,
        Button,
        Card,
        Alert,
    } from "react-bootstrap";
    import { getAnnouncements, createAnnouncement } from "../api/Announcement";

    const AnnouncementPage = ({ facilityId }) => {
    console.log("Gelen facilityId:", facilityId);

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
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

    useEffect(() => {
        async function fetchAnnouncements() {
        try {
            if (!facilityId) return;

            const data = await getAnnouncements(facilityId);
            console.log("API'den gelen duyurular:", data);
            setAnnouncements(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Duyurular alınamadı:", err);
        }
        }

        fetchAnnouncements();
    }, [facilityId]); // Sadece facilityId'ye bağlı

    const handleSubmit = async () => {
        if (!facilityId) {
        setError("Tesis ID'si bulunamadı!");
        return;
        }

        if (!title.trim() || !text.trim()) {
        setError("Lütfen hem başlık hem de metin girin.");
        return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", text);
        formData.append("endTime", endDate || "");
        if (image) {
        formData.append("bannerUrl", image);
        }

        try {
        const response = await createAnnouncement(facilityId, formData);
        const newAnnouncement = response.data; // API yapınıza göre bu kısım değişebilir

        setAnnouncements((prev) => [newAnnouncement, ...prev]);
        setTitle("");
        setText("");
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
        setEditedTitle(ann.title);
        setEditedText(ann.content);
        setEditedEndDate(ann.endTime ?? "");
        setImagePreview(ann.bannerUrl ?? "");
    };

    const saveEditedAnnouncement = () => {
        const updated = announcements.map((ann, i) =>
        i === editingIndex
            ? {
                ...ann,
                title: editedTitle,
                content: editedText,
                endTime: editedEndDate || null,
                bannerUrl: imagePreview || ann.bannerUrl,
            }
            : ann
        );
        setAnnouncements(updated);
        // düzenleme modu kapat, formu resetle
        setEditingIndex(null);
        setEditedTitle("");
        setEditedText("");
        setEditedEndDate("");
        setImage(null);
        setImagePreview(null);
    };

    return (
        <Container className="mt-5">
        <Row className="g-5">
            <Col>
            <h4 className="mb-4">Duyuru Oluştur</h4>
            <Form>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group controlId="announcementTitle" className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Duyuru başlığı girin..."
                    value={editingIndex !== null ? editedTitle : title}
                    onChange={(e) =>
                    editingIndex !== null
                        ? setEditedTitle(e.target.value)
                        : setTitle(e.target.value)
                    }
                />
                </Form.Group>

                <Form.Group controlId="announcementText" className="mb-3">
                <Form.Control
                    as="textarea"
                    placeholder="Metninizi buraya yazın..."
                    value={editingIndex !== null ? editedText : text}
                    onChange={(e) =>
                    editingIndex !== null
                        ? setEditedText(e.target.value)
                        : setText(e.target.value)
                    }
                    style={{
                    height: "200px",
                    resize: "none",
                    borderRadius: "10px",
                    }}
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
                    value={editingIndex !== null ? editedEndDate : endDate}
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

                <Button
                variant="success"
                onClick={
                    editingIndex !== null ? saveEditedAnnouncement : handleSubmit
                }
                >
                {editingIndex !== null ? "Kaydet" : "Oluştur"}
                </Button>
            </Form>
            </Col>

            <Col>
            <h4>Duyurular</h4>
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                {announcements.length === 0 && <p>Henüz duyuru yok.</p>}
                {announcements.map((ann, idx) => (
                <Card className="mt-3" key={ann.id || idx}>
                    <Card.Header
                    onClick={() => toggleCard(idx)}
                    style={{
                        cursor: "pointer",
                        backgroundColor: "#f8f9fa",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                    >
                    <strong>{ann.title}</strong>
                    <div>
                        <Button
                        variant="outline-info"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            editAnnouncement(idx);
                        }}
                        className="me-2"
                        >
                        ✏️
                        </Button>
                        <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteAnnouncement(idx);
                        }}
                        >
                        ❌
                        </Button>
                    </div>
                    </Card.Header>
                    {openIndex === idx && (
                    <Card.Body>
                        {ann.bannerUrl && (
                        <img
                            src={ann.bannerUrl}
                            alt="Banner"
                            style={{
                            width: "100%",
                            marginBottom: "1rem",
                            borderRadius: "8px",
                            }}
                        />
                        )}
                        <Card.Text>{ann.content}</Card.Text>
                        <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                        Oluşturulma: {new Date(ann.createdAt).toLocaleString()}
                        </div>
                        {ann.endTime && (
                        <div
                            className="text-muted"
                            style={{ fontSize: "0.9rem" }}
                        >
                            Bitiş: {new Date(ann.endTime).toLocaleDateString()}
                        </div>
                        )}
                    </Card.Body>
                    )}
                </Card>
                ))}
            </div>
            </Col>
        </Row>
        </Container>
    );
    };

    export default AnnouncementPage;
