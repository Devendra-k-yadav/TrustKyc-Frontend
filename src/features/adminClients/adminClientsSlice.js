// features/adminClients/adminClientsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchAdminClients = createAsyncThunk(
  "adminClients/fetch",
  async () => {
    const res = await axios.get("/admin/products/clients"); // ✅ FIX
    return res.data;
  }
);


const adminClientsSlice = createSlice({
  name: "adminClients",
  initialState: {
    clients: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload; // ✅ DIRECT ARRAY
      })
      .addCase(fetchAdminClients.rejected, (state) => {
        state.loading = false;
      });
  },
});


export default adminClientsSlice.reducer;
