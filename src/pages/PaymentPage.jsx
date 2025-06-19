import React, { useState, useEffect } from "react";
import { Table, Container, Card } from "react-bootstrap";
import { getPayments } from "../api/PaymentApi";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const ownerId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (ownerId) {
          const data = await getPayments(ownerId);
          setPayments(Array.isArray(data) ? data : []);
        } else {
          setError("Kullanıcı bilgisi bulunamadı.");
        }
      } catch (error) {
        console.error("Veri çekilemedi:", error);
        setError("Ödeme bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ownerId]);

  const totalAmount = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  return (
    <Container className="my-4">
      <h2 className="mb-4 text-primary">
        <i className="bi bi-credit-card me-2"></i>Ödeme Geçmişi
      </h2>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-2">Ödeme bilgileri yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <Card className="mb-4 shadow-sm">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">Toplam Ödeme</h5>
                  <small className="text-muted">Tüm zamanlar</small>
                </div>
                <h4 className="text-success mb-0">{totalAmount}₺</h4>
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Saha</th>
                      <th>Detay</th>
                      <th>Tutar</th>
                      <th>Ödeyen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length > 0 ? (
                      payments.map((payment, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{payment.fieldName}</td>
                          <td>
                            <small className="text-muted">{payment.detail}</small>
                          </td>
                          <td className="fw-bold">{payment.amount}₺</td>
                          <td>{payment.paidBy}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          <i className="bi bi-info-circle fs-4 text-muted"></i>
                          <p className="mt-2">
                            Henüz ödeme kaydı bulunmamaktadır
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default PaymentPage;
