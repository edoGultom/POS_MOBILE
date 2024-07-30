
import { BE_API_HOST } from '@env';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/useAxiosBackend';

// Initial state
const initialState = {
    units: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getUnits = createAsyncThunk('unit/getUnits', async (axiosInstance) => {
    try {
        const result = await axiosInstance({ url: "/bahan-baku/units", method: "GET" })
        return result
    } catch (error) {
        console.error(error);
    }
});

const unitsSlice = createSlice({
    name: 'unitsReducer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUnits.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUnits.fulfilled, (state, action) => {
                state.loading = false;
                state.units = action.payload.data ?? [];
            })
            .addCase(getUnits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export default unitsSlice.reducer;