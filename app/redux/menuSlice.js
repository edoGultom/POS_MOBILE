
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../api/instance';
import { addLoading } from './globalSlice';

// Initial state
const initialState = {
    menus: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getMenu = createAsyncThunk('menu/getMenu', async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(addLoading(true));
    try {
        const response = await axiosInstance.get('/menu');
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
export const addMenu = createAsyncThunk('menu/addMenu', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;

    const { setRefreshData, dataInput } = param
    setRefreshData(true);
    try {

        const response = await axiosInstance.post(`/menu/add`, dataInput, {
            headers: {
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
export const updateMenu = createAsyncThunk('menu/updateMenu', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, dataInput } = param
    setRefreshData(true);
    try {
        const response = await axiosInstance.post(`/menu/update?id=${id}`, dataInput, {
            headers: {
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
export const deleteMenu = createAsyncThunk('menu/deleteMenu', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData } = param
    setRefreshData(true);
    try {
        const response = await axiosInstance.delete(`/menu/delete?id=${id}`);
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