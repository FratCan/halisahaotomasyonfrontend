// services/facilityService.js
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

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

  // Fotoğraf varsa ekle
  if (facilityData.logoFile instanceof File) {
    formData.append("PhotoFiles", facilityData.logoFile);
  }

  // Token
  const token = localStorage.getItem("token");

  // Elle PascalCase olarak tüm alanları ekle (createFacility ile aynı yapıda)
  formData.append("OwnerId", facilityData.ownerId);
  formData.append("Name", facilityData.name);
  formData.append("Email", facilityData.email);
  formData.append("AddressDetails", facilityData.addressDetails);
  formData.append("Phone", facilityData.phone);
  formData.append("BankAccountInfo", facilityData.bankAccountInfo);
  formData.append("City", facilityData.city);
  formData.append("Town", facilityData.town);
  formData.append("Description", facilityData.description);
  formData.append("HasLockableCabinet", facilityData.hasLockableCabinet);
  formData.append("HasLockerRoom", facilityData.hasLockerRoom);
  formData.append("HasFirstAid", facilityData.hasFirstAid);
  formData.append("HasSecurityCameras", facilityData.hasSecurityCameras);
  formData.append("HasRefereeService", facilityData.hasRefereeService);
  formData.append("HasCafeteria", facilityData.hasCafeteria);
  formData.append("HasShower", facilityData.hasShower);
  formData.append("HasToilet", facilityData.hasToilet);
  formData.append("HasTransportService", facilityData.hasTransportService);
  formData.append("HasParking", facilityData.hasParking);
formData.append("LogoFile", facilityData.logoFile);
formData.append("Rating", facilityData.rating);
  // Güncelleme isteği
  const { data } = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}



export const createFacility = async (facilityData) => {
  const formData = new FormData();

  // Alan adlarını PascalCase olarak elle ekliyoruz
  formData.append("OwnerId", facilityData.ownerId);
  formData.append("Name", facilityData.name);
  formData.append("Email", facilityData.email);
  formData.append("AddressDetails", facilityData.addressDetails);
  formData.append("Phone", facilityData.phone);
  formData.append("BankAccountInfo", facilityData.bankAccountInfo);
  formData.append("Latitude", facilityData.latitude);
  formData.append("Longitude", facilityData.longitude);
  formData.append("City", facilityData.city);
  formData.append("Town", facilityData.town);
  formData.append("Description", facilityData.description);
  formData.append("LogoFile", "");
  formData.append("HasLockableCabinet", facilityData.hasLockableCabinet);
  formData.append("HasLockerRoom", facilityData.hasLockerRoom);
  formData.append("HasFirstAid", facilityData.hasFirstAid);
  formData.append("HasSecurityCameras", facilityData.hasSecurityCameras);
  formData.append("HasRefereeService", facilityData.hasRefereeService);
  formData.append("HasCafeteria", facilityData.hasCafeteria);
  formData.append("HasShower", facilityData.hasShower);
  formData.append("HasToilet", facilityData.hasToilet);
  formData.append("HasTransportService", facilityData.hasTransportService);
  formData.append("HasParking", facilityData.hasParking);

  // Eğer ekipmanlar varsa JSON string olarak gönder
  facilityData.equipments.forEach((item, index) => {
    formData.append(`Equipments[${index}]`, JSON.stringify(item));
  });
  console.log("form:", formData);
 

  // Boş bile olsa sunucu null hata vermesin diye
  formData.append("PhotoFiles", ""); 

  try {
    const token = localStorage.getItem("token");
 console.log("token:", token);
    const { data } = await axios.post(
      "https://halisaha.up.railway.app/api/Facilities",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.error("❌ Tesis ekleme başarısız:", error.response?.data || error.message);
    throw error;
  }
};


export const deleteFacility = async (id) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

//https://halisaha.up.railway.app/api/Facilities/1/photos

export const uploadFacilityPhotos = async (facilityId, formData) => {
  const token = localStorage.getItem("token");
  

  try {
    const response = await axios.put(
      `https://halisaha.up.railway.app/api/Facilities/${facilityId}/photos`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ Token buraya eklendi
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Fotoğraf yükleme hatası:", error);
    throw error;
  }
};

