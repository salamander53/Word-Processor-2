import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
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
import { Collections } from './pages/Collections';
import { CollectionDetail } from './components/CollectionDetail';
import { Provider } from 'react-redux';
// import {store} from './store';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/folder/:nameFolder" element={<ProjectPage />} />
          <Route
            path="/collections/:collectionId"
            element={<CollectionDetail />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
