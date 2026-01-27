import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { RootLayout } from './layouts/RootLayout';
import { DocsLayout } from './layouts/DocsLayout';
import 'highlight.js/styles/github-dark.css';
import { MailPage } from './features/mail/MailPage';
import { EditorPage } from './features/editor/EditorPage';
import { SlidesPage } from './features/slides/SlidesPage';
import BuilderPage from './features/admin/BuilderPage';
import { DashboardPage } from './features/admin/DashboardPage';
import { ListPage } from './features/admin/ListPage';
import { AdminLayout } from './features/admin/AdminLayout';
import './App.css'; // Just for global side effects

// Auto-import all MDX files recursively
const mdxPages = import.meta.glob('/src/docs/**/*.mdx', { eager: true });

const docsRoutes = Object.keys(mdxPages).map((path) => {
  const slug = path.split('/').pop()?.replace('.mdx', '');
  const Component = (mdxPages[path] as any).default;
  return { path: slug, Component };
}).sort((a, b) => (a.path || '').localeCompare(b.path || ''));

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Navigate to="/mail" replace />} />
          <Route path="mail" element={<MailPage />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="slides" element={<SlidesPage />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<ListPage />} />
            <Route path="builder" element={<BuilderPage />} />
          </Route>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="docs" element={<DocsLayout />}>
            {docsRoutes.length > 0 && (
              <Route index element={<Navigate to={docsRoutes[0].path!} replace />} />
            )}
            {docsRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
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
