import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import 'react-toastify/dist/ReactToastify.min.css';
import MainRotas from './rotas';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer />
    <BrowserRouter>
      <MainRotas />
    </BrowserRouter>
  </React.StrictMode>
);

