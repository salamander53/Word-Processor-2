import React from 'react';
import AxiosInstance from '../components/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import store from '../redux/store';
import { setToken } from '../redux/authSlice';
import { useSelector } from 'react-redux';

function Login() {
  const navigate = useNavigate();
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    // console.log('Email:', email, 'Password:', password);
    // Thêm logic xử lý đăng nhập tại đây
    AxiosInstance.post(`auth/login`, {
      username: username,
      password: password,
    })
      .then((response) => {
        console.log(response);
        // localStorage.setItem('Token', response.data);
        store.dispatch(setToken({ token: response.data.token }));
        if (response.data) {
          navigate(`/home`);
        } else {
          toast.error('Login failed!');
        }
      })
      .catch((error) => {
        console.error('Error during login', error);
        toast.error('Error during login');
      })
      .finally(() => {
        // Ẩn toast "Loading..." khi nhận được response hoặc khi gặp lỗi
        // toast.dismiss(loadingToastId);
        // setLoading(false);
      });
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
