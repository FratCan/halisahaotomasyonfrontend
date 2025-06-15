// src/api/fieldsApi.js
import axios from 'axios';

//lokaldekki=http://localhost:5021/api/facilities/fields
const API_URL = 'https://halisaha.up.railway.app/api/facilities/fields';



export const getAllFields = async () => {
  try {
    const {data} = await axios.get(API_URL);
    return  data;
  } catch (error) {
    console.error("Hata:", error);
  }
};


export const getFields = async (facilityId) => {
  if (!facilityId) throw new Error("FacilityId parametresi zorunludur!");

  try {
    const { data } = await axios.get(`${API_URL}?facilityId=${facilityId}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Sahaları çekerken hata oluştu:", error);
    throw error;
  }
};

export const getFieldsOwner = async (ownerId) => {
  if (!ownerId) throw new Error("OwnerId parametresi zorunludur!");

  try {
    const { data } = await axios.get(`${API_URL}?ownerId=${ownerId}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Sahaları çekerken hata oluştu:", error);
    throw error;
  }
};

export const createField = async (fieldData) => {
  try {
    const { data } = await axios.post(API_URL, fieldData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.error("❌ Saha ekleme başarısız:", error.response?.data || error.message);
    throw error;
  }
};


export const updateField = async (id,fieldData) => {
  const isFormData = fieldData instanceof FormData;

  const { data } = await axios.put(`${API_URL}/${id}`, fieldData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

  return data;
};

export const deleteField = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};

export const uploadFieldPhotos = async (id, photoFiles) => {
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