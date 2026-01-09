/**
 * useResizable - 패널 크기 조절 및 상태 관리 Hook
 *
 * 각 패널의 크기 상태를 관리하고 LocalStorage에 저장/복원합니다.
 * Resize 핸들 드래그 및 최소화/복원 기능을 제공합니다.
 *
 * @example
 * const { sizes, isCollapsed, handleResize, toggleCollapse } = useResizable({
 *   defaultSizes: { left: '200px', right: '300px' },
 *   minSizes: { left: 100, right: 200 },
 *   storageKey: 'ppt-layout',
 * });
 */

import { useCallback, useEffect, useState } from 'react';
import type { PresentationGridArea } from '@/components/types/Atom/types';

export interface ResizableSizes {
  header?: string;
  footer?: string;
  left?: string;
  right?: string;
  'top-left'?: string;
  'top-right'?: string;
  'bottom-left'?: string;
  'bottom-right'?: string;
}

export interface ResizableMinSizes {
  header?: number;
  footer?: number;
  left?: number;
  right?: number;
  'top-left'?: number;
  'top-right'?: number;
  'bottom-left'?: number;
  'bottom-right'?: number;
}

export interface CollapsedState {
  [key: string]: boolean;
}

export interface UseResizableOptions {
  defaultSizes?: ResizableSizes;
  minSizes?: ResizableMinSizes;
  maxSizes?: ResizableMinSizes;
  storageKey?: string;
}

export interface UseResizableReturn {
  sizes: ResizableSizes;
  isCollapsed: CollapsedState;
  handleResize: (area: PresentationGridArea, newSize: number) => void;
  toggleCollapse: (area: PresentationGridArea) => void;
  resetSizes: () => void;
}

/**
 * Clamp value between min and max
 */
function clamp(value: number, min: number | undefined, max: number | undefined): number {
  if (min !== undefined && value < min) return min;
  if (max !== undefined && value > max) return max;
  return value;
}

/**
 * Main hook
 */
export function useResizable(options: UseResizableOptions = {}): UseResizableReturn {
  const {
    defaultSizes = {},
    minSizes = {},
    maxSizes = {},
    storageKey = 'grid-layout-sizes',
  } = options;

  // Load from localStorage or use defaults
  const loadSizes = useCallback((): ResizableSizes => {
    if (typeof window === 'undefined') return defaultSizes;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultSizes, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load sizes from localStorage:', error);
    }
    return defaultSizes;
  }, [defaultSizes, storageKey]);

  const loadCollapsed = useCallback((): CollapsedState => {
    if (typeof window === 'undefined') return {};

    try {
      const stored = localStorage.getItem(`${storageKey}-collapsed`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load collapsed state from localStorage:', error);
    }
    return {};
  }, [storageKey]);

  const [sizes, setSizes] = useState<ResizableSizes>(loadSizes);
  const [isCollapsed, setIsCollapsed] = useState<CollapsedState>(loadCollapsed);

  // Save to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(sizes));
    } catch (error) {
      console.error('Failed to save sizes to localStorage:', error);
    }
  }, [sizes, storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(`${storageKey}-collapsed`, JSON.stringify(isCollapsed));
    } catch (error) {
      console.error('Failed to save collapsed state to localStorage:', error);
    }
  }, [isCollapsed, storageKey]);

  // Handle resize
  const handleResize = useCallback(
    (area: PresentationGridArea, newSize: number) => {
      const min = minSizes[area as keyof ResizableMinSizes];
      const max = maxSizes[area as keyof ResizableMinSizes];
      const clampedSize = clamp(newSize, min, max);

      setSizes((prev) => ({
        ...prev,
        [area]: `${clampedSize}px`,
      }));

      // Uncollapse if resizing a collapsed panel
      if (isCollapsed[area]) {
        setIsCollapsed((prev) => ({
          ...prev,
          [area]: false,
        }));
      }
    },
    [minSizes, maxSizes, isCollapsed]
  );

  // Toggle collapse
  const toggleCollapse = useCallback((area: PresentationGridArea) => {
    setIsCollapsed((prev) => ({
      ...prev,
      [area]: !prev[area],
    }));
  }, []);

  // Reset to defaults
  const resetSizes = useCallback(() => {
    setSizes(defaultSizes);
    setIsCollapsed({});
  }, [defaultSizes]);

  return {
    sizes,
    isCollapsed,
    handleResize,
    toggleCollapse,
    resetSizes,
  };
}
