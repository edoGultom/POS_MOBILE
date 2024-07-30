import { AxiosRequestHeaders } from 'axios';
import { axBackendInstance } from './axios-instances'; // Make sure to import your Axios instance
import { getData } from '../utils';
import { useEffect, useState } from 'react';

const useAxiosInterceptor = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    async function refreshTokenAction() {
        const refreshTokenFromKeychain = refreshToken;

        if (!refreshTokenFromKeychain) {
            return null;
        }

        try {
            let formData = new FormData();
            formData.append('grant_type', 'refresh_token');
            formData.append('client_id', 'testclient');
            formData.append('client_secret', 'testpass');
            formData.append('refresh_token', refreshTokenFromKeychain);
            const response = await axios.post(`${BE_API_HOST}/oauth2/token`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            storeData('token', { value: response.data.access_token });
            storeData('refreshToken', { value: response.data.refresh_token });
            return response.data.access_token;
        } catch (error) {
            console.log(error, 'error get refresh token')
            return Promise.reject(error)
        }
    };

    //config
    const reqResInterceptor = (config) => {
        config.headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        return config;
    }
    const reqErrInterceptor = async (error) => Promise.reject(error);
    const resResInterceptor = async (response) => {
        return response;
    }
    const resErrInterceptor = async (error) => {
        const originalRequest = error.config;
        console.log(originalRequest, 'masukxxx')
        // if (error.response.status === 403 && !originalRequest._retry) {
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshTokenAction();
                axBackendInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                return axBackendInstance(originalRequest);
            } catch (error) {
                console.error('Token refresh failed', error);
            }
        }
        if (error.response.status === ANOTHER_STATUS_CODE) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
    }
    // end config
    useEffect(() => {
        if (accessToken === null) {
            getData('token').then((res) => {
                setAccessToken(res.value)
            })
            getData('refreshToken').then((res) => {
                setRefreshToken(res.value)
            })
        } else {
            const reqInterceptor = axBackendInstance.interceptors.request.use(
                reqResInterceptor,
                reqErrInterceptor,
            );
            const resInterceptor = axBackendInstance.interceptors.response.use(
                resResInterceptor,
                resErrInterceptor,
            );
            return () => {
                axBackendInstance.interceptors.request.eject(reqInterceptor);
                axBackendInstance.interceptors.response.eject(resInterceptor);
            }
        }
    }, [accessToken])
    return axBackendInstance;
}
export default useAxiosInterceptor;
