/**
 * SearchModalDSL - IDDL 기반 검색 모달 (v1.0.1)
 *
 * IDDL Structure:
 * - Overlay[Dialog]: 최상위 모달 컨테이너
 *   - Section[Header]: 검색 입력 영역
 *     - Group[Toolbar]: 검색바
 *       - Field[text]: 검색 입력 (clearable)
 *   - Section[Container]: 검색 결과 영역
 *     - Group[List]: 결과 목록
 *       - Action: 각 검색 결과 아이템
 *         - Text: 타이틀/서브타이틀
 *   - Section[Footer]: 힌트 및 결과 카운트
 *     - Group[Toolbar]: 키보드 힌트
 */

import { useState, useEffect, useRef } from 'react';
import { Overlay } from '@/components/dsl/Overlay';
import { Section } from '@/components/dsl/Section';
import { Group } from '@/components/dsl/Group';
import { Field } from '@/components/dsl/Field';
import { Action } from '@/components/dsl/Action';
import { Text } from '@/components/dsl/Text';
import { Search, File, Folder, Command, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigableCursor, useModalShortcut, KeyboardContext, useKeyboardContext } from '@/lib/keyboard';

interface SearchResult {
  id: string;
  type: 'file' | 'folder' | 'command' | 'symbol';
  title: string;
  subtitle?: string;
  path?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockResults: SearchResult[] = [
  { id: '1', type: 'file', title: 'App.tsx', subtitle: 'src/', path: '/src/App.tsx' },
  { id: '2', type: 'file', title: 'Layer.tsx', subtitle: 'src/components/ui/', path: '/src/components/ui/Layer.tsx' },
  { id: '3', type: 'folder', title: 'components', subtitle: 'src/', path: '/src/components' },
  { id: '4', type: 'command', title: 'Open Settings', subtitle: 'Command' },
  { id: '5', type: 'symbol', title: 'LayerLevel', subtitle: 'Type in Layer.tsx' },
];

export const SearchModalDSL = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>(mockResults);
  const inputRef = useRef<HTMLInputElement>(null);
  const { enableContext, disableContext } = useKeyboardContext();

  // 검색 결과 필터링
  useEffect(() => {
    if (query) {
      const filtered = mockResults.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(mockResults);
    }
  }, [query]);

  // 키보드 네비게이션
  const { cursorIndex, getItemProps } = useNavigableCursor({
    type: 'list',
    items: results,
    onSelect: (result) => {
      console.log('Selected:', result);
      onClose();
    },
    enabled: isOpen,
  });

  // ESC로 닫기
  useModalShortcut('escape', onClose, {
    enabled: isOpen,
    description: 'Close search modal',
  });

  // 모달 열림/닫힘에 따라 컨텍스트 관리
  useEffect(() => {
    if (isOpen) {
      enableContext(KeyboardContext.SEARCH_OPEN);
      inputRef.current?.focus();
      setQuery('');
    } else {
      disableContext(KeyboardContext.SEARCH_OPEN);
    }
  }, [isOpen, enableContext, disableContext]);

  const getIcon = (type: SearchResult['type']) => {
    const iconProps = { size: 16, className: 'text-subtle' };
    switch (type) {
      case 'file':
        return <File {...iconProps} />;
      case 'folder':
        return <Folder {...iconProps} />;
      case 'command':
        return <Command {...iconProps} />;
      case 'symbol':
        return <Hash {...iconProps} />;
    }
  };

  return (
    <Overlay
      id="search-modal"
      role="Dialog"
      isOpen={isOpen}
      onClose={onClose}
      dismissable={true}
      className="max-w-2xl w-full"
    >
      {/* Search Input Header */}
      <Section role="Header" className="px-4 py-3 border-b border-border">
        <Group role="Toolbar" layout="inline" className="items-center gap-3">
          <Search size={20} className="text-subtle" />
          <Field
            model="search"
            dataType="text"
            label=""
            placeholder="Search files, commands, symbols..."
            clearable
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            className="flex-1 bg-transparent"
          />
          <kbd className="px-2 py-0.5 text-xs bg-surface-base text-subtle rounded">
            ESC
          </kbd>
        </Group>
      </Section>

      {/* Results */}
      <Section role="Container" className="max-h-[400px] overflow-y-auto">
        {results.length === 0 ? (
          <div className="py-12 text-center">
            <Text
              role="Body"
              prominence="Tertiary"
              className="text-sm"
              content={`No results found for "${query}"`}
            />
          </div>
        ) : (
          <Group role="List" className="py-2">
            {results.map((result, index) => (
              <Action
                key={result.id}
                prominence="Tertiary"
                intent="Neutral"
                {...getItemProps(index)}
                className={cn(
                  'w-full justify-start gap-3 px-4 py-2.5',
                  {
                    'bg-accent/10 hover:bg-accent/10': index === cursorIndex,
                  }
                )}
              >
                {getIcon(result.type)}
                <div className="flex-1 min-w-0">
                  <Text
                    role="Body"
                    prominence="Primary"
                    className="text-sm truncate"
                    content={result.title}
                  />
                  {result.subtitle && (
                    <Text
                      role="Caption"
                      prominence="Tertiary"
                      className="text-xs truncate"
                      content={result.subtitle}
                    />
                  )}
                </div>
                {index === cursorIndex && (
                  <kbd className="px-2 py-0.5 text-xs bg-surface-base text-subtle rounded">
                    ↵
                  </kbd>
                )}
              </Action>
            ))}
          </Group>
        )}
      </Section>

      {/* Footer - Keyboard Hints */}
      <Section role="Footer" className="px-4 py-2 border-t border-border">
        <Group role="Toolbar" layout="inline" className="items-center justify-between">
          <Group role="Toolbar" layout="inline" className="items-center gap-4">
            <span className="flex items-center gap-1 text-xs text-subtle">
              <kbd className="px-1.5 py-0.5 bg-surface-base rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-surface-base rounded">↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1 text-xs text-subtle">
              <kbd className="px-1.5 py-0.5 bg-surface-base rounded">↵</kbd>
              select
            </span>
          </Group>
          <Text
            role="Caption"
            prominence="Tertiary"
            className="text-xs"
            content={`${results.length} results`}
          />
        </Group>
      </Section>
    </Overlay>
  );
};
