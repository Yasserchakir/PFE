import axios from 'axios';

const API_URL = "http://localhost:5000/api/societes";

export const getAllSocietes = () => axios.get(API_URL);

export const getSocieteById = (id) => axios.get(`${API_URL}/${id}`);

export const createSociete = (data) =>
  axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

export const updateSociete = (id, data) =>
  axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

export const deleteSociete = (id) =>
  axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
