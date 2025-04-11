    import React, { useState } from "react";
    import { Container, Row, Col, Table, Modal, Button, ListGroup } from "react-bootstrap";
    import { useFieldContext } from "../Components/FieldContext";
    import FieldCard from "../Components/FieldCard";

    const ReservationPage = () => {
    const { fields, updateField } = useFieldContext();
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedFieldIndex, setSelectedFieldIndex] = useState(0);

    const handleSlotClick = (slot) => {
        setSelectedSlot(slot);
    };

    const handleCloseModal = () => {
        setSelectedSlot(null);
    };

    // Haftalık günleri hesapla
    const getWeekDays = () => {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(currentDate.getDate() - day);

        const days = [];
        for (let i = 0; i < 7; i++) {
        const newDate = new Date(startOfWeek);
        newDate.setDate(startOfWeek.getDate() + i);
        days.push(newDate);
        }
        return days;
    };

    const handlePreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const handlePreviousField = () => {
        setSelectedFieldIndex((prevIndex) => (prevIndex === 0 ? fields.length - 1 : prevIndex - 1));
    };

    const handleNextField = () => {
        setSelectedFieldIndex((prevIndex) => (prevIndex === fields.length - 1 ? 0 : prevIndex + 1));
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    };

    const hours = Array.from({ length: 13 }, (_, i) => 9 + i); // 09:00 - 21:00
    const weekDays = getWeekDays();

    const selectedField = fields[selectedFieldIndex];

    return (
        <Container fluid className="d-flex justify-content-center align-items-center">
        <Row className="w-100 my-2">
            {/* Sol Kısım: Saha Kartı */}
            <Col md={3} className="d-flex justify-content-center">
            <FieldCard key={selectedField.id} field={selectedField} />
            </Col>

            {/* Sağ Kısım: Takvim */}
            <Col md={9} className="border border-light">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Button variant="light" onClick={handlePreviousWeek}>&larr; Previous Week</Button>
                <h4 className="mb-0">
                {weekDays.length > 0 &&
                    `${weekDays[0].toLocaleDateString()} - ${weekDays[6].toLocaleDateString()}`}
                </h4>
                <Button variant="light" onClick={handleNextWeek}>Next Week &rarr;</Button>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button variant="light" onClick={handlePreviousField}>&larr; Previous Field</Button>
                <h5>{selectedField.name}</h5>
                <Button variant="light" onClick={handleNextField}>Next Field &rarr;</Button>
            </div>

            <Table bordered responsive >
                <thead>
                <tr>
                    <th></th>
                    {weekDays.map((day, idx) => (
                    <th key={idx}>{formatDate(day)}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {hours.map((hour) => (
                    <tr key={hour}>
                    <td>{`${hour.toString().padStart(2, "0")}:00`}</td>
                    {weekDays.map((day, idx) => (
                        <td
                        key={idx}
                        style={{
                            backgroundColor: "#d4edda", // Available
                            cursor: "pointer",
                            textAlign: "center",
                        }}
                        onClick={() =>
                            handleSlotClick({
                            day: formatDate(day),
                            hour: `${hour.toString().padStart(2, "0")}:00`,
                            status: "Available",
                            reservationInfo: {
                                name: "Not Reserved Yet",
                                phone: "-",
                                email: "-",
                            },
                            })
                        }
                        >
                        Available
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </Table>
            </Col>
        </Row>

        {/* Modal: Rezervasyon Detayı */}
        {selectedSlot && (
            <Modal show={true} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                Reservation Info - {selectedSlot.day}, {selectedSlot.hour}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                <ListGroup.Item><strong>Name:</strong> {selectedSlot.reservationInfo.name}</ListGroup.Item>
                <ListGroup.Item><strong>Email:</strong> {selectedSlot.reservationInfo.email}</ListGroup.Item>
                <ListGroup.Item><strong>Phone:</strong> {selectedSlot.reservationInfo.phone}</ListGroup.Item>
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                Kapat
                </Button>
            </Modal.Footer>
            </Modal>
        )}
        </Container>
    );
    };

    export default ReservationPage;
