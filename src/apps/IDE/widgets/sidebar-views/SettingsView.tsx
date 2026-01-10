import { ChevronDown, Search } from 'lucide-react';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { Section } from '@/components/types/Section/Section';
import { Input } from './components/ui/input';
import { Switch } from './components/ui/switch';
import { SidebarHeader } from './SidebarHeader';

export const SettingsView = () => {
  return (
    <>
      <SidebarHeader
        title="SETTINGS"
        actions={
          <div className="flex items-center gap-1">
            <Action
              role="IconButton"
              icon="FileJson"
              label="Open Settings (JSON)"
              prominence="Subtle"
              density="Compact"
            />
          </div>
        }
      />

      <Section role="Container" className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Search */}
        <Block role="Container" className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-text-tertiary" />
          <Input placeholder="Search Settings" className="pl-8 text-sm font-sans" />
        </Block>

        {/* Categories */}
        <Block role="List" className="flex flex-col gap-6">
          {/* Editor */}
          <Block role="Container" className="flex flex-col gap-3">
            <div className="flex items-center gap-1 text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 border-b border-border-muted pb-1">
              <ChevronDown size={14} />
              <span>Text Editor</span>
            </div>

            <div className="flex items-start gap-3 p-2 hover:bg-surface-hover rounded-lg">
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <Text role="Body" content="Font Family" className="font-bold text-sm" />
                <Text
                  role="Caption"
                  content="Controls the font family."
                  className="text-text-secondary"
                />
                <Input
                  className="h-7 text-xs font-mono mt-1"
                  defaultValue="JetBrains Mono, Menlo, Monaco, 'Courier New', monospace"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-2 hover:bg-surface-hover rounded-lg">
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <Text role="Body" content="Font Size" className="font-bold text-sm" />
                <Text
                  role="Caption"
                  content="Controls the font size in pixels."
                  className="text-text-secondary"
                />
                <Input
                  className="h-7 text-xs font-mono mt-1 w-20"
                  type="number"
                  defaultValue="13"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-2 hover:bg-surface-hover rounded-lg">
              <div className="mt-1">
                <Switch checked />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <Text role="Body" content="Mini Map" className="font-bold text-sm" />
                <Text
                  role="Caption"
                  content="Controls whether the minimap is shown."
                  className="text-text-secondary"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-2 hover:bg-surface-hover rounded-lg">
              <div className="mt-1">
                <Switch />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <Text role="Body" content="Word Wrap" className="font-bold text-sm" />
                <Text
                  role="Caption"
                  content="Controls how lines should wrap."
                  className="text-text-secondary"
                />
              </div>
            </div>
          </Block>

          {/* Workbench */}
          <Block role="Container" className="flex flex-col gap-3">
            <div className="flex items-center gap-1 text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 border-b border-border-muted pb-1">
              <ChevronDown size={14} />
              <span>Workbench</span>
            </div>

            <div className="flex items-start gap-3 p-2 hover:bg-surface-hover rounded-lg">
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <Text role="Body" content="Color Theme" className="font-bold text-sm" />
                <Text
                  role="Caption"
                  content="Specifies the color theme used in the workbench."
                  className="text-text-secondary"
                />
                <select className="h-7 text-xs mt-1 w-full rounded border border-input bg-background px-2">
                  <option>IDDL Dark</option>
                  <option>GitHub Dark</option>
                  <option>Monokai</option>
                </select>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2 hover:bg-surface-hover rounded-lg">
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <Text role="Body" content="Icon Theme" className="font-bold text-sm" />
                <Text
                  role="Caption"
                  content="Specifies the file icon theme used in the workbench."
                  className="text-text-secondary"
                />
                <select className="h-7 text-xs mt-1 w-full rounded border border-input bg-background px-2">
                  <option>Lucide Icons</option>
                  <option>Material Items</option>
                  <option>None</option>
                </select>
              </div>
            </div>
          </Block>
        </Block>
      </Section>
    </>
  );
};
