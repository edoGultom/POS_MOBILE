import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postRefreshToken } from '../redux/tokenSlice';
import { getData } from '../utils';
import { axiosBackend } from './api';

const useAxiosBackend = () => {
    const dispatch = useDispatch();
    const { auth } = useSelector(state => state.tokenReducer);
    const [accessToken, setAccessToken] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)
    const getToken = async () => {
        try {
            const res = await getData('token');
            setAccessToken(res.value);
        } catch (error) {
            console.error('Failed to get access token:', error);
        }
    };

    const getRefreshToken = async () => {
        try {
            const res = await getData('refreshToken');
            setRefreshToken(res.value);
        } catch (error) {
            console.error('Failed to get refresh token:', error);
        }
    };

    useEffect(() => {
        if (accessToken === null) {
            getToken()
        }
        if (refreshToken === null) {
            getRefreshToken()
        }
    }, []);


    useEffect(() => {
        if (auth) {
            setAccessToken(auth.access_token);
            setRefreshToken(auth.refresh_token);
        }
    }, [auth]);

    // useEffect(() => {
    //   if (accessToken) {
    //     axiosBackend.interceptors.request.use(
    //       (config) => {
    //         if (!config.headers['Authorization']) {
    //           config.headers['Authorization'] = `Bearer ${accessToken}`;
    //         }
    //         return config;
    //       },
    //       (error) => Promise.reject(error)
    //     );
    //   }

    //   axiosBackend.interceptors.response.use(
    //     (response) => response,
    //     async (error) => {
    //       if (refreshToken) {
    //         const prevRequest = error?.config;
    //         if (error?.response?.status === 401 && !prevRequest?.sent) {
    //           prevRequest.sent = true;
    //           const param = { refToken: refreshToken };
    //           await dispatch(postRefreshToken(param));
    //           prevRequest.headers['Authorization'] =
    //             `Bearer ${accessToken}`;

    //           return axiosBackend(prevRequest);
    //         }
    //         console.log('err:', error)
    //         return Promise.reject(error);
    //       }
    //     }
    //   );
    //   return () => {
    //     // axiosBackend.interceptors.request.eject(requestIntercept);
    //     // axiosBackend.interceptors.response.eject(responseIntercept);
    //   };
    // }, [accessToken, refreshToken, dispatch]);
    if (accessToken) {
        console.log(accessToken, 'navigation')
        axiosBackend.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }
    return axiosBackend;
};

export default useAxiosBackend;
