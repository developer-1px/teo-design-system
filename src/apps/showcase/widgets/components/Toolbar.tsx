/**
 * Storybook-style Toolbar (Pure IDDL v3.1)
 *
 * Canvas 제어 도구:
 * - 줌 (100%, 50%, 200%)
 * - 배경 토글 (투명, 흰색, 다크)
 * - 격자 표시
 * - 측정 도구
 * - 반응형 뷰포트
 *
 * v3.1: Minimal IDDL - role 기반, selected prop 사용, 수동 className 최소화
 */

import {
  Grid3x3,
  Maximize2,
  Monitor,
  Ruler,
  Smartphone,
  Tablet,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Block } from '@/components/types/Block/Block.tsx';
import { Separator } from '@/components/types/Element/Separator/Separator.tsx';
import { Action } from '@/components/types/Element/Action/Action';

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
    <Block role="Toolbar" density="Compact" prominence="Standard">
      {/* Zoom Controls */}
      <Block role="Toolbar" density="Compact">
        <Action onClick={() => onZoomChange(Math.max(25, zoom - 25))}>
          <ZoomOut size={14} />
        </Action>
        <Action onClick={() => onZoomChange(100)}>{zoom}%</Action>
        <Action onClick={() => onZoomChange(Math.min(200, zoom + 25))}>
          <ZoomIn size={14} />
        </Action>
        <Action onClick={() => onZoomChange(100)}>
          <Maximize2 size={14} />
        </Action>
      </Block>

      {/* Divider */}
      <Block role="Container" className="w-px h-6 bg-border-default" />

      {/* Background Controls - NOTE: Color swatches는 향후 Swatch 컴포넌트로 교체 예정 */}
      <Block role="Toolbar" density="Compact">
        <Action
          selected={background === 'light'}
          onClick={() => onBackgroundChange('light')}
          aria-label="White background"
        >
          ⬜
        </Action>
        <Action
          selected={background === 'dark'}
          onClick={() => onBackgroundChange('dark')}
          aria-label="Dark background"
        >
          ⬛
        </Action>
        <Action
          selected={background === 'transparent'}
          onClick={() => onBackgroundChange('transparent')}
          aria-label="Transparent background"
        >
          ▦
        </Action>
        <Action selected={showGrid} onClick={onGridToggle} aria-label="Toggle grid">
          <Grid3x3 size={16} />
        </Action>
      </Block>

      {/* Divider */}
      <Block role="Container" className="w-px h-6 bg-border-default" />

      {/* Viewport Controls */}
      <Block role="Toolbar" density="Compact">
        <Action
          selected={viewport === 'mobile'}
          onClick={() => onViewportChange('mobile')}
          aria-label="Mobile (375px)"
        >
          <Smartphone size={16} />
        </Action>
        <Action
          selected={viewport === 'tablet'}
          onClick={() => onViewportChange('tablet')}
          aria-label="Tablet (768px)"
        >
          <Tablet size={16} />
        </Action>
        <Action
          selected={viewport === 'desktop'}
          onClick={() => onViewportChange('desktop')}
          aria-label="Desktop (1280px)"
        >
          <Monitor size={16} />
        </Action>
        <Action
          selected={viewport === 'full'}
          onClick={() => onViewportChange('full')}
          aria-label="Full width"
        >
          <Maximize2 size={16} />
        </Action>
      </Block>

      {/* Divider */}
      <Block role="Container" className="w-px h-6 bg-border-default" />

      {/* Measure Tool */}
      <Action selected={showMeasure} onClick={onMeasureToggle} aria-label="Toggle measure">
        <Ruler size={16} />
      </Action>
    </Block>
  );
}
