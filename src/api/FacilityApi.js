// services/facilityService.js
import axios from "axios";

const BASE_URL = "http://localhost:5021/api/Facilities";

export const getFacilities = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

export const updateFacility = async (facilityId, updatedData) => {
    const response = await axios.put(`${BASE_URL}/${facilityId}`, updatedData);
    return response.data;
};
