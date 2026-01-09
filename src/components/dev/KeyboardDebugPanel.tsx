/**
 * KeyboardDebugPanel - 키보드 시스템 디버그 도구
 *
 * - 활성 컨텍스트 표시
 * - 등록된 단축키 목록 (우선순위별)
 * - 충돌 감지 경고
 * - 검색 가능한 단축키 cheatsheet
 */

import { AlertTriangle, Keyboard, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { IconButton } from '@/components/Item/Action/role/IconButton.tsx';
import { Section } from '@/components/Section/Section.tsx';
import { useGlobalShortcut, useKeyboardContext } from '@/shared/lib/keyboard';
import { PRIORITY } from '@/shared/lib/keyboard/types.ts';

export const KeyboardDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { activeContexts, getAllShortcuts } = useKeyboardContext();

  // Cmd+Shift+K로 토글
  useGlobalShortcut(
    'mod+shift+k',
    () => {
      setIsOpen((prev) => !prev);
    },
    {
      description: 'Toggle keyboard debug panel',
      preventDefault: true,
    }
  );

  // 모든 단축키 가져오기
  const allShortcuts = useMemo(() => getAllShortcuts(), [getAllShortcuts]);

  // 충돌 감지
  const conflicts = useMemo(() => {
    const keyMap = new Map<string, typeof allShortcuts>();
    allShortcuts.forEach((shortcut) => {
      const key = `${shortcut.key}-${shortcut.context}-${shortcut.priority}`;
      if (!keyMap.has(key)) {
        keyMap.set(key, []);
      }
      keyMap.get(key)!.push(shortcut);
    });

    return Array.from(keyMap.entries())
      .filter(([_, shortcuts]) => shortcuts.length > 1)
      .map(([key, shortcuts]) => ({ key, shortcuts }));
  }, [allShortcuts]);

  // 검색 필터링
  const filteredShortcuts = useMemo(() => {
    if (!searchQuery) return allShortcuts;

    const query = searchQuery.toLowerCase();
    return allShortcuts.filter((shortcut) => {
      const contextStr = Array.isArray(shortcut.context)
        ? shortcut.context.join(' ')
        : shortcut.context || '';

      return (
        shortcut.key.toLowerCase().includes(query) ||
        shortcut.description?.toLowerCase().includes(query) ||
        contextStr.toLowerCase().includes(query)
      );
    });
  }, [allShortcuts, searchQuery]);

  // 우선순위별 그룹화
  const groupedShortcuts = useMemo(() => {
    const groups = new Map<number, typeof allShortcuts>();
    filteredShortcuts.forEach((shortcut) => {
      const priority = shortcut.priority ?? PRIORITY.GLOBAL;
      if (!groups.has(priority)) {
        groups.set(priority, []);
      }
      groups.get(priority)!.push(shortcut);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => b - a) // 높은 우선순위 먼저
      .map(([priority, shortcuts]) => ({
        priority,
        name: getPriorityName(priority),
        shortcuts: shortcuts.sort((a, b) => a.key.localeCompare(b.key)),
      }));
  }, [filteredShortcuts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pointer-events-none">
      <Section
        role="Container"
        prominence="Hero"
        className="w-[500px] max-h-[80vh] flex flex-col pointer-events-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-default">
          <div className="flex items-center gap-2">
            <Keyboard size={20} className="text-accent" />
            <h2 className="text-sm font-semibold text">Keyboard Debug Panel</h2>
          </div>
          <IconButton title="Close debug panel" size="sm" onClick={() => setIsOpen(false)}>
            <X size={16} />
          </IconButton>
        </div>

        {/* Active Contexts */}
        <div className="p-4 border-b border-default">
          <h3 className="text-xs font-semibold text-subtle uppercase mb-2">
            Active Contexts ({activeContexts.size})
          </h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(activeContexts).map((context) => (
              <span
                key={context}
                className="px-2 py-1 text-xs rounded bg-accent/10 text-accent font-medium"
              >
                {context}
              </span>
            ))}
          </div>
        </div>

        {/* Conflicts Warning */}
        {conflicts.length > 0 && (
          <div className="p-4 bg-semantic-warning/10 border-b border-semantic-warning/30">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-semantic-warning flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-semibold text-semantic-warning mb-1">
                  {conflicts.length} Conflict(s) Detected
                </h3>
                <div className="text-xs text-muted space-y-1">
                  {conflicts.map(({ key, shortcuts }) => (
                    <div key={key}>
                      <code className="text-xs bg-surface-sunken px-1 rounded">
                        {shortcuts[0].key}
                      </code>{' '}
                      has {shortcuts.length} handlers in{' '}
                      <code className="text-xs bg-surface-sunken px-1 rounded">
                        {shortcuts[0].context}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="p-4 border-b border-default">
          <div className="flex items-center gap-2 px-3 py-2 rounded bg-surface-sunken">
            <Search size={14} className="text-subtle" />
            <input
              type="text"
              placeholder="Search shortcuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none text-sm text placeholder:text-subtle"
            />
            {searchQuery && (
              <IconButton title="Clear search" size="sm" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </IconButton>
            )}
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {groupedShortcuts.map((group) => (
              <div key={group.priority}>
                <h3 className="text-xs font-semibold text-subtle uppercase mb-2">
                  {group.name} (Priority: {group.priority})
                </h3>
                <div className="space-y-1">
                  {group.shortcuts.map((shortcut, index) => {
                    const contextStr = Array.isArray(shortcut.context)
                      ? shortcut.context.join(', ')
                      : shortcut.context || 'global';

                    return (
                      <div
                        key={`${shortcut.key}-${contextStr}-${index}`}
                        className="flex items-start justify-between gap-4 p-2 rounded hover:bg-surface transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <kbd className="px-2 py-0.5 text-xs font-mono bg-surface-raised border border-default rounded">
                              {shortcut.key}
                            </kbd>
                            <span className="text-xs text-subtle">{contextStr}</span>
                          </div>
                          {shortcut.description && (
                            <p className="text-xs text-muted">{shortcut.description}</p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              shortcut.enabled === false
                                ? 'bg-semantic-error/10 text-semantic-error'
                                : 'bg-accent/10 text-accent'
                            }`}
                          >
                            {shortcut.enabled === false ? 'Disabled' : 'Active'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {filteredShortcuts.length === 0 && (
            <div className="text-center py-8 text-subtle text-sm">
              {searchQuery ? 'No shortcuts match your search' : 'No shortcuts registered'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-default bg-surface-sunken">
          <div className="flex items-center justify-between text-xs text-subtle">
            <span>
              {filteredShortcuts.length} / {allShortcuts.length} shortcuts
            </span>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 bg-surface-base border border-default rounded">⌘⇧K</kbd>
              <span>to toggle</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

// Helper: 우선순위 숫자를 이름으로 변환
function getPriorityName(priority: number): string {
  switch (priority) {
    case PRIORITY.MODAL:
      return 'Modal';
    case PRIORITY.PANEL:
      return 'Panel';
    case PRIORITY.COMPONENT:
      return 'Component';
    case PRIORITY.GLOBAL:
      return 'Global';
    default:
      return `Custom (${priority})`;
  }
}
