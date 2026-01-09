/**
 * Storybook-style Toolbar
 *
 * Canvas 제어 도구:
 * - 줌 (100%, 50%, 200%)
 * - 배경 토글 (투명, 흰색, 다크)
 * - 격자 표시
 * - 측정 도구
 * - 반응형 뷰포트
 */

import { Group } from '@/components/dsl/Group';
import { Action } from '@/components/dsl/Action';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3x3,
  Paintbrush,
  Smartphone,
  Tablet,
  Monitor,
  Ruler
} from 'lucide-react';

export type BackgroundType = 'transparent' | 'light' | 'dark' | 'grid';
export type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'full';

interface ToolbarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  background: BackgroundType;
  onBackgroundChange: (bg: BackgroundType) => void;
  viewport: ViewportSize;
  onViewportChange: (size: ViewportSize) => void;
  showGrid: boolean;
  onGridToggle: () => void;
  showMeasure: boolean;
  onMeasureToggle: () => void;
}

export function Toolbar({
  zoom,
  onZoomChange,
  background,
  onBackgroundChange,
  viewport,
  onViewportChange,
  showGrid,
  onGridToggle,
  showMeasure,
  onMeasureToggle,
}: ToolbarProps) {
  return (
    <Group role="Toolbar" layout="inline" density="Compact" className="px-4 py-2 border-b border-default">
      {/* Zoom Controls */}
      <Group role="Toolbar" layout="inline" className="gap-1">
        <Action
          icon="ZoomOut"
          prominence="Tertiary"
          intent="Neutral"
          onClick={() => onZoomChange(Math.max(25, zoom - 25))}
          label=""
        />
        <button
          onClick={() => onZoomChange(100)}
          className="px-2 py-1 text-xs text-muted hover:text min-w-[60px] rounded transition-colors"
        >
          {zoom}%
        </button>
        <Action
          icon="ZoomIn"
          prominence="Tertiary"
          intent="Neutral"
          onClick={() => onZoomChange(Math.min(200, zoom + 25))}
          label=""
        />
        <Action
          icon="Maximize2"
          prominence="Tertiary"
          intent="Neutral"
          onClick={() => onZoomChange(100)}
          label=""
        />
      </Group>

      <div className="w-px h-6 bg-border-default" />

      {/* Background Controls */}
      <Group role="Toolbar" layout="inline" className="gap-1">
        <button
          onClick={() => onBackgroundChange('light')}
          className={`w-6 h-6 rounded border-2 transition-all ${
            background === 'light'
              ? 'border-primary bg-white'
              : 'border-default bg-white hover:border-muted'
          }`}
          title="White background"
        />
        <button
          onClick={() => onBackgroundChange('dark')}
          className={`w-6 h-6 rounded border-2 transition-all ${
            background === 'dark'
              ? 'border-primary bg-gray-900'
              : 'border-default bg-gray-900 hover:border-muted'
          }`}
          title="Dark background"
        />
        <button
          onClick={() => onBackgroundChange('transparent')}
          className={`w-6 h-6 rounded border-2 transition-all ${
            background === 'transparent'
              ? 'border-primary'
              : 'border-default hover:border-muted'
          }`}
          style={{
            backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)',
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 4px 4px',
          }}
          title="Transparent background"
        />
        <button
          onClick={onGridToggle}
          className={`p-1 rounded transition-colors ${
            showGrid
              ? 'bg-primary text-inverse'
              : 'text-muted hover:text hover:bg-surface-sunken'
          }`}
          title="Toggle grid"
        >
          <Grid3x3 size={16} />
        </button>
      </Group>

      <div className="w-px h-6 bg-border-default" />

      {/* Viewport Controls */}
      <Group role="Toolbar" layout="inline" className="gap-1">
        <button
          onClick={() => onViewportChange('mobile')}
          className={`p-1 rounded transition-colors ${
            viewport === 'mobile'
              ? 'bg-primary text-inverse'
              : 'text-muted hover:text hover:bg-surface-sunken'
          }`}
          title="Mobile (375px)"
        >
          <Smartphone size={16} />
        </button>
        <button
          onClick={() => onViewportChange('tablet')}
          className={`p-1 rounded transition-colors ${
            viewport === 'tablet'
              ? 'bg-primary text-inverse'
              : 'text-muted hover:text hover:bg-surface-sunken'
          }`}
          title="Tablet (768px)"
        >
          <Tablet size={16} />
        </button>
        <button
          onClick={() => onViewportChange('desktop')}
          className={`p-1 rounded transition-colors ${
            viewport === 'desktop'
              ? 'bg-primary text-inverse'
              : 'text-muted hover:text hover:bg-surface-sunken'
          }`}
          title="Desktop (1280px)"
        >
          <Monitor size={16} />
        </button>
        <button
          onClick={() => onViewportChange('full')}
          className={`p-1 rounded transition-colors ${
            viewport === 'full'
              ? 'bg-primary text-inverse'
              : 'text-muted hover:text hover:bg-surface-sunken'
          }`}
          title="Full width"
        >
          <Maximize2 size={16} />
        </button>
      </Group>

      <div className="w-px h-6 bg-border-default" />

      {/* Measure Tool */}
      <button
        onClick={onMeasureToggle}
        className={`p-1 rounded transition-colors ${
          showMeasure
            ? 'bg-primary text-inverse'
            : 'text-muted hover:text hover:bg-surface-sunken'
        }`}
        title="Toggle measure"
      >
        <Ruler size={16} />
      </button>
    </Group>
  );
}
