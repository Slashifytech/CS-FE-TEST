// src/app/RouteEncryptSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stringForRoute } from '../service/Genricfunc';

export const storeRouteString = createAsyncThunk(
    'routeEncrypt/storeRouteString',
    async (_, { rejectWithValue }) => {
      try {
        const result = await stringForRoute()
        return result;
      } catch (error) {
        return rejectWithValue('Failed to get route string');
      }
    }
  );
  
const RouteEncryptSlice = createSlice({
    name: 'routeEncrypt',
    initialState: {
      routeString: '',  
      status: 'idle',   // idle | loading | succeeded | failed
      error: null,
    },
   
    extraReducers: (builder) => {
      builder
        .addCase(storeRouteString.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(storeRouteString.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.routeString = action.payload;
        })
        .addCase(storeRouteString.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
export const { setStep, setFormData } = RouteEncryptSlice.actions;
export const selectStepper = (state) => state.stepper;
export default RouteEncryptSlice.reducer;



