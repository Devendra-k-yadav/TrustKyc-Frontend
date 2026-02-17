import api from "../../api/axios";

// GET all pricing
export const fetchPricing = () =>
  api.get("/pricing");

// CREATE
export const createPricingApi = (data) =>
  api.post("/pricing/create", data);

// UPDATE
export const updatePricingApi = (id, data) =>
  api.put(`/pricing/update/${id}`, data);

// DELETE
export const deletePricingApi = (id) =>
  api.delete(`/pricing/delete/${id}`);
