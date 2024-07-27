
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addLoading } from './globalSlice';
import { axiosInstance } from '../api/instance';

// Initial state
const initialState = {
    stocks: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getTransaksiStok = createAsyncThunk('stock/getTransaksiStok', async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(addLoading(true));
    try {
        const response = await axiosInstance.get(`/stock`);
        if (response.status === 200) {
            dispatch(addLoading(false));
            return response.data;
        } else {
            dispatch(addLoading(false));
            console.error('Response not okay');
        }
    } catch (error) {
        dispatch(addLoading(false));
        console.error('Error: ', error);
    }
});
export const addTransaksiStok = createAsyncThunk('stock/addTransaksiStok', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { setRefreshData, dataInput } = param
    setRefreshData(true);
    try {
        const response = await axiosInstance.post(`/stock/add-transaction`, dataInput, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(addStockState(response.data.data))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
});
export const updateTransaksiStok = createAsyncThunk('stock/updateTransaksiStok', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, dataInput } = param
    setRefreshData(true);
    try {
        const response = await axiosInstance.post(`/stock/update-transaction?id=${id}`, dataInput, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(updateStockState(response.data.data))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
    } catch (error) {
        setRefreshData(false)
        console.error('Error: ', error);
    }
});
export const deleteStok = createAsyncThunk('stock/deleteStok', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData } = param
    setRefreshData(true);
    try {
        const response = await axiosInstance.delete(`/stock/delete-transaction?id=${id}`);
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(deleteStockState(id))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
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
                state.stocks = action.payload.data;
            })
            .addCase(getTransaksiStok.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export const { addStockState, deleteStockState, updateStockState } = stockSlice.actions;
export default stockSlice.reducer;