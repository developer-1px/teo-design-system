import { useState } from 'react';
import { Action } from '@/components/types/Element/Action/Action';
import { Section } from '@/components/types/Section/Section';
import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';
import { SidebarHeader } from './SidebarHeader';
import { ChevronRight, ChevronDown, File } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Input } from './components/ui/input';

export const SearchView = () => {
    const [isReplaceExpanded, setIsReplaceExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [replaceQuery, setReplaceQuery] = useState('');

    // Mock results
    const mockResults = [
        {
            file: 'src/App.tsx',
            path: 'src/App.tsx',
            matches: [
                { line: 12, content: 'import { Button } from "@/components/ui/button";' },
                { line: 45, content: '<Button variant="ghost">Click me</Button>' },
            ]
        },
        {
            file: 'src/components/Button.tsx',
            path: 'src/components/Button.tsx',
            matches: [
                { line: 8, content: 'export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {' },
            ]
        }
    ];

    return (
        <>
            <SidebarHeader
                title="SEARCH"
                actions={
                    <div className="flex items-center gap-1">
                        <Action role="IconButton" icon="RefreshCw" label="Refresh" prominence="Subtle" density="Compact" />
                        <Action role="IconButton" icon="Filter" label="Filter" prominence="Subtle" density="Compact" />
                    </div>
                }
            />

            <Section role="Container" className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {/* Search Inputs */}
                <Block role="Container" className="relative">
                    <div className="relative">
                        <div className="flex flex-col gap-2">
                            <div className="relative flex items-center">
                                <Action
                                    role="IconButton"
                                    icon={isReplaceExpanded ? "ChevronDown" : "ChevronRight"}
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
                                    className="pl-8 h-8 text-sm"
                                />
                                <div className="absolute right-1 top-1 flex gap-0.5">
                                    <Action role="IconButton" icon="CaseSensitive" label="Match Case" prominence="Subtle" density="Compact" className="h-6 w-6" />
                                    <Action role="IconButton" icon="WholeWord" label="Match Whole Word" prominence="Subtle" density="Compact" className="h-6 w-6" />
                                    <Action role="IconButton" icon="Regex" label="Use Regular Expression" prominence="Subtle" density="Compact" className="h-6 w-6" />
                                </div>
                            </div>

                            {isReplaceExpanded && (
                                <div className="relative flex items-center pl-8">
                                    <Input
                                        placeholder="Replace"
                                        value={replaceQuery}
                                        onChange={(e) => setReplaceQuery(e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                    <div className="absolute right-1 top-1 flex gap-0.5">
                                        <Action role="IconButton" icon="Replace" label="Replace All" prominence="Subtle" density="Compact" className="h-6 w-6" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Block>

                {/* Results */}
                {searchQuery && (
                    <Block role="List" className="flex flex-col gap-0">
                        <div className="px-2 py-1 text-xs text-text-tertiary font-medium">
                            {mockResults.reduce((acc, curr) => acc + curr.matches.length, 0)} results in {mockResults.length} files
                        </div>

                        {mockResults.map((result, idx) => (
                            <Block key={idx} role="Container" className="flex flex-col">
                                {/* File Header */}
                                <button className="flex items-center gap-1 px-2 py-1 hover:bg-surface-hover rounded-sm text-left group">
                                    <ChevronDown size={14} className="text-text-tertiary" />
                                    <File size={14} className="text-text-tertiary" />
                                    <span className="text-sm text-text-secondary font-medium truncate flex-1">{result.file}</span>
                                    <span className="text-xs text-text-tertiary bg-surface-raised px-1.5 rounded-full">{result.matches.length}</span>
                                </button>

                                {/* Matches */}
                                <div className="flex flex-col ml-6 border-l border-border-muted">
                                    {result.matches.map((match, mIdx) => (
                                        <button key={mIdx} className="flex items-start gap-2 px-2 py-1 hover:bg-surface-hover text-left overflow-hidden">
                                            <span className="text-xs text-text-tertiary font-mono w-6 text-right flex-shrink-0 mt-0.5">{match.line}</span>
                                            <span className="text-sm text-text-secondary truncate font-mono opacity-80">{match.content}</span>
                                        </button>
                                    ))}
                                </div>
                            </Block>
                        ))}
                    </Block>
                )}
            </Section>
        </>
    );
};
