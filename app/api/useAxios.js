import { BE_API_HOST } from '@env';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getData, storeData } from '../utils';
import { useDispatch } from 'react-redux';

const useAxios = () => {
    const [response, setResponse] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();

    const axiosInstance = axios.create({
        baseURL: BE_API_HOST,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    const refreshAuthToken = async (refreshToken) => {
        try {
            const response = await axios.post(`${BE_API_HOST}/oauth2/token`, {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: 'testclient',
                client_secret: 'testpass',
            });
            storeData('token', { value: response.data.access_token });
            storeData('refreshToken', { value: response.data.refresh_token });
            // return response.data;
            return Promise.resolve();
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    };

    axiosInstance.interceptors.request.use(
        async (config) => {
            const accessToken = await getData('token');
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken.value}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error)
        }
    )
    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const refreshToken = await getData('refreshToken');
                if (refreshToken) {
                    await refreshAuthToken(refreshToken.value);
                    await getData('token');
                    const newToken = await getData('token');
                    console.log(newToken, 'newTokenData')
                    originalRequest.headers.Authorization = `Bearer ${newToken.value}`;
                    return axiosInstance(originalRequest);
                }
            }
            return Promise.reject(error)
        }
    )

    let controller = new AbortController();
    useEffect(() => {
        return () => controller.abort()
    }, [])

    const fetchData = async ({ url, method, data = {}, params = {} }) => {
        setLoading(true);
        controller.abort();
        controller = new AbortController()
        try {
            const result = await axiosInstance({
                url,
                method,
                data,
                params,
                signal: controller.signal
            })
            if (result.status === 200) {
                return result.data
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                console.error("Request cancelled", error.message);
            } else {
                setError(error.response ? error.response.data : error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return { fetchData }
};

export default useAxios;
