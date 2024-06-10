
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addLoading } from './globalSlice';
import { BE_API_HOST } from '@env';
import axios from 'axios';

// Initial state
const initialState = {
    CartList: [],
    loading: false,
    error: null,
};
export const addPembayaran = createAsyncThunk('pembayaran/addPembayaran', async (properties, { dispatch }) => {
    const { data, token } = properties;
    dispatch(addLoading(true));
    try {
        const response = await axios.post(`${BE_API_HOST}/pembayaran/add`, data, {
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (response.status === 200) {
            dispatch(addLoading(false));
            console.log(response.data, 'response')
            // dispatch(deleteMenuState(id))
        } else {
            dispatch(addLoading(false));
            console.error('Response not okay');
        }
    } catch (error) {
        dispatch(addLoading(false));
        console.error('Error: ', error);
    }
});

const orderSlice = createSlice({
    name: 'orderSlice',
    initialState,
    reducers: {
        addToChartList: (state, action) => {
            const { id, harga } = action.payload;
            const existingIndex = state.CartList.findIndex(item => item.id === id);
            if (existingIndex !== -1) {
                state.CartList[existingIndex] = {
                    ...action.payload,
                    qty: state.CartList[existingIndex].qty + 1,
                    totalHarga: state.CartList[existingIndex].totalHarga + harga
                };
            } else {
                state.CartList.push({
                    ...action.payload,
                    qty: 1,
                    totalHarga: harga
                });
            }
        },
        incrementCartItemQuantity: (state, action) => {
            const item = state.CartList.find(item => item.id === action.payload);
            if (item) {
                item.qty += 1;
                item.totalHarga = item.harga * item.qty
            }
        },
        decrementCartItemQuantity: (state, action) => {
            const item = state.CartList.find(item => item.id === action.payload);
            if (item && item.qty > 1) {
                item.qty -= 1;
                item.totalHarga -= item.harga
            }
        },
    },
    extraReducers: () => { },
});
export const { addToChartList, incrementCartItemQuantity, decrementCartItemQuantity, calculateCartPrice } = orderSlice.actions;
export default orderSlice.reducer;