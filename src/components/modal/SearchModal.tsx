import { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
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
  const { cursorIndex, getItemProps, selectCurrent } = useNavigableCursor({
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

  const handleSelect = (result: SearchResult) => {
    console.log('Selected:', result);
    onClose();
  };

  const getIcon = (type: SearchResult['type']) => {
    const iconProps = { size: 16, className: 'text-text-tertiary' };
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

      <Layout
        depth={6}
        className="relative w-full max-w-2xl overflow-hidden"
      >
          {/* Search Input */}
          <Layout depth={1} rounded={false} className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Search size={20} className="text-text-tertiary" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search files, commands, symbols..."
                className="flex-1 bg-transparent text-text placeholder:text-text-tertiary focus:outline-none text-sm"
              />
              <kbd className="px-2 py-0.5 text-xs bg-layer-0 text-text-tertiary rounded">
                ESC
              </kbd>
            </div>
          </Layout>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {results.length === 0 ? (
              <div className="py-12 text-center text-text-tertiary text-sm">
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
                        <div className="text-xs text-text-tertiary truncate">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                    {index === cursorIndex && (
                      <kbd className="px-2 py-0.5 text-xs bg-layer-0 text-text-tertiary rounded">
                        ↵
                      </kbd>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <Layout depth={1} rounded={false} className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-text-tertiary">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-layer-0 rounded">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-layer-0 rounded">↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-layer-0 rounded">↵</kbd>
                  select
                </span>
              </div>
              <div className="text-xs text-text-tertiary">
                {results.length} results
              </div>
            </div>
          </Layout>
        </Layout>
    </div>
  );
};
