import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; 
import stepperReducer from "./slices/Regslice";
import authReducer from "./slices/AuthSlice";
import popupReducer from "./slices/PopupSlice";
import redDotReducer from "./slices/notificationslice";
import formDataReducer from "./slices/formSlice";
import selectAllReducer from "./slices/selectAllSlice,jsx";
import adminReducer from "./slices/Admin"
import toggleReducer from "./slices/UpdateSlice"
import socketMiddleware from './middleware/socketMiddleware';
import chatReducer from "./slices/chatSlice";
import masterReducer from "./slices/MasterSlice";



export const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    auth: authReducer,
    formData: formDataReducer,
    popup: popupReducer,
    redDot : redDotReducer,
    selectAll: selectAllReducer,
    admin: adminReducer,
   toggle: toggleReducer,
   chat: chatReducer,
   masterData: masterReducer

  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware),
  // middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), userIdMiddleware],
});
