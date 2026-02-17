export const selectApprovedBalance = (state) =>
  state.balance.requests
    .filter(r => r.status === "Approved")
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);
