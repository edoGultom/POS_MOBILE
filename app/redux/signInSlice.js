import { BE_API_HOST } from '@env';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { showMessage, storeData } from '../utils';
import { addLoading } from './globalSlice';

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
        //data user
        const profile = res.data.user;
        storeData('userProfile', profile);

        //data token
        const token = `${res.data.token_type} ${res.data.access_token}`;
        storeData('token', { value: token });
        storeData('refreshToken', { value: res.data.refresh_token });

        if (profile.scope.includes('Admin')) {
          obj.navigation.reset({ index: 0, routes: [{ name: 'Admin' }] });
        } else {
          obj.navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
        }
      })
      .catch(err => {
        dispatch(addLoading(false));
        showMessage(err?.response?.data?.message);
      });
  },
);
