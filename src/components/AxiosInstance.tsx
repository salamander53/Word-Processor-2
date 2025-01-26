import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import store, { RootState } from '../redux/store';
import { clearAuth } from '../redux/authSlice';

const baseUrl = 'http://127.0.0.1:3000/';

const AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('Token');
  // console.log("token: ", token);
  // const token = useSelector((state: RootState) => state.auth.token);
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  } else {
    config.headers.authorization = ``;
  }
  return config;
});

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // const dispatch = useDispatch();
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem('Token');
      // store.dispatch(clearAuth());
      // window.location.href = '/';
    }
  }
);

export default AxiosInstance;
