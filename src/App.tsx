import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { RootLayout } from './layouts/RootLayout';
import { DocsLayout } from './layouts/DocsLayout';
import { MailPage } from './features/mail/MailPage';
import { EditorPage } from './features/editor/EditorPage';
import WhyVanillaExtract from './docs/why-vanilla-extract.mdx';
import PRD from './docs/prd.mdx';
import SurfaceDoc from './docs/surface.mdx';
import SurfaceExamples from './docs/surface-examples.mdx';
import Typography from './docs/typography.mdx';
import Architecture from './docs/architecture-matrix.mdx';
import OverlayDoc from './docs/overlay.mdx';
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
            <Route path="docs" element={<DocsLayout />}>
              <Route path="why-vanilla-extract" element={<WhyVanillaExtract />} />
              <Route path="prd" element={<PRD />} />
              <Route path="surface" element={<SurfaceDoc />} />
              <Route path="surface-examples" element={<SurfaceExamples />} />
              <Route path="typography" element={<Typography />} />
              <Route path="architecture-matrix" element={<Architecture />} />
              <Route path="overlay" element={<OverlayDoc />} />
            </Route>
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
