/**
 * SectionShowcasePage - Section Component Showcase
 */

import { useState } from 'react';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';
import { Field } from '@/components/types/Atom/Field/Field';

export function SectionShowcasePage() {
  const [selectedRole, setSelectedRole] = useState<string>('Container');

  return (
    <Page role="Application" layout="Studio">
      <Section role="Toolbar" prominence="Standard">
        <Group role="Toolbar" layout="inline" density="Compact">
          <Text role="Title" prominence="Primary" content="Section Component Showcase" />
        </Group>
      </Section>

      <Section role="PrimarySidebar" prominence="Standard">
        <Group role="Container" layout="stack" density="Comfortable" className="p-4 gap-4">
          <Group role="Fieldset" layout="stack">
            <Text role="Label" content="Section Role" prominence="Primary" />
            <Field
              label=""
              model="sectionRole"
              type="select"
              value={selectedRole}
              onChange={(value) => setSelectedRole(value as string)}
              options={[
                { label: 'Container', value: 'Container' },
                { label: 'Toolbar', value: 'Toolbar' },
                { label: 'Panel', value: 'Panel' },
                { label: 'Main', value: 'Main' },
                { label: 'Editor', value: 'Editor' },
                { label: 'PrimarySidebar', value: 'PrimarySidebar' },
                { label: 'SecondarySidebar', value: 'SecondarySidebar' },
              ]}
            />
          </Group>
        </Group>
      </Section>

      <Section role="Editor" prominence="Standard">
        <Group role="Container" className="p-8">
          <Group role="Card" prominence="Standard" className="p-4">
            <Text role="Title" prominence="Primary" content={`Section role="${selectedRole}"`} />
            <Text role="Body" prominence="Secondary" content="Section 컴포넌트의 Live Preview입니다." />
          </Group>
        </Group>
      </Section>

      <Section role="SecondarySidebar" prominence="Standard">
        <Group role="Container" layout="stack" density="Comfortable" className="p-4 gap-4">
          <Text role="Title" prominence="Primary" content="IDDL Specification" />
          <Group role="Card" prominence="Subtle" className="p-3">
            <Text role="Code" prominence="Secondary" content={'<Section role="Container" gridArea="main">'} />
          </Group>
        </Group>
      </Section>
    </Page>
  );
}
