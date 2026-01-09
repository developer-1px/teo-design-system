import { useState, useEffect, useRef } from 'react';
import { Section } from '@/components/dsl/Section';
import { Button } from '@/components/ui';
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

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
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

  // 키보드 네비게이션 (useNavigableCursor 사용)
  const { cursorIndex, getItemProps } = useNavigableCursor({
    type: 'list',
    items: results,
    onSelect: (result) => {
      console.log('Selected:', result);
      onClose();
    },
    enabled: isOpen,
  });

  // 모달 단축키 (ESC로 닫기)
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <Section
        role="Container"
        prominence="Hero"
        className="relative w-full max-w-2xl overflow-hidden"
      >
          {/* Search Input */}
          <Section role="Container" prominence="Tertiary" className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Search size={20} className="text-subtle" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search files, commands, symbols..."
                className="flex-1 bg-transparent text-text placeholder:text-subtle focus:outline-none text-sm"
              />
              <kbd className="px-2 py-0.5 text-xs bg-surface-base text-subtle rounded">
                ESC
              </kbd>
            </div>
          </Section>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {results.length === 0 ? (
              <div className="py-12 text-center text-subtle text-sm">
                No results found for "{query}"
              </div>
            ) : (
              <div className="py-2">
                {results.map((result, index) => (
                  <Button
                    key={result.id}
                    variant="ghost"
                    {...getItemProps(index)}
                    className={cn(
                      'w-full justify-start gap-3 px-4 py-2.5 h-auto',
                      {
                        'bg-accent/10 hover:bg-accent/10': index === cursorIndex,
                      }
                    )}
                  >
                    {getIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-text truncate">
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="text-xs text-subtle truncate">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                    {index === cursorIndex && (
                      <kbd className="px-2 py-0.5 text-xs bg-surface-base text-subtle rounded">
                        ↵
                      </kbd>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <Section role="Footer" prominence="Tertiary" className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-subtle">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-surface-base rounded">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-surface-base rounded">↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-surface-base rounded">↵</kbd>
                  select
                </span>
              </div>
              <div className="text-xs text-subtle">
                {results.length} results
              </div>
            </div>
          </Section>
        </Section>
    </div>
  );
};
