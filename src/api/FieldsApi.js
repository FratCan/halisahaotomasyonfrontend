// src/api/fieldsApi.js
import axios from 'axios';

//lokaldekki=http://localhost:5021/api/facilities/fields
const API_URL = 'https://halisaha.up.railway.app/api/facilities/fields ';



export const getAllFields = async () => {
  try {
    const {data} = await axios.get(API_URL);
    return  data;
  } catch (error) {
    console.error("Hata:", error);
  }
};


export const getFields = async (facilityId) => {
  if (!facilityId) throw new Error("FieldId gerekli!");
//(`${API_URL}/${fieldId}`);
    try {
        const { data } = await axios.get(`${API_URL}?facilityId=${facilityId}`);//
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Sahaları çekerken hata:", error);
        throw error;
    }
};
export const createField = async (fieldData) => {
  const formData = new FormData();

  for (const key in fieldData) {
    if (Array.isArray(fieldData[key])) {
      // Eğer dizi ise (örneğin fields, equipments)
      fieldData[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else {
      formData.append(key, fieldData[key]);
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
    console.error("❌ Saha ekleme başarısız:", error.response?.data || error.message);
    throw error;  // Hata fırlatıyoruz ki üst katmanda yakalanabilsin
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