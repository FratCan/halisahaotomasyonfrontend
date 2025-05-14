import axios from "axios";

const API_URL = "http://localhost:5021/api/facilities";

export const getAnnouncements = async (facilityId) => {
    if (!facilityId) throw new Error("FacilityId gerekli!");

    try {
        const { data } = await axios.get(`${API_URL}/${facilityId}/announcements`);
        // Swagger'dan dönen veri zaten bir dizi, doğrudan dönebiliriz.
        // Eğer veri array değilse, boş array döndür.
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Duyuruları çekerken hata:", error);
        throw error;
    }
};

export const createAnnouncement = async (facilityId, formData) => {
    if (!facilityId) throw new Error("FacilityId gerekli!");
    try {
        const { data } = await axios.post(
            `${API_URL}/${facilityId}/announcements`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return data;
    } catch (error) {
        console.error("Duyuru oluşturulurken hata:", error);
        throw error;
    }
};

