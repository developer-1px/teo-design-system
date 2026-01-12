/**
 * PageShowcasePage - Enhanced IDDL Page Showcase with Interactive Controls
 *
 * Features:
 * - FloatingControlPanel for real-time property manipulation
 * - Diverse examples for each PageRole
 * - Live preview with actual content
 * - All IDDL axes: role × prominence × density × intent
 */

import { useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { ROLE_LAYOUT_MAP } from '@/apps/PAGE/lib/page-constants';
import { ApplicationExample } from '@/apps/PAGE/widgets/examples/ApplicationExample';
import { DocumentExample } from '@/apps/PAGE/widgets/examples/DocumentExample';
import { FocusExample } from '@/apps/PAGE/widgets/examples/FocusExample';
import { ImmersiveExample } from '@/apps/PAGE/widgets/examples/ImmersiveExample';
import { OverlayExample } from '@/apps/PAGE/widgets/examples/OverlayExample';
import { PaperExample } from '@/apps/PAGE/widgets/examples/PaperExample';
import { Page } from '@/components/dsl/Page/Page';
import type { PageLayout, PageRole } from '@/components/dsl/Page/Page.types';
import type { Density, Intent, Prominence } from '@/components/dsl/Shared.types';
import { FloatingControlPanel } from '@/components/workspace/FloatingControlPanel';

/**
 * Component map for each PageRole
 */
const EXAMPLE_COMPONENTS: Record<PageRole, React.ComponentType<{ layout: PageLayout }>> = {
  Document: DocumentExample,
  Application: ApplicationExample,
  Focus: FocusExample,
  Immersive: ImmersiveExample,
  Overlay: OverlayExample,
  Paper: PaperExample,
};

export function PageShowcasePage() {
  // Page properties state (URL Synced via wouter)
  const [location, setLocation] = useLocation();
  const queryString = useSearch(); // Returns string like "role=Document&layout=Single"
  const searchParams = new URLSearchParams(queryString);

  const role = (searchParams.get('role') as PageRole) || 'Document';
  const layout = (searchParams.get('layout') as PageLayout) || 'Single';
  const prominence = (searchParams.get('prominence') as Prominence) || 'Standard';
  const density = (searchParams.get('density') as Density) || 'Standard';
  const intent = (searchParams.get('intent') as Intent) || 'Neutral';

  // Get available layouts for current role
  const availableLayouts = [...(ROLE_LAYOUT_MAP[role] || ['Single'])];

  // Helper to update URL params
  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(queryString);
    newParams.set(key, value);
    // wouter setLocation takes a path, so we append the search string
    setLocation(location + '?' + newParams.toString(), { replace: true });
  };

  // Handle role change (reset layout to first available)
  const handleRoleChange = (newRole: PageRole) => {
    const newParams = new URLSearchParams(queryString);
    newParams.set('role', newRole);
    newParams.set('layout', ROLE_LAYOUT_MAP[newRole][0]);
    setLocation(location + '?' + newParams.toString(), { replace: true });
  };

  // Get the appropriate example component
  const ExampleComponent = EXAMPLE_COMPONENTS[role] || DocumentExample;

  return (
    <>
      {/* Floating Control Panel */}
      <FloatingControlPanel
        role={role}
        layout={layout}
        prominence={prominence}
        density={density}
        intent={intent}
        availableLayouts={availableLayouts}
        onRoleChange={handleRoleChange}
        onLayoutChange={(val) => updateParam('layout', val)}
        onProminenceChange={(val) => updateParam('prominence', val)}
        onDensityChange={(val) => updateParam('density', val)}
        onIntentChange={(val) => updateParam('intent', val)}
      />

      {/* Live Preview */}
      <Page
        role={role}
        layout={layout}
        prominence={prominence}
        density={density}
        intent={intent}
        title={`${role} - ${layout}`}
      >
        <ExampleComponent layout={layout} />
      </Page>
    </>
  );
}

export { PageShowcasePage as AppPage };
