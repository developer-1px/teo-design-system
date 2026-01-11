import { Download, FolderOpen, GitBranch, Play, Settings, Upload } from 'lucide-react';
import { AIAgentChat } from '@/apps/IDE/widgets/chat/AIAgentChat.tsx';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';

interface RightBarProps {
  view: string | null;
  projectName?: string;
  currentBranch?: string;
  onOpenSettings?: () => void;
}

export const RightBar = ({
  view,
  projectName = 'ide-ui-kit',
  currentBranch = 'main',
  onOpenSettings,
}: RightBarProps) => {
  if (!view) return null;

  const renderContent = () => {
    switch (view) {
      case 'ai':
        return <AIPanel />;
      case 'git':
        return <GitPanel currentBranch={currentBranch} />;
      case 'info':
        return <ProjectInfoPanel projectName={projectName} currentBranch={currentBranch} />;
      case 'settings':
        return <SettingsPanel onOpenSettings={onOpenSettings} />;
      default:
        return null;
    }
  };

  return (
    <Block role="Stack" gap="none" className="h-full bg-surface-cool">
      {renderContent()}
    </Block>
  );
};

// ============================================================================
// Panel Components
// ============================================================================

const AIPanel = () => {
  return <AIAgentChat hideHeader={false} className="h-full" />;
};

const GitPanel = ({ currentBranch }: { currentBranch: string }) => {
  return (
    <Block role="Stack" gap="none" className="h-full">
      {/* Header */}
      <Block role="Toolbar" density="Compact" className="px-3 border-b border-border-default">
        <Block role="Inline" layout="inline" className="gap-2">
          <GitBranch size={16} className="text-accent" />
          <Text role="Title" size="sm" prominence="Standard" content="Source Control" />
        </Block>
      </Block>

      {/* Content */}
      <Block role="ScrollArea" className="flex-1">
        <Block role="Stack" gap={4} className="p-3">
          {/* Current Branch */}
          <Block role="Group" gap={2}>
            <Text
              role="Caption"
              prominence="Subtle"
              className="font-semibold"
              content="Current Branch"
            />
            <Block role="Card" prominence="Subtle" className="flex items-center gap-2 px-3 py-2">
              <GitBranch size={14} />
              <Text role="Body" size="sm" content={currentBranch} />
            </Block>
          </Block>

          {/* Actions */}
          <Block role="Group" gap={2}>
            <Text role="Caption" prominence="Subtle" className="font-semibold" content="Actions" />
            <Block role="Stack" gap={1}>
              <Action
                role="Button"
                icon={<Download size={14} />}
                label="Pull"
                prominence="Subtle"
                className="w-full justify-start"
              />
              <Action
                role="Button"
                icon={<Upload size={14} />}
                label="Push"
                prominence="Subtle"
                className="w-full justify-start"
              />
              <Action
                role="Button"
                icon={<GitBranch size={14} />}
                label="Branches"
                prominence="Subtle"
                className="w-full justify-start"
              />
            </Block>
          </Block>

          {/* Changes */}
          <Block role="Group" gap={2}>
            <Text role="Caption" prominence="Subtle" className="font-semibold" content="Changes" />
            <Text
              role="Body"
              size="xs"
              prominence="Subtle"
              className="px-2 py-4 text-center italic"
              content="No changes detected"
            />
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const ProjectInfoPanel = ({
  projectName,
  currentBranch,
}: {
  projectName: string;
  currentBranch: string;
}) => {
  return (
    <Block role="Stack" gap="none" className="h-full">
      {/* Header */}
      <Block role="Toolbar" density="Compact" className="px-3 border-b border-border-default">
        <Block role="Inline" layout="inline" className="gap-2">
          <FolderOpen size={16} className="text-accent" />
          <Text role="Title" size="sm" prominence="Standard" content="Project Info" />
        </Block>
      </Block>

      {/* Content */}
      <Block role="ScrollArea" className="flex-1">
        <Block role="Stack" gap={4} className="p-3">
          {/* Project Name */}
          <Block role="Group" gap={1}>
            <Text role="Caption" prominence="Subtle" className="font-semibold" content="Project" />
            <Text role="Body" size="sm" content={projectName} />
          </Block>

          {/* Branch */}
          <Block role="Group" gap={1}>
            <Text role="Caption" prominence="Subtle" className="font-semibold" content="Branch" />
            <Block role="Inline" layout="inline" className="gap-2">
              <GitBranch size={14} />
              <Text role="Body" size="sm" content={currentBranch} />
            </Block>
          </Block>

          {/* Stats */}
          <Block role="Group" gap={2}>
            <Text
              role="Caption"
              prominence="Subtle"
              className="font-semibold"
              content="Quick Stats"
            />
            <Block role="Stack" gap={1}>
              <Block
                role="Inline"
                layout="inline"
                justify="between"
                className="px-3 py-2 rounded bg-surface-sunken"
              >
                <Text role="Caption" prominence="Subtle" content="Files" />
                <Text role="Caption" className="font-mono" content="42" />
              </Block>
              <Block
                role="Inline"
                layout="inline"
                justify="between"
                className="px-3 py-2 rounded bg-surface-sunken"
              >
                <Text role="Caption" prominence="Subtle" content="Components" />
                <Text role="Caption" className="font-mono" content="18" />
              </Block>
              <Block
                role="Inline"
                layout="inline"
                justify="between"
                className="px-3 py-2 rounded bg-surface-sunken"
              >
                <Text role="Caption" prominence="Subtle" content="Lines" />
                <Text role="Caption" className="font-mono" content="2,547" />
              </Block>
            </Block>
          </Block>

          {/* Run Configs */}
          <Block role="Group" gap={2}>
            <Text
              role="Caption"
              prominence="Subtle"
              className="font-semibold"
              content="Run Configurations"
            />
            <Block role="Stack" gap={1}>
              <Action
                role="Button"
                icon={<Play size={14} />}
                label="dev"
                prominence="Subtle"
                className="w-full justify-start"
              />
              <Action
                role="Button"
                icon={<Play size={14} />}
                label="build"
                prominence="Subtle"
                className="w-full justify-start"
              />
              <Action
                role="Button"
                icon={<Play size={14} />}
                label="test"
                prominence="Subtle"
                className="w-full justify-start"
              />
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const SettingsPanel = ({ onOpenSettings }: { onOpenSettings?: () => void }) => {
  return (
    <Block role="Stack" gap="none" className="h-full">
      {/* Header */}
      <Block role="Toolbar" density="Compact" className="px-3 border-b border-border-default">
        <Block role="Inline" layout="inline" className="gap-2">
          <Settings size={16} className="text-accent" />
          <Text role="Title" size="sm" prominence="Standard" content="Quick Settings" />
        </Block>
      </Block>

      {/* Content */}
      <Block role="ScrollArea" className="flex-1">
        <Block role="Stack" gap={4} className="p-3">
          <Block role="Group" gap={2}>
            <Text role="Caption" prominence="Subtle" className="font-semibold" content="Editor" />
            <Block role="Stack" gap={1}>
              <Block
                role="Inline"
                layout="inline"
                justify="between"
                className="px-3 py-2 rounded bg-surface-sunken cursor-pointer"
              >
                <Text role="Body" size="sm" content="Auto Save" />
                <input type="checkbox" className="accent-accent" defaultChecked />
              </Block>
              <Block
                role="Inline"
                layout="inline"
                justify="between"
                className="px-3 py-2 rounded bg-surface-sunken cursor-pointer"
              >
                <Text role="Body" size="sm" content="Format on Save" />
                <input type="checkbox" className="accent-accent" defaultChecked />
              </Block>
              <Block
                role="Inline"
                layout="inline"
                justify="between"
                className="px-3 py-2 rounded bg-surface-sunken cursor-pointer"
              >
                <Text role="Body" size="sm" content="Line Numbers" />
                <input type="checkbox" className="accent-accent" defaultChecked />
              </Block>
            </Block>
          </Block>

          <Block role="Group" gap={2}>
            <Text
              role="Caption"
              prominence="Subtle"
              className="font-semibold"
              content="Appearance"
            />
            <Block role="Stack" gap={1}>
              <Block
                role="Inline"
                layout="inline"
                justify="between"
                className="px-3 py-2 rounded bg-surface-sunken cursor-pointer"
              >
                <Text role="Body" size="sm" content="Minimap" />
                <input type="checkbox" className="accent-accent" />
              </Block>
              <Block
                role="Inline"
                layout="inline"
                justify="between"
                className="px-3 py-2 rounded bg-surface-sunken cursor-pointer"
              >
                <Text role="Body" size="sm" content="Breadcrumbs" />
                <input type="checkbox" className="accent-accent" defaultChecked />
              </Block>
            </Block>
          </Block>

          <Action
            role="Button"
            icon={<Settings size={14} />}
            label="Open Settings"
            prominence="Subtle"
            className="w-full justify-start"
            onClick={onOpenSettings}
          />
        </Block>
      </Block>
    </Block>
  );
};
