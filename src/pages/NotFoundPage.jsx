import React from "react";

export default function NotFoundPage() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        textAlign: "center"
      }}
    >
      <h1 style={{ fontSize: "6rem", marginBottom: "1rem", color: "#dc3545" }}>404</h1>
      <p style={{ fontSize: "1.5rem", color: "#333" }}>Sayfa Bulunamadı</p>
    </div>
  );
}
