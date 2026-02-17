// src/features/users/usersService.js
import axios from "../../api/axios"; // same as your context

const API_URL = "/manager";

const getUsers = async () => {
  const res = await axios.get(`${API_URL}/list`);
  return res.data.data;
};

const addUser = async (payload) => {
  await axios.post(`${API_URL}/create`, payload);
  return true; // just to trigger refresh
};

const updateUser = async (id, payload) => {
  await axios.put(`${API_URL}/update/${id}`, payload);
  return true; // just to trigger refresh
};

const deleteUser = async (id) => {
  await axios.delete(`${API_URL}/delete/${id}`);
  return true; // just to trigger refresh
};

const usersService = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
};

export default usersService;
