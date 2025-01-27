import axios from 'axios';
import store from '../redux/store'; // Import store từ Redux
import { clearAuth } from '../redux/authSlice'; // Import action để xóa auth

const baseUrl = 'http://127.0.0.1:3000/';

// Tạo Axios instance
const AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

// Interceptor để thêm token vào header trước khi gửi request
AxiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.token; // Lấy token từ Redux store
  if (token) {
    config.headers.authorization = `Bearer ${token}`; // Thêm token vào header
  } else {
    delete config.headers.authorization; // Xóa authorization header nếu không có token
  }
  if (config.data?.compressedContent) {
    config.data.compressedContent = new Uint8Array(
      config.data.compressedContent
    );
    config.headers['Content-Encoding'] = 'gzip';
  }
  return config;
});

// Interceptor để xử lý response
AxiosInstance.interceptors.response.use(
  (response) => {
    return response; // Trả về response nếu không có lỗi
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xử lý lỗi 401 (Unauthorized)
      store.dispatch(clearAuth()); // Xóa thông tin auth khỏi Redux store
      window.location.href = '/'; // Chuyển hướng về trang đăng nhập
    }
    return Promise.reject(error); // Trả về lỗi để xử lý tiếp
  }
);

export default AxiosInstance;
