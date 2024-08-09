
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addLoading } from './globalSlice';
import { BE_API_HOST } from '@env';
import axios from 'axios';
import { showMessage } from '../utils';
import { ToastAndroid } from 'react-native';

// Initial state
const initialState = {
    CartList: [],
    Midtrans: null,
    orders: [],
    readyOrders: [],
    loading: false,
    error: null,
};
export const processOrder = createAsyncThunk('order/processOrder', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { formData, status, axiosBe, getDataOrder } = param
    dispatch(addLoading(true))
    try {
        const response = await axiosBe({
            url: "/order/process-order",
            method: "POST",
            data: formData,
            params: { status },
            headers: {
                'Content-Type': 'application/json', // Adjust content type if necessary
            },
        })
        // console.log(response, 'response'); return
        if (response.status) {
            dispatch(addLoading(false))
            getDataOrder();
        } else {
            dispatch(addLoading(false))
            showMessage(response.message);
        }
    } catch (error) {
        dispatch(addLoading(false))
        console.error('Error: ', error);
    }
});
export const readyOrder = createAsyncThunk('order/readyOrder', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { formData, status, axiosBe } = param
    dispatch(addLoading(true))
    try {
        const response = await axiosBe({
            url: "/order/ready-order",
            method: "POST",
            data: formData,
            params: { status },
            headers: {
                'Content-Type': 'application/json', // Adjust content type if necessary
            },
        })
        // console.log(response, 'response'); return
        if (response.status) {
            dispatch(addLoading(false))
            // getDataOrder();
            ToastAndroid.showWithGravity(`Success send to waiters`,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            )
        } else {
            showMessage(response.message);
        }
    } catch (error) {
        dispatch(addLoading(false))
        console.error('Error: ', error);
    }
});
export const servedOrder = createAsyncThunk('order/servedOrder', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { formData, status, axiosBe } = param
    dispatch(addLoading(true))
    try {
        const response = await axiosBe({
            url: "/order/served-order",
            method: "POST",
            data: formData,
            params: { status },
            headers: {
                'Content-Type': 'application/json', // Adjust content type if necessary
            },
        })
        // console.log(response, 'response'); return
        if (response.status) {
            dispatch(addLoading(false))
            ToastAndroid.showWithGravity(`Success served to customer`,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            )
        } else {
            showMessage(response.message);
        }
    } catch (error) {
        dispatch(addLoading(false))
        console.error('Error: ', error);
    }
});
export const getOrders = createAsyncThunk('order/getOrders', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { status, axiosBe } = param
    dispatch(addLoading(true));
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
export const getReadyOrder = createAsyncThunk('order/getReadyOrder', async (param, thunkAPI) => {
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
export const addPembayaran = createAsyncThunk('pembayaran/addPembayaran', async (properties, thunkAPI) => {
    const { data, axiosBe, navigation } = properties;
    const { dispatch } = thunkAPI;
    // console.log(data, 'xxx'); return
    dispatch(addLoading(true));
    try {
        const response = await axiosBe({
            url: "/pembayaran/add",
            method: "POST",
            data: data,
            headers: {
                'Content-Type': 'application/json', // Adjust content type if necessary
            },
        })
        // console.log(response, 'xxx'); return

        if (response.status) {
            const { midtrans, cash } = response
            if (midtrans) {
                // console.log(response.data.midtrans.actions, 'responseMidtrans')
                console.log(midtrans, 'responseMidtrans')
                dispatch(addStateMidtrans(midtrans))
            } else if (cash) {
                setTimeout(() => {
                    dispatch(addToOrderHistoryListFromCart())
                }, 1000);
                const params = {
                    cash: cash,
                    redirect: {
                        index: 21,
                        name: 'MainAppCashier'
                    }
                }
                navigation.reset({ index: 5, routes: [{ name: 'SuccessPaymentCash', params }] });
                console.log(response.data, 'cash')
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
            .addCase(getReadyOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(getReadyOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.readyOrders = action.payload.data ?? [];
            })
            .addCase(getReadyOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export const { addToChartList, incrementCartItemQuantity, decrementCartItemQuantity, calculateCartPrice, addStateMidtrans, addToOrderHistoryListFromCart } = orderSlice.actions;
export default orderSlice.reducer;