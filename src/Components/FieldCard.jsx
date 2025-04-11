// Components/FieldCard.js
import React from "react";
import { Card, Button } from "react-bootstrap";

function FieldCard({ field, onEdit, showEditButton = false }) {
  return (
    <Card bg="light" border="primary" style={{ width: "100%" }}>
      <Card.Header className="text-center" style={{ fontSize: 22, color: "black" }}>
        {field.name}
      </Card.Header>
      <Card.Body
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Card.Img variant="top" src={field.image} />
        <Card.Text className="fs-4 p-3">
          📍 {field.district} <br />
          ⏰ {field.hours} <br />
          {field.lighted ? "💡 Lighted" : "🌑 Not lighted"}
        </Card.Text>
        <Card.Text className="text-center fs-5">
          <strong>${field.price}/hour</strong>
          <span className="ms-5"
            style={{
              color: field.available ? "green" : "red",

            }}
          >
            {field.available ? "Available" : "Closed"}
          </span>
        </Card.Text>
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
