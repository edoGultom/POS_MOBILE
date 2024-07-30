
import { BE_API_HOST } from '@env';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/useAxios';
import useAxiosInterceptor from '../api/useAxiosInterceptor';

// Initial state
const initialState = {
    kategori: [],
    loading: false,
    error: null,
};

// Async thunk for posting user data
export const getKategori = createAsyncThunk('kategori/getKategori', async (axiosInstance) => {
    try {
        const result = await axiosInstance({ url: "/kategori", method: "GET" })
        return result
    } catch (err) {
        console.error(err.message);
    }
});

const kategoriSlice = createSlice({
    name: 'kategoriReducer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getKategori.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getKategori.fulfilled, (state, action) => {
                state.loading = false;
                state.kategori = action.payload.data;
            })
            .addCase(getKategori.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export default kategoriSlice.reducer;