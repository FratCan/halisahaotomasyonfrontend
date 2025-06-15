    import axios from 'axios';

    const API_URL = 'https://halisaha.up.railway.app/api/Reservations';

    export async function getReservations(fieldId, period = "all") {
    try {
        const res = await axios.get(
        API_URL,
        {
            params: {
            fieldId: fieldId,
            period: period,
            },
            headers: {
            Accept: "*/*",
            },
        }
        );

        console.log(res.data); // rezervasyon listesi
        return res.data;
    } catch (err) {
        console.error("Rezervasyonları çekerken hata:", err);
        throw err;
    }
    }