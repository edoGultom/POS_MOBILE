
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
export const getUnits = createAsyncThunk('unit/getUnits', async () => {
    try {
        const response = await axiosInstance.get('/bahan-baku/units');
        return response.data.data;
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
                state.units = action.payload;
            })
            .addCase(getUnits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export default unitsSlice.reducer;