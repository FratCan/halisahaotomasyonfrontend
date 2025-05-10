import axios from "axios";

const API_URL = "http://localhost:5021/api/facilities";

export const getEquipments = async (facilityId) => {
  try {
    const { data } = await axios.get(`${API_URL}/${facilityId}/equipments`);
    return data;
  } catch (error) {
    console.error("Hata:", error);
    throw error; // Hatanın üst kata fırlatılması iyi olur, catch'leyen olursa
  }
};

export const createEquipments = async (facilityId, equipmentsData) => {
  try {
    const formData = new FormData();

    for (const key in equipmentsData) {
      if (Array.isArray(equipmentsData[key])) {
        equipmentsData[key].forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, equipmentsData[key]);
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
    console.error("Ekipman oluşturulurken hata:", error);
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
  try {
    const { data } = await axios.delete(
      `${API_URL}/${facilityId}/equipments/${equipmentId}`
    );
    return data;
  } catch (error) {
    console.error("Silme işlemi hatası:", error);
    throw error;
  }
};