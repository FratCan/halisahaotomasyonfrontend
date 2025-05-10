// Components/FieldCard.js
import React from "react";
import { Card, Button } from "react-bootstrap";

function FieldCard({ field, onEdit,showEditButton}) {
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
          src={field.photoUrls?.[0]
            ? `http://localhost:5021/${field.photoUrls[0]}`
            : ""}
          alt={field.name}
          style={{ height: "200px", objectFit: "cover", marginBottom: "10px" }}
        />

        <Card.Text className="fs-4 p-3">
          ⏰ {field.startTime?.slice(0, 5)} - {field.endTime?.slice(0, 5)}
          <br />
          {field.lightingAvailable ? "💡 Lighted" : "🌑 Not lighted"}
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
          <strong>All Days:</strong> {(field.openingDays || []).join(", ")}
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
