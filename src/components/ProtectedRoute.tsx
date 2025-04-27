import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import store, { RootState } from '../redux/store';
import { setToken, setTokenPayload } from '../redux/authSlice';

const ProtectedRoute = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    // Nếu không có token trong Redux store, kiểm tra localStorage
    if (!token) {
      const storedToken = localStorage.getItem('token');
      const storedTokenPayload = localStorage.getItem('tokenPayload');

      if (storedToken && storedTokenPayload) {
        // Khôi phục token vào Redux store
        store.dispatch(setToken({ token: storedToken }));
        store.dispatch(
          setTokenPayload({ tokenPayload: JSON.parse(storedTokenPayload) })
        );
      }
    }
  }, [token]);

  // Kiểm tra token từ cả Redux store và localStorage
  const isAuthenticated = token || localStorage.getItem('token');

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
