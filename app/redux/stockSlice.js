
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addLoading } from './globalSlice';

// Initial state
const initialState = {
    stocks: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getTransaksiStok = createAsyncThunk('stock/getTransaksiStok', async (axiosInstance, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(addLoading(true));
    try {
        const result = await axiosInstance({ url: "/stock", method: "GET" })
        dispatch(addLoading(false));
        return result;
    } catch (error) {
        dispatch(addLoading(false));
        console.error('Error: ', error);
    }
});
export const addTransaksiStok = createAsyncThunk('stock/addTransaksiStok', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { setRefreshData, dataInput, axiosBe } = param
    setRefreshData(true);
    try {
        const response = await axiosBe({
            url: "/stock/add-transaction",
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
export const updateTransaksiStok = createAsyncThunk('stock/updateTransaksiStok', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, dataInput, axiosBe } = param
    setRefreshData(true);
    try {
        const response = await axiosBe({
            url: `/stock/update-transaction`,
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
export const deleteTransaksiStok = createAsyncThunk('stock/deleteTransaksiStok', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, axiosBe } = param
    setRefreshData(true);
    try {
        await axiosBe({
            url: `/stock/delete-transaction`,
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

const stockSlice = createSlice({
    name: 'stockReducer',
    initialState,
    reducers: {
        addStockState: (state, action) => {
            if (!Array.isArray(state.stocks)) {
                state.stocks = [];
            }
            // Menambahkan menu ke dalam state.stocks
            state.stocks.push(action.payload);
        },
        updateStockState: (state, action) => {
            const { id } = action.payload;
            const index = state.stocks.findIndex(stock => stock.id === id);
            if (index !== -1) {
                state.stocks[index] = {
                    ...state.stocks[index],
                    ...action.payload,
                };
            }
        },
        deleteStockState: (state, action) => {
            const current = [...state.stocks];
            const filter = current.filter((item) => item.id !== action.payload)
            state.stocks = filter
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTransaksiStok.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTransaksiStok.fulfilled, (state, action) => {
                state.loading = false;
                state.stocks = action.payload.data ?? [];
            })
            .addCase(getTransaksiStok.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export const { addStockState, deleteStockState, updateStockState } = stockSlice.actions;
export default stockSlice.reducer;