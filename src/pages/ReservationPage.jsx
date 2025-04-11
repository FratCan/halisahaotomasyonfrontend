        import React, { useState } from "react";
        import { Container, Row, Col, Table, Modal, Button, ListGroup } from "react-bootstrap";
        import { useFieldContext } from "../Components/FieldContext";
        import FieldCard from "../Components/FieldCard";
        
        const ReservationPage = () => {
        const { fields } = useFieldContext(); // Use context to get fields
        const [selectedSlot, setSelectedSlot] = useState(null);
        const [currentDate, setCurrentDate] = useState(new Date());
        const [selectedFieldIndex, setSelectedFieldIndex] = useState(0);
        
        const selectedField = fields[selectedFieldIndex];
        
        // Get the working hours from the selected field
        const hours = selectedField?.hours
            ? selectedField.hours.split(" - ").map((time) => parseInt(time.split(":")[0]))
            : [9, 21]; // Default to 09:00 - 21:00 if no hours are available
        
        const [startHour, endHour] = hours; // Get start and end hour from hours range
        
        const hoursRange = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
        
        // Function to handle slot click (not needed for hours logic, but part of the UI interaction)
        const handleSlotClick = (slot) => {
            setSelectedSlot(slot);
        };
        
        const handleCloseModal = () => {
            setSelectedSlot(null);
        };
        
        // Generate week days for the calendar
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
        
        const weekDays = getWeekDays();
        
        return (
            <Container fluid className="d-flex justify-content-center align-items-center">
            <Row className="w-100 my-2">
                {/* Left Section: Field Card */}
                <Col md={3} className="d-flex justify-content-center">
                <FieldCard key={selectedField.id} field={selectedField} />
                </Col>
        
                {/* Right Section: Calendar */}
                <Col md={9} className="border border-light">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Button variant="light" onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}>&larr; Previous Week</Button>
                    <h4 className="mb-0">
                    {weekDays.length > 0 && `${weekDays[0].toLocaleDateString()} - ${weekDays[6].toLocaleDateString()}`}
                    </h4>
                    <Button variant="light" onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}>Next Week &rarr;</Button>
                </div>
        
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Button variant="light" onClick={() => setSelectedFieldIndex(prevIndex => (prevIndex === 0 ? fields.length - 1 : prevIndex - 1))}>&larr; Previous Field</Button>
                    <h5>{selectedField.name}</h5>
                    <Button variant="light" onClick={() => setSelectedFieldIndex(prevIndex => (prevIndex === fields.length - 1 ? 0 : prevIndex + 1))}>Next Field &rarr;</Button>
                </div>
        
                <Table bordered responsive>
                    <thead>
                    <tr>
                        <th></th>
                        {weekDays.map((day, idx) => (
                        <th key={idx}>{day.toLocaleDateString()}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {hoursRange.map((hour) => (
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
                                day: day.toLocaleDateString(),
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
                            Müsait
                            </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </Table>
                </Col>
            </Row>
        
            {/* Modal: Reservation Details */}
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
                    Close
                    </Button>
                </Modal.Footer>
                </Modal>
            )}
            </Container>
        );
        };
export default ReservationPage;