import React, { useState, useEffect } from "react";
import { Container, Row, Col, Modal, Button, ListGroup } from "react-bootstrap";
import FieldCard from "../Components/FieldCard";
import Calendar from "../Components/Calendar";
import ReservationFilter from "../Components/ReservationFilter";
import { getAllFields } from "../api/FieldsApi";

const ReservationPage = () => {
  const [fields, setFields] = useState([]);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Load fields on mount
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await getAllFields();
        setFields(response);
        setLoading(false);
      } catch (error) {
        console.error("Saha verisi alınamadı:", error);
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  // 2. Get the currently selected field
  const selectedField = fields[selectedFieldIndex] || {};

  // 3. Parse working hours
  const parseWorkingHours = () => {
    if (selectedField.hours) {
      return selectedField.hours
        .split(" - ")
        .map((t) => parseInt(t.split(":")[0], 10));
    } else if (selectedField.startTime && selectedField.endTime) {
      return [
        parseInt(selectedField.startTime.split(":")[0], 10),
        parseInt(selectedField.endTime.split(":")[0], 10),
      ];
    }
    return [9, 21]; // Default hours
  };

  const [startHour, endHour] = parseWorkingHours();
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

  // 5. Enhanced availability check
  const isAvailable = (day, hour) => {
    const dayName = day.toLocaleDateString("tr-TR", { weekday: "long" });
    const h = parseInt(hour, 10);

    // Check if field is open on this day
    if (
      selectedField.openingDays &&
      !selectedField.openingDays.includes(dayName)
    ) {
      return false;
    }

    // Check if within working hours
    return h >= startHour && h < endHour;
  };

  // 6. Slot handlers
  const handleSlotClick = (slot) => setSelectedSlot(slot);
  const handleCloseModal = () => setSelectedSlot(null);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <em>Saha bilgileri yükleniyor...</em>
      </Container>
    );
  }

  if (!fields.length) {
    return (
      <Container className="text-center py-5">
        <em>Yüklenebilecek saha bulunamadı</em>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
    >
      <Row className="w-100 my-4">
        {/* Left: FieldCard */}
        <Col md={3} className="d-flex justify-content-center">
          <div className="field-card-container">
            <FieldCard field={selectedField} showEditButton={false} />
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
              &larr; Önceki Saha
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
              Sonraki Saha &rarr;
            </Button>
          </div>
          <Calendar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            weekDays={weekDays}
            handleSlotClick={handleSlotClick}
            hoursRange={hoursRange}
            field={selectedField} // openingDays ve isAvailable burada
          />
        </Col>

        <ReservationFilter />
      </Row>

      {/* Reservation Modal */}
      {selectedSlot && (
        <Modal show onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Rezervasyon Bilgisi – {selectedSlot.day}, {selectedSlot.hour}:00
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>İsim:</strong> {selectedSlot.reservationInfo.name}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Email:</strong> {selectedSlot.reservationInfo.email}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Telefon:</strong> {selectedSlot.reservationInfo.phone}
              </ListGroup.Item>
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
