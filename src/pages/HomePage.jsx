import React, { useState,useEffect } from "react";
import { Container, Row, Col, Card, Button, Nav } from "react-bootstrap";
//import { useFieldContext } from "../Components/FieldContext"; // Import the context
import { getAllFields } from "../api/FieldsApi"; // API'den saha verilerini almak için fonksiyon
import { Offcanvas } from "react-bootstrap";



function HomePage() {
  //const { fields } = useFieldContext(); // Access fields from context
  //const [selectedField, setSelectedField] = useState(
  //  fields[0]?.name || "Saha 1"
  //);
const [showSidebar, setShowSidebar] = useState(false);

const handleCloseSidebar = () => setShowSidebar(false);
const handleShowSidebar = () => setShowSidebar(true);


const [field, setField] = useState([]);
const [selectedField, setSelectedField] = useState("Saha 1");

useEffect(() => {
  const fetchFields = async () => {
    try {
      const response = await getAllFields(); // API'den veriyi al
      setField(response); // response.data olabilir, getFields nasıl yazıldığına bağlı
      setSelectedField(response[0]?.name || "Saha 1");
    } catch (error) {
      console.error("Saha verisi alınamadı:", error);
    }
  };

  fetchFields();
}, []);

  const [selectedDate, setSelectedDate] = useState(new Date());

  // 📅 Tarih formatlayan fonksiyon
  const formatDate = (date) => {
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      weekday: "long",
    });
  };

  // 🔙 Bir gün geri git
  const handlePreviousDate = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 1);
      return newDate;
    });
  };

  // 🔜 Bir gün ileri git
  const handleNextDate = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 1);
      return newDate;
    });
  };

  const timeSlots = [
    { time: "13:00", status: "Geçmiş" },
    { time: "14:00", status: "Geçmiş" },
    { time: "15:00", status: "Dolu" },
    { time: "16:00", status: "Dolu" },
    { time: "17:00", status: "Boş" },
    { time: "18:00", status: "Boş" },
    { time: "19:00", status: "Boş" },
    { time: "20:00", status: "Boş" },
    { time: "21:00", status: "Boş" },
    { time: "22:00", status: "Boş" },
    { time: "23:00", status: "Boş" },
    { time: "24:00", status: "Boş" },
  ];

  const matches = [
    { time: "13:00", teams: "Galatasaray - Fenerbahçe", saha: "1" },
    { time: "14:00", teams: "Galatasaray - Fenerbahçe", saha: "1" },
    { time: "15:00", teams: "Galatasaray - Fenerbahçe", saha: "1" },
    { time: "16:00", teams: "Beşiktaş - Trabzonspor", saha: "2" },
    { time: "17:00", teams: "Adana Demir - Başakşehir", saha: "3" },
    { time: "18:00", teams: "Konyaspor - Antalyaspor", saha: "1" },
    { time: "19:00", teams: "Gaziantep - Sivasspor", saha: "2" },
    { time: "20:00", teams: "Kayserispor - Alanyaspor", saha: "3" },
    { time: "21:00", teams: "Hatayspor - Giresunspor", saha: "1" },
  ];

  return (
    <Container
      style={{ marginTop: "20px" }}
    >
      <Row>
        <Col md={4}>
          {/* Sol Kısım */}

          <Card
            border="primary"
            style={{ backgroundColor: "#f5f5f5" }}
            className="p-3 rounded"
          >
            {/* Tarih Seçme Butonu */}
            <div className="d-flex justify-content-center mb-3">
              <Button
                variant="light"
                className="rounded-pill px-3 me-2"
                onClick={handlePreviousDate}
              >
                {"<"}
              </Button>
              <span className="fw-bold" style={{ fontSize: 18 }}>
                {formatDate(selectedDate)}
              </span>
              <Button
                variant="light"
                className="rounded-pill px-3 ms-2"
                onClick={handleNextDate}
              >
                {">"}
              </Button>
            </div>

            {/* Scrollable Maç Listesi */}
            <div
              style={{ maxHeight: "600px", overflowY: "auto", fontSize: 18 }}
            >
              {matches.map((match, index) => (
                <Card key={index} className="mb-2 p-2">
                  <b>{match.time}</b>{" "}
                  <span>
                    {match.teams} --- Saha: {field.name}
                  </span>
                </Card>
              ))}
            </div>
          </Card>
        </Col>
        <Col md={8}>
          {/* Sağ Kısım */}
          <Card
            border="primary"
            style={{
              height: "685px",
              backgroundColor: "#f5f5f5",
            }}
            className="p-4 rounded"
          >
            <Nav
              className="justify-content-center"
              style={{ fontSize: 15 }}
              variant="tabs"
              defaultActiveKey={selectedField}
            >
              {field.map((field) => (
                <Nav.Item key={field.id}>
                  <Nav.Link
                    eventKey={field.name}
                    onClick={() => setSelectedField(field.name)}
                    className="text-center"
                  >
                    {field.name}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
            <h4 className="text-center mt-3">Seçili Saha: {selectedField}</h4>
            <div className="d-flex justify-content-center my-2">
              <Button
                variant="light"
                className="rounded-pill px-3 me-2"
                onClick={handlePreviousDate}
              >
                {"<"}
              </Button>
              <span className="fw-bold" style={{ fontSize: 18 }}>
                {formatDate(selectedDate)}
              </span>
              <Button
                variant="light"
                className="rounded-pill px-3 ms-2"
                onClick={handleNextDate}
              >
                {">"}
              </Button>
            </div>
            
            <div
              style={{ maxHeight: "600px", overflowY: "auto", overflowX: "hidden", fontSize: 18 }}
            >
            <Row>
              {timeSlots.map((slot) => (
                <Col xs={4} key={slot.time} className="mb-2 text-center">
                  <Card
                    className={`p-2 ${
                      slot.status === "Dolu"
                        ? "bg-danger text-white"
                        : slot.status === "Geçmiş"
                        ? "bg-warning"
                        : "bg-light"
                    }`}
                    style={{ fontSize: "18px" }}
                  >
                    <b>{slot.time}</b>
                    <br />
                    <span style={{ fontSize: "18px" }}>{slot.status}</span>
                  </Card>
                </Col>
              ))}
            </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
