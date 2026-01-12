/**
 * PageShowcasePage - Enhanced IDDL Page Showcase with Interactive Controls
 *
 * Features:
 * - FloatingControlPanel for real-time property manipulation
 * - Diverse examples for each PageRole
 * - Live preview with actual content
 * - All IDDL axes: role × prominence × density × intent
 */

import { useState } from 'react';
import { Page } from '@/components/dsl/Page/Page';
import type { PageRole, PageLayout } from '@/components/dsl/Page/Page.types';
import type { Prominence, Density, Intent } from '@/components/dsl/Shared.types';
import { FloatingControlPanel } from '@/components/workspace/FloatingControlPanel';
import { DocumentExample } from '@/apps/PAGE/widgets/examples/DocumentExample';
import { ApplicationExample } from '@/apps/PAGE/widgets/examples/ApplicationExample';
import { FocusExample } from '@/apps/PAGE/widgets/examples/FocusExample';
import { ImmersiveExample } from '@/apps/PAGE/widgets/examples/ImmersiveExample';
import { OverlayExample } from '@/apps/PAGE/widgets/examples/OverlayExample';
import { PaperExample } from '@/apps/PAGE/widgets/examples/PaperExample';
import { ROLE_LAYOUT_MAP } from '@/apps/PAGE/lib/page-constants';

/**
 * Component map for each PageRole
 */
const EXAMPLE_COMPONENTS: Record<PageRole, React.ComponentType<{ layout?: PageLayout }>> = {
  Document: DocumentExample,
  Application: ApplicationExample,
  Focus: FocusExample,
  Immersive: ImmersiveExample,
  Overlay: OverlayExample,
  Paper: PaperExample,
};

export function PageShowcasePage() {
  // Page properties state
  const [role, setRole] = useState<PageRole>('Document');
  const [layout, setLayout] = useState<PageLayout>('Single');
  const [prominence, setProminence] = useState<Prominence>('Standard');
  const [density, setDensity] = useState<Density>('Standard');
  const [intent, setIntent] = useState<Intent>('Neutral');

  // Get available layouts for current role
  const availableLayouts = [...(ROLE_LAYOUT_MAP[role] || ['Single'])];

  // Handle role change (reset layout to first available)
  const handleRoleChange = (newRole: PageRole) => {
    setRole(newRole);
    setLayout(ROLE_LAYOUT_MAP[newRole][0]);
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
        onLayoutChange={setLayout}
        onProminenceChange={setProminence}
        onDensityChange={setDensity}
        onIntentChange={setIntent}
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
