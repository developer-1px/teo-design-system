/**
 * RightBar - Right sidebar panel with different views
 */

import { Section } from '@/components/Section/Section.tsx';
import { Button } from '@/components/Action/role/Button';
import { AIAgentChat } from '@/apps/IDE/widgets/chat/AIAgentChat.tsx';
import {
  GitBranch,
  Play,
  Download,
  Upload,
  FolderOpen,
  Settings as SettingsIcon,
} from 'lucide-react';

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
    <Section role="Aside" prominence="Secondary" className="flex w-80 flex-col overflow-hidden bg-surface-cool boundary-shadow-left">
      {renderContent()}
    </Section>
  );
};

// ============================================================================
// Panel Components
// ============================================================================

const AIPanel = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AIAgentChat hideHeader={false} className="flex-1" />
    </div>
  );
};

const GitPanel = ({ currentBranch }: { currentBranch: string }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-default">
        <GitBranch size={16} className="text-accent" />
        <h3 className="text-sm font-semibold text-text">Source Control</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Current Branch */}
        <div>
          <div className="text-xs font-semibold text-subtle mb-2">Current Branch</div>
          <div className="flex items-center gap-2 px-3 py-2 rounded bg-surface-sunken">
            <GitBranch size={14} />
            <span className="text-sm text-text">{currentBranch}</span>
          </div>
        </div>

        {/* Actions */}
        <div>
          <div className="text-xs font-semibold text-subtle mb-2">Actions</div>
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <Download size={14} />
              <span>Pull</span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <Upload size={14} />
              <span>Push</span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <GitBranch size={14} />
              <span>Branches</span>
            </Button>
          </div>
        </div>

        {/* Changes */}
        <div>
          <div className="text-xs font-semibold text-subtle mb-2">Changes</div>
          <div className="text-xs text-muted px-2 py-4 text-center">
            No changes detected
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectInfoPanel = ({ projectName, currentBranch }: { projectName: string; currentBranch: string }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-default">
        <FolderOpen size={16} className="text-accent" />
        <h3 className="text-sm font-semibold text-text">Project Info</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Project Name */}
        <div>
          <div className="text-xs font-semibold text-subtle mb-1">Project</div>
          <div className="text-sm text-text">{projectName}</div>
        </div>

        {/* Branch */}
        <div>
          <div className="text-xs font-semibold text-subtle mb-1">Branch</div>
          <div className="flex items-center gap-2">
            <GitBranch size={14} />
            <span className="text-sm text-text">{currentBranch}</span>
          </div>
        </div>

        {/* Stats */}
        <div>
          <div className="text-xs font-semibold text-subtle mb-2">Quick Stats</div>
          <div className="space-y-2">
            <div className="flex justify-between px-3 py-2 rounded bg-surface-sunken">
              <span className="text-xs text-muted">Files</span>
              <span className="text-xs text-text font-mono">42</span>
            </div>
            <div className="flex justify-between px-3 py-2 rounded bg-surface-sunken">
              <span className="text-xs text-muted">Components</span>
              <span className="text-xs text-text font-mono">18</span>
            </div>
            <div className="flex justify-between px-3 py-2 rounded bg-surface-sunken">
              <span className="text-xs text-muted">Lines</span>
              <span className="text-xs text-text font-mono">2,547</span>
            </div>
          </div>
        </div>

        {/* Run Configs */}
        <div>
          <div className="text-xs font-semibold text-subtle mb-2">Run Configurations</div>
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <Play size={14} />
              <span>dev</span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <Play size={14} />
              <span>build</span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <Play size={14} />
              <span>test</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPanel = ({ onOpenSettings }: { onOpenSettings?: () => void }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-default">
        <SettingsIcon size={16} className="text-accent" />
        <h3 className="text-sm font-semibold text-text">Quick Settings</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div>
          <div className="text-xs font-semibold text-subtle mb-2">Editor</div>
          <div className="space-y-2">
            <label className="flex items-center justify-between px-3 py-2 rounded bg-surface-sunken cursor-pointer">
              <span className="text-sm text-text">Auto Save</span>
              <input type="checkbox" className="accent-accent" defaultChecked />
            </label>
            <label className="flex items-center justify-between px-3 py-2 rounded bg-surface-sunken cursor-pointer">
              <span className="text-sm text-text">Format on Save</span>
              <input type="checkbox" className="accent-accent" defaultChecked />
            </label>
            <label className="flex items-center justify-between px-3 py-2 rounded bg-surface-sunken cursor-pointer">
              <span className="text-sm text-text">Line Numbers</span>
              <input type="checkbox" className="accent-accent" defaultChecked />
            </label>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-subtle mb-2">Appearance</div>
          <div className="space-y-2">
            <label className="flex items-center justify-between px-3 py-2 rounded bg-surface-sunken cursor-pointer">
              <span className="text-sm text-text">Minimap</span>
              <input type="checkbox" className="accent-accent" />
            </label>
            <label className="flex items-center justify-between px-3 py-2 rounded bg-surface-sunken cursor-pointer">
              <span className="text-sm text-text">Breadcrumbs</span>
              <input type="checkbox" className="accent-accent" defaultChecked />
            </label>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={onOpenSettings}
        >
          <SettingsIcon size={14} />
          <span>Open Settings</span>
        </Button>
      </div>
    </div>
  );
};
