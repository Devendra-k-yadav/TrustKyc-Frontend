import { createSelector } from "@reduxjs/toolkit";

export const selectProductsState = (state) => state.products;

export const selectActiveTab = (state) => state.products.activeTab;
export const selectSearch = (state) => state.products.search;

export const selectSubscribedProductIds = (state) =>
  state.products.subscribedProductIds;

export const selectFilteredProducts = createSelector(
  [selectProductsState],
  ({ list, activeTab, search }) =>
    list.filter((p) => {
      const matchTab =
        activeTab === "All" || p.category === activeTab;
      const matchSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchTab && matchSearch;
    })
);

export const selectSubscribedProducts = createSelector(
  [selectProductsState],
  ({ list, subscribedProductIds }) =>
    list.filter((p) => subscribedProductIds.includes(p.id))
);
