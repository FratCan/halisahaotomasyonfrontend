import React, { useState,useEffect } from "react";
import {
Form,
Container,
Row,
Col,
Button,
Card,
Alert,
} from "react-bootstrap";
import { getAnnouncements,createAnnouncement} from "../api/Announcement";

const Announcement = ({ facility}) => {
const [title, setTitle] = useState("");
const [text, setText] = useState("");
const [announcements, setAnnouncements] = useState([]);
const [error, setError] = useState("");
const [openIndex, setOpenIndex] = useState(null); // hangi card açık
const [editingIndex, setEditingIndex] = useState(null); // Düzenleme durumu
const [editedTitle, setEditedTitle] = useState("");
const [editedText, setEditedText] = useState("");
const [image, setImage] = useState(null);
const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        async function fetchAnnouncements() {
        try {
            const data = await getAnnouncements(facility.id); // <<< BURAYA facility.id EKLE
            console.log("Gelen duyurular:", data);
            setAnnouncements(data);
        } catch (error) {
            console.error("Duyurular alınamadı:", error);
        }
        }

        if (facility?.facilityId) {
        fetchAnnouncements();
        }
    }, [facility?.id]); // <<< BURADA DA facility.id'ye bağımlı olsun

const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
    setImage(file);
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

const handleSubmit = async () => {
    if (!title.trim() || !text.trim()) {
        setError("Lütfen hem başlık hem de metin girin.");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", text);
    if (image) {
        formData.append("banner", image); // backend'de field adı farklıysa değiştirin
    }

    try {
        const created = await createAnnouncement(facility.id, formData);
        setAnnouncements([created, ...announcements]);
        setTitle("");
        setText("");
        setError("");
        setImage(null);
        setImagePreview("");
    } catch (err) {
        setError("Duyuru oluşturulamadı!");
        console.error(err);
    }
};

const toggleCard = (index) => {
    setOpenIndex(openIndex === index ? null : index);
};

const deleteAnnouncement = (indexToDelete) => {
    setAnnouncements(announcements.filter((_, i) => i !== indexToDelete));
    if (openIndex === indexToDelete) setOpenIndex(null);
};

const editAnnouncement = (indexToEdit) => {
    const announcementToEdit = announcements[indexToEdit];
    setEditingIndex(indexToEdit); // Düzenlemeye başlama
    setEditedTitle(announcementToEdit.title);
    setEditedText(announcementToEdit.text);
};

const saveEditedAnnouncement = () => {
    const updatedAnnouncements = announcements.map((ann, index) =>
    index === editingIndex
        ? // saveEditedAnnouncement:
 { ...ann, title: editedTitle, content: editedText }  // text yerine content!

        : ann
    );
    setAnnouncements(updatedAnnouncements);
    setEditingIndex(null); // Düzenlemeyi bitir
    setEditedTitle("");
    setEditedText("");
    setImage(null);
    setImagePreview("");
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

            {/* Fotoğraf Ekleme Alanı */}
            <Form.Group controlId="announcementImage" className="mb-3">
            <Form.Label>Fotoğraf Ekle (isteğe bağlı)</Form.Label>
            <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
            />
            </Form.Group>

            {/* Yüklenen görsel önizlemesi */}
            {imagePreview && (
            <div className="mb-3">
                <img
                src={imagePreview}
                alt="Yüklenen görsel"
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
            {announcements.map((ann, index) => (
            <Card className="mt-3" key={ann.facilityId || index}>
                <Card.Header
                onClick={() => toggleCard(index)}
                style={{
                    cursor: "pointer",
                    backgroundColor: "#f8f9fa",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
                >
                <strong>{ann.title}</strong>
                <small className="text-muted" style={{ fontSize: "0.85rem" }}>
                    {ann.createdAt
                        ? new Date(ann.createdAt).toLocaleString()
                        : ""}
                </small>
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => {
                    e.stopPropagation(); // Kart açılmasını engelle
                    deleteAnnouncement(index);
                    }}
                >
                    ❌
                </Button>
                <Button
                    variant="outline-info"
                    size="sm"
                    onClick={(e) => {
                    e.stopPropagation();
                    editAnnouncement(index);
                    }}
                    className="ms-2"
                >
                    ✏️
                </Button>
                </Card.Header>
                {openIndex === index && (
                <Card.Body>
                    {/* Banner resmi varsa göster */}
                    {ann.bannerUrl && (
                        <div className="mb-2">
                            <img
                                src={ann.bannerUrl}
                                alt="Duyuru görseli"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "200px",
                                    borderRadius: "10px",
                                }}
                            />
                        </div>
                    )}
                    <Card.Text>{ann.content}</Card.Text>
                    <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                        Oluşturulma: {ann.createdAt
                            ? new Date(ann.createdAt).toLocaleString()
                            : ""}
                    </div>
                    {ann.endTime && (
                        <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                            Bitiş: {new Date(ann.endTime).toLocaleString()}
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
}

export default Announcement;
