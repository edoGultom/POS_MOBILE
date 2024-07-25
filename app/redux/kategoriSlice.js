
import { BE_API_HOST } from '@env';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../api/instance';

// Initial state
const initialState = {
    kategori: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getKategori = createAsyncThunk('kategori/getKategori', async () => {
    try {
        const response = await axiosInstance.get('/kategori');
        return response.data.data;
    } catch (error) {
        console.error(error);
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
                state.kategori = action.payload;
            })
            .addCase(getKategori.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export default kategoriSlice.reducer;