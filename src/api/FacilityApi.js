// services/facilityService.js
import axios from "axios";

const API_URL = "http://localhost:5021/api/Facilities";

export const getFacilities = async () => {
    const {data} = await axios.get(API_URL);
    return  data;
};
export async function updateFacility(id, facilityData) {
    const { data } = await axios.put(`${API_URL}/${id}`, facilityData);
    return data;
}

export const createField = async (field) => {
    const { data } = await axios.post(API_URL, field);
    return data;
};