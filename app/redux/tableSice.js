
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addLoading } from './globalSlice';

// Initial state
const initialState = {
    tables: [],
    loading: false,
    error: null,
};
// Async thunk for posting user data
export const getTables = createAsyncThunk('table/getTables', async (axiosInstance, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(addLoading(true));
    try {
        const result = await axiosInstance({ url: "/table", method: "GET" })
        dispatch(addLoading(false));
        return result
    } catch (err) {
        dispatch(addLoading(false));
        console.error(err.message);
    }
});
export const addTable = createAsyncThunk('table/addTable', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { setRefreshData, dataInput, axiosBe } = param
    setRefreshData(true);
    try {
        const response = await axiosBe({
            url: "/table/add",
            method: "POST",
            data: dataInput,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        setRefreshData(false);
        dispatch(addTablesState(response.data))
    } catch (error) {
        setRefreshData(false);
        console.error('Error: ', error);
    }
});
export const updateTable = createAsyncThunk('table/updateTable', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, dataInput, axiosBe } = param
    setRefreshData(true);
    try {
        const response = await axiosBe({
            url: `/table/update?id=${id}`,
            method: "POST",
            data: dataInput,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        setRefreshData(false);
        dispatch(updateTablesState(response.data))
    } catch (error) {
        setRefreshData(false)
        console.error('Error: ', error);
    }
});
export const deleteTable = createAsyncThunk('table/deleteTable', async (param, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { id, setRefreshData, axiosBe } = param
    setRefreshData(true);
    try {
        const response = await axiosBe({
            url: `/table/delete?id=${id}`,
            method: "DELETE",
        })
        setRefreshData(false);
        dispatch(deleteTablesState(id))
    } catch (error) {
        setRefreshData(false)
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
                state.tables = action.payload.data ?? [];
            })
            .addCase(getTables.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export const { addTablesState, deleteTablesState, updateTablesState } = tableSlice.actions;
export default tableSlice.reducer;