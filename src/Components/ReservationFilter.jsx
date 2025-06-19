import {
  Card,
  Col,
  Button,
  Dropdown,
  ButtonGroup,
  ListGroup,
} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { format, parseISO, isSameWeek, isSameMonth } from "date-fns";
import { getReservations } from "../api/ReservationApi"; // API'den rezervasyonları çekmek için fonksiyon

function ReservationFilter({ fields }) {
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reservations, setReservations] = useState([]);

  // API'den rezervasyonları çek
  useEffect(() => {
    async function fetchReservations() {
      try {
        const selected = fields.find((f) => f.name === selectedField);
        const fieldId = selected?.id ?? null;
        const data = await getReservations(fieldId);

        // slotStart'ı ayır: tarih, saat
        const enriched = data.map((r) => {
          const dateObj = new Date(r.slotStart);
          return {
            ...r,
            date: format(dateObj, "yyyy-MM-dd"),
            time: format(dateObj, "HH:mm"),
            fieldName: selected?.name || `Saha ${r.fieldId}`,
            status: r.status,
            price: r.priceTotal,
          };
        });

        setReservations(enriched);
      } catch (err) {
        console.error("Rezervasyonları çekerken hata:", err);
      }
    }

    fetchReservations();
  }, [selectedField, fields]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const filteredReservations = reservations.filter((res) => {
    const resDate = parseISO(res.slotStart);

    if (filterType === "day" && selectedDate) {
      return res.date === format(selectedDate, "yyyy-MM-dd");
    }

    if (filterType === "week" && selectedDate) {
      return isSameWeek(resDate, selectedDate, { weekStartsOn: 1 });
    }

    if (filterType === "month" && selectedDate) {
      return isSameMonth(resDate, selectedDate);
    }

    return true;
  });

  return (
    <Col>
      <Card className="m-4 shadow">
        <h5 className="ps-3 py-2">Filtre</h5>
        <Card.Body>
          <Dropdown as={ButtonGroup} className="me-2">
            <Button variant="warning">{selectedField || "Saha adı"}</Button>
            <Dropdown.Toggle split variant="warning" id="dropdown-saha" />
            <Dropdown.Menu>
              {fields.map((field) => (
                <Dropdown.Item
                  key={field.id}
                  onClick={() => setSelectedField(field.name)}
                >
                  {field.name}
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => setSelectedField(null)}>
                Tüm Sahalar
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button
            variant="success"
            className="me-2"
            onClick={() => {
              setFilterType("all");
              setSelectedDate(null);
            }}
          >
            Tüm zamanlar
          </Button>

          <Button
            variant="success"
            className="me-2"
            onClick={() => {
              setFilterType("day");
              setShowDatePicker(true);
            }}
          >
            Günlük
          </Button>

          <Button
            variant="success"
            className="me-2"
            onClick={() => {
              setFilterType("week");
              setShowDatePicker(true);
            }}
          >
            Haftalık
          </Button>

          <Button
            variant="success"
            className="me-2"
            onClick={() => {
              setFilterType("month");
              setShowDatePicker(true);
            }}
          >
            Aylık
          </Button>

          {showDatePicker && (
            <div className="mt-3">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                placeholderText="Tarih seçin"
              />
            </div>
          )}
        </Card.Body>
      </Card>

      <Card className="m-4 shadow">
        <Card.Header>
          <div className="row text-muted fw-bold">
            <div className="col">Saha</div>
            <div className="col">Tarih</div>
            <div className="col">Saat</div>
            <div className="col">Durum</div>
            <div className="col">Ücret</div>
          </div>
        </Card.Header>

        <ListGroup variant="flush">
          {filteredReservations.map((res) => (
            <ListGroup.Item key={res.id}>
              <div className="row align-items-center">
                <div className="col">{res.fieldName}</div>
                <div className="col">{res.date}</div>
                <div className="col">{res.time}</div>
                <div className="col">{res.status}</div>
                <div className="col">{res.price} ₺</div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </Col>
  );
}

export default ReservationFilter;
