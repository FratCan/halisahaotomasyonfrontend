// src/api/fieldsApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5021/api/Fields';

export const getFields = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const createField = async (field) => {

  const { data } = await axios.post(API_URL, field);
  return data;
};

export const updateField = async (field) => {
  const { data } = await axios.put(`${API_URL}/${field.id}`, field);
  return data;
};

export const deleteField = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};