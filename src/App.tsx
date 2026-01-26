import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { RootLayout } from './layouts/RootLayout';
import { MailPage } from './features/mail/MailPage';
import { EditorPage } from './features/editor/EditorPage';
import './App.css'; // Just for global side effects

function AppContent() {
  const { themeClass } = useTheme();

  return (
    <div className={themeClass}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Navigate to="/mail" replace />} />
            <Route path="mail" element={<MailPage />} />
            <Route path="editor" element={<EditorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App;
