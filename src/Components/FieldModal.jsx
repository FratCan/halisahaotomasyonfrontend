import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

function FieldModal({ show, handleClose, field, onSave }) {
  // Form state'ini mevcut field verileriyle başlat
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    lightingAvailable: false,
    pricePerHour: 0,
    available: true,
    width: 0,
    height: 0,
    isIndoor: false,
    capacity: 0,
    hasCamera: false,
    floorType: "",
    openingDays: []
  });

  // Field prop değiştiğinde form verilerini güncelle
  useEffect(() => {
    if (field) {
      setFormData({
        name: field.name || "",
        startTime: field.startTime?.slice(0, 5) || "",
        endTime: field.endTime?.slice(0, 5) || "",
        lightingAvailable: field.lightingAvailable || false,
        pricePerHour: field.pricePerHour || 0,
        available: field.available ?? field.isAvailable ?? true,
        width: field.width || 0,
        height: field.height || 0,
        isIndoor: field.isIndoor || false,
        capacity: field.capacity || 0,
        hasCamera: field.hasCamera || false,
        floorType: field.floorType || "",
        openingDays: field.openingDays || []
      });
    }
  }, [field]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleDaysChange = (day) => {
    setFormData(prev => {
      const newDays = prev.openingDays.includes(day)
        ? prev.openingDays.filter(d => d !== day)
        : [...prev.openingDays, day];
      
      return { ...prev, openingDays: newDays };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Zaman formatını HH:MM:SS'e çevir
    const updatedField = {
      ...formData,
      startTime: `${formData.startTime}:00`,
      endTime: `${formData.endTime}:00`
    };
    onSave(updatedField);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Saha Düzenle: {field?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Temel Bilgiler */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formName">
                <Form.Label>Saha Adı</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formPrice">
                <Form.Label>Saatlik Ücret ($)</Form.Label>
                <Form.Control
                  type="number"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Zaman ve Aydınlatma */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formStartTime">
                <Form.Label>Açılış Saati</Form.Label>
                <Form.Control
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formEndTime">
                <Form.Label>Kapanış Saati</Form.Label>
                <Form.Control
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Check
                type="checkbox"
                label="Aydınlatma Mevcut"
                name="lightingAvailable"
                checked={formData.lightingAvailable}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Check
                type="checkbox"
                label="Saha Müsait"
                name="available"
                checked={formData.available}
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* Fiziksel Özellikler */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="formWidth">
                <Form.Label>Genişlik (m)</Form.Label>
                <Form.Control
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formHeight">
                <Form.Label>Uzunluk (m)</Form.Label>
                <Form.Control
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formCapacity">
                <Form.Label>Kapasite</Form.Label>
                <Form.Control
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Diğer Özellikler */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formFloorType">
                <Form.Label>Zemin Tipi</Form.Label>
                <Form.Select
                  name="floorType"
                  value={formData.floorType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Çim">Çim</option>
                  <option value="Sentetik Çim">Sentetik Çim</option>
                  <option value="Toprak">Toprak</option>
                  <option value="Tartan">Tartan</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formIndoor">
                <Form.Label>Mekan Tipi</Form.Label>
                <Form.Select
                  name="isIndoor"
                  value={formData.isIndoor ? "true" : "false"}
                  onChange={(e) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      isIndoor: e.target.value === "true" 
                    }))
                  }
                  required
                >
                  <option value="false">Açık</option>
                  <option value="true">Kapalı</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Check
                type="checkbox"
                label="Güvenlik Kamerası Mevcut"
                name="hasCamera"
                checked={formData.hasCamera}
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* Açık Olduğu Günler */}
          <Form.Group className="mb-3">
            <Form.Label>Açık Olduğu Günler</Form.Label>
            <div>
              {["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"].map(day => (
                <Form.Check
                  inline
                  key={day}
                  type="checkbox"
                  label={day}
                  checked={formData.openingDays.includes(day)}
                  onChange={() => handleDaysChange(day)}
                />
              ))}
            </div>
          </Form.Group>

          <Button variant="primary" type="submit">
            Kaydet
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default FieldModal;