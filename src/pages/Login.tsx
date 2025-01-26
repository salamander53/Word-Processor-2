import React from 'react';
import AxiosInstance from '../components/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import store from '../redux/store';
import { setToken, setTokenPayload } from '../redux/authSlice';
import { useSelector } from 'react-redux';

function Login() {
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Lấy giá trị từ form
    const username = event.currentTarget.username.value;
    const password = event.currentTarget.password.value;
    // console.log(username, password);

    try {
      // Gọi API đăng nhập
      const response = await AxiosInstance.post('auth/login', {
        username: username,
        password: password,
      });

      // Kiểm tra nếu response có dữ liệu
      if (response.data) {
        console.log('Login response:', response.data);

        // Lưu token và tokenPayload vào Redux store
        store.dispatch(setToken({ token: response.data.token }));
        store.dispatch(
          setTokenPayload({ tokenPayload: response.data.tokenPayload })
        );

        // Chuyển hướng đến trang home
        navigate('/home');
      } else {
        console.error('No data received from the server');
        toast.error('No data received from the server');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Error during login');
    }
  };

  return (
    <div className="container">
      <div
        className="login-container mx-auto my-5 p-4 bg-white rounded shadow-sm"
        style={{ maxWidth: '400px' }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="username"
              className="form-control"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                name="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <a href="#" className="text-decoration-none">
              Forgot password?
            </a>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="mb-0">
            Don't have an account?{' '}
            <a href="#" className="text-decoration-none">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
