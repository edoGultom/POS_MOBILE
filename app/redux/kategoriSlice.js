
import { BE_API_HOST } from '@env';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/useAxios';

// Initial state
const initialState = {
    kategori: [],
    subKategori: [],
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

export const getSubKategori = createAsyncThunk('subKategori/getSubKategori', async (axiosBe, thunkAPI) => {
    try {
        const result = await axiosBe({ url: `/kategori/sub`, method: "GET" })
        return result
    } catch (err) {
        console.error(err.message);
    }
});
export const getSubKategoriById = createAsyncThunk('subKategori/getSubKategori', async (param, thunkAPI) => {
    try {
        const { id, axiosBe } = param
        const result = await axiosBe({ url: `/kategori/sub-by-id?id=${id}`, method: "GET" })
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
            })

            .addCase(getSubKategori.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSubKategori.fulfilled, (state, action) => {
                state.loading = false;
                state.subKategori = action.payload.data;
            })
            .addCase(getSubKategori.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export default kategoriSlice.reducer;