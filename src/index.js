import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FieldProvider } from "./Components/FieldContext"; // FieldProvider'ı buraya ekliyoruz
// App.js veya index.js
import "leaflet/dist/leaflet.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FieldProvider> {/* FieldProvider sadece burada bir kez kullanılmalı */}
      <App />
    </FieldProvider>
  </React.StrictMode>
);

// Performans ölçümü için
reportWebVitals();
