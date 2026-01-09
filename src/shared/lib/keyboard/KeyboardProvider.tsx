/**
 * KeyboardProvider - 키보드 & 단축키 시스템 최상위 Provider
 *
 * 역할:
 * - 활성 컨텍스트 스택 관리
 * - 단축키 충돌 감지
 * - 우선순위 기반 단축키 실행
 */

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { KeyboardContext, type ShortcutDefinition } from './types';

interface KeyboardState {
  /** 현재 활성 컨텍스트 (스택) */
  activeContexts: Set<KeyboardContext>;
  /** 등록된 모든 단축키 */
  shortcuts: Map<string, ShortcutDefinition[]>;
}

interface KeyboardContextValue extends KeyboardState {
  /** 컨텍스트 활성화 */
  enableContext: (context: KeyboardContext) => void;
  /** 컨텍스트 비활성화 */
  disableContext: (context: KeyboardContext) => void;
  /** 컨텍스트 토글 */
  toggleContext: (context: KeyboardContext) => void;
  /** 컨텍스트 활성 여부 확인 */
  isContextActive: (context: KeyboardContext | KeyboardContext[]) => boolean;
  /** 단축키 등록 */
  registerShortcut: (shortcut: ShortcutDefinition) => void;
  /** 단축키 해제 */
  unregisterShortcut: (key: string, handler: (event: KeyboardEvent) => void) => void;
  /** 디버그: 모든 단축키 반환 */
  getAllShortcuts: () => ShortcutDefinition[];
}

const KeyboardContextObj = createContext<KeyboardContextValue | null>(null);

export const useKeyboardContext = () => {
  const context = useContext(KeyboardContextObj);
  if (!context) {
    throw new Error('useKeyboardContext must be used within KeyboardProvider');
  }
  return context;
};

interface KeyboardProviderProps {
  children: ReactNode;
  /** 초기 활성 컨텍스트 */
  initialContexts?: KeyboardContext[];
}

export const KeyboardProvider = ({
  children,
  initialContexts = [KeyboardContext.GLOBAL],
}: KeyboardProviderProps) => {
  const [activeContexts, setActiveContexts] = useState<Set<KeyboardContext>>(
    new Set(initialContexts)
  );

  const [shortcuts] = useState<Map<string, ShortcutDefinition[]>>(new Map());

  // 컨텍스트 활성화
  const enableContext = useCallback((context: KeyboardContext) => {
    setActiveContexts((prev) => {
      const next = new Set(prev);
      next.add(context);
      return next;
    });
  }, []);

  // 컨텍스트 비활성화
  const disableContext = useCallback((context: KeyboardContext) => {
    setActiveContexts((prev) => {
      const next = new Set(prev);
      next.delete(context);
      return next;
    });
  }, []);

  // 컨텍스트 토글
  const toggleContext = useCallback((context: KeyboardContext) => {
    setActiveContexts((prev) => {
      const next = new Set(prev);
      if (next.has(context)) {
        next.delete(context);
      } else {
        next.add(context);
      }
      return next;
    });
  }, []);

  // 컨텍스트 활성 여부 확인
  const isContextActive = useCallback(
    (context: KeyboardContext | KeyboardContext[]) => {
      if (Array.isArray(context)) {
        return context.some((ctx) => activeContexts.has(ctx));
      }
      return activeContexts.has(context);
    },
    [activeContexts]
  );

  // 단축키 등록
  const registerShortcut = useCallback(
    (shortcut: ShortcutDefinition) => {
      const existing = shortcuts.get(shortcut.key) || [];
      shortcuts.set(shortcut.key, [...existing, shortcut]);

      // 충돌 감지 (같은 키에 같은 우선순위)
      const conflicts = existing.filter(
        (s) =>
          s.priority === shortcut.priority && s.context === shortcut.context && s.enabled !== false
      );

      if (conflicts.length > 0 && import.meta.env.DEV) {
        console.warn(`[KeyboardProvider] Potential conflict detected for key "${shortcut.key}":`, {
          new: shortcut.description || 'unnamed',
          existing: conflicts.map((c) => c.description || 'unnamed'),
        });
      }
    },
    [shortcuts]
  );

  // 단축키 해제
  const unregisterShortcut = useCallback(
    (key: string, handler: (event: KeyboardEvent) => void) => {
      const existing = shortcuts.get(key) || [];
      const filtered = existing.filter((s) => s.handler !== handler);
      if (filtered.length === 0) {
        shortcuts.delete(key);
      } else {
        shortcuts.set(key, filtered);
      }
    },
    [shortcuts]
  );

  // 디버그: 모든 단축키 반환
  const getAllShortcuts = useCallback(() => {
    const all: ShortcutDefinition[] = [];
    shortcuts.forEach((list) => {
      all.push(...list);
    });
    return all;
  }, [shortcuts]);

  const value = useMemo<KeyboardContextValue>(
    () => ({
      activeContexts,
      shortcuts,
      enableContext,
      disableContext,
      toggleContext,
      isContextActive,
      registerShortcut,
      unregisterShortcut,
      getAllShortcuts,
    }),
    [
      activeContexts,
      shortcuts,
      enableContext,
      disableContext,
      toggleContext,
      isContextActive,
      registerShortcut,
      unregisterShortcut,
      getAllShortcuts,
    ]
  );

  return <KeyboardContextObj.Provider value={value}>{children}</KeyboardContextObj.Provider>;
};
