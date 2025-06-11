// Components/FieldCard.js
import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
function FieldCard({ field, onEdit, showEditButton }) {
  const isAvailable = field.available ?? field.isAvailable;

  return (
    <Card
      bg="light"
      border="primary"
      style={{
        width: "100%",
        opacity: isAvailable ? 1 : 0.5,
        transition: "opacity 0.3s ease",
      }}
    >
      <Card.Header
        className="text-center"
        style={{ fontSize: 20, color: "black" }}
      >
        {field.name}
      </Card.Header>

      <Card.Body
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* FOTO */}
        <Card.Img
          variant="top"
          src={
            field.photoUrls?.[0]
              ? `https://halisaha.up.railway.app/${field.photoUrls[0]}`
              : ""
          }
          alt={field.name}
          className="img-fluid"
          style={{ maxHeight: "200px", objectFit: "cover" }}
        />

        <div className="d-flex justify-content-between px-3 py-3">
          {/* SAAT ve AYDINLATMA */}
          <Card.Text className="fs-5 m-0 align-self-start">
            <br />
            {field.lightingAvailable ? "💡 Lighted" : "🌑 Not lighted"}
          </Card.Text>

          {/* FİYAT ve DURUM */}
          <Card.Text className="fs-5 m-0 align-self-start">
            <div>
              <strong>${field.pricePerHour}/hour</strong>
            </div>
            <div style={{ color: isAvailable ? "green" : "red" }}>
              {isAvailable ? "Available" : "Closed"}
            </div>
          </Card.Text>
        </div>

        {/* YENİ EKLENEN ALANLAR */}
        <Row className="fs-6 px-3 py-3">
          {/* Sol taraf */}
          <Col md={6}>
            <p className="mb-2">
              <strong>Boyut:</strong> {field.width}m × {field.height}m
            </p>
            <p className="mb-2">
              <strong>Açık/Kapalı:</strong> {field.isIndoor ? "Kapalı" : "Açık"}
            </p>
            <p className="mb-2">
              <strong>Kapasite:</strong> {field.capacity} oyuncu
            </p>
            <p className="mb-2">
              <strong>Kamera:</strong> {field.hasCamera ? "Var" : "Yok"}
            </p>
          </Col>

          {/* Sağ taraf */}
          <Col md={6}>
            <p className="mb-2">
              <strong>Saha tipi:</strong> {field.floorType}
            </p>
            <p className="mb-2">
              <strong>Haftalık Saatler:</strong>
              <br />
             {(field.weeklyOpenings || []).map((w, idx) => {
  const dayName = WEEK_DAYS[w.dayOfWeek] ?? `${w.dayOfWeek}`;
  return (
    <span key={idx}>
      {dayName}: {w.startTime?.slice(0, 5)} - {w.endTime?.slice(0, 5)}
      <br />
    </span>
  );
})}

            </p>
            {field.exceptions?.length > 0 && (
              <p className="mb-2">
                <strong>Kapalı Günler</strong>
                <br />
                {field.exceptions.map((ex, idx) => (
                  <span key={idx}>
                    📅 {new Date(ex.date).toLocaleDateString()}{" "}
                    {ex.isOpen ? "(Açık)" : "(Kapalı)"}
                    <br />
                  </span>
                ))}
              </p>
            )}
          </Col>
        </Row>

        {/* DÜZENLE BUTONU */}
        {showEditButton && (
          <Button variant="primary" onClick={onEdit}>
            Düzenle
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default FieldCard;
