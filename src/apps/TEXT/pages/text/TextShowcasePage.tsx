/**
 * TextShowcasePage - Text Component Showcase
 */

import { useState } from 'react';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';
import { Field } from '@/components/types/Atom/Field/Field';

export function TextShowcasePage() {
  const [selectedRole, setSelectedRole] = useState<string>('Body');
  const [selectedProminence, setSelectedProminence] = useState<string>('Primary');

  return (
    <Page role="Application" layout="Studio">
      <Section role="Toolbar" prominence="Standard">
        <Group role="Toolbar" layout="inline" density="Compact">
          <Text role="Title" prominence="Primary" content="Text Component Showcase" />
        </Group>
      </Section>

      <Section role="PrimarySidebar" prominence="Standard">
        <Group role="Container" layout="stack" density="Comfortable" className="p-4 gap-4">
          <Group role="Fieldset" layout="stack">
            <Text role="Label" content="Text Role" prominence="Primary" />
            <Field
              label=""
              model="textRole"
              type="select"
              value={selectedRole}
              onChange={(value) => setSelectedRole(value as string)}
              options={[
                { label: 'Title', value: 'Title' },
                { label: 'Body', value: 'Body' },
                { label: 'Label', value: 'Label' },
                { label: 'Caption', value: 'Caption' },
                { label: 'Code', value: 'Code' },
                { label: 'Kbd', value: 'Kbd' },
                { label: 'Badge', value: 'Badge' },
                { label: 'Tag', value: 'Tag' },
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
                { label: 'Subtle', value: 'Subtle' },
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
              content={`Text role="${selectedRole}" prominence="${selectedProminence}"`}
            />
            <Text
              role={selectedRole as any}
              prominence={selectedProminence as any}
              content="이것은 예제 텍스트입니다. The quick brown fox jumps over the lazy dog."
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
              content={`<Text role="${selectedRole}" prominence="${selectedProminence}" />`}
            />
          </Group>
        </Group>
      </Section>
    </Page>
  );
}
