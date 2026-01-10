import { Check, ChevronDown, ChevronRight, Minus, MoveRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { Section } from '@/components/types/Section/Section';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { SidebarHeader } from './SidebarHeader';

export const SourceControlView = () => {
  const [message, setMessage] = useState('');

  return (
    <>
      <SidebarHeader
        title="SOURCE CONTROL"
        actions={
          <div className="flex items-center gap-1">
            <Action
              role="IconButton"
              icon="LayoutList"
              label="View as List"
              prominence="Subtle"
              density="Compact"
            />
            <Action
              role="IconButton"
              icon="Check"
              label="Commit"
              prominence="Subtle"
              density="Compact"
            />
            <Action
              role="IconButton"
              icon="RefreshCw"
              label="Refresh"
              prominence="Subtle"
              density="Compact"
            />
            <Action
              role="IconButton"
              icon="MoreHorizontal"
              label="More Actions"
              prominence="Subtle"
              density="Compact"
            />
          </div>
        }
      />

      <Section role="Container" className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {/* Commit Input */}
        <Block role="Container" className="flex flex-col gap-2">
          <Input
            placeholder="Message (⌘Enter to commit)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="text-sm font-sans"
          />
          <Button variant="default" size="sm" className="w-full mt-1 h-8">
            <Check size={14} className="mr-2" />
            Commit
          </Button>
        </Block>

        {/* Staged Changes */}
        <Block role="Container" className="flex flex-col gap-1">
          <button className="flex items-center gap-1 text-xs text-text-tertiary font-bold hover:text-text uppercase tracking-wider mb-1">
            <ChevronDown size={14} />
            <span>Staged Changes</span>
            <span className="ml-auto bg-surface-raised px-1.5 py-0.5 rounded-full">1</span>
          </button>

          <div className="flex items-center px-2 py-1 hover:bg-surface-hover rounded-sm group cursor-pointer">
            <Text role="Body" content="App.tsx" size="sm" className="flex-1" />
            <span className="text-xs text-text-tertiary mr-2 px-1">src</span>
            <span className="text-xs font-bold text-accent">M</span>
            <div className="hidden group-hover:flex ml-2 gap-1">
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Minus size={12} />
              </Button>
            </div>
          </div>
        </Block>

        {/* Changes */}
        <Block role="Container" className="flex flex-col gap-1">
          <div className="flex items-center justify-between group/header">
            <button className="flex items-center gap-1 text-xs text-text-tertiary font-bold hover:text-text uppercase tracking-wider mb-1">
              <ChevronDown size={14} />
              <span>Changes</span>
              <span className="ml-auto bg-surface-raised px-1.5 py-0.5 rounded-full">2</span>
            </button>
            <div className="hidden group-hover/header:flex gap-1">
              <Action
                role="IconButton"
                icon="Plus"
                label="Stage All"
                prominence="Subtle"
                density="Compact"
                className="h-5 w-5"
              />
              <Action
                role="IconButton"
                icon="RotateCcw"
                label="Discard All"
                prominence="Subtle"
                density="Compact"
                className="h-5 w-5"
              />
            </div>
          </div>

          <div className="flex items-center px-2 py-1 hover:bg-surface-hover rounded-sm group cursor-pointer">
            <Text role="Body" content="Button.tsx" size="sm" className="flex-1" />
            <span className="text-xs text-text-tertiary mr-2 px-1">src/components/ui</span>
            <span className="text-xs font-bold text-accent">M</span>
            <div className="hidden group-hover:flex ml-2 gap-1">
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Plus size={12} />
              </Button>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <MoveRight size={12} />
              </Button>
            </div>
          </div>

          <div className="flex items-center px-2 py-1 hover:bg-surface-hover rounded-sm group cursor-pointer">
            <Text
              role="Body"
              content="utils.ts"
              size="sm"
              className="flex-1 text-text-tertiary decoration-line-through decoration-text-tertiary"
            />
            <span className="text-xs text-text-tertiary mr-2 px-1">src/lib</span>
            <span className="text-xs font-bold text-semantic-error">D</span>
            <div className="hidden group-hover:flex ml-2 gap-1">
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Plus size={12} />
              </Button>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <MoveRight size={12} />
              </Button>
            </div>
          </div>
        </Block>
      </Section>
    </>
  );
};
