export const selectApps = (state) => state.clientApps.apps;

export const selectCreateModal = (state) =>
  state.clientApps.showCreateModal;

export const selectSelectedApp = (state) =>
  state.clientApps.selectedApp;

export const selectAppsLoading = (state) =>
  state.clientApps.loading; 
