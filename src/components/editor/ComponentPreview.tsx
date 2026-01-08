import { Layer } from '@/components/ui/Layer';
import { Suspense, lazy, ComponentType, useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface ComponentPreviewProps {
  path: string;
  filename: string;
}

// 모든 tsx/jsx 파일을 eager하게 import
const componentModules = import.meta.glob('/src/**/*.{tsx,jsx}', { eager: true });

export const ComponentPreview = ({ path, filename }: ComponentPreviewProps) => {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const module = componentModules[path] as any;

      if (!module) {
        setError('Component not found');
        return;
      }

      // default export 찾기
      if (module.default) {
        setComponent(() => module.default);
        return;
      }

      // named export 찾기 (첫 번째 컴포넌트)
      const exportedComponents = Object.keys(module).filter(
        key => typeof module[key] === 'function' && key !== 'default'
      );

      if (exportedComponents.length > 0) {
        setComponent(() => module[exportedComponents[0]]);
        return;
      }

      setError('No component export found');
    } catch (err) {
      console.error('Failed to load component:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [path]);

  if (error || !Component) {
    return (
      <Layer level={3} rounded="lg" className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-3 text-error" size={48} />
          <p className="text-text-primary font-medium mb-1">
            Cannot preview this component
          </p>
          <p className="text-text-tertiary text-sm mb-2">{filename}</p>
          {error && (
            <p className="text-xs text-error mt-2 font-mono">{error}</p>
          )}
        </div>
      </Layer>
    );
  }

  return (
    <Layer level={3} rounded="lg" className="flex-1 overflow-auto">
      {/* Preview Header */}
      <div className="sticky top-0 z-10 bg-layer-1 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-text">Component Preview</h2>
            <p className="text-xs text-text-tertiary mt-0.5">{filename}</p>
          </div>
          <div className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
            Live Preview
          </div>
        </div>
      </div>

      {/* Component Render Area */}
      <div className="p-6">
        <div className="bg-layer-0 rounded-lg p-6">
          <Component />
        </div>

        {/* Info */}
        <div className="mt-4 p-4 bg-layer-1 rounded-lg">
          <p className="text-xs text-text-tertiary">
            <strong className="text-text-secondary">Note:</strong> This is a live preview of the component.
            Some components may require props or context to render properly.
          </p>
        </div>
      </div>
    </Layer>
  );
};
