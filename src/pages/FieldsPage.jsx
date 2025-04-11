import React, { useState } from "react";
import {
    Container,
    Card,
    Button,
    Modal,
    Form,
    Row,
    Col,
} from "react-bootstrap";
import FieldCard from "../Components/FieldCard";
import { useFieldContext } from "../Components/FieldContext";

function FieldsPage() {
    const { fields, updateField } = useFieldContext();
    const [showModal, setShowModal] = useState(false);
    const [selectedField, setSelectedField] = useState(null);

    const handleEditClick = (field) => {
        if (field) {
        setSelectedField(field);
        setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedField(null);
    };

    const handleFieldUpdate = (e) => {
        e.preventDefault();
        const updatedField = {
        ...selectedField,
        name: e.target.name.value,
        district: e.target.district.value,
        hours: e.target.hours.value,
        price: e.target.price.value,
        lighted: e.target.lighted.checked,
        available: e.target.available.checked,
        };

        updateField(updatedField);
        handleCloseModal();
    };

    return (
    <>
        <Container style={{ padding: 10 }}>
            <h2 className="text-center my-5">Futbol Sahaları</h2>
            {Array.from({ length: Math.ceil(fields.length / 3) }, (_, rowIndex) => (
            <Row key={rowIndex} className="mb-4 justify-content-center">
                {fields
                .slice(rowIndex * 3, rowIndex * 3 + 3)
                .map((field) => (
                    <Col key={field.id} md={4} className="d-flex justify-content-center">
                    <FieldCard
                        field={field}
                        onEdit={() => handleEditClick(field)}
                        showEditButton={true}
                    />
                    </Col>
                ))}
            </Row>
            ))}
        </Container>

    {showModal && selectedField && (
            <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Saha Düzenle: {selectedField.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleFieldUpdate}>
                <Form.Group controlId="name">
                    <Form.Label>Adı</Form.Label>
                    <Form.Control type="text" defaultValue={selectedField.name} />
                </Form.Group>

                <Form.Group controlId="district">
                    <Form.Label>İlçe</Form.Label>
                    <Form.Control type="text" defaultValue={selectedField.district} />
                </Form.Group>

                <Form.Group controlId="hours">
                    <Form.Label>Çalışma Saatleri</Form.Label>
                    <Form.Control type="text" defaultValue={selectedField.hours} />
                </Form.Group>

                <Form.Group controlId="price">
                    <Form.Label>Fiyat</Form.Label>
                    <Form.Control type="number" defaultValue={selectedField.price} />
                </Form.Group>

                <Form.Group controlId="lighted">
                    <Form.Check
                    type="checkbox"
                    label="Aydınlatmalı"
                    defaultChecked={selectedField.lighted}
                    />
                </Form.Group>

                <Form.Group controlId="available">
                    <Form.Check
                    type="checkbox"
                    label="Mevcut"
                    defaultChecked={selectedField.available}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Kaydet
                </Button>
                </Form>
            </Modal.Body>
            </Modal>
    )}
    </>
);
}

export default FieldsPage;
