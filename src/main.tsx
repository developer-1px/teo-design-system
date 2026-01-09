import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { KeyboardProvider } from '@/shared/lib/keyboard';
import { initializeTheme } from '@/shared/lib/theme';
import './index.css';

// Initialize theme BEFORE React renders
// This ensures data-theme attribute is set on first paint
initializeTheme();

// Note: AppProvider moved inside App.tsx (needs to be inside Router context)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KeyboardProvider>
      <App />
    </KeyboardProvider>
  </React.StrictMode>
);
