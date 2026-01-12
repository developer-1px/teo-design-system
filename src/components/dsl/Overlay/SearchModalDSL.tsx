import { Frame } from '@/components/dsl/shared/Frame';
/**
 * SearchModalDSL - IDDL 기반 검색 모달 (v1.0.1)
 *
 * IDDL Structure:
 * - Overlay[Dialog]: 최상위 모달 컨테이너
 *   - Section[Header]: 검색 입력 영역
 *     - Block[Toolbar]: 검색바
 *       - Field[text]: 검색 입력 (clearable)
 *   - Section[Container]: 검색 결과 영역
 *     - Block[List]: 결과 목록
 *       - Action: 각 검색 결과 아이템
 *         - Text: 타이틀/서브타이틀
 *   - Section[Footer]: 힌트 및 결과 카운트
 *     - Block[Toolbar]: 키보드 힌트
 */

import { Command, File, Folder, Hash, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Block } from '@/components/dsl/Block/Block.tsx';
import { Action } from '@/components/dsl/Element/Action/Action.tsx';
import { Field } from '@/components/dsl/Element/Field/Field.tsx';
import { Text } from '@/components/dsl/Element/Text/Text.tsx';
import { Overlay } from '@/components/dsl/Overlay/Overlay.tsx';
import { Section } from '@/components/dsl/Section/Section.tsx';
import {
  KeyboardContext,
  useKeyboardContext,
  useModalShortcut,
  useNavigableCursor,
} from '@/shared/lib/keyboard';
import { cn } from '@/shared/lib/utils';

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
  {
    id: '2',
    type: 'file',
    title: 'Layer.tsx',
    subtitle: 'src/components/ui/',
    path: '/src/components/ui/Layer.tsx',
  },
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
    onSelect: (_result) => {
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
      density="Compact"
    >
      {/* Search Input Header */}
      <Section role="DialogHeader" density="Compact">
        <Block role="Toolbar" layout="inline" density="Compact">
          <Search size={20} className="text-subtle" />
          <Field
            model="search"
            type="text"
            label=""
            placeholder="Search files, commands, symbols..."
            clearable
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          />
          <kbd className="px-2 py-0.5 text-xs bg-surface-base text-subtle rounded">ESC</kbd>
        </Block>
      </Section>

      {/* Results */}
      <Section role="DialogContent" density="Compact">
        {results.length === 0 ? (
          <Text
            role="Body"
            prominence="Subtle"
            align="center"
            content={`No results found for "${query}"`}
          />
        ) : (
          <Block role="List" density="Compact">
            {results.map((result, index) => (
              <Action
                key={result.id}
                prominence="Standard"
                intent="Neutral"
                {...getItemProps(index)}
                className={cn('w-full justify-start', {
                  'bg-accent/10 hover:bg-accent/10': index === cursorIndex,
                })}
              >
                {getIcon(result.type)}
                <div className="flex-1 min-w-0">
                  <Text role="Body" prominence="Standard" content={result.title} />
                  {result.subtitle && (
                    <Text role="Caption" prominence="Subtle" content={result.subtitle} />
                  )}
                </div>
                {index === cursorIndex && (
                  <kbd className="px-2 py-0.5 text-xs bg-surface-base text-subtle rounded">↵</kbd>
                )}
              </Action>
            ))}
          </Block>
        )}
      </Section>

      {/* Footer - Keyboard Hints */}
      <Section role="DialogFooter" density="Compact">
        <Block role="Toolbar" layout="inline" density="Compact">
          <Frame.Inline layout="inline" density="Compact">
            <span className="flex items-center gap-1 text-xs text-subtle">
              <kbd className="px-1.5 py-0.5 bg-surface-base rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-surface-base rounded">↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1 text-xs text-subtle">
              <kbd className="px-1.5 py-0.5 bg-surface-base rounded">↵</kbd>
              select
            </span>
          </Frame.Inline>
          <Text role="Caption" prominence="Subtle" content={`${results.length} results`} />
        </Block>
      </Section>
    </Overlay>
  );
};
