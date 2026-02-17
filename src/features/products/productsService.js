import axios from "../../api/axios";

export const productsService = {
  getAllProducts: () => axios.get("/products"),

  subscribe: (productId) =>
    axios.post("/client/products/subscribe", { productId }),

  unsubscribe: (productId) =>
    axios.delete(`/client/products/unsubscribe/${productId}`),

  getSubscribed: () =>
    axios.get("/client/products/subscribed"),

  // 🔥 CLIENT: get assigned / subscribed products
getClientSubscribedProducts: () =>
  axios.get("/client/products/subscribed"),


  /* ========= ADMIN ========= */
  createProduct: (data) =>
    axios.post("/products", data), // same controller, role based

  getAdminProducts: () =>
    axios.get("/admin/products"), // optional (admin listing)

  getClientProducts: (clientId) =>
  axios.get(`/admin/products/clients/${clientId}/products`),

  // 🔥 NEW (ADMIN SUBSCRIBE / UNSUBSCRIBE)
  adminSubscribe: (clientId, productId) =>
    axios.post("/admin/products/subscribe", {
      clientId,
      productId,
    }),

  adminUnsubscribe: (clientId, productId) =>
    axios.post("/admin/products/unsubscribe", {
      clientId,
      productId,
    }),

};
