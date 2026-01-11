import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { Section } from '@/components/types/Section/Section';

export function SectionShowcasePage() {
  const categories = [
    { id: 'bar', label: '1. Bar Category' },
    { id: 'panel', label: '2. Panel Category' },
    { id: 'main', label: '3. Main Category' },
    { id: 'overlay', label: '4. Overlay Category' },
    { id: 'validation', label: '5. Rules & Validation' },
  ];

  const handleCategoryChange = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ShowcasePage
      title="Section Showcase"
      subtitle="IDDL v5 Specification"
      description="Semantic regions providing design context (Direction, Density, Rules) to child blocks."
      categories={categories}
      activeCategoryId="bar"
      onCategoryChange={handleCategoryChange}
    >
      {/* 1. Bar Category */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6} id="bar">
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="1. Bar Category" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Horizontal, fixed-height strips. Default Density: Compact."
          />
        </Block>

        <Block role="Stack" gap={4}>
          <Section role="Header" className="border border-border-default p-4">
            <Text role="Label" content="Header Section" prominence="Strong" />
            <Block role="Toolbar">
              <Text role="Caption" content="Toolbar inside Header (Flat by default)" />
              <Action role="Button" label="Action 1" />
              <Action role="Button" label="Action 2" />
            </Block>
          </Section>

          <Section role="Footer" className="border border-border-default p-4">
            <Text role="Label" content="Footer Section" prominence="Strong" />
            <Block role="Group" className="flex justify-between w-full">
              <Text role="Caption" content="Footer Status" />
              <Action role="Button" label="Close" />
            </Block>
          </Section>

          <Section role="Toolbar" className="border border-border-default p-2">
            <Text role="Label" content="Toolbar Section" prominence="Strong" />
            <Block role="Stack" gap={2}>
              <Text role="Caption" content="Dedicated Toolbar Section" />
            </Block>
          </Section>
        </Block>
      </Block>

      <Block role="Divider" className="my-12" />

      {/* 2. Panel Category */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6} id="panel">
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="2. Panel Category" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Vertical, resizable areas. Sidebars, Panels, Rails."
          />
        </Block>

        <div className="flex gap-4 h-[300px] border border-border-default bg-surface-base">
          <Section
            role="ActivityBar"
            className="border-r border-border-default p-2 w-[50px] items-center"
          >
            <Action role="Button" label="A" />
            <Action role="Button" label="B" />
          </Section>

          <Section
            role="Sidebar"
            className="border-r border-border-default p-4 w-[200px] bg-surface-sunken"
          >
            <Text role="Label" content="Sidebar" prominence="Strong" />
            <Block role="List" className="mt-4">
              <Action role="ListItem">
                <Text content="Explorer" />
              </Action>
              <Action role="ListItem">
                <Text content="Search" />
              </Action>
            </Block>
          </Section>

          <Section role="Panel" className="flex-1 p-4">
            <Text role="Label" content="Panel / Content" prominence="Strong" />
            <Text role="Body" content="Flexible content area within the layout." />
          </Section>
        </div>
      </Block>

      <Block role="Divider" className="my-12" />

      {/* 3. Main Category */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6} id="main">
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="3. Main Category" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Primary content areas. Density: Comfortable. Allows Hero elements."
          />
        </Block>

        <Section
          role="Main"
          className="border border-border-default p-8 bg-surface-base min-h-[200px]"
        >
          <Text role="Title" prominence="Hero" content="Main Region" />
          <Text
            role="Body"
            content="The primary focus of the user's task. Supports rich content and deep nesting."
          />
          <Block role="Card" className="mt-4 p-4">
            <Text role="Heading" content="Content Card" />
          </Block>
        </Section>
      </Block>

      <Block role="Divider" className="my-12" />

      {/* 4. Overlay Category */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6} id="overlay">
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="4. Overlay Category" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Floating regions. Modals, Drawers, Popovers."
          />
        </Block>

        <div className="relative h-[300px] border border-border-default bg-surface-subtle p-8 flex items-center justify-center">
          {/* Simulation of a Modal */}
          <Section
            role="Modal"
            className="bg-surface p-0 shadow-xl rounded-lg w-[400px] border border-border-muted"
          >
            <Section role="DialogHeader" className="p-4 border-b border-border-muted">
              <Text role="Label" content="Modal Title" prominence="Strong" />
            </Section>
            <Section role="DialogContent" className="p-6">
              <Text role="Body" content="This is a simulated modal content area." />
            </Section>
            <Section
              role="DialogFooter"
              className="p-4 border-t border-border-muted bg-surface-raised flex justify-end gap-2"
            >
              <Action role="Button" label="Cancel" />
              <Action role="Button" label="Confirm" prominence="Strong" />
            </Section>
          </Section>
        </div>
      </Block>

      <Block role="Divider" className="my-12" />

      {/* 5. Validation */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6} id="validation">
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="5. Rules & Validation" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Sections enforce rules on their children. Open Console to see warnings."
          />
        </Block>

        <Section role="Header" className="border border-yellow-200 bg-yellow-50 p-4">
          <Text role="Label" content="Header (Restricted)" />
          <Text
            role="Caption"
            content="Try adding a 'DataTable' here in code to see a console warning."
          />

          {/* Uncomment to test validation: */}
          {/* <Block role="DataTable" /> */}
        </Section>
      </Block>
    </ShowcasePage>
  );
}
