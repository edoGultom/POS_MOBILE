import { BE_API_HOST } from '@env';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { showMessage, storeData } from '../utils';
import { addLoading } from './globalSlice';

// // Sign Up
export const signUpAction = createAsyncThunk(
  'post/postRegister',
  async (data, { dispatch }) => {
    await axios
      .post(`${BE_API_HOST}/user/register`, data)
      .then(res => {
        const profile = res.data.data;
        if (res.data.status) {
          const username = profile.username;
          let formData = new FormData();
          formData.append('username', username);
          formData.append('password', data.password);
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
                const token = `${res.data.token_type} ${res.data.access_token}`;
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
                        Authorization: `${token}`,
                        'Content-Type': 'multipart/form-data',
                      },
                    })
                    .then(resUpload => {
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
        console.log(err, 'err');
        showMessage(err);
      });
  },
);