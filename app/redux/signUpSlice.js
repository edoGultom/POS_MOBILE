import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { showMessage, storeData } from '../utils';
import { addLoading } from './globalSlice';
import axios from 'axios';
import { BE_API_HOST } from '@env'

const initialState = {
  roles: [],
  loading: false,
  error: null,
};
export const getRoles = createAsyncThunk('user/getRoles', async () => {
  try {
    const response = await axios.get(`${BE_API_HOST}/user/roles`);
    return response.data;
  } catch (error) {
    console.error('Errorx: ', error);
  }
});
// Sign Up
export const signUpAction = createAsyncThunk(
  'post/postRegister',
  async (data, { dispatch }) => {
    const { axiosBe } = data
    // console.log(data, 'datax'); return
    dispatch(addLoading(true));
    await axios
      .post(`${BE_API_HOST}/user/register`, data.form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        const profile = res.data.data;
        if (res.data.status) {
          const username = profile.username;
          let formData = new FormData();
          formData.append('username', username);
          formData.append('password', data.form.password);
          formData.append('grant_type', 'password');
          formData.append('client_id', 'testclient');
          formData.append('client_secret', 'testpass');
          axios
            .post(`${BE_API_HOST}/user/login`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then(res => {
              if (res.data.access_token) {
                const token = `${res.data.access_token}`;
                storeData('token', { value: token });
                // upload foto
                if (data.photo !== null) {
                  let uri = data.photo.assets[0].uri;
                  let fileExtension = uri.substr(uri.lastIndexOf('.') + 1);
                  const dataPhoto = {
                    uri: data.photo.assets[0].uri,
                    type: data.photo.assets[0].mimeType,
                    name: `avatar.${fileExtension}`
                  }
                  const photoForUpload = new FormData();
                  photoForUpload.append('imageFile', dataPhoto);

                  axios
                    .post(`${BE_API_HOST}/upload-file/upload`, photoForUpload, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                      },
                    })
                    .then(resUpload => {
                      // console.log(resUpload.data, 'resUpload.data')
                      dispatch(addLoading(false));
                      profile.profile_photo_url = resUpload.data.data.path;
                      storeData('userProfile', profile);
                      data.navigation.reset({
                        index: 0,
                        routes: [{ name: 'SuccessSignUp' }],
                      });
                    }).catch(err => {
                      console.log(err, 'errx')
                      dispatch(addLoading(false));
                      showMessage(err?.response?.data.message, 'danger');
                    });
                }
              }
            }).catch(function (error) {
              console.log('gagal login');
              dispatch(addLoading(false));
              showMessage(error);
            });
        }
      })
      .catch(err => {
        dispatch(addLoading(false));
        console.log(data, 'responsex')
        console.log(err?.response, 'err');
        showMessage(err);
      });
  },
);

const signUpSlice = createSlice({
  name: 'signUpReducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.data ?? [];
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default signUpSlice.reducer;
