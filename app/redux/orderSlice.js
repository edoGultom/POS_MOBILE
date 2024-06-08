
import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    CartList: [],
    loading: false,
    error: null,
};

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
    },
    extraReducers: () => { },
});
export const { addToChartList } = orderSlice.actions;
export default orderSlice.reducer;