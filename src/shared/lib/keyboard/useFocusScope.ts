/**
 * useFocusScope - React Aria의 FocusScope 래퍼
 *
 * 모달, 패널 등에서 포커스를 가두고 자동으로 복원
 */

import { useFocusManager } from '@react-aria/focus';
import { useEffect, useRef } from 'react';
import type { FocusScopeOptions } from './types';

/**
 * 포커스 스코프 훅
 * 모달이나 패널에서 포커스를 가두고 자동 포커스/복원 기능 제공
 */
export const useFocusScope = (options: FocusScopeOptions = {}) => {
  const { contain = false, autoFocus = false, restoreFocus = false } = options;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // 자동 포커스
    if (autoFocus && contain) {
      const firstFocusable = ref.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    // 포커스 복원
    if (restoreFocus) {
      const previouslyFocused = document.activeElement as HTMLElement;
      return () => {
        if (previouslyFocused && previouslyFocused.focus) {
          previouslyFocused.focus();
        }
      };
    }
  }, [contain, autoFocus, restoreFocus]);

  return ref;
};

/**
 * 포커스 매니저 훅 (프로그래밍 방식 포커스 이동)
 * focusNext, focusPrevious, focusFirst, focusLast 제공
 */
export const useFocusNavigation = () => {
  const focusManager = useFocusManager();

  return {
    focusNext: () => focusManager?.focusNext({ wrap: true }),
    focusPrevious: () => focusManager?.focusPrevious({ wrap: true }),
    focusFirst: () => focusManager?.focusFirst(),
    focusLast: () => focusManager?.focusLast(),
  };
};
