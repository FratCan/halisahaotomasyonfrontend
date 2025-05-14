import axios from "axios";

const API_URL = "http://localhost:5021/api/facilities";

export const getEquipments = async (facilityId) => {
  if (!facilityId) throw new Error("FacilityId gerekli!");

  try {
    const { data } = await axios.get(`${API_URL}/${facilityId}/equipments`);
    return data;
  } catch (error) {
    console.error("Ekipmanları çekerken hata:", error);
    throw error;
  }
};


export const createEquipments = async (facilityId, equipmentsData) => {
  try {
    const formData = new FormData();

    for (const key in equipmentsData) {
      const value = equipmentsData[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString()); // boolean -> string
        } else {
          formData.append(key, value);
        }
      }
    }

    const { data } = await axios.post(
      `${API_URL}/${facilityId}/equipments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Ekipman oluşturulurken hata:", error.response?.data || error.message);
    throw error;
  }
};



export const updateEquipment = async (facilityId, equipmentId, updatedData) => {
  try {
    const { data } = await axios.put(
      `${API_URL}/${facilityId}/equipments/${equipmentId}`,
      updatedData
    );
    return data;
  } catch (error) {
    console.error("Update işlemi hatası:", error);
    throw error;
  }
};

export const deleteEquipment = async (facilityId, equipmentId) => {
  const { data } = await axios.delete(`${API_URL}/${facilityId}/equipments/${equipmentId}`);
    return data;
};
export const  updateEquipmentPhotos = async (facilityId, equipmentId, photoFile) => {
  const formData = new FormData();
  formData.append('PhotoFiles', photoFile);

  try {
    const response = await axios.put(
      `${API_URL}/${facilityId}/equipments/${equipmentId}/photos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'accept': '*/*',
        },
      }
    );
    console.log("✅ Fotoğraf güncellendi:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Fotoğraf güncelleme hatası:", error.response?.data || error.message);
    throw error;
  }
};