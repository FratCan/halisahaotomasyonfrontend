// Components/FieldCard.js
import React from "react";
import { Card, Button } from "react-bootstrap";

function FieldCard({ field, onEdit, showEditButton = false }) {
  const isAvailable = field.available ?? field.isAvailable;
  const price = field.pricePerHour ?? field.price;
  const lighted = field.lighted ?? field.lightingAvailable;

  const baseImageUrl = "http://localhost:3000/Facilities/"; // 💡 Buraya kendi backend URL'ini yazabilirsin
  let imgSrc = "";

  if (Array.isArray(field.photos)) {
    imgSrc = field.photos.length > 0 ? baseImageUrl + field.photos[0] : null;
  } else if (typeof field.photos === "string" && field.photos !== "") {
    imgSrc = baseImageUrl + field.photos;
  } else {
    imgSrc = "https://via.placeholder.com/300x200?text=No+Image"; // Fotoğraf yoksa default resim
  }

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
          src={imgSrc}
          alt={field.name}
          style={{ height: "200px", objectFit: "cover", marginBottom: "10px" }}
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
          <strong>${price}/hour</strong>
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
