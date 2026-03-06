// features/adminClients/adminClientsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchAdminClients = createAsyncThunk(
  "adminClients/fetch",
  async () => {
    const res = await API.get("/admin/products/clients");
    return res.data;
  }
);

// ✅ ASSIGN PRODUCT
export const assignProductToClient = createAsyncThunk(
  "adminClients/assignProduct",
  async (payload, thunkAPI) => {
    try {
      const res = await API.post(
        "/admin/products/assign-product",
        payload
      );

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Assign failed"
      );
    }
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
        state.clients = action.payload;
      })
      .addCase(fetchAdminClients.rejected, (state) => {
        state.loading = false;
      })

      // ✅ ADD THIS
      .addCase(assignProductToClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignProductToClient.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignProductToClient.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default adminClientsSlice.reducer;