
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  auth: null,
  loading: false,
  error: null,
};
export const postRefreshToken = createAsyncThunk('token/refreshToken', async (param, thunkAPI) => {
  const { dispatch } = thunkAPI;
  const { refToken } = param
  try {
    const response = await axios.post(`${BE_API_HOST}/oauth2/token`, {
      grant_type: 'refresh_token',
      refresh_token: refToken,
      client_id: 'testclient',
      client_secret: 'testpass',
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data, 'responsssssss')
    dispatch(addAuth(response.data))
    return Promise.resolve();
  } catch (error) {
    console.error('Error When Refresh Token:  ', error);
    return Promise.reject(error);
  }
});
const tokenSlice = createSlice({
  name: 'tokenReducer',
  initialState,
  reducers: {
    addAuth: (state, action) => {
      state.auth.action.payload
    },

  },
  extraReducers: (builder) => { },
});
export const { addAuth, } = tokenSlice.actions;
export default tokenSlice.reducer;