    import { useEffect, useState } from "react";
    import Offcanvas from "react-bootstrap/Offcanvas";
    import {
    markNotificationAsRead,
    getUnreadNotifications,
    } from "../api/NotificationApi";

    const Notification = ({ show, handleClose }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
        const userId = Number(localStorage.getItem("userId"));
        if (!userId) return;

        try {
            const data = await getUnreadNotifications(userId);
            console.log("📦 Bildirimler geldi:", data);
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Bildirimler alınamadı:", error);
        }
        };

        if (show) {
        fetchNotifications();
        }
    }, [show]);

    return (
        <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        style={{
            zIndex: 9999,
            borderTopLeftRadius: "15px",
            borderBottomLeftRadius: "15px",
            overflow: "hidden",
            boxShadow: "-4px 0px 15px rgba(0,0,0,0.25)",
            width: "300px",
        }}
        >
        <Offcanvas.Header closeButton>
            <Offcanvas.Title style={{ fontWeight: "600" }}>
            Bildirimler
            </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body
            style={{
            overflowY: "auto",
            maxHeight: "calc(100vh - 100px)", // çok uzun olmasın
            padding: "1rem 1.25rem",
            }}
        >
            {notifications && notifications.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {notifications.map((noti) => (
                <li
                    key={noti.id}
                    onClick={async () => {
                    try {
                        await markNotificationAsRead(noti.id);
                        const userId = Number(localStorage.getItem("userId"));
                        const updated = await getUnreadNotifications(userId);
                        setNotifications(Array.isArray(updated) ? updated : []);
                    } catch (err) {
                        console.error("Bildirim güncellenemedi:", err);
                    }
                    }}
                    style={{
                    cursor: "pointer",
                    padding: "12px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    backgroundColor: noti.isRead ? "#f8f9fa" : "#ffe5e5",
                    borderLeft: noti.isRead
                        ? "4px solid #dee2e6"
                        : "4px solid #dc3545",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                >
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                    🔔 {noti.title || "Başlık yok"}
                    </div>
                    {noti.content && (
                    <div
                        style={{
                        fontSize: "0.9rem",
                        color: "#343a40",
                        marginTop: "2px",
                        }}
                    >
                        {noti.content}
                    </div>
                    )}

                    <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                    {new Date(noti.createdAt).toLocaleString()}
                    </div>
                </li>
                ))}
            </ul>
            ) : (
            <p>Yeni bildirim yok.</p>
            )}
        </Offcanvas.Body>
        </Offcanvas>
    );
    };

    export default Notification;
