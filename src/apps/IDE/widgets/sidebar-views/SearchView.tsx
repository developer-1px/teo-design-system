import { ChevronDown, File } from 'lucide-react';
import { useState } from 'react';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Frame } from '@/components/dsl/shared/Frame';

import { Input } from './components/ui/input';
import { SidebarHeader } from './SidebarHeader';

interface SearchViewProps {
  onFileClick?: (path: string) => void;
}

export const SearchView = ({ onFileClick }: SearchViewProps) => {
  const [isReplaceExpanded, setIsReplaceExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');

  // Mock results
  const mockResults = [
    {
      file: 'src/App.tsx',
      path: '/src/App.tsx',
      matches: [
        { line: 12, content: 'import { IDEPage } from "./pages/ide/IDEPage";' },
        { line: 40, content: '<Route path="/ide" component={AppIDE} />' },
      ],
    },
    {
      file: 'Button.tsx',
      path: '/src/components/ui/Button.tsx',
      matches: [
        {
          line: 8,
          content:
            'export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {',
        },
      ],
    },
  ];

  return (
    <>
      <SidebarHeader
        title="SEARCH"
        actions={
          <>
            <Action
              role="IconButton"
              icon="RefreshCw"
              label="Refresh"
              prominence="Subtle"
              density="Compact"
            />
            <Action
              role="IconButton"
              icon="Filter"
              label="Filter"
              prominence="Subtle"
              density="Compact"
            />
          </>
        }
      />

      <div className="flex-1 overflow-y-auto px-5 py-2">
        <div className="flex flex-col gap-2">
          {/* Search Input Box */}
          <div className="flex flex-col gap-1.5">
            <div className="relative flex items-center group">
              <div
                className="absolute left-1 z-10 p-0.5 hover:bg-hover rounded cursor-pointer"
                onClick={() => setIsReplaceExpanded(!isReplaceExpanded)}
              >
                {isReplaceExpanded ? <ChevronDown size={14} /> : <ChevronDown size={14} className="-rotate-90" />}
              </div>
              <input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-sunken border border-transparent focus:border-focus outline-none text-[13px] pl-7 pr-16 h-[26px] rounded-sm text-text placeholder:opacity-40"
              />
              <div className="absolute right-1.5 flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                <Action icon="CaseSensitive" size="xs" className="hover:bg-hover p-0.5 rounded" />
                <Action icon="WholeWord" size="xs" className="hover:bg-hover p-0.5 rounded" />
                <Action icon="Regex" size="xs" className="hover:bg-hover p-0.5 rounded" />
              </div>
            </div>

            {isReplaceExpanded && (
              <div className="relative flex items-center pl-7">
                <input
                  placeholder="Replace"
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  className="w-full bg-surface-sunken border border-transparent focus:border-focus outline-none text-[13px] px-2 h-[26px] rounded-sm text-text placeholder:opacity-40"
                />
                <div className="absolute right-1.5 flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                  <Action icon="Replace" size="xs" className="hover:bg-hover p-0.5 rounded" />
                  <Action icon="ReplaceAll" size="xs" className="hover:bg-hover p-0.5 rounded" />
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {searchQuery && (
            <div className="flex flex-col mt-4">
              <div className="px-1 text-[11px] opacity-40 mb-2">
                {mockResults.reduce((acc, curr) => acc + curr.matches.length, 0)} results in {mockResults.length} files
              </div>

              {mockResults.map((result, idx) => (
                <div key={idx} className="flex flex-col">
                  {/* File Header */}
                  <div
                    className="flex items-center gap-1.5 py-1 hover:bg-hover cursor-pointer group select-none"
                    onClick={() => onFileClick?.(result.path)}
                  >
                    <ChevronDown size={14} className="opacity-40" />
                    <File size={14} className="text-info" />
                    <span className="text-[13px] text-muted font-medium truncate flex-1">{result.file}</span>
                    <span className="text-[11px] bg-surface-hover px-1.5 rounded-full mr-1 opacity-60 group-hover:opacity-100">
                      {result.matches.length}
                    </span>
                  </div>

                  {/* Matches */}
                  <div className="flex flex-col border-l border-border-muted ml-[18px]">
                    {result.matches.map((match, mIdx) => (
                      <div
                        key={mIdx}
                        className="flex items-center gap-3 pl-4 pr-2 py-0.5 hover:bg-hover cursor-pointer group whitespace-nowrap overflow-hidden"
                      >
                        <span className="text-[11px] opacity-30 w-6 text-right shrink-0">{match.line}</span>
                        <span className="text-[12px] opacity-70 group-hover:opacity-100 truncate">{match.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
