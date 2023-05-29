import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/rules',
        element: <></>
      },
      {
        path: '/settings',
        element: <></>
      },
      {
        path: '/help',
        element: <></>
      }
    ]
    ,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
