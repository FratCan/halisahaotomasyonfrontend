// services/facilityService.js
import axios from "axios";
//http://localhost:5021/api/Facilities
const API_URL = "https://halisaha.up.railway.app/api/Facilities";

export const getFacilities = async (ownerId) => {
  //https://halisaha.up.railway.app/api/Facilities?ownerId=1
  try {
    let data;
    if (ownerId) {
      const response = await axios.get(`${API_URL}?ownerId=${ownerId}`);
      data = response.data;
      // Tek bir facility dönerse array'e sar
      return Array.isArray(data) ? data : [data];
    }
  } catch (error) {
    console.error("Tesisleri çekerken hata:", error);
    console.error("Hata mesajı:", error.response?.data || error.message);
    throw error;
  }
};


export async function updateFacility(id, facilityData) {
  const formData = new FormData();

  // Anahtarları FormData’ya ekle
  Object.keys(facilityData).forEach(key => {
    // Boş stringleri veya undefined olanları atla (sunucu hata verebilir)
    if (facilityData[key] !== undefined && facilityData[key] !== "") {
      formData.append(key, facilityData[key]);
    }
  });

  const { data } = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
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
//https://halisaha.up.railway.app/api/Facilities/1/photos
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


