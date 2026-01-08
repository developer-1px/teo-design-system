import { useEffect } from 'react';
import { Layer } from '@/components/ui/Layer';
import { FloatingBar } from '@/components/ui/FloatingBar';
import { IDEPage } from '@/components/pages/IDEPage';
import { PPTPage } from '@/components/pages/PPTPage';
import { JSONPage } from '@/components/pages/JSONPage';
import { DesignPage } from '@/components/pages/DesignPage';
import { DSLDemoPage } from '@/components/pages/DSLDemoPage';
import { initializeTheme } from '@/lib/theme';
import { useApp } from '@/lib/app-context';

function App() {
  const { currentApp } = useApp();

  useEffect(() => {
    initializeTheme();
  }, []);

  const renderPage = () => {
    switch (currentApp) {
      case 'ide':
        return <IDEPage />;
      case 'ppt':
        return <PPTPage />;
      case 'notion':
        return <JSONPage />;
      case 'figma':
        return <DesignPage />;
      case 'linear':
        return <JSONPage />;
      case 'calendar':
        return <IDEPage />;
      case 'dsl':
        return <DSLDemoPage />;
      default:
        return <IDEPage />;
    }
  };

  return (
    <Layer level={0} className="flex h-screen w-screen flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderPage()}
      </div>

      {/* FloatingBar */}
      <FloatingBar />
    </Layer>
  );
}

export default App;
