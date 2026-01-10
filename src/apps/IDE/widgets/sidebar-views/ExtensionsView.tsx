import { DownloadCloud, Filter, Star } from 'lucide-react';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { Section } from '@/components/types/Section/Section';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { SidebarHeader } from './SidebarHeader';

export const ExtensionsView = () => {
  // Mock extensions
  const extensions = [
    {
      name: 'ESLint',
      publisher: 'Microsoft',
      description: 'Integrates ESLint JavaScript into VS Code.',
      installs: '25M',
      rating: 4.5,
      installed: true,
    },
    {
      name: 'Prettier - Code formatter',
      publisher: 'Prettier',
      description: 'Code formatter using prettier',
      installs: '38M',
      rating: 4.8,
      installed: true,
    },
    {
      name: 'Tailwind CSS IntelliSense',
      publisher: 'Brad Cornes',
      description: 'Intelligent Tailwind CSS tooling for VS Code',
      installs: '8M',
      rating: 5.0,
      installed: false,
    },
    {
      name: 'GitLens',
      publisher: 'GitKraken',
      description: 'Supercharge Git within VS Code',
      installs: '12M',
      rating: 4.9,
      installed: false,
    },
  ];

  return (
    <>
      <SidebarHeader
        title="EXTENSIONS"
        actions={
          <div className="flex items-center gap-1">
            <Action
              role="IconButton"
              icon="Filter"
              label="Filter Extensions"
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
              label="Views and More Actions"
              prominence="Subtle"
              density="Compact"
            />
          </div>
        }
      />

      <Section role="Container" className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Search */}
        <Block role="Container" className="flex flex-col gap-2">
          <Input placeholder="Search Extensions in Marketplace" className="text-sm font-sans" />
        </Block>

        {/* Installed */}
        <Block role="List" className="flex flex-col gap-4">
          <div className="px-1 py-1 text-xs font-bold text-text-tertiary uppercase tracking-wider">
            Installed
          </div>

          {extensions
            .filter((e) => e.installed)
            .map((ext, idx) => (
              <ExtensionCard key={idx} {...ext} />
            ))}
        </Block>

        {/* Recommended */}
        <Block role="List" className="flex flex-col gap-4 pt-4 border-t border-border-muted">
          <div className="px-1 py-1 text-xs font-bold text-text-tertiary uppercase tracking-wider">
            Recommended
          </div>

          {extensions
            .filter((e) => !e.installed)
            .map((ext, idx) => (
              <ExtensionCard key={idx} {...ext} />
            ))}
        </Block>
      </Section>
    </>
  );
};

const ExtensionCard = ({ name, publisher, description, installs, rating, installed }: any) => {
  return (
    <Block
      role="Card"
      className="flex gap-3 hover:bg-surface-hover p-2 rounded-lg cursor-pointer group bg-transparent border-0 shadow-none"
    >
      {/* Icon */}
      <div className="w-10 h-10 bg-accent/10 rounded overflow-hidden flex-shrink-0 flex items-center justify-center text-accent font-bold text-lg uppercase">
        {name.substring(0, 2)}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <Text role="Body" content={name} className="font-bold text-sm truncate" />
        </div>
        <Text
          role="Body"
          content={description}
          className="text-xs text-text-secondary line-clamp-2"
        />
        <div className="flex items-center gap-3 mt-1 text-[10px] text-text-tertiary">
          <span className="flex items-center gap-0.5">
            <DownloadCloud size={10} /> {installs}
          </span>
          <span className="flex items-center gap-0.5">
            <Star size={10} className="fill-current" /> {rating}
          </span>
          <span>{publisher}</span>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        {installed ? (
          <Action
            role="IconButton"
            icon="Settings"
            label="Manage"
            prominence="Subtle"
            density="Compact"
            className="opacity-0 group-hover:opacity-100"
          />
        ) : (
          <Button
            size="sm"
            variant="secondary"
            className="h-6 text-[10px] px-2 bg-surface-raised hover:bg-accent hover:text-white transition-colors"
          >
            Install
          </Button>
        )}
      </div>
    </Block>
  );
};
