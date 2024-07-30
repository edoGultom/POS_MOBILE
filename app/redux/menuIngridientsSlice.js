
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addLoading } from './globalSlice';
import axiosInstance from '../api/useAxiosBackend';

// Initial state
const initialState = {
    menu_ingridients: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getMenuIngridients = createAsyncThunk('menuIngridients/getMenuIngridients', async (axiosInstance, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(addLoading(true));
    try {
        const result = await axiosInstance({ url: "/menu-bahan-baku", method: "GET" })
        dispatch(addLoading(false));
        return result;

    } catch (error) {
        dispatch(addLoading(false));
        console.error('Error: ', error);
    }
});
export const addMenuIngridients = createAsyncThunk('menuIngridients/addMenuIngridients', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { setRefreshData, dataInput, axiosBe } = param
    setRefreshData(true);
    try {
        const response = await axiosBe({
            url: "/menu-bahan-baku/add",
            method: "POST",
            data: dataInput,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        setRefreshData(false);
        dispatch(addMenuIngridientsState(response.data))

    } catch (error) {
        console.error('Error: ', error);
    }
});
export const updateMenuIngridients = createAsyncThunk('menuIngridients/updateMenuIngridients', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, dataInput, axiosBe } = param
    setRefreshData(true);
    try {
        const response = await axiosBe({
            url: `/menu-bahan-baku/update?id=${id}`,
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
        dispatch(updateMenuIngridientsState(response.data))
    } catch (error) {
        setRefreshData(false)
        console.error('Error: ', error);
    }
});
export const deleteMenuIngridients = createAsyncThunk('menuIngridients/deleteMenuIngridients', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, axiosBe } = param
    setRefreshData(true);
    try {
        await axiosBe({
            url: `/menu-bahan-baku/update`,
            method: "DELETE",
            params: {
                id,
            },
        })
        setRefreshData(false);
        dispatch(deleteMenuIngridientsState(id))
    } catch (error) {
        console.error('Error: ', error);
    }
});

const menuIngridientsSlice = createSlice({
    name: 'menuIngridientsReducer',
    initialState,
    reducers: {
        addMenuIngridientsState: (state, action) => {
            if (!Array.isArray(state.menu_ingridients)) {
                state.menu_ingridients = [];
            }
            const { id_menu } = action.payload;
            const index = state.menu_ingridients.findIndex(menu => menu.id === id_menu);
            if (index !== -1) {
                state.menu_ingridients[index].list_bahan_baku.push(action.payload)
            }
        },
        updateMenuIngridientsState: (state, action) => {
            const { id, id_menu } = action.payload;
            const menuItem = state.menu_ingridients.find(item => item.id === id_menu);
            if (menuItem) {
                const bahanBaku = menuItem.list_bahan_baku.find(b => b.id === id);
                if (bahanBaku) {
                    Object.assign(bahanBaku, action.payload);
                }
            }
        },
        deleteMenuIngridientsState: (state, action) => {
            const current = [...state.menu_ingridients];
            const updatedData = current.map(item => {
                return {
                    ...item,
                    list_bahan_baku: item.list_bahan_baku.filter(bahan => bahan.id !== action.payload)
                };
            });
            state.menu_ingridients = updatedData
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMenuIngridients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMenuIngridients.fulfilled, (state, action) => {
                state.loading = false;
                state.menu_ingridients = action.payload.data ?? [];
            })
            .addCase(getMenuIngridients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export const { addMenuIngridientsState, deleteMenuIngridientsState, updateMenuIngridientsState } = menuIngridientsSlice.actions;
export default menuIngridientsSlice.reducer;