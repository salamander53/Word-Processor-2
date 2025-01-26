import React from 'react';
import {
  createBrowserRouter,
  Route,
  Router,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProjectPage } from './pages/ProjectPage';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
// const router = createBrowserRouter([
//   {
//     path: '/home',
//     element: <HomePage />,
//   },
//   {
//     path: '/folder/:name',
//     element: <ProjectPage />,
//   },
//   {
//     path: '/',
//     element: <Login />,
//   },
// ]);

function App() {
  return (
    <>
      <ToastContainer />
      {/* <RouterProvider router={router} /> */}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/folder/:nameFolder" element={<ProjectPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
