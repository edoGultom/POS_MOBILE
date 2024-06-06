
import { BE_API_HOST } from '@env';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addLoading } from './globalSlice';

// Initial state
const initialState = {
    menus: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getMenu = createAsyncThunk('menu/getMenu', async (token, { dispatch }) => {
    dispatch(addLoading(true));
    try {
        const response = await axios.get(`${BE_API_HOST}/barang`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        if (response.status === 200) {
            dispatch(addLoading(false));
            return response.data;
        } else {
            dispatch(addLoading(false));
            console.error('Response not okay');
        }

    } catch (error) {
        console.error('Error: ', error);
    }
});

const menuSlice = createSlice({
    name: 'menuReducer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.menus = action.payload.data;
            })
            .addCase(getMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export default menuSlice.reducer;