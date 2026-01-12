import { Frame } from '@/components/dsl/shared/Frame';
import { useState } from 'react';
import { Block } from '@/components/dsl/Block/Block.tsx';
import { Action } from '@/components/dsl/Element/Action/Action.tsx';
import { cn } from '@/shared/lib/utils';

interface WorkspaceNavProps {
  onViewChange?: (view: string) => void;
}

export const WorkspaceNav = ({ onViewChange }: WorkspaceNavProps) => {
  const [activeView, setActiveView] = useState('files');

  const handleViewChange = (view: string) => {
    setActiveView(view);
    onViewChange?.(view);
  };

  const NavItem = ({ icon, view, label }: { icon: any; view: string; label: string }) => {
    const isActive = activeView === view;
    return (
      <div className="relative w-full flex justify-center group py-2">
        {/* Active Indicator */}
        {isActive && (
          <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-primary rounded-r shadow-[0_0_8px_var(--color-primary)]" />
        )}
        <Action
          role="IconButton"
          icon={icon}
          label={label}
          selected={isActive}
          onClick={() => handleViewChange(view)}
          className={cn(
            "p-2 rounded-none transition-all duration-200",
            isActive ? "text-primary" : "text-subtle hover:text-text"
          )}
        />
      </div>
    );
  };

  return (
    <Block role="Toolbar" className="flex flex-col items-center w-full h-full py-2 bg-surface-sunken border-none">
      <NavItem icon="Files" view="files" label="Explorer" />
      <NavItem icon="Search" view="search" label="Search" />
      <NavItem icon="GitBranch" view="git" label="Source Control" />
      <NavItem icon="Bug" view="debug" label="Run and Debug" />
      <NavItem icon="Package" view="extensions" label="Extensions" />

      <Block role="Divider" className="w-8 my-2 opacity-10" />

      <NavItem icon="Play" view="run" label="Run & Deploy" />
      <NavItem icon="Palette" view="tokens" label="Design Tokens" />
      <NavItem icon="Presentation" view="presentation" label="Presentation" />

      <Frame.Spacer />

      <NavItem icon="UserCircle" view="account" label="Accounts" />
      <NavItem icon="Settings" view="settings" label="Settings" />
    </Block>
  );
};
