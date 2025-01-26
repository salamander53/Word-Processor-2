import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import store, { RootState } from '../redux/store';

const ProtectedRoute = () => {
  //   const token = localStorage.getItem('Token');
  // const token = store.getState().auth.token;
  // console.log(token);
  // const state = store.getState();
  // console.log('Updated state:', state);
  const token = useSelector((state: RootState) => state.auth.token);
  console.log('Token from Redux:', token);

  return token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
