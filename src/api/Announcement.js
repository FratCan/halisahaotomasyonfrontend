import axios from "axios";

const API_URL = 'https://halisaha.up.railway.app/api/announcements';
/*lokaleki "http://localhost:5021/api/facilities"*/

export const getAnnouncements = async (facilityId) => {
  if (!facilityId) throw new Error("FacilityId gerekli!");

  try {
    const { data } = await axios.get(`${API_URL}?facilityId=${facilityId}`);
    // direkt olarak array geliyor, data.data değil!
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
            `${API_URL}/${facilityId}`,
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

export const deleteAnnouncementById = async (announcementId) => {
  return axios.delete(`${API_URL}/${announcementId}`);
};


export const updateAnnouncement = async (announcementId, formData) => {
  try {
    const response = await axios.put(`${API_URL}/${announcementId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Duyuru güncellenemedi:", error);
    throw error;
  }
};

export const uploadAnnouncementPhotos = async (id, photoFiles) => {
      const formData = new FormData();
      photoFiles.forEach(file => {
        formData.append('PhotoFiles', file);
      });
    
      try {
        const { data } = await axios.put(`${API_URL}/${id}/photos`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "accept": "*/*",
          },
        });
        return data;
      } catch (error) {
        console.error("Fotoğraf yükleme hatası:", error);
        throw error;
      }
  };

