import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './lib/app-context';
import { KeyboardProvider } from './lib/keyboard';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <KeyboardProvider>
        <App />
      </KeyboardProvider>
    </AppProvider>
  </React.StrictMode>
);
