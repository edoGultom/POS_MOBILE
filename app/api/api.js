import axios from 'axios';
import { BE_API_HOST } from '@env';

export const axiosBackend = axios.create({
    baseURL: BE_API_HOST,
    headers: { 'Content-Type': 'application/json' }
});
