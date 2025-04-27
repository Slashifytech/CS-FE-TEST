// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isToggle: false,
};

const toggleSlice = createSlice({
  name: 'toggle',
  initialState,
  reducers: {
    setIsToggle(state) {
      state.isToggle = !state.isToggle;
    },
  },
});

// Export the actions
export const { setIsToggle } = toggleSlice.actions;

// Export the reducer
export default toggleSlice.reducer;
