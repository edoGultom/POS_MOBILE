
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addLoading } from './globalSlice';
import axiosInstance from '../api/useAxios';
import useAxios from '../api/useAxios';

// Initial state
const initialState = {
    menus: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getMenu = createAsyncThunk('menu/getMenu', async (axiosInstance, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(addLoading(true));
    try {
        const result = await axiosInstance({ url: "/menu", method: "GET" })
        dispatch(addLoading(false));
        return result
    } catch (err) {
        dispatch(addLoading(false));
        console.error(err.message);
    }
});
export const addMenu = createAsyncThunk('menu/addMenu', async (param, thunkAPI) => {
    const { setRefreshData, dataInput, axiosBe } = param
    const { dispatch } = thunkAPI
    setRefreshData(true);
    try {
        const response = await axiosBe({
            url: "/menu/add",
            method: "POST",
            data: dataInput,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        setRefreshData(false);
        dispatch(addMenuState(response.data))
    } catch (error) {
        console.error('Error: ', error);
    }
});
export const updateMenu = createAsyncThunk('menu/updateMenu', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, dataInput, axiosBe } = param
    setRefreshData(true);
    try {
        const response = await axiosBe({
            url: `/menu/update?id=${id}`,
            method: "POST",
            data: dataInput,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        setRefreshData(false);
        dispatch(updateMenuState(response.data))
    } catch (error) {
        setRefreshData(false)
        console.error('Error: ', error);
    }
});
export const deleteMenu = createAsyncThunk('menu/deleteMenu', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, axiosBe } = param
    setRefreshData(true);
    try {
        const response = await axiosBe({
            url: `/menu/delete`,
            method: "DELETE",
            params: { id }
        })
        console.log(response, 'responsedelete')
        setRefreshData(false);
        dispatch(deleteMenuState(id))
    } catch (error) {
        console.error('Error: ', error);
    }
});

const menuSlice = createSlice({
    name: 'menuReducer',
    initialState,
    reducers: {
        addMenuState: (state, action) => {
            // Memastikan state.menus sudah diinisialisasi
            if (!Array.isArray(state.menus)) {
                state.menus = [];
            }
            // Menambahkan menu ke dalam state.menus
            state.menus.push(action.payload);
        },
        updateMenuState: (state, action) => {
            const { id } = action.payload;
            const index = state.menus.findIndex(menu => menu.id === id);
            if (index !== -1) {
                state.menus[index] = {
                    ...state.menus[index],
                    ...action.payload,
                };
            }
        },
        deleteMenuState: (state, action) => {
            const current = [...state.menus];
            const filter = current.filter((item) => item.id !== action.payload)
            state.menus = filter
        },
    },
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
export const { addMenuState, deleteMenuState, updateMenuState } = menuSlice.actions;
export default menuSlice.reducer;