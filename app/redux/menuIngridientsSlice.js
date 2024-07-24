
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addLoading } from './globalSlice';
import { axiosInstance } from '../api/instance';

// Initial state
const initialState = {
    menu_ingridients: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getMenuIngridients = createAsyncThunk('menuIngridients/getMenuIngridients', async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(addLoading(true));
    try {
        const response = await axiosInstance.get('/menu-bahan-baku');
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
export const addMenuIngridients = createAsyncThunk('menuIngridients/addMenuIngridients', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;

    const { setRefreshData, dataInput } = param
    setRefreshData(true);
    try {

        const response = await axiosInstance.post(`/menu-bahan-baku/add`, dataInput, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(addMenuIngridientsState(response.data.data))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
});
export const updateMenuIngridients = createAsyncThunk('menuIngridients/updateMenuIngridients', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, dataInput } = param
    setRefreshData(true);
    try {
        const response = await axiosInstance.post(`/menu-bahan-baku/update?id=${id}`, dataInput, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(updateMenuIngridientsState(response.data.data))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
    } catch (error) {
        setRefreshData(false)
        console.error('Error: ', error);
    }
});
export const deleteMenuIngridients = createAsyncThunk('menuIngridients/deleteMenuIngridients', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData } = param
    setRefreshData(true);
    try {
        const response = await axiosInstance.delete(`/menu-bahan-baku/delete?id=${id}`);
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(deleteMenuIngridientsState(id))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
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
            state.menu_ingridients.push(action.payload);
        },
        updateMenuIngridientsState: (state, action) => {
            const { id } = action.payload;
            const index = state.menu_ingridients.findIndex(menu => menu.id === id);
            if (index !== -1) {
                state.menu_ingridients[index] = {
                    ...state.menu_ingridients[index],
                    ...action.payload,
                };
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
                state.menu_ingridients = action.payload.data;
            })
            .addCase(getMenuIngridients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export const { addMenuIngridientsState, deleteMenuIngridientsState, updateMenuIngridientsState } = menuIngridientsSlice.actions;
export default menuIngridientsSlice.reducer;