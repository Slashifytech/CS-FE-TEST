import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiurl from '../../util';

// Async thunk for fetching master data
export const fetchMasterData = createAsyncThunk(
  'masterData/fetchMasterData',
  async (type, { rejectWithValue }) => {
    try {
      const response = await apiurl.get(`/getMasterData/${type}`);
      return { type, data: response.data };
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return rejectWithValue({ type, error: error.message });
    }
  }
);

// Array of master data types
const masterDataTypes = [
  "religion",
  "profession",
  "other",
  "interest",
  "fitness",
  "education",
  "diet",
  "community",
  "country",
  "state",
  "funActivity",
];

// Initial state with dynamic keys
const initialState = masterDataTypes.reduce((acc, type) => {
  acc[type] = [];
  return acc;
}, {});

// Slice
const MasterSlice = createSlice({
  name: 'masterData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMasterData.pending, (state, action) => {
        // You can add logic here if you need to handle pending state
      })
      .addCase(fetchMasterData.fulfilled, (state, action) => {
        const { type, data } = action.payload;
        if (masterDataTypes.includes(type)) {
          state[type] = data;
        }
      })
      .addCase(fetchMasterData.rejected, (state, action) => {
        const { type, error } = action.payload;
        if (masterDataTypes.includes(type)) {
          console.error(`Failed to fetch ${type} data: ${error}`);
        }
      });
  },
});

export default MasterSlice.reducer;
