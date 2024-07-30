import { BE_API_HOST } from '@env';
import axios from 'axios';

export const axBackendInstance = axios.create({
  baseURL: BE_API_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
});
