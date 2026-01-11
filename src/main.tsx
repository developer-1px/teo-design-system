import React from 'react';
import ReactDOM from 'react-dom/client';
import { KeyboardProvider } from '@/shared/lib/keyboard';
import { initializeTheme } from '@/shared/lib/theme';
import App from './app/App.tsx';
import './index.css';

// Initialize theme BEFORE React renders
// This ensures data-theme attribute is set on first paint
initializeTheme();

// Initialize IDDL Fields (Register Spec Roles)
import { registerDefaultFields } from '@/components/types/Element/Field/init-fields';
registerDefaultFields();

// Note: AppProvider moved inside App.tsx (needs to be inside Router context)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KeyboardProvider>
      <App />
    </KeyboardProvider>
  </React.StrictMode>
);
