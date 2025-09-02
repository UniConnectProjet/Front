import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AuthProvider from './auth/AuthProvider';
import reportWebVitals from './reportWebVitals';
import { ToastProvider } from './components/molecules/ToastProvider/ToastProvider';

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ToastProvider position="top-right" max={4}>
      <App />
    </ToastProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
