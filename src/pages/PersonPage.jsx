import React, { useEffect, useState } from "react";
import axios from "axios";
import { update_password } from "../api/AuthApi";
import Button from "react-bootstrap/Button";
const PersonPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setError("Giriş yapmanız gerekiyor.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://halisaha.up.railway.app/api/Auth/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (err) {
        const message =
          typeof err.response?.data === "object"
            ? err.response.data.Message || "Veriler alınamadı."
            : err.response?.data || "Veriler alınamadı.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      await update_password({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage("Şifre başarıyla güncellendi.");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      const errorMessage =
        typeof err.response?.data === "object"
          ? err.response.data.Message || "Şifre güncellenirken bir hata oluştu."
          : err.response?.data || "Şifre güncellenirken bir hata oluştu.";

      setPasswordMessage(errorMessage);
    }
  };

  // Error boundary için try/catch ile sarmalayıcı bir render fonksiyonu ekle
  try {
    if (loading) return <div className="p-4">Yükleniyor...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    return (
      <div className="max-w-md mx-auto p-5 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Kişisel Bilgiler</h2>
        <div className="space-y-2 mb-5">
          <div style={{ marginBottom: "10px" }}>
            <strong>Ad:</strong> {userData.firstName}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Soyad:</strong> {userData.lastName}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Kullanıcı Adı:</strong> {userData.userName}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Email:</strong> {userData.email}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Rol:</strong> {userData.role}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Şehir:</strong> {userData.city}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>İlçe:</strong> {userData.town}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Doğum Tarihi:</strong>{" "}
            {new Date(userData.birthday).toLocaleDateString()}
          </div>
        </div>
          <br></br>
        {/* Şifre Değiştirme Bölümü */}
        <div className="mt-1">
          <h3 className="text-lg font-semibold">Şifreyi Değiştir</h3>
      <br></br>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-sm">Mevcut Şifre</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full p-1 border rounded m-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Yeni Şifre</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                className="w-full p-1 border rounded m-2"
                required
              />
            </div>
            <br></br>
            <Button variant="success" type="submit">
              Güncelle
            </Button>
          </form>
          {passwordMessage && (
            <div className="mt-2 text-green-600">{passwordMessage}</div>
          )}
        </div>
      </div>
    );
  } catch (err) {
    // Hata olursa kullanıcıya göster
    return (
      <div className="p-4 text-red-600">
        Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.
      </div>
    );
  }
};

export default PersonPage;
