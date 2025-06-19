import axios from "axios";

const API_URL = "https://halisaha.up.railway.app/api/rooms/payments";

export const getPayments = async (ownerId) => {
  try {
    let data;
    if (ownerId) {
      const response = await axios.get(`${API_URL}?ownerId=${ownerId}`);
      data = response.data;
      // Eğer tek bir ödeme dönüyorsa array'e sar
      return Array.isArray(data) ? data : [data];
    }
  } catch (error) {
    console.error("Ödemeleri çekerken hata:", error);
    console.error("Hata mesajı:", error.response?.data || error.message);
    throw error;
  }
};
