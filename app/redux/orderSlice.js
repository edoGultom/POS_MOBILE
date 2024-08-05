
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addLoading } from './globalSlice';
import { BE_API_HOST } from '@env';
import axios from 'axios';

// Initial state
const initialState = {
    CartList: [],
    Midtrans: null,
    orders: [],
    pasOrders: [],
    loading: false,
    error: null,
};
export const getOrders = createAsyncThunk('order/getOrders', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { status, axiosBe } = param
    try {
        const response = await axiosBe({
            url: `/order/get-orders`,
            method: "GET",
            params: { status }
        })
        dispatch(addLoading(false));
        return response
    } catch (error) {
        dispatch(addLoading(false));
        console.error('Error: ', error);
    }
});
export const getPasOrders = createAsyncThunk('order/getPasOrders', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { status, axiosBe } = param
    try {
        const response = await axiosBe({
            url: `/order/get-orders`,
            method: "GET",
            params: { status }
        })
        dispatch(addLoading(false));
        return response
    } catch (error) {
        dispatch(addLoading(false));
        console.error('Error: ', error);
    }
});
export const addOrder = createAsyncThunk('order/addOrder', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { closeModal, formData, navigation, axiosBe } = param
    dispatch(addLoading(true))
    try {
        const response = await axiosBe({
            url: "/order/add",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': 'application/json', // Adjust content type if necessary
            },
        })
        if (response.status) {
            dispatch(addLoading(false))
            closeModal();
            navigation.reset({ index: 4, routes: [{ name: 'SuccessOrder' }] });
        }
    } catch (error) {
        dispatch(addLoading(false))
        console.error('Error: ', error);
    }
});
export const addPembayaran = createAsyncThunk('pembayaran/addPembayaran', async (properties, { dispatch }) => {
    const { data, token, handleSuccess } = properties;
    dispatch(addLoading(true));
    try {
        const response = await axios.post(`${BE_API_HOST}/pembayaran/add`, data, {
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (response.status === 200) {
            const { midtrans } = response.data
            console.log(response.data, 'midtrans')
            if (midtrans !== undefined) {
                console.log(response.data.midtrans.actions, 'responseMidtrans')
                dispatch(addStateMidtrans(midtrans))
            } else {
                handleSuccess(response.data)
                console.log(response.data, 'responsePembayaran')
            }
            dispatch(addLoading(false));
        } else {
            dispatch(addLoading(false));
            console.error('Response not okay');
        }
    } catch (error) {
        dispatch(addLoading(false));
        console.error('Error: ', error);
    }
});
export const batalPembayaran = createAsyncThunk('pembayaran/batalPembayaran', async (properties, { dispatch }) => {
    const { data, token } = properties;
    dispatch(addLoading(true));
    console.log(BE_API_HOST, 'BE_API_HOST')
    try {
        const response = await axios.post(`${BE_API_HOST}/pembayaran/cancel`, data, {
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (response.status === 200) {
            // const { midtrans } = response.data
            dispatch(addLoading(false));
            console.log(response.data, 'response')
            // dispatch(addStateMidtrans(midtrans))
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
            const { id, harga, harga_ekstra, temperatur } = action.payload;
            const existingIndex = state.CartList.findIndex(item => item.id === id && item.temperatur === temperatur);
            if (action.payload.length < 1) {
                state.CartList = [];
            } else if (existingIndex !== -1) {
                state.CartList[existingIndex] = {
                    ...action.payload,
                    qty: state.CartList[existingIndex].qty + 1,
                    totalHarga: state.CartList[existingIndex].totalHarga + harga + harga_ekstra
                };
            } else {
                state.CartList.push({
                    ...action.payload,
                    qty: 1,
                    totalHarga: harga + harga_ekstra
                });
            }
        },
        incrementCartItemQuantity: (state, action) => {
            const { id, temperatur } = action.payload
            const item = state.CartList.find(item => item.id === id && item.temperatur === temperatur);
            if (item) {
                item.qty += 1;
                item.totalHarga = (item.harga + item.harga_ekstra) * item.qty
            }
        },
        decrementCartItemQuantity: (state, action) => {
            const { id, temperatur } = action.payload
            const item = state.CartList.find(item => item.id === id && item.temperatur === temperatur);
            if (item) {
                if (item.qty > 1) {
                    item.qty -= 1;
                    item.totalHarga -= (item.harga + item.harga_ekstra);
                } else {
                    state.CartList = state.CartList.filter(item => !(item.id === id && item.temperatur === temperatur));
                }
            }
        },
        addStateMidtrans: (state, action) => {
            state.Midtrans = action.payload
        },
        addToOrderHistoryListFromCart: (state, action) => {
            state.CartList = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(getOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.data ?? [];
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getPasOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(getPasOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.pasOrders = action.payload.data ?? [];
            })
            .addCase(getPasOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export const { addToChartList, incrementCartItemQuantity, decrementCartItemQuantity, calculateCartPrice, addStateMidtrans, addToOrderHistoryListFromCart } = orderSlice.actions;
export default orderSlice.reducer;