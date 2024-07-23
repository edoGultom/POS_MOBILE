
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';
import { addLoading } from './globalSlice';

// Initial state
const initialState = {
    ingridients: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getIngridients = createAsyncThunk('ingridients/getIngridients', async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(addLoading(true));
    try {
        const response = await api.get('/bahan-baku');
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
export const addIngridients = createAsyncThunk('ingridients/addIngridients', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;

    const { setRefreshData, dataInput } = param
    setRefreshData(true);
    try {

        const response = await api.post(`/bahan-baku/add`, dataInput, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(addIngridientsState(response.data.data))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
});
export const updateIngridients = createAsyncThunk('ingridients/updateIngridients', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, dataInput } = param
    setRefreshData(true);
    try {
        const response = await api.post(`/bahan-baku/update?id=${id}`, dataInput, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(updateIngridientsState(response.data.data))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
    } catch (error) {
        setRefreshData(false)
        console.error('Error: ', error);
    }
});
export const deleteIngridients = createAsyncThunk('ingridients/deleteIngridients', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData } = param
    setRefreshData(true);
    try {
        const response = await api.delete(`/bahan-baku/delete?id=${id}`);
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(deleteIngridientsState(id))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
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
                state.ingridients = action.payload.data;
            })
            .addCase(getIngridients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export const { addIngridientsState, deleteIngridientsState, updateIngridientsState } = ingridientsSlice.actions;
export default ingridientsSlice.reducer;