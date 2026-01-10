/**
 * OverlayShowcasePage - Overlay Component Showcase
 */

import { useState } from 'react';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';
import { Field } from '@/components/types/Atom/Field/Field';
import { Action } from '@/components/types/Atom/Action/Action';
import { Overlay } from '@/components/types/Overlay/Overlay';

export function OverlayShowcasePage() {
  const [selectedRole, setSelectedRole] = useState<string>('Dialog');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Page role="Application" layout="Studio">
      <Section role="Toolbar" prominence="Standard">
        <Group role="Toolbar" layout="inline" density="Compact">
          <Text role="Title" prominence="Primary" content="Overlay Component Showcase" />
        </Group>
      </Section>

      <Section role="PrimarySidebar" prominence="Standard">
        <Group role="Container" layout="stack" density="Comfortable" className="p-4 gap-4">
          <Group role="Fieldset" layout="stack">
            <Text role="Label" content="Overlay Role" prominence="Primary" />
            <Field
              label=""
              model="overlayRole"
              type="select"
              value={selectedRole}
              onChange={(value) => setSelectedRole(value as string)}
              options={[
                { label: 'Dialog', value: 'Dialog' },
                { label: 'Drawer', value: 'Drawer' },
                { label: 'Popover', value: 'Popover' },
                { label: 'Tooltip', value: 'Tooltip' },
                { label: 'Floating', value: 'Floating' },
              ]}
            />
          </Group>
          <Action
            label="Open Overlay"
            prominence="Primary"
            intent="Brand"
            onClick={() => setIsOpen(true)}
          />
        </Group>
      </Section>

      <Section role="Editor" prominence="Standard">
        <Group role="Container" className="p-8">
          <Group role="Card" prominence="Standard" className="p-4">
            <Text role="Title" prominence="Primary" content={`Overlay role="${selectedRole}"`} />
            <Text role="Body" prominence="Secondary" content="Overlay 컴포넌트의 Live Preview입니다." />
          </Group>
        </Group>
      </Section>

      <Section role="SecondarySidebar" prominence="Standard">
        <Group role="Container" layout="stack" density="Comfortable" className="p-4 gap-4">
          <Text role="Title" prominence="Primary" content="IDDL Specification" />
          <Group role="Card" prominence="Subtle" className="p-3">
            <Text role="Code" prominence="Secondary" content={`<Overlay role="${selectedRole}" isOpen={true}>`} />
          </Group>
        </Group>
      </Section>

      {/* Example Overlay */}
      <Overlay
        id="example-overlay"
        role={selectedRole as any}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Group role="Card" className="p-4">
          <Text role="Title" prominence="Primary" content={`${selectedRole} Example`} />
          <Text role="Body" prominence="Secondary" content="이것은 예제 Overlay입니다." />
          <Action label="Close" onClick={() => setIsOpen(false)} />
        </Group>
      </Overlay>
    </Page>
  );
}
