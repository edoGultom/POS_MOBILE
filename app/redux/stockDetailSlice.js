
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addLoading } from './globalSlice';
import { axiosInstance } from '../api/instance';

// Initial state
const initialState = {
    details: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getDetailStok = createAsyncThunk('stock/getDetailStok', async (idTrx, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(addLoading(true));
    try {
        const response = await axiosInstance.get(`/stock/detail-stock?id=${idTrx}`);
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
export const addStok = createAsyncThunk('stock/addStock', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { setRefreshData, dataInput } = param
    setRefreshData(true);
    try {
        const response = await axiosInstance.post(`/stock/add-stock`, dataInput, {
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
export const updateStok = createAsyncThunk('stock/updateStok', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, dataInput } = param
    setRefreshData(true);
    try {
        const response = await axiosInstance.post(`/stock/update-stock?id=${id}`, dataInput, {
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
export const deleteStock = createAsyncThunk('stock/deleteStock', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData } = param
    setRefreshData(true);
    try {
        const response = await axiosInstance.delete(`/stock/delete-stock?id=${id}`);
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
                state.details = action.payload.data;
            })
            .addCase(getDetailStok.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export const { addStockState, deleteStockState, updateStockState } = stockDetailSlice.actions;
export default stockDetailSlice.reducer;