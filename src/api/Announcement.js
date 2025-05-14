    import axios from "axios";


    const API_URL = "http://localhost:5021/api/facilities";

    export const getAnnouncements = async (facilityId) => {
    if (!facilityId) throw new Error("FacilityId gerekli!");

    try {
        const { data } = await axios.get(`${API_URL}/${facilityId}/announcements`);
        return data;
    } catch (error) {
        console.error("Duyuruları çekerken hata:", error);
        throw error;
    }
    };

