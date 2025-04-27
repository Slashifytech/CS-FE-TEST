import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: 'new',
  userAddedbyAdminId: "",
  userEditedbyAdminId: "",
  userDataAddedByAdmin: {},
  newUserData: {},
};

// Function to load state from localStorage
const loadStateFromLocalStorage = () => {
  const savedState = localStorage.getItem('adminState');
  if (savedState) {
    return JSON.parse(savedState);
  }
  return initialState;
};

const adminSlice = createSlice({
  name: 'admin',
  initialState: loadStateFromLocalStorage(),
  reducers: {
    setAdmin(state, action) {
      state.admin = action.payload;
      saveStateToLocalStorage(state);
    },
    setUserAddedbyAdminId(state, action) {
      state.userAddedbyAdminId = action.payload;
      saveStateToLocalStorage(state);
    },
    setUserEditedbyAdminId(state, action) {
      state.userEditedbyAdminId = action.payload;
    },
    setUserDataAddedbyAdmin(state, action) {
      state.userDataAddedByAdmin = action.payload;
      saveStateToLocalStorage(state);
    },
    setNewUserData(state, action) {
      state.newUserData = action.payload;
    },
    clearAdminState(state) {
      state.admin = initialState.admin;
      state.userAddedbyAdminId = initialState.userAddedbyAdminId;
      state.userEditedbyAdminId = initialState.userEditedbyAdminId;
      state.userDataAddedByAdmin = initialState.userDataAddedByAdmin;
      state.newUserData = initialState.newUserData;
      localStorage.setItem('adminState', JSON.stringify(initialState));
    }
  },
});

// Function to save state to localStorage
const saveStateToLocalStorage = (state) => {
  const { admin, userAddedbyAdminId, userEditedbyAdminId, userDataAddedByAdmin, newUserData } = state;
  localStorage.setItem('adminState', JSON.stringify({ admin, userAddedbyAdminId, userEditedbyAdminId, userDataAddedByAdmin, newUserData }));
};

// Export the actions
export const { setAdmin, setUserAddedbyAdminId, setUserEditedbyAdminId, setUserDataAddedbyAdmin, clearAdminState, setNewUserData } = adminSlice.actions;

// Export the reducer
export default adminSlice.reducer;
