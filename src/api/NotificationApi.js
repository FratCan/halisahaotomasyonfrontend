import axios from "axios";

const API_URL = "https://halisaha.up.railway.app/api/notifications";

export const getUnreadNotifications = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        Accept: "*/*",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Bildirimler çekilemedi:", error);
    throw error;
  }
};


export const markNotificationAsRead = async (notificationId) => {
  try {
    await axios.put(`${API_URL}/${notificationId}/read`, {
      headers: {
        Accept: "*/*",
      },
    });
  } catch (error) {
    console.error("Bildirim okundu olarak işaretlenemedi:", error);
    throw error;
  }
};