/**
 * ActionShowcasePage - Action Component Showcase
 */

import { useState } from 'react';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';
import { Field } from '@/components/types/Atom/Field/Field';
import { Action } from '@/components/types/Atom/Action/Action';

export function ActionShowcasePage() {
  const [selectedRole, setSelectedRole] = useState<string>('Button');
  const [selectedProminence, setSelectedProminence] = useState<string>('Primary');
  const [selectedIntent, setSelectedIntent] = useState<string>('Brand');

  return (
    <Page role="Application" layout="Studio">
      <Section role="Toolbar" prominence="Standard">
        <Group role="Toolbar" layout="inline" density="Compact">
          <Text role="Title" prominence="Primary" content="Action Component Showcase" />
        </Group>
      </Section>

      <Section role="PrimarySidebar" prominence="Standard">
        <Group role="Container" layout="stack" density="Comfortable" className="p-4 gap-4">
          <Group role="Fieldset" layout="stack">
            <Text role="Label" content="Action Role" prominence="Primary" />
            <Field
              label=""
              model="actionRole"
              type="select"
              value={selectedRole}
              onChange={(value) => setSelectedRole(value as string)}
              options={[
                { label: 'Button', value: 'Button' },
                { label: 'IconButton', value: 'IconButton' },
                { label: 'Link', value: 'Link' },
              ]}
            />
          </Group>

          <Group role="Fieldset" layout="stack">
            <Text role="Label" content="Prominence" prominence="Primary" />
            <Field
              label=""
              model="prominence"
              type="select"
              value={selectedProminence}
              onChange={(value) => setSelectedProminence(value as string)}
              options={[
                { label: 'Hero', value: 'Hero' },
                { label: 'Primary', value: 'Primary' },
                { label: 'Secondary', value: 'Secondary' },
                { label: 'Tertiary', value: 'Tertiary' },
              ]}
            />
          </Group>

          <Group role="Fieldset" layout="stack">
            <Text role="Label" content="Intent" prominence="Primary" />
            <Field
              label=""
              model="intent"
              type="select"
              value={selectedIntent}
              onChange={(value) => setSelectedIntent(value as string)}
              options={[
                { label: 'Neutral', value: 'Neutral' },
                { label: 'Brand', value: 'Brand' },
                { label: 'Positive', value: 'Positive' },
                { label: 'Caution', value: 'Caution' },
                { label: 'Critical', value: 'Critical' },
              ]}
            />
          </Group>
        </Group>
      </Section>

      <Section role="Editor" prominence="Standard">
        <Group role="Container" className="p-8">
          <Group role="Card" prominence="Standard" className="p-4 gap-4">
            <Text
              role="Title"
              prominence="Primary"
              content={`Action role="${selectedRole}" prominence="${selectedProminence}" intent="${selectedIntent}"`}
            />
            <Action
              role={selectedRole as any}
              label="Example Action"
              icon={selectedRole === 'IconButton' ? 'Zap' : undefined}
              prominence={selectedProminence as any}
              intent={selectedIntent as any}
              onClick={() => alert('Action clicked!')}
            />
          </Group>
        </Group>
      </Section>

      <Section role="SecondarySidebar" prominence="Standard">
        <Group role="Container" layout="stack" density="Comfortable" className="p-4 gap-4">
          <Text role="Title" prominence="Primary" content="IDDL Specification" />
          <Group role="Card" prominence="Subtle" className="p-3">
            <Text
              role="Code"
              prominence="Secondary"
              content={`<Action role="${selectedRole}" prominence="${selectedProminence}" intent="${selectedIntent}" />`}
            />
          </Group>
        </Group>
      </Section>
    </Page>
  );
}
