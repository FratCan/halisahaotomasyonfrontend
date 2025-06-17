import { Card, Col, Button, Dropdown, ButtonGroup, ListGroup } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { format, parseISO, isSameWeek, isSameMonth } from "date-fns";

function ReservationFilter({fields}) {
    const [filterType, setFilterType] = useState("all");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedField, setSelectedField] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const reservations = [
        {
        id: 1,
        fieldName: "Saha 1",
        date: "2025-04-15",
        time: "18:00",
        user: "Ahmet Yılmaz",
        isPast: false,
        },
        {
        id: 2,
        fieldName: "Saha 2",
        date: "2025-04-10",
        time: "15:00",
        user: "Mehmet Kaya",
        isPast: true,
        },
        {
        id: 3,
        fieldName: "Saha 1",
        date: "2025-04-13",
        time: "12:00",
        user: "Ali Can",
        isPast: false,
        },
    ];

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setShowDatePicker(false);
    };

    const filteredReservations = reservations.filter((res) => {
        const resDate = parseISO(res.date);

        // Filtre: Saha adı eşleşmesi
        if (selectedField && res.fieldName !== selectedField) return false;

        // Filtre: Tarih tipine göre
        if (filterType === "day" && selectedDate) {
        return res.date === format(selectedDate, "yyyy-MM-dd");
        }

        if (filterType === "week" && selectedDate) {
        return isSameWeek(resDate, selectedDate, { weekStartsOn: 1 });
        }

        if (filterType === "month" && selectedDate) {
        return isSameMonth(resDate, selectedDate);
        }

        return true; // "all" durumu veya sadece saha filtre aktifse
    });

    return (
        <Col>
        <Card className="m-4 2 shadow">
            <h5 className="ps-3 py-2">Filtre</h5>
            <Card.Body>
            <Dropdown as={ButtonGroup} className="me-2">
                <Button variant="warning">{selectedField || "Saha adı"}</Button>
                <Dropdown.Toggle split variant="warning" id="dropdown-saha" />
                <Dropdown.Menu>
                {fields.map((field) => (
                    <Dropdown.Item key={field.id} onClick={() => setSelectedField(field.name)}>
                    {field.name}
                    </Dropdown.Item>
                ))}
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setSelectedField(null)}>Tüm Sahalar</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <Button variant="success" className="me-2" onClick={() => {
                setFilterType("all");
                setSelectedDate(null);
            }}>Tüm zamanlar</Button>

            <Button variant="success" className="me-2" onClick={() => {
                setFilterType("day");
                setShowDatePicker(true);
            }}>Günlük</Button>

            <Button variant="success" className="me-2" onClick={() => {
                setFilterType("week");
                setShowDatePicker(true);
            }}>Haftalık</Button>

            <Button variant="success" className="me-2" onClick={() => {
                setFilterType("month");
                setShowDatePicker(true);
            }}>Aylık</Button>

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

        <Card  className="m-4 2 shadow">
            <Card.Header>
            <div className="row text-muted fw-bold">
                <div className="col">Saha</div>
                <div className="col">Tarih</div>
                <div className="col">Saat</div>
                <div className="col">Kim Tarafından Yapıldı</div>
                <div className="col">Gerçekleşme durumu</div>
            </div>
            </Card.Header>

            <ListGroup variant="flush">
            {filteredReservations.map((res) => (
                <ListGroup.Item key={res.id}>
                <div className="row align-items-center">
                    <div className="col">{res.fieldName}</div>
                    <div className="col">{res.date}</div>
                    <div className="col">{res.time}</div>
                    <div className="col">{res.user}</div>
                    <div className="col" style={{ color: res.isPast ? "gray" : "green" }}>
                    {res.isPast ? "Gerçekleşti" : "Gerçekleşecek"}
                    </div>
                </div>
                </ListGroup.Item>
            ))}
            </ListGroup>
        </Card>
        </Col>
    );
}

export default ReservationFilter;



/*
// src/Components/ReservationFilter.jsx
import React, { useState, useEffect } from "react";
import { Card, Col, Button, Dropdown, ButtonGroup, ListGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, isSameWeek, isSameMonth } from "date-fns";
import { getReservations } from "../api/reservationsApi"; // ← implement this

function ReservationFilter({ fields }) {
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reservations, setReservations] = useState([]);

  // load real reservations
  useEffect(() => {
    async function fetchAll() {
      try {
        const data = await getReservations();
        setReservations(data);
      } catch (err) {
        console.error("Failed to load reservations:", err);
      }
    }
    fetchAll();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const filteredReservations = reservations.filter((res) => {
    const resDate = parseISO(res.date);

    // filter by field
    if (selectedField && res.fieldName !== selectedField) return false;

    // by day
    if (filterType === "day" && selectedDate) {
      return res.date === format(selectedDate, "yyyy-MM-dd");
    }

    // by week
    if (filterType === "week" && selectedDate) {
      return isSameWeek(resDate, selectedDate, { weekStartsOn: 1 });
    }

    // by month
    if (filterType === "month" && selectedDate) {
      return isSameMonth(resDate, selectedDate);
    }

    return true; // "all"
  });

  return (
    <Col>
      <Card className="m-4 shadow">
        <h5 className="ps-3 py-2">Filtre</h5>
        <Card.Body>
          <Dropdown as={ButtonGroup} className="me-2">
            <Button variant="warning">
              {selectedField || "Saha adı"}
            </Button>
            <Dropdown.Toggle split variant="warning" id="dropdown-saha" />
            <Dropdown.Menu>
              {fields.map((f) => (
                <Dropdown.Item
                  key={f.id}
                  onClick={() => setSelectedField(f.name)}
                >
                  {f.name}
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
            <div className="col">Kullanıcı</div>
            <div className="col">Durum</div>
          </div>
        </Card.Header>

        <ListGroup variant="flush">
          {filteredReservations.map((res) => (
            <ListGroup.Item key={res.id}>
              <div className="row align-items-center">
                <div className="col">{res.fieldName}</div>
                <div className="col">{res.date}</div>
                <div className="col">{res.time}</div>
                <div className="col">{res.user}</div>
                <div
                  className="col"
                  style={{ color: res.isPast ? "gray" : "green" }}
                >
                  {res.isPast ? "Gerçekleşti" : "Gerçekleşecek"}
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </Col>
  );
}

export default ReservationFilter;


<ReservationFilter fields={fields} />

*/