import axios from "axios";

const API_URL = "https://halisaha.up.railway.app/api/comments";

export const analyzeComments = async () => {
  const token = localStorage.getItem("token"); // token'ı localStorage'dan al

  try {
    const response = await axios.post(`${API_URL}/ai-analyze`, null, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`, // 🔐 Token'ı ekle
      },
    });
    return response.data;
  } catch (error) {
    console.error("Yorum analizi başarısız:", error);
    throw error;
  }
};
