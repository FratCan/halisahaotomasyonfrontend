// Components/FieldCard.js
import React from "react";
import { Card, Button, Row, Col, Badge } from "react-bootstrap";
import {
  FaEdit,
  FaLightbulb,
  FaVideo,
  FaCalendarAlt,
  FaCalendarTimes,
  FaClipboardList,
  FaChair,
} from "react-icons/fa";
import { IoMdFootball } from "react-icons/io";
import { GiSoccerField } from "react-icons/gi";

const WEEK_DAYS = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

function FieldCard({ field, onEdit, showEditButton }) {
  const isAvailable = field.available ?? field.isAvailable;

  return (
    <Card
      className="shadow-sm mb-4"
      style={{
        width: "100%",
        opacity: isAvailable ? 1 : 0.85,
        transition: "all 0.3s ease",
        border: isAvailable
          ? "1px solid rgba(0, 123, 255, 0.3)"
          : "1px solid rgba(220, 53, 69, 0.3)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Card.Header
        className="text-center py-3"
        style={{
          fontSize: "1.25rem",
          color: "white",
          backgroundColor: isAvailable ? "#0d6efd" : "#dc3545",
          borderBottom: "none",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <span>{field.name}</span>
          {showEditButton && (
            <Button
              variant="light"
              onClick={onEdit}
              size="sm"
              style={{ borderRadius: "20px" }}
            >
              <FaEdit className="me-1" /> Düzenle
            </Button>
          )}
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        {/* FOTO */}
        <div style={{ position: "relative" }}>
          <Card.Img
            variant="top"
            src={
              field.photoUrls?.[0]
                ? `https://halisaha.up.railway.app/${field.photoUrls[0]}`
                : "https://via.placeholder.com/800x400?text=Saha+Görseli+Yok"
            }
            alt={field.name}
            style={{
              height: "220px",
              width: "100%",
              objectFit: "cover",
              filter: isAvailable ? "none" : "grayscale(50%)",
            }}
          />
          {!isAvailable && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "rgba(220, 53, 69, 0.9)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "20px",
                fontWeight: "bold",
              }}
            >
              KAPALI
            </div>
          )}
        </div>

        {/* BİLGİLER */}
        <div className="p-3">
          <Row className="g-3">
            {/* Sol taraf */}
            <Col md={6}>
              <div className="d-flex align-items-center mb-2">
                <GiSoccerField className="me-2" size={20} />
                <span>
                  <strong>
                    {field.width}m × {field.height}m
                  </strong>{" "}
                  (Boyut)
                </span>
              </div>

              <div className="d-flex align-items-center mb-2">
                <IoMdFootball className="me-2" size={20} />
                <span>
                  <strong>{field.floorType}</strong> (Zemin)
                </span>
              </div>

              <div className="d-flex align-items-center mb-2">
                {field.isIndoor ? (
                  <span className="badge bg-info me-2">🏠</span>
                ) : (
                  <span className="badge bg-success me-2">☀️</span>
                )}
                <span>{field.isIndoor ? "Kapalı Saha" : "Açık Saha"}</span>
              </div>

              <div className="d-flex align-items-center mb-2">
                <span className="badge bg-secondary me-2">👥</span>
                <span>
                  <strong>{field.capacity}</strong> kişi kapasite
                </span>
              </div>

              {/* Yeni eklenen: Skorboard */}
              <div className="d-flex align-items-center mb-2">
                {field.hasScoreBoard ? (
                  <FaClipboardList className="text-success me-2" size={20} />
                ) : (
                  <FaClipboardList className="text-secondary me-2" size={20} />
                )}
                <span>
                  Skorboard:{" "}
                  <strong>{field.hasScoreBoard ? "Var" : "Yok"}</strong>
                </span>
              </div>
            </Col>

            {/* Sağ taraf */}
            <Col md={6}>
              <div className="d-flex align-items-center mb-2">
                {field.lightingAvailable ? (
                  <FaLightbulb className="text-warning me-2" size={20} />
                ) : (
                  <FaLightbulb className="text-secondary me-2" size={20} />
                )}
                <span>
                  Aydınlatma:{" "}
                  <strong>{field.lightingAvailable ? "Var" : "Yok"}</strong>
                </span>
              </div>

              <div className="d-flex align-items-center mb-2">
                {field.hasCamera ? (
                  <FaVideo className="text-primary me-2" size={20} />
                ) : (
                  <FaVideo className="text-secondary me-2" size={20} />
                )}
                <span>
                  Kamera: <strong>{field.hasCamera ? "Var" : "Yok"}</strong>
                </span>
              </div>

              {/* Yeni eklenen: Tribün */}
              <div className="d-flex align-items-center mb-2">
                {field.hasTribune ? (
                  <FaChair className="text-info me-2" size={20} />
                ) : (
                  <FaChair className="text-secondary me-2" size={20} />
                )}
                <span>
                  Tribün: <strong>{field.hasTribune ? "Var" : "Yok"}</strong>
                </span>
              </div>

              <div className="d-flex align-items-center mb-2">
                <span className="badge bg-dark me-2">💰</span>
                <span>
                  <strong>{field.pricePerHour}₺</strong> / saat
                </span>
              </div>

              <div className="d-flex align-items-center mb-2">
                <span
                  className={`badge me-2 ${
                    isAvailable ? "bg-success" : "bg-danger"
                  }`}
                >
                  {isAvailable ? "✔" : "✖"}
                </span>
                <span>
                  Durum:{" "}
                  <strong>{field.isAvailable ? "Açık" : "Kapalı"}</strong>
                </span>
              </div>
            </Col>
          </Row>

          {/* ÇALIŞMA SAATLERİ VE KAPALI GÜNLER */}
          {(field.weeklyOpenings?.length > 0 ||
            field.exceptions?.length > 0) && (
            <div className="mt-4">
              <Row className="g-3">
                {field.weeklyOpenings?.length > 0 && (
                  <Col md={6}>
                    <div className="p-3 bg-light rounded">
                      <h6 className="d-flex align-items-center mb-3">
                        <FaCalendarAlt className="me-2 text-primary" />
                        <strong>Çalışma Saatleri</strong>
                      </h6>
                      <div className="d-flex flex-wrap gap-2">
                        {field.weeklyOpenings.map((w, idx) => {
                          const dayName =
                            WEEK_DAYS[w.dayOfWeek] ?? `${w.dayOfWeek}`;
                          return (
                            <Badge
                              key={idx}
                              bg="light"
                              text="dark"
                              className="border border-primary"
                              style={{ borderRadius: "8px" }}
                            >
                              {dayName}: {w.startTime?.slice(0, 5)}-
                              {w.endTime?.slice(0, 5)}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </Col>
                )}

                {/* Kapalı Günler */}
                {field.exceptions?.length > 0 && (
                  <Col md={6}>
                    <div className="p-3 bg-light rounded">
                      <h6 className="d-flex align-items-center mb-3">
                        <FaCalendarTimes className="me-2 text-danger" />
                        <strong>Kapalı Günler</strong>
                      </h6>
                      <div className="d-flex flex-wrap gap-2">
                        {field.exceptions.map((ex, idx) => (
                          <Badge
                            key={idx}
                            bg="light"
                            text="dark"
                            className="border border-danger"
                            style={{ borderRadius: "8px" }}
                          >
                            {new Date(ex.date).toLocaleDateString("tr-TR")}
                            {ex.isOpen ? " (Açık)" : " (Kapalı)"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default FieldCard;
