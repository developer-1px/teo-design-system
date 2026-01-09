/**
 * useShortcut - 단축키 등록 훅
 *
 * react-hotkeys-hook을 래핑하여 우리의 컨텍스트 시스템과 통합
 */

import { useCallback, useEffect, useRef } from 'react';
import { type Options as HotkeysOptions, useHotkeys } from 'react-hotkeys-hook';
import { useKeyboardContext } from './KeyboardProvider';
import { KeyboardContext, PRIORITY } from './types';

export interface UseShortcutOptions {
  /** 활성 컨텍스트 (단일 또는 배열) */
  context?: KeyboardContext | KeyboardContext[];
  /** 우선순위 (기본: PRIORITY.GLOBAL) */
  priority?: number;
  /** 설명 (디버그/문서용) */
  description?: string;
  /** 활성화 여부 */
  enabled?: boolean;
  /** 전파 방지 */
  preventDefault?: boolean;
}

/**
 * 단축키 등록 훅
 *
 * @example
 * ```tsx
 * useShortcut('cmd+k', () => {
 *   openCommandPalette();
 * }, {
 *   context: KeyboardContext.GLOBAL,
 *   description: 'Open command palette',
 *   priority: PRIORITY.GLOBAL
 * });
 * ```
 */
export const useShortcut = (
  keys: string | string[],
  callback: (event: KeyboardEvent) => void,
  options: UseShortcutOptions = {}
) => {
  const {
    context = KeyboardContext.GLOBAL,
    priority = PRIORITY.GLOBAL,
    description,
    enabled = true,
    preventDefault = true,
  } = options;

  const { isContextActive, registerShortcut, unregisterShortcut } = useKeyboardContext();

  // 핸들러 ref (재생성 방지)
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // 컨텍스트 체크를 포함한 핸들러
  const wrappedCallback = useCallback(
    (event: KeyboardEvent) => {
      // 컨텍스트 체크
      if (!isContextActive(context)) {
        return;
      }

      if (preventDefault) {
        event.preventDefault();
      }

      callbackRef.current(event);
    },
    [context, isContextActive, preventDefault]
  );

  // react-hotkeys-hook 옵션
  const hotkeysOptions: HotkeysOptions = {
    enabled: enabled && isContextActive(context),
    preventDefault,
  };

  // 단축키 등록
  useHotkeys(keys, wrappedCallback, hotkeysOptions, [wrappedCallback, enabled]);

  // KeyboardProvider에 등록 (디버그용)
  useEffect(() => {
    if (!enabled) return;

    const keyArray = Array.isArray(keys) ? keys : [keys];

    keyArray.forEach((key) => {
      registerShortcut({
        key,
        handler: wrappedCallback,
        context,
        priority,
        description,
        enabled,
      });
    });

    return () => {
      keyArray.forEach((key) => {
        unregisterShortcut(key, wrappedCallback);
      });
    };
  }, [
    keys,
    wrappedCallback,
    context,
    priority,
    description,
    enabled,
    registerShortcut,
    unregisterShortcut,
  ]);
};

/**
 * 전역 단축키 등록 (편의 함수)
 */
export const useGlobalShortcut = (
  keys: string | string[],
  callback: (event: KeyboardEvent) => void,
  options: Omit<UseShortcutOptions, 'context'> = {}
) => {
  return useShortcut(keys, callback, {
    ...options,
    context: KeyboardContext.GLOBAL,
  });
};

/**
 * 모달 단축키 등록 (편의 함수)
 */
export const useModalShortcut = (
  keys: string | string[],
  callback: (event: KeyboardEvent) => void,
  options: Omit<UseShortcutOptions, 'context' | 'priority'> = {}
) => {
  return useShortcut(keys, callback, {
    ...options,
    context: KeyboardContext.MODAL_OPEN,
    priority: PRIORITY.MODAL,
  });
};
