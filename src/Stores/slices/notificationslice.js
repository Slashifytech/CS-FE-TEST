import { createSlice } from "@reduxjs/toolkit";

export const redDotSlice = createSlice({
  name: "redDot",
  initialState: {
    isThere: false,
    isAdminThere: false
  },

  reducers: {
    isNotification: (state) => {
      state.isThere = true;
    },
    isNotNotification: (state) => {
      state.isThere = false;
    },
    isNotificationsState: (state, action) =>{
      state.isThere = action.payload
    },
    isAdminNotifications: (state) =>{
       state.isAdminThere = true;
    },
    isNotAdminNotifications: (state) =>{
      state.isAdminThere = false;
    },
    isAdminNotificationState: (state, action) =>{
      state.isAdminThere = action.payload;
    }
  
  },
});

export const { isNotification, isNotNotification, isNotificationsState, isAdminNotifications, isAdminNotificationState, isNotAdminNotifications } = redDotSlice.actions;
export const notificationStore = (state) => state.redDot;
export default redDotSlice.reducer;