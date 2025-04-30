    import React, { useState, useEffect } from "react";
    import {
    Container,
    Row,
    Col,
    Modal,
    Button,
    ListGroup,
    } from "react-bootstrap";
    import FieldCard from "../Components/FieldCard";
    import Calendar from "../Components/Calendar";
    import ReservationFilter from "../Components/ReservationFilter";
    import { getFields } from "../api/FieldsApi";

    const ReservationPage = () => {
    const [fields, setFields] = useState([]);
    const [selectedFieldIndex, setSelectedFieldIndex] = useState(0);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState(null);

    // 1. Load fields on mount
    useEffect(() => {
        const fetch = async () => {
        try {
            const data = await getFields();
            setFields(data);
        } catch (err) {
            console.error("Failed to load fields:", err);
        }
        };
        fetch();
    }, []);

    // 2. Derive the currently selected field
    const selectedField = fields[selectedFieldIndex] || {};

    // 3. Parse working hours
    const [startHour, endHour] = selectedField.hours
        ? selectedField.hours.split(" - ").map((t) => parseInt(t.split(":")[0], 10))
        : [9, 21];
    const hoursRange = Array.from(
        { length: endHour - startHour },
        (_, i) => startHour + i
    );

    // 4. Week days generator
    const getWeekDays = () => {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(currentDate.getDate() - day);
        return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
        });
    };
    const weekDays = getWeekDays();

    // 5. Availability check
    const isAvailable = (day, hour) => {
        const dayName = day.toLocaleDateString("en-US", { weekday: "long" });
        const h = parseInt(hour, 10);
        if (!selectedField.workingDays?.includes(dayName)) return false;
        return h >= startHour && h < endHour;
    };

    // 6. Slot handlers
    const handleSlotClick = (slot) => setSelectedSlot(slot);
    const handleCloseModal = () => setSelectedSlot(null);

    if (!fields.length) {
        return (
        <Container className="text-center py-5">
            <em>Loading fields...</em>
        </Container>
        );
    }

    return (
        <Container fluid className="d-flex justify-content-center align-items-center">
        <Row className="w-100 my-4">
            {/* Left: FieldCard */}
            <Col md={3} className="d-flex justify-content-center">
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "95vh",
                width: "100%",
            }}>
                <FieldCard field={selectedField} />
            </div>
            </Col>

            {/* Right: Calendar */}
            <Col md={9} className="border border-light shadow">
            <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                variant="light"
                onClick={() =>
                    setSelectedFieldIndex((i) =>
                    i === 0 ? fields.length - 1 : i - 1
                    )
                }
                >
                &larr; Previous Field
                </Button>
                <h5>{selectedField.name}</h5>
                <Button
                variant="light"
                onClick={() =>
                    setSelectedFieldIndex((i) =>
                    i === fields.length - 1 ? 0 : i + 1
                    )
                }
                >
                Next Field &rarr;
                </Button>
            </div>
            <Calendar
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                weekDays={weekDays}
                handleSlotClick={handleSlotClick}
                hoursRange={hoursRange}
                isAvailable={isAvailable}
            />
            </Col>

            <ReservationFilter />
        </Row>

        {/* Reservation Modal */}
        {selectedSlot && (
            <Modal show onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                Reservation Info – {selectedSlot.day}, {selectedSlot.hour}:00
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup variant="flush">
                <ListGroup.Item>
                    <strong>Name:</strong> {selectedSlot.reservationInfo.name}
                </ListGroup.Item>
                <ListGroup.Item>
                    <strong>Email:</strong> {selectedSlot.reservationInfo.email}
                </ListGroup.Item>
                <ListGroup.Item>
                    <strong>Phone:</strong> {selectedSlot.reservationInfo.phone}
                </ListGroup.Item>
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                Close
                </Button>
            </Modal.Footer>
            </Modal>
        )}
        </Container>
    );
    };

    export default ReservationPage;
