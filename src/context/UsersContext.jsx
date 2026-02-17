import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get("/manager/list");
    setUsers(res.data.data);
  };

  const addUser = async (payload) => {
    await axios.post("/manager/create", payload);
    fetchUsers();
  };

  const updateUser = async (id, payload) => {
    await axios.put(`/manager/update/${id}`, payload);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await axios.delete(`/manager/delete/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider
      value={{ users, addUser, updateUser, deleteUser }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
