// src/features/products/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productsService } from "./productsService";
import axios from "../../api/axios";
/* ================= ASYNC ================= */
/* ================= EXECUTE PRODUCT API ================= */

export const executeProductThunk = createAsyncThunk(
  "products/executeProduct",
  async ({ code, payload }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/execute/${code}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);
// 🔹 ADMIN: Create product
export const createProduct = createAsyncThunk(
  "products/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await productsService.createProduct(data);
      return res.data; // newly created product
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);


// 🔹 All products (from backend only)
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (clientId, { rejectWithValue }) => {
    try {
      // ✅ client-wise products
      if (clientId) {
        const res = await productsService.getClientProducts(clientId);
        return res.data; // [{...product, subscribed:true/false}]
      }

      // ✅ fallback (admin default)
      const res = await productsService.getAllProducts();
      return res.data;

    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);


// 🔹 Subscribed products
export const fetchSubscribedProducts = createAsyncThunk(
  "products/fetchSubscribed",
  async () => {
    const res = await productsService.getSubscribed();
    return res.data; // [{_id, name, ...}]
  }
);

// 🔹 Subscribe
export const subscribeProduct = createAsyncThunk(
  "products/subscribe",
  async (productId, { dispatch }) => {
    await productsService.subscribe(productId);
    dispatch(fetchSubscribedProducts()); // 🔥 sync UI
  }
);

// 🔹 Unsubscribe
export const unsubscribeProduct = createAsyncThunk(
  "products/unsubscribe",
  async (productId, { dispatch }) => {
    await productsService.unsubscribe(productId);
    dispatch(fetchSubscribedProducts());
  }
);
// 🔹 ADMIN: Subscribe product for client
export const adminSubscribeProduct = createAsyncThunk(
  "products/adminSubscribe",
  async ({ clientId, productId }, { dispatch, rejectWithValue }) => {
    try {
      await productsService.adminSubscribe(clientId, productId);

      // 🔥 refresh client-wise table
      dispatch(fetchProducts(clientId));
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// 🔹 ADMIN: Unsubscribe product for client
export const adminUnsubscribeProduct = createAsyncThunk(
  "products/adminUnsubscribe",
  async ({ clientId, productId }, { dispatch, rejectWithValue }) => {
    try {
      await productsService.adminUnsubscribe(clientId, productId);
      dispatch(fetchProducts(clientId));
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);
export const fetchClientSubscribedProducts = createAsyncThunk(
  "products/fetchClientSubscribedProducts",
  async (clientId, { rejectWithValue }) => {
    try {
      const res = await productsService.getClientSubscribedProducts(clientId);
      return res.data; // 🔥 array of products
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);



/* ================= SLICE ================= */

const productsSlice = createSlice({
  name: "products",
  initialState: {
    list: [],                     // ✅ backend only
    subscribedProductIds: [],
    activeTab: "All",
    search: "",
    loading: false,
    executing: false,
  },
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    
          /* ---------- CREATE PRODUCT (ADMIN) ---------- */
    .addCase(createProduct.pending, (state) => {
      state.loading = true;
    })
    .addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;

      // duplicate avoid (safety)
      const exists = state.list.find(
        (p) => p._id === action.payload._id
      );

      if (!exists) {
        state.list.unshift(action.payload); // 🔥 instant admin update
      }
    })
    .addCase(createProduct.rejected, (state) => {
      state.loading = false;
    })
      
      /* ---------- ALL PRODUCTS ---------- */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

  state.list = Array.isArray(action.payload) ? action.payload : [];

  // 🔥 client-wise subscribed ids
  state.subscribedProductIds = Array.isArray(action.payload)
    ? action.payload
        .filter((p) => p.subscribed)
        .map((p) => p._id)
    : [];
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchClientSubscribedProducts.pending, (state) => {
  state.loading = true;
})

.addCase(fetchClientSubscribedProducts.fulfilled, (state, action) => {
  state.loading = false;

  // 🔥 SHOW ONLY SUBSCRIBED PRODUCTS
  state.list = Array.isArray(action.payload) ? action.payload : [];

  state.subscribedProductIds = Array.isArray(action.payload)
    ? action.payload.map((p) => p._id)
    : [];
})

.addCase(fetchClientSubscribedProducts.rejected, (state) => {
  state.loading = false;
})

      .addCase(fetchSubscribedProducts.fulfilled, (state, action) => {
        state.subscribedProductIds = Array.isArray(action.payload)
          ? action.payload
              .filter((p) => p && p._id)
              .map((p) => p._id)
          : [];
      })
      // execute API
      .addCase(executeProductThunk.pending, (state) => {
        state.executing = true;
      })
      .addCase(executeProductThunk.fulfilled, (state, action) => {
        state.executing = false;
        const { code, remainingBalance } = action.payload;
        const product = state.list.find((p) => p.code === code);
        if (product) {
          product.balance = remainingBalance;
          product.used = (product.used || 0) + 1;
        }
      })
      .addCase(executeProductThunk.rejected, (state) => {
        state.executing = false;
      })
  },
});

export const { setActiveTab, setSearch } = productsSlice.actions;

/* ================= SELECTORS ================= */

export const selectActiveTab = (state) => state.products.activeTab;
export const selectSearch = (state) => state.products.search;
export const selectSubscribedProductIds = (state) =>
  state.products.subscribedProductIds;

export const selectFilteredProducts = (state) => {
  const { list, activeTab, search } = state.products;

  return list.filter((p) => {
    const matchTab = activeTab === "All" || p.category === activeTab;
    const matchSearch = p.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    return matchTab && matchSearch;
  });
};

// 🔹 Used in ClientAppDetails
export const selectSubscribedProducts = (state) => {
  const { list, subscribedProductIds } = state.products;
  return list.filter((p) => subscribedProductIds.includes(p._id));
};

export default productsSlice.reducer;
