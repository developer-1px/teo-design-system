import { ChevronDown, File } from 'lucide-react';
import { useState } from 'react';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { Section } from '@/components/types/Section/Section';
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
        { line: 12, text: 'import { IDEPage } from "./pages/ide/IDEPage";' },
        { line: 40, text: '<Route path="/ide" component={AppIDE} />' },
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

      <Block role="ScrollArea" className="flex-1">
        <Block role="Stack" gap={4} className="p-4">
          {/* Search Inputs */}
          <Block role="Group" gap={2}>
            <Block role="Row" layout="inline" className="relative">
              <Action
                role="IconButton"
                icon={isReplaceExpanded ? 'ChevronDown' : 'ChevronRight'}
                label="Toggle Replace"
                prominence="Subtle"
                density="Compact"
                className="absolute left-0 top-1.5 z-10"
                onClick={() => setIsReplaceExpanded(!isReplaceExpanded)}
              />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm w-full"
              />
              <Block role="Row" layout="inline" className="absolute right-1 top-1 gap-0.5">
                <Action
                  role="IconButton"
                  icon="CaseSensitive"
                  label="Match Case"
                  prominence="Subtle"
                  density="Compact"
                  className="h-6 w-6"
                />
                <Action
                  role="IconButton"
                  icon="WholeWord"
                  label="Match Whole Word"
                  prominence="Subtle"
                  density="Compact"
                  className="h-6 w-6"
                />
                <Action
                  role="IconButton"
                  icon="Regex"
                  label="Use Regular Expression"
                  prominence="Subtle"
                  density="Compact"
                  className="h-6 w-6"
                />
              </Block>
            </Block>

            {isReplaceExpanded && (
              <Block role="Row" layout="inline" className="relative pl-8">
                <Input
                  placeholder="Replace"
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  className="h-8 text-sm w-full"
                />
                <Block role="Row" layout="inline" className="absolute right-1 top-1 gap-0.5">
                  <Action
                    role="IconButton"
                    icon="Replace"
                    label="Replace All"
                    prominence="Subtle"
                    density="Compact"
                    className="h-6 w-6"
                  />
                </Block>
              </Block>
            )}
          </Block>

          {/* Results */}
          {searchQuery && (
            <Block role="List" className="flex flex-col gap-0 mt-2">
              <Text
                role="Caption"
                prominence="Subtle"
                className="px-2 py-1 italic mb-2"
                content={`${mockResults.reduce((acc, curr) => acc + curr.matches.length, 0)} results in ${mockResults.length} files`}
              />

              {mockResults.map((result, idx) => (
                <Block key={idx} role="Group" className="flex flex-col">
                  {/* File Header */}
                  <Action
                    role="Button"
                    prominence="Subtle"
                    className="flex items-center gap-1 px-2 py-1 hover:bg-surface-hover rounded-sm text-left w-full justify-start"
                    onClick={() => onFileClick?.(result.path)}
                  >
                    <ChevronDown size={14} className="text-text-tertiary" />
                    <File size={14} className="text-text-tertiary" />
                    <Text
                      role="Body"
                      size="sm"
                      prominence="Standard"
                      content={result.file}
                      className="font-medium truncate flex-1 ml-1"
                    />
                    <Text
                      role="Badge"
                      className="text-[10px] text-text-tertiary bg-surface-raised px-1.5 rounded-full"
                    >
                      {result.matches.length}
                    </Text>
                  </Action>

                  {/* Matches */}
                  <Block role="Stack" gap={0} className="ml-6 border-l border-border-muted">
                    {result.matches.map((match, mIdx) => (
                      <Action
                        key={mIdx}
                        role="Button"
                        prominence="Subtle"
                        className="flex items-start gap-3 px-2 py-1 hover:bg-surface-hover text-left overflow-hidden w-full justify-start h-auto"
                      >
                        <Text
                          role="Code"
                          size="xs"
                          prominence="Subtle"
                          className="w-6 text-right flex-shrink-0"
                          content={String(match.line)}
                        />
                        <Text
                          role="Code"
                          size="sm"
                          prominence="Standard"
                          content={match.content}
                          className="truncate opacity-80"
                        />
                      </Action>
                    ))}
                  </Block>
                </Block>
              ))}
            </Block>
          )}
        </Block>
      </Block>
    </>
  );
};
