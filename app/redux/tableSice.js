
import { BE_API_HOST } from '@env';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addLoading } from './globalSlice';

// Initial state
const initialState = {
    tables: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getTables = createAsyncThunk('table/getTables', async (token, { dispatch }) => {
    dispatch(addLoading(true));
    try {
        const response = await axios.get(`${BE_API_HOST}/table`, {
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
        dispatch(addLoading(false));
        console.error('Error: ', error);
    }
});
export const addTable = createAsyncThunk('table/addTable', async (param, { dispatch }) => {
    const { setRefreshData, dataInput, token } = param
    setRefreshData(true);
    try {
        const response = await axios.post(`${BE_API_HOST}/table/add`, dataInput, {
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(addTablesState(response.data.data))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
});
export const updateTable = createAsyncThunk('table/updateTable', async (param, { dispatch }) => {
    const { id, setRefreshData, dataInput, token } = param
    setRefreshData(true);
    try {
        const response = await axios.post(`${BE_API_HOST}/table/update?id=${id}`, dataInput, {
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(updateTablesState(response.data.data))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
    } catch (error) {
        setRefreshData(false)
        console.error('Error: ', error);
    }
});
export const deleteTable = createAsyncThunk('table/deleteTable', async (param, { dispatch }) => {
    const { id, setRefreshData, token } = param
    setRefreshData(true);
    try {
        const response = await axios.delete(`${BE_API_HOST}/table/delete?id=${id}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        if (response.status === 200) {
            setRefreshData(false);
            dispatch(deleteTablesState(id))
        } else {
            setRefreshData(false)
            console.error('Response not okay');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
});

const tableSlice = createSlice({
    name: 'tablesReducer',
    initialState,
    reducers: {
        addTablesState: (state, action) => {
            if (!Array.isArray(state.tables)) {
                state.tables = [];
            }
            // Menambahkan menu ke dalam state.tables
            state.tables.push(action.payload);
        },
        updateTablesState: (state, action) => {
            const { id } = action.payload;
            const index = state.tables.findIndex(menu => menu.id === id);
            if (index !== -1) {
                state.tables[index] = {
                    ...state.tables[index],
                    ...action.payload,
                };
            }
        },
        deleteTablesState: (state, action) => {
            const current = [...state.tables];
            const filter = current.filter((item) => item.id !== action.payload)
            state.tables = filter
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTables.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTables.fulfilled, (state, action) => {
                state.loading = false;
                state.tables = action.payload.data;
            })
            .addCase(getTables.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export const { addTablesState, deleteTablesState, updateTablesState } = tableSlice.actions;
export default tableSlice.reducer;