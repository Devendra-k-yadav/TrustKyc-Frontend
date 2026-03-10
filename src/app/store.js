import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/users/usersSlice"; 
import clientReducer from "../features/client/clientSlice";
import clientAppsReducer from "../features/client/clientAppsSlice";
import productsReducer from "../features/products/productsSlice";
import trialCenterReducer from "../features/trialCenter/trialCenterSlice";
import clientReportsReducer from
  "../features/clientReports/clientReportsSlice";
  import vendorApiKeysReducer from "../features/vendorApiKeys/vendorApiKeysSlice";
  
  import adminAppReducer from "../features/appManagement/adminAppSlice";
  import adminClientsReducer from "../features/adminClients/adminClientsSlice";
  import balanceReducer from "../features/balance/balanceSlice";
  import pricingReducer from "../features/pricing/pricingSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer, 
    client: clientReducer,
    clientApps: clientAppsReducer,
    products: productsReducer,
    trialCenter: trialCenterReducer,
    clientReports: clientReportsReducer,
    vendorApiKeys: vendorApiKeysReducer,
   
    adminApps: adminAppReducer,
    adminClients: adminClientsReducer,
    balance: balanceReducer,
    pricing: pricingReducer,
  },
});

export default store;
