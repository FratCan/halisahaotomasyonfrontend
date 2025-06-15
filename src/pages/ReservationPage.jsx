import React, { useState, useEffect } from "react";
import { Container, Row, Col, Modal, Button, ListGroup } from "react-bootstrap";

import FieldCard from "../Components/FieldCard";
import Calendar from "../Components/Calendarr";
import ReservationFilter from "../Components/ReservationFilter";
import FacilitySelect from "../Components/FacilitySelect";
import { getReservations } from "../api/ReservationApi";
import { getAllFields } from "../api/FieldsApi";

const ownerId = Number(localStorage.getItem("userId") ?? 0);

export default function ReservationPage() {
  /*──────── STATE ────────*/
  const [facilityId, setFacilityId] = useState(
    localStorage.getItem("selectedFacilityId") || ""
  );

  const [allFields, setAllFields] = useState([]); // tüm sahalar (owner'a ait)
  const [fields, setFields] = useState([]); // seçili tesise ait
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loadingFields, setLoadingFields] = useState(true);

  /*──────── SAHALARI YÜKLE ────────*/
  useEffect(() => {
    if (!ownerId) return;

    (async () => {
      setLoadingFields(true);
      try {
        const list = (await getAllFields(ownerId)) ?? [];
        console.log("Loaded fields:", list); // Debug için
        setAllFields(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("Saha verisi alınamadı:", e);
        setAllFields([]);
      } finally {
        setLoadingFields(false);
      }
    })();
  }, [ownerId]);

  /*──────── TESİS FİLTRESİ ────────*/
  useEffect(() => {
    if (!facilityId) {
      setFields([]);
      return;
    }
    const filtered = allFields.filter(
      (f) => f.facilityId === Number(facilityId)
    );
    console.log("Filtered fields for facility:", facilityId, filtered); // Debug için
    setFields(filtered);
    setSelectedFieldIndex(0);
  }, [facilityId, allFields]);

  useEffect(() => {
    const field = fields[selectedFieldIndex];
    if (!field) return;
    /* istersen buraya rezervasyon fetch’i ekle */
    (async () => {
      try {
        const data = await getReservations(field.id, "week"); // api'ne göre
        setReservations(Array.isArray(data) ? data : []);
      } catch (_) {
        setReservations([]);
      }
    })();
  }, [fields, selectedFieldIndex]);
  /*──────── YARDIMCI HESAPLAR ────────*/
  const selectedField = fields[selectedFieldIndex] || {};

  // Çalışma saatlerini hesapla
  const parseWorkingHours = () => {
    // Önce weeklyOpenings kontrol et
    if (
      Array.isArray(selectedField.weeklyOpenings) &&
      selectedField.weeklyOpenings.length > 0
    ) {
      const allStartTimes = selectedField.weeklyOpenings.map((w) =>
        parseInt(w.startTime.split(":")[0], 10)
      );
      const allEndTimes = selectedField.weeklyOpenings.map((w) =>
        (w.endTime.startsWith("00") ? 23 : parseInt(w.endTime, 10))
      );
      const minStart = Math.min(...allStartTimes);
      const maxEnd = Math.max(...allEndTimes);
      console.log("Working hours from weeklyOpenings:", minStart, maxEnd);
      return [minStart, maxEnd];
    }

    // Fallback: hours alanı
    if (selectedField.hours) {
      const hoursParts = selectedField.hours.split(" - ");
      if (hoursParts.length === 2) {
        return [
          parseInt(hoursParts[0].split(":")[0], 10),
          parseInt(hoursParts[1].split(":")[0], 10),
        ];
      }
    }

    // Fallback: startTime/endTime alanları
    if (selectedField.startTime && selectedField.endTime) {
      return [
        parseInt(selectedField.startTime.split(":")[0], 10),
        parseInt(selectedField.endTime.split(":")[0], 10),
      ];
    }

    // Default saatler
    console.log("Using default working hours: 8-22");
    return [8, 22];
  };

  const [startHour, endHour] = parseWorkingHours();
  // ► Bitiş saati dâhil (inclusive)
  const hoursRange = Array.from(
    { length: Math.max(endHour - startHour, 0) + 1 },
    (_, i) => startHour + i
  );

  console.log("Hours range:", hoursRange); // Debug için

  // Hafta günlerini hesapla
  const getWeekDays = () => {
    const start = new Date(currentDate);
    const dow = start.getDay(); // 0 = Pazar
    start.setDate(currentDate.getDate() - dow);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };
  const weekDays = getWeekDays();

  /*──────── SLOT HANDLERS ────────*/
  const handleSlotClick = (slot) => {
    console.log("Slot clicked:", slot);
    setSelectedSlot(slot);
  };

  const handleCloseModal = () => setSelectedSlot(null);

  /*──────── LOADING / EMPTY ────────*/
  if (loadingFields)
    return (
      <Container className="text-center py-5">
        <em>Veriler yükleniyor…</em>
      </Container>
    );

  if (!facilityId)
    return (
      <Container style={{ padding: 40 }}>
        <FacilitySelect
          ownerId={ownerId}
          facilityId={facilityId}
          onChange={setFacilityId}
        />
        <p className="text-center mt-4">
          <em>Önce bir tesis seçin.</em>
        </p>
      </Container>
    );

  if (!fields.length)
    return (
      <Container style={{ padding: 40 }}>
        <FacilitySelect
          ownerId={ownerId}
          facilityId={facilityId}
          onChange={setFacilityId}
        />
        <p className="text-center mt-4">
          <em>Bu tesise ait saha bulunamadı.</em>
        </p>
      </Container>
    );
  const changeWeek = (delta) =>
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7 * delta);
      return d;
    });
  /*──────── UI ────────*/
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
    >
      <Row className="w-100 my-4">
        {/*■■■ TESİS SEÇİCİ ■■■*/}
        <Col xs={12} className="mb-3">
          <FacilitySelect
            ownerId={ownerId}
            facilityId={facilityId}
            onChange={setFacilityId}
          />
        </Col>

        {/* LEFT: FieldCard */}
        <Col md={3} className="d-flex justify-content-center">
          <FieldCard field={selectedField} showEditButton={false} />
        </Col>

        {/* RIGHT: Calendar */}
        <Col md={9} className="border border-light shadow">
          <div className="d-flex justify-content-between align-items-center mt-3">
            {fields.length > 1 && (
              <>
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

                <h5 className="m-0">{selectedField.name}</h5>

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
              </>
            )}
            {fields.length === 1 && (
              <h5 className="m-0">{selectedField.name}</h5>
            )}
          </div>
          <Calendar
            currentDate={currentDate}
            weekDays={weekDays}
            hoursRange={hoursRange}
            field={selectedField}
            reservations={reservations}
            onSlotClick={handleSlotClick}
            changeWeek={changeWeek}
          />
        </Col>

        <ReservationFilter />
      </Row>

      {/* Rezervasyon Bilgi Modalı */}
      {selectedSlot && (
        <Modal show onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Rezervasyon – {selectedSlot.day}, {selectedSlot.hour}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedSlot.reservationInfo ? (
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
            ) : (
              <div className="text-center">
                <p>Bu slot müsait durumda.</p>
                <Button variant="primary">Rezervasyon Yap</Button>
              </div>
            )}
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
}
