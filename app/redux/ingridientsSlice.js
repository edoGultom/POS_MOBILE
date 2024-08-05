
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addLoading } from './globalSlice';
import axios from 'axios';

// Initial state
const initialState = {
    ingridients: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getIngridients = createAsyncThunk('ingridients/getIngridients', async (axiosInstance, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(addLoading(true));
    try {
        const result = await axiosInstance({ url: "/bahan-baku", method: "GET" })
        dispatch(addLoading(false));
        return result;
    } catch (err) {
        dispatch(addLoading(false));
        console.error(err.message);
    }
});
export const addIngridients = createAsyncThunk('ingridients/addIngridients', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;

    const { setRefreshData, dataInput, axiosBe } = param
    setRefreshData(true);
    try {
        const response = await axiosBe({
            url: "/bahan-baku/add",
            method: "POST",
            data: dataInput,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        setRefreshData(false);
        dispatch(addIngridientsState(response.data))
    } catch (error) {
        console.error('Error: ', error);
    }
});
export const updateIngridients = createAsyncThunk('ingridients/updateIngridients', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, dataInput, axiosBe } = param
    setRefreshData(true);
    try {
        const response = await axiosBe({
            url: `/bahan-baku/update`,
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
        dispatch(updateIngridientsState(response.data))
    } catch (error) {
        setRefreshData(false)
        console.error('Error: ', error);
    }
});
export const deleteIngridients = createAsyncThunk('ingridients/deleteIngridients', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, axiosBe } = param
    setRefreshData(true);
    try {
        await axiosBe({
            url: `/bahan-baku/delete`,
            method: "DELETE",
            params: {
                id
            }
        })
        setRefreshData(false);
        dispatch(deleteIngridientsState(id))
    } catch (error) {
        console.error('Error: ', error);
    }
});

const ingridientsSlice = createSlice({
    name: 'ingridientsReducer',
    initialState,
    reducers: {
        addIngridientsState: (state, action) => {
            // Memastikan state.menus sudah diinisialisasi
            if (!Array.isArray(state.ingridients)) {
                state.ingridients = [];
            }
            // Menambahkan menu ke dalam state.ingridients
            state.ingridients.push(action.payload);
        },
        updateIngridientsState: (state, action) => {
            const { id } = action.payload;
            const index = state.ingridients.findIndex(menu => menu.id === id);
            if (index !== -1) {
                state.ingridients[index] = {
                    ...state.ingridients[index],
                    ...action.payload,
                };
            }
        },
        deleteIngridientsState: (state, action) => {
            const current = [...state.ingridients];
            const filter = current.filter((item) => item.id !== action.payload)
            state.ingridients = filter
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getIngridients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getIngridients.fulfilled, (state, action) => {
                state.loading = false;
                state.ingridients = action.payload.data ?? [];
            })
            .addCase(getIngridients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export const { addIngridientsState, deleteIngridientsState, updateIngridientsState } = ingridientsSlice.actions;
export default ingridientsSlice.reducer;