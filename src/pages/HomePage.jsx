import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, Button, Nav, Badge } from "react-bootstrap";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaFutbol,
} from "react-icons/fa";
import { getFieldsOwner } from "../api/FieldsApi";
import { getReservations } from "../api/ReservationApi";

const START_HOUR = 8;
const END_HOUR = 23;

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const toWeekIndex = (dow) =>
  typeof dow === "number"
    ? dow
    : WEEK_DAYS.findIndex((d) => d.toLowerCase() === String(dow).toLowerCase());

export default function HomePage() {
  const ownerId = Number(localStorage.getItem("userId"));
  const [fields, setFields] = useState([]);
  const [selectedField, setField] = useState(null);
  const [selectedDate, setDate] = useState(new Date());
  const [reservations, setResv] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getFieldsOwner(ownerId);
        setFields(data);
        setField(data[0] ?? null);
      } catch (err) {
        console.error("Sahalar alınamadı:", err);
      }
    })();
  }, [ownerId]);

  useEffect(() => {
    if (!selectedField) return;
    (async () => {
      try {
        const data = await getReservations(selectedField.id, "all");
        setResv(Array.isArray(data) ? data : []);
      } catch (_) {}
    })();
  }, [selectedField]);

  const slotsForDay = useMemo(() => {
    if (!selectedField) return [];

    const weekDay = selectedDate.getDay();
    const isoDate = selectedDate.toISOString().slice(0, 10);

    const exc = (selectedField.exceptions ?? []).find(
      (ex) => ex.date?.slice(0, 10) === isoDate
    );
    const isClosedByException = exc && exc.isOpen === false;
    const isForcedOpen = exc && exc.isOpen === true;

    const openHours = new Set();
    if (!isClosedByException) {
      if (isForcedOpen || (selectedField.weeklyOpenings ?? []).length === 0) {
        for (let h = START_HOUR; h <= END_HOUR; h++) openHours.add(h);
      } else {
        (selectedField.weeklyOpenings ?? [])
          .filter((w) => toWeekIndex(w.dayOfWeek) === weekDay)
          .forEach((w) => {
            const s = Number((w.startTime || "00:00").slice(0, 2));
            let e = Number((w.endTime || "24:00").slice(0, 2));

            // ÖZEL DURUM: Gece 00:00 kapanışsa aslında gece 24:00 gibi say
            if (e === 0) e = 24;

            for (let h = s; h < e; h++) openHours.add(h);
          });
      }
    }

    const reserved = new Set(
      reservations
        .filter((r) => r.slotStart.slice(0, 10) === isoDate)
        .map((r) => new Date(r.slotStart).getHours())
    );

    const now = new Date();
    const today = now.toISOString().slice(0, 10) === isoDate;
    const slots = [];

const isBeforeToday = (() => {
  const onlyDate = (d) => {
    const newDate = new Date(d);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };
  return onlyDate(selectedDate) < onlyDate(new Date());
})();

for (let h = START_HOUR; h <= END_HOUR; h++) {
  const label = `${String(h).padStart(2, "0")}:00`;
  let status;

  const isReserved = reserved.has(h);

  if (isClosedByException || !openHours.has(h)) {
    status = "Kapalı";
  } else if (isReserved) {
    status = "Rezerve";
  } else if (isBeforeToday) {
    status = "Geçmiş"; // 🔥 sadece rezerve değilse geçmiş yap
  } else if (
    today &&
    (h < now.getHours() || (h === now.getHours() && now.getMinutes() > 0))
  ) {
    status = "Geçmiş";
  } else {
    status = "Boş";
  }

  slots.push({ time: label, status });
}

    return slots;
  }, [selectedField, reservations, selectedDate]);

  const formatDate = (d) =>
    d.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      weekday: "long",
    });

  const changeDay = (delta) =>
    setDate((prev) => {
      const n = new Date(prev);
      n.setDate(n.getDate() + delta);
      return n;
    });

  const getStatusVariant = (status) => {
    switch (status) {
      case "Boş":
        return "outline-success";
      case "Rezerve":
        return "outline-danger";
      case "Geçmiş":
        return "outline-warning";
      case "Kapalı":
        return "outline-secondary";
      default:
        return "outline-primary";
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col md={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Nav className="justify-content-center" variant="tabs">
                {fields.map((f) => (
                  <Nav.Item key={f.id}>
                    <Nav.Link
                      active={selectedField?.id === f.id}
                      onClick={() => setField(f)}
                      className="text-center"
                    >
                      {f.name}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              <div className="p-4">
                <h5 className="text-center mb-4">
                  Seçili Saha: {selectedField?.name ?? "—"}
                </h5>

                <div className="d-flex justify-content-center align-items-center mb-4">
                  <Button
                    variant="light"
                    className="rounded-circle me-3 shadow-sm border border-primary d-flex align-items-center justify-content-center"
                    style={{
                      width: "42px",
                      height: "42px",
                      transition: "all 0.2s",
                    }}
                    onClick={() => changeDay(-1)}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e8f0fe")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    <FaChevronLeft size={18} color="#0d6efd" />
                  </Button>

                  <h4
                    className="mb-0 text-center"
                    style={{ minWidth: "300px" }}
                  >
                    {formatDate(selectedDate)}
                  </h4>

                  <Button
                    variant="light"
                    className="rounded-circle ms-3 shadow-sm border border-primary d-flex align-items-center justify-content-center"
                    style={{
                      width: "42px",
                      height: "42px",
                      transition: "all 0.2s",
                    }}
                    onClick={() => changeDay(1)}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e8f0fe")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    <FaChevronRight size={18} color="#0d6efd" />
                  </Button>
                </div>

                <div className="time-slots-container" style={{ overflow: "hidden" }}>
                  <Row className="g-3">
                    {slotsForDay.map(({ time, status }) => (
                      <Col xs={6} md={4} lg={3} key={time}>
                        <Button
                          variant={getStatusVariant(status)}
                          className="w-100 py-2 time-slot-button"
                          disabled={status !== "Boş"}
                        >
                          <div className="d-flex flex-column">
                            <span className="fw-bold">{time}</span>
                            <small>{status}</small>
                          </div>
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

<style jsx>{`
  .time-slots-container {
    max-height: 500px;
    overflow-y: auto;
    padding: 5px;
  }

  .time-slot-button {
    height: 90px;
    transition: all 0.2s ease;
  }
  .time-slot-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  /* Saat (üstteki) */
  .time-slot-button span.fw-bold {
    font-size: 1.4rem;   /* ≈ 22 px */
  }

  /* Durum metni (altındaki “Boş / Rezerve / …”) */
  .time-slot-button small {
    font-size: 1.1rem;   /* ≈ 17-18 px */
  }
`}</style>

    </Container>
  );
}
