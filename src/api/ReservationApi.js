import axios from "axios";

const API_URL = "https://halisaha.up.railway.app/api/Reservations";

export async function getReservations(fieldId = null, period = "all") {
  try {
    const res = await axios.get(API_URL, {
      params: {
        fieldId,
        period,
      },
      headers: {
        Accept: "*/*",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Rezervasyonları çekerken hata:", err);
    throw err;
  }
}
