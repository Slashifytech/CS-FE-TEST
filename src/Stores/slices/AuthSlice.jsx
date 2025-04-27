import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from "jwt-decode";
import apiurl from '../../util';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userData: null,
    userId: null,
    onlineUser : [],
    channelId : null
  },
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        isLoggedIn: true,
        userId: action.payload.userData ? action.payload.userData._id : action.payload.userId,
        userData: action.payload.userData,
      };
    },
    setAuthTokenCookie: (state, action) => {
      // document.cookie = `authToken=${action.payload}; path=/`;
      localStorage.setItem('authToken', action.payload)
      
    },
    setOnlineUser : (state,action)=>{
      state.onlineUser = action.payload
    },
    setChannelId : (state,action)=>{
      state.channelId = action.payload
    },
    logout: (state) => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("nekoTssel-PTO");
      localStorage.removeItem("oc");
      localStorage.removeItem("ohc");
      localStorage.removeItem("os");
      return {
        ...state,
        isLoggedIn: false,
        userData: null,
        userId: null
      };
    },
  },
});

export const { setUser, setAuthTokenCookie, logout, setOnlineUser, setChannelId } = authSlice.actions;
export const userDataStore = (state) => state.auth;

export const decodeCookieAndFetchUserData = () => async (dispatch) => {
  try {
    // Retrieve JWT token from cookie
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      // Decode JWT token to get userId
      // console.log(authToken);
      const decodedUserData = jwtDecode(authToken);
      const userId = decodedUserData.id;
    
      // Fetch user data from the server
      try {
        const response = await apiurl.get(`/auth/getUser/${userId}`);
        const userData = response?.data?.user;
        if (userData.additionalDetails && userData.additionalDetails.height) {
          const heightInFeet = (userData.additionalDetails.height / 12).toFixed(1);
          userData.additionalDetails.height = parseFloat(heightInFeet);
        }
      
        if (userData.partnerPreference && userData.partnerPreference.length > 0) {
          const partnerPref = userData.partnerPreference[0]; 

      
          if (partnerPref.heightRangeStart) {
            const startFeet = (partnerPref.heightRangeStart / 12).toFixed(1);
            partnerPref.heightRangeStart = parseFloat(startFeet);
          }
      
          if (partnerPref.heightRangeEnd) {
            const endFeet = (partnerPref.heightRangeEnd / 12).toFixed(1);
            partnerPref.heightRangeEnd = parseFloat(endFeet);
          }
        }
        // Dispatch setUser action to store user data in Redux store
        dispatch(setUser({ userId, userData }));
      } catch (error) {
        if (error.message){
          localStorage.removeItem("authToken")
        }
        console.error('Error fetching user data:', error);
      }
    } else {
      // Handle case where token is empty or undefined
      console.error('Auth token is empty or undefined');
    }
  } catch (error) {
    console.error('Error decoding cookie and fetching user data:', error);
  }
  
};

export default authSlice.reducer;
