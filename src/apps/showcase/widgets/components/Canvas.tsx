/**
 * Storybook-style Canvas
 *
 * 격리된 컴포넌트 렌더링 영역:
 * - 배경 (투명, 흰색, 다크, 격자)
 * - 줌
 * - 반응형 뷰포트
 * - 패딩
 * - 측정 도구
 */

import type {
  ComponentMetadata,
  FileTreeNode,
  PropValue,
} from '@/apps/showcase/widgets/parser/types';
import { Block } from '@/components/types/Block/Block.tsx';
import { Text } from '@/components/types/Element/Text/Text';
import { ComponentRenderer } from './ComponentRenderer';
import { ErrorBoundary } from './ErrorBoundary';
import type { BackgroundType, ViewportSize } from './Toolbar';

interface CanvasProps {
  node: FileTreeNode | null;
  propValues: Record<string, PropValue>;
  zoom: number;
  background: BackgroundType;
  viewport: ViewportSize;
  showGrid: boolean;
  showMeasure: boolean;
}

const viewportWidths: Record<ViewportSize, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '1280px',
  full: '100%',
};

export function Canvas({
  node,
  propValues,
  zoom,
  background,
  viewport,
  showGrid,
  showMeasure,
}: CanvasProps) {
  const metadata = node?.metadata || null;

  // 배경 스타일
  const getBackgroundStyle = (): React.CSSProperties => {
    switch (background) {
      case 'light':
        return { backgroundColor: '#ffffff' };
      case 'dark':
        return { backgroundColor: '#1a1a1a' };
      case 'transparent':
        return {
          backgroundImage:
            'linear-gradient(45deg, #f5f5f5 25%, transparent 25%, transparent 75%, #f5f5f5 75%, #f5f5f5), linear-gradient(45deg, #f5f5f5 25%, transparent 25%, transparent 75%, #f5f5f5 75%, #f5f5f5)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
        };
      case 'grid':
        return {
          backgroundColor: '#ffffff',
          backgroundImage:
            'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        };
      default:
        return {};
    }
  };

  // 격자 오버레이
  const gridOverlay =
    showGrid && background !== 'grid' ? (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
    ) : null;

  // 측정 도구
  const measureOverlay = showMeasure ? (
    <div className="absolute top-0 left-0 pointer-events-none">
      {/* 가로 눈금자 */}
      <div className="h-6 border-b border-default bg-surface flex items-end text-[10px] text-muted">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex-1 border-r border-default text-center pb-0.5">
            {i * 100}
          </div>
        ))}
      </div>
      {/* 세로 눈금자 */}
      <div className="absolute top-6 left-0 w-6 border-r border-default bg-surface">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="h-[100px] border-b border-default text-[10px] text-muted text-center"
          >
            <span className="rotate-90 inline-block mt-10">{i * 100}</span>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative h-full w-full overflow-auto" style={getBackgroundStyle()}>
      {gridOverlay}
      {measureOverlay}

      {/* Canvas Content */}
      <div
        className="min-h-full flex items-center justify-center transition-all"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          padding: '48px',
          paddingLeft: showMeasure ? '64px' : '48px',
          paddingTop: showMeasure ? '64px' : '48px',
        }}
      >
        <div
          className="transition-all duration-300"
          style={{
            width: viewportWidths[viewport],
            maxWidth: '100%',
          }}
        >
          {metadata && node?.componentModule ? (
            <Block
              role="Container"
              prominence="Standard"
              className="border border-border rounded-lg overflow-hidden bg-surface p-8"
            >
              <ErrorBoundary>
                <ComponentRenderer
                  metadata={metadata}
                  propValues={propValues}
                  mockData={{}}
                  componentModule={node.componentModule}
                />
              </ErrorBoundary>
            </Block>
          ) : (
            <Block role="Container" prominence="Standard" className="p-12 text-center">
              <Text role="Body" prominence="Subtle" content="Select a component to preview" />
            </Block>
          )}
        </div>
      </div>
    </div>
  );
}
