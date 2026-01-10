import { Bell, Clock, GitBranch, MessageSquare, User } from 'lucide-react';
import { useState } from 'react';
import { Action } from '@/components/types/Atom/Action/Action.tsx';
import { Section } from '@/components/types/Section/Section.tsx';

interface RightSidebarProps {
  onClose?: () => void;
}

export const RightSidebar = ({ onClose }: RightSidebarProps) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'git' | 'chat' | 'history'>(
    'notifications'
  );

  return (
    <Section role="Container" className="flex w-80 flex-col overflow-hidden">
      {/* Header with tabs */}
      <div className="flex items-center justify-between px-2 py-1.5">
        <div className="flex gap-1">
          <Action
            role="IconButton"
            icon="Bell"
            label="Notifications"
            density="Compact"
            selected={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
          />
          <Action
            role="IconButton"
            icon="GitBranch"
            label="Git Changes"
            density="Compact"
            selected={activeTab === 'git'}
            onClick={() => setActiveTab('git')}
          />
          <Action
            role="IconButton"
            icon="MessageSquare"
            label="Chat"
            density="Compact"
            selected={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
          />
          <Action
            role="IconButton"
            icon="Clock"
            label="History"
            density="Compact"
            selected={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          />
        </div>
        <Action
          role="IconButton"
          icon="X"
          label="Close"
          density="Compact"
          onClick={onClose}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === 'notifications' && (
          <div className="space-y-1.5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Notifications
            </h3>
            {[
              {
                icon: <GitBranch size={14} />,
                title: 'Branch merged',
                desc: 'feature/ui-kit → main',
                time: '2m ago',
              },
              {
                icon: <User size={14} />,
                title: 'Code review',
                desc: 'PR #123 approved',
                time: '5m ago',
              },
              {
                icon: <MessageSquare size={14} />,
                title: 'New comment',
                desc: 'On layer-system.md',
                time: '10m ago',
              },
            ].map((item, i) => (
              <Section
                key={i}
                role="Container"
                className="p-2 rounded-lg transition-all hover:shadow-layer-4 cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 text-accent">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text">{item.title}</div>
                    <div className="text-xs text-text-secondary truncate">{item.desc}</div>
                    <div className="mt-1 text-xs text-text-tertiary">{item.time}</div>
                  </div>
                </div>
              </Section>
            ))}
          </div>
        )}

        {activeTab === 'git' && (
          <div className="space-y-1.5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Git Changes
            </h3>
            <Section role="Container" className="p-2">
              <div className="text-sm text-text-secondary">
                <div className="mb-2 text-xs text-text-tertiary">Modified (3)</div>
                <div className="space-y-1 font-mono text-xs">
                  <div>src/App.tsx</div>
                  <div>src/components/ui/layer.tsx</div>
                  <div>tailwind.config.js</div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-1.5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Team Chat
            </h3>
            <div className="text-center text-text-tertiary text-sm py-6">No messages yet</div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-1.5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Recent History
            </h3>
            <Section role="Container" className="p-2">
              <div className="space-y-2 text-xs">
                <div>
                  <div className="font-medium text-text">Edited App.tsx</div>
                  <div className="text-text-tertiary">2 minutes ago</div>
                </div>
                <div>
                  <div className="font-medium text-text">Created layer.tsx</div>
                  <div className="text-text-tertiary">5 minutes ago</div>
                </div>
              </div>
            </Section>
          </div>
        )}
      </div>
    </Section>
  );
};
