// services/facilityService.js
import axios from "axios";

const API_URL = "http://localhost:5021/api/Facilities";

export const getFacilities = async () => {
  try {
    const {data} = await axios.get(API_URL);
    return  data;
  } catch (error) {
    console.error("Hata:", error);
  }

};

export async function updateFacility(id, facilityData) {
  const isFormData = facilityData instanceof FormData;

  const { data } = await axios.put(`${API_URL}/${id}`, facilityData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

  return data;
}


export const createFacility = async (facilityData) => {
  const formData = new FormData();

  for (const key in facilityData) {
    if (Array.isArray(facilityData[key])) {
      // Eğer dizi ise (örneğin fields, equipments)
      facilityData[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else {
      formData.append(key, facilityData[key]);
    }
  }

  try {
    const { data } = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    console.error("❌ Tesis ekleme başarısız:", error.response?.data || error.message);
    throw error;  // Hata fırlatıyoruz ki üst katmanda yakalanabilsin
  }
};


export const deleteFacility = async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
  };

  export const uploadFacilityPhotos = async (id, photoFiles) => {
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


