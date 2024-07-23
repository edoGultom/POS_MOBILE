import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BE_API_HOST } from '@env'
import { getData } from '../utils';

const api = axios.create({
    baseURL: BE_API_HOST
});

api.interceptors.request.use(
    async (config) => {
        const token = await getData('token');  // Mengambil token dari AsyncStorage
        // console.log(token, 'tokns')
        if (token && token.value) {
            config.headers.Authorization = token.value;
        }
        return config;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            try {
                const response = await api.post('/user/refresh-token', {
                    params: {
                        token: refreshToken
                    }
                });
                const { token, refreshToken: newRefreshToken } = response.data;

                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('refreshToken', newRefreshToken);

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                originalRequest.headers['Authorization'] = `Bearer ${token}`;

                return api(originalRequest);
            } catch (err) {
                console.log(err, 'err')
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('refreshToken');
                useNavigation().navigate('SignIn');
            }
        }

        return Promise.reject(error);
    }
);

export default api;