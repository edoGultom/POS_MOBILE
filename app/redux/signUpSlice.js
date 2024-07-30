import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../api/useAxiosBackend';
import { showMessage, storeData } from '../utils';
import { addLoading } from './globalSlice';

const initialState = {
  roles: [],
  loading: false,
  error: null,
};
export const getRoles = createAsyncThunk('user/getRoles', async (_, thunkAPI) => {
  const { dispatch } = thunkAPI;
  try {
    const response = await axiosInstance.get(`/user/roles`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Response not okay');
    }
  } catch (error) {
    console.error('Error: ', error);
  }
});
// Sign Up
export const signUpAction = createAsyncThunk(
  'post/postRegister',
  async (data, { dispatch }) => {
    dispatch(addLoading(true));
    await axiosInstance
      .post(`/user/register`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        console.log(res.data.data)
        const profile = res.data.data;
        if (res.data.status) {
          const username = profile.username;
          let formData = new FormData();
          formData.append('username', username);
          formData.append('password', data.password);
          formData.append('grant_type', 'password');
          formData.append('client_id', 'testclient');
          formData.append('client_secret', 'testpass');
          axiosInstance
            .post(`/user/login`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then(res => {
              if (res.data.access_token) {
                // const token = `${res.data.token_type} ${res.data.access_token}`;
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
                  axiosInstance
                    .post(`/upload-file/upload`, photoForUpload, {
                      headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'multipart/form-data',
                      },
                    })
                    .then(resUpload => {
                      dispatch(addLoading(false));
                      profile.profile_photo_url = resUpload.data.data.path;
                      storeData('userProfile', profile);
                      data.navigation.reset({
                        index: 0,
                        routes: [{ name: 'SuccessSignUp' }],
                      });
                    }).catch(err => {
                      console.log(err, 'err')
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
        // showMessage(err?.response?.data.message);
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
        state.roles = action.payload.data;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default signUpSlice.reducer;
