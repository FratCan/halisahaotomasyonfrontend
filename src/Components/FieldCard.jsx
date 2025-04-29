// Components/FieldCard.js
import React from "react";
import { Card, Button } from "react-bootstrap";

function FieldCard({ field, onEdit, showEditButton = false }) {
  // Eski “available” prop’u yoksa yeni “isAvailable”’ı kullan
  const isAvailable = field.available ?? field.isAvailable;

  // Eski “price” prop’u yoksa yeni “pricePerHour”’ı kullan
  const price = field.pricePerHour ?? field.price;

  // Eskiden field.lighted, yeni JSON’da lightingAvailable
  const lighted = field.lighted ?? field.lightingAvailable;

  const imgSrc = Array.isArray(field.photos)
  ? field.photos[0]
  : field.photos; // örneğin "data:image/jpeg;base64,...."


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
        style={{ fontSize: 22, color: "black" }}
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
  src={imgSrc || undefined}
  alt={field.name}
/>

        {/* SAAT ve AYDINLATMA */}
        <Card.Text className="fs-4 p-3">
          ⏰ {field.hours}
          <br />
          {lighted ? "💡 Lighted" : "🌑 Not lighted"}
        </Card.Text>

        {/* YENİ EKLENEN ALANLAR */}
        <Card.Text className="fs-6">
          <strong>Dimensions:</strong> {field.width}m × {field.height}m
          <br />
          <strong>Type:</strong> {field.isIndoor ? "Indoor" : "Outdoor"}
          <br />
          <strong>Capacity:</strong> {field.capacity} players
          <br />
          <strong>Camera:</strong> {field.hasCamera ? "Yes" : "No"}
          <br />
          <strong>Floor Type:</strong> {field.floorType}
          <br />
          <strong>All Days:</strong> {(field.allDays || []).join(", ")}
        </Card.Text>

        {/* FİYAT ve DURUM */}
        <Card.Text className="text-center fs-5">
          <strong>${field.pricePerHour}/hour</strong>
          <span
            className="ms-5"
            style={{ color: isAvailable ? "green" : "red" }}
          >
            {isAvailable ? "Available" : "Closed"}
          </span>
        </Card.Text>

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
