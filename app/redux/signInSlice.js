import { BE_API_HOST } from '@env';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { showMessage, storeData } from '../utils';
import { addLoading } from './globalSlice';

// Initial state
// const initialState = {
//   user: null,
//   loading: false,
//   error: null,
// };
// Async thunk for posting user data
// export const loginUser = createAsyncThunk('auth/loginUser', async (form) => {
//   let formData = new FormData();
//   formData.append('username', form.username);
//   formData.append('password', form.password);
//   formData.append('grant_type', 'password');
//   formData.append('client_id', 'testclient');
//   formData.append('client_secret', 'testpass');
//   const response = await axios.post('http://192.168.100.3:8084/user/login', formData); // Replace with your API endpoint
//   return response.data;
// });

// // User slice
// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });
// export default userSlice.reducer;

export const signInAction = createAsyncThunk(
  'post/postSignIn',
  async (obj, { dispatch }) => {
    dispatch(addLoading(true));
    const { form } = obj;
    let formData = new FormData();
    formData.append('username', form.username);
    formData.append('password', form.password);
    formData.append('grant_type', 'password');
    formData.append('client_id', 'testclient');
    formData.append('client_secret', 'testpass');

    await axios
      .post(`${BE_API_HOST}/user/login`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        dispatch(addLoading(false));
        console.log(res, 'ress');
        //data user
        const profile = res.data.user;
        storeData('userProfile', profile);

        //data token
        const token = `${res.data.token_type} ${res.data.access_token}`;
        storeData('token', { value: token });
        obj.navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
      })
      .catch(err => {
        dispatch(addLoading(false));
        showMessage(err?.response?.data?.message);
      });
  },
);
