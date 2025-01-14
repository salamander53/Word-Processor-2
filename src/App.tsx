import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProjectPage } from './pages/ProjectPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/folder/:name',
    element: <ProjectPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;