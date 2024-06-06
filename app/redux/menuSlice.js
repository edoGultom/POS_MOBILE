
import { BE_API_HOST } from '@env';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addLoading } from './globalSlice';

// Initial state
const initialState = {
    menus: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getMenu = createAsyncThunk('menu/getMenu', async (token, { dispatch }) => {
    dispatch(addLoading(true));
    try {
        const response = await axios.get(`${BE_API_HOST}/barang`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        if (response.status === 200) {
            dispatch(addLoading(false));
            return response.data;
        } else {
            dispatch(addLoading(false));
            console.error('Response not okay');
        }

    } catch (error) {
        console.error('Error: ', error);
    }
});
export const addMenu = createAsyncThunk('menu/addMenu', async (param, { dispatch }) => {
    const { setRefreshData, dataInput, token } = param
    setRefreshData(true);
    try {
        const response = await axios.post(`${BE_API_HOST}/barang/add`, dataInput, {
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(addMenuState(response.data.data))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
});
export const updateMenu = createAsyncThunk('menu/updateMenu', async (param, { dispatch }) => {
    const { id, setRefreshData, dataInput, token } = param
    setRefreshData(true);
    console.log(dataInput, 'dataInput')
    try {
        const response = await axios.post(`${BE_API_HOST}/barang/update?id=${id}`, dataInput, {
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(updateMenuState(response.data.data))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
    } catch (error) {
        setRefreshData(false)
        console.error('Error: ', error);
    }
});
export const deleteMenu = createAsyncThunk('menu/deleteMenu', async (param, { dispatch }) => {
    const { id, setRefreshData, token } = param
    setRefreshData(true);
    try {
        const response = await axios.delete(`${BE_API_HOST}/barang/delete?id=${id}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(deleteMenuState(id))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
});

const menuSlice = createSlice({
    name: 'menuReducer',
    initialState,
    reducers: {
        addMenuState: (state, action) => {
            state.menus = [...state.menus, action.payload]
        },
        updateMenuState: (state, action) => {
            const newData = state.menus.map(item => {
                if (item.id === action.payload.id) {
                    return { ...item, ...action.payload };
                }
                return item;
            });
            state.menus = newData
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