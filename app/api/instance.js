import { BE_API_HOST } from '@env';
import axios from 'axios';
import { getData, storeData } from '../utils';

export const axiosInstance = axios.create({
    baseURL: BE_API_HOST
});
const refreshToken = async () => {
    const refreshTokenFromKeychain = await getData('token');

    if (!refreshTokenFromKeychain) {
        return null;
    }

    try {
        let formData = new FormData();
        formData.append('username', 'admin');
        formData.append('password', '123456');
        formData.append('grant_type', 'password');
        formData.append('client_id', 'testclient');
        formData.append('client_secret', 'testpass');
        const response = await axios.post(`${BE_API_HOST}/user/refresh-token?access_token=${refreshTokenFromKeychain.value}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        storeData('token', { value: response.data.access_token });
        storeData('refreshToken', { value: response.data.refresh_token });
        return response.data.access_token;
    } catch (error) {
        console.log(error, 'error refresh');
        throw error;
    }
};
axiosInstance.interceptors.request.use(
    async (config) => {
        const tokens = await getData('token');
        if (tokens) {
            if (config.headers) {
                config.headers.Authorization = `Bearer ${tokens.value}`
            }
        }
        return config;
    }
);
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshToken()
                // console.log(newToken, 'responsex')
                axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return axiosInstance(originalRequest);
            } catch (refreshErr) {
                return Promise.reject(refreshErr)
            }
        }
        return Promise.reject(error);
    });
