
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addLoading } from './globalSlice';
import axiosInstance from '../api/useAxiosBackend';

// Initial state
const initialState = {
    details: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getDetailStok = createAsyncThunk('stock/getDetailStok', async (params, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, axiosBe } = params
    dispatch(addLoading(true));
    try {
        const result = await axiosBe({
            url: "/stock/detail-stock", method: "GET",
            params: {
                id
            }
        })
        dispatch(addLoading(false));
        return result;
    } catch (error) {
        dispatch(addLoading(false));
        console.error('Error: ', error);
    }
});
export const addStok = createAsyncThunk('stock/addStock', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { setRefreshData, dataInput, axiosBe } = param
    setRefreshData(true);
    try {
        const response = await axiosBe({
            url: "/stock/add-stock",
            method: "POST",
            data: dataInput,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        setRefreshData(false);
        dispatch(addStockState(response.data))
    } catch (error) {
        console.error('Error: ', error);
    }
});
export const updateStok = createAsyncThunk('stock/updateStok', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, dataInput, axiosBe } = param
    setRefreshData(true);
    try {
        const response = await axiosBe({
            url: `/stock/update-stock`,
            method: "POST",
            data: dataInput,
            params: {
                id,
            },
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        setRefreshData(false);
        dispatch(updateStockState(response.data))
    } catch (error) {
        setRefreshData(false)
        console.error('Error: ', error);
    }
});
export const deleteStock = createAsyncThunk('stock/deleteStock', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, axiosBe } = param
    setRefreshData(true);
    try {
        await axiosBe({
            url: `/stock/delete-stock`,
            method: "DELETE",
            params: {
                id
            }
        })
        setRefreshData(false);
        dispatch(deleteStockState(id))
    } catch (error) {
        console.error('Error: ', error);
    }
});

const stockDetailSlice = createSlice({
    name: 'stockDetailReducer',
    initialState,
    reducers: {
        addStockState: (state, action) => {
            if (!Array.isArray(state.details)) {
                state.details = [];
            }
            // Menambahkan menu ke dalam state.details
            state.details.push(action.payload);
        },
        updateStockState: (state, action) => {
            const { id } = action.payload;
            const index = state.details.findIndex(stock => stock.id === id);
            if (index !== -1) {
                state.details[index] = {
                    ...state.details[index],
                    ...action.payload,
                };
            }
        },
        deleteStockState: (state, action) => {
            const current = [...state.details];
            const filter = current.filter((item) => item.id !== action.payload)
            state.details = filter
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDetailStok.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDetailStok.fulfilled, (state, action) => {
                state.loading = false;
                state.details = action.payload.data ?? [];
            })
            .addCase(getDetailStok.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export const { addStockState, deleteStockState, updateStockState } = stockDetailSlice.actions;
export default stockDetailSlice.reducer;