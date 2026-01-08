import { useState, useEffect, useRef } from 'react';
import { Layer } from '@/components/ui/Layer';
import { Search, File, Folder, Command, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>(mockResults);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query) {
      const filtered = mockResults.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults(mockResults);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

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
        return <Folder {...iconProps} className="text-accent" />;
      case 'command':
        return <Command {...iconProps} className="text-accent" />;
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

      <Layer
        level={6}
        rounded="lg"
        className="relative w-full max-w-2xl overflow-hidden"
      >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 bg-layer-1">
            <Search size={20} className="text-text-tertiary" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files, commands, symbols..."
              className="flex-1 bg-transparent text-text placeholder:text-text-tertiary focus:outline-none text-sm"
            />
            <kbd className="px-2 py-0.5 text-xs bg-layer-1 text-text-tertiary rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {results.length === 0 ? (
              <div className="py-12 text-center text-text-tertiary text-sm">
                No results found for "{query}"
              </div>
            ) : (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left layer-6-interactive',
                      {
                        'bg-accent/10': index === selectedIndex,
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
                    {index === selectedIndex && (
                      <kbd className="px-2 py-0.5 text-xs bg-layer-1 text-text-tertiary rounded">
                        ↵
                      </kbd>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 bg-layer-1">
            <div className="flex items-center gap-4 text-xs text-text-tertiary">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-layer-2 rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-layer-2 rounded">↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-layer-2 rounded">↵</kbd>
                select
              </span>
            </div>
            <div className="text-xs text-text-tertiary">
              {results.length} results
            </div>
          </div>
        </Layer>
    </div>
  );
};
