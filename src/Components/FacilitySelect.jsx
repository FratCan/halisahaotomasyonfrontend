import React, { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { getFacilities } from "../api/FacilityApi";

/**
 * Reusable “Bir Tesis Seçin” dropdown.
 *
 * Props
 * ──────
 * ownerId:        number    → Tesise göre filtreler (zorunlu)
 * facilityId:     string|number|null → Şu an seçili tesis
 * onChange(id):   function  → Yeni id’yi parent’a bildirir
 */
export default function FacilitySelect({ ownerId, facilityId, onChange }) {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  /*── İlk açılışta tesisleri getir ──*/
  useEffect(() => {
    if (!ownerId) return;

    (async () => {
      try {
        const list = (await getFacilities(ownerId)) ?? [];
        setFacilities(Array.isArray(list) ? list : []);
        /* localStorage’ta id yoksa ilk tesisi otomatik seç */
        if (!facilityId && list.length) {
          const firstId = list[0].id;
          onChange(String(firstId));
          localStorage.setItem("selectedFacilityId", firstId);
        }
      } catch (e) {
        console.error("Tesisler getirilemedi:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [ownerId]);

  /*── Seçim değiştiğinde localStorage’a yaz ──*/
  const handleChange = (e) => {
    const id = e.target.value;
    onChange(id);
    localStorage.setItem("selectedFacilityId", id);
  };

  /*── Render ──*/
  if (loading)
    return (
      <Form.Group className="mb-4">
        <Form.Label>Tesisler yükleniyor…</Form.Label>
        <div>
          <Spinner animation="border" size="sm" />
        </div>
      </Form.Group>
    );

  if (!facilities.length)
    return (
      <Form.Group className="mb-4">
        <Form.Label>Kayıtlı tesis bulunamadı.</Form.Label>
      </Form.Group>
    );

  return (
    <Form.Group className="mb-4" controlId="facilitySelector">
      <Form.Label>Bir Tesis Seçin:</Form.Label>
      <Form.Select value={facilityId ?? ""} onChange={handleChange}>
        <option value="">Tesis Seçin</option>
        {facilities.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}
