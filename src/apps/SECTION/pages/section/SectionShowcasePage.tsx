import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section';

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
      <Block role="Container" density="Comfortable" id="bar">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="1. Bar Category" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Horizontal, fixed-height strips. Default Density: Compact."
          />
        </Block>

        <Block role="Stack">
          <Section role="Header">
            <Text role="Label" content="Header Section" prominence="Strong" />
            <Block role="Toolbar">
              <Text role="Caption" content="Toolbar inside Header (Flat by default)" />
              <Action role="Button" label="Action 1" />
              <Action role="Button" label="Action 2" />
            </Block>
          </Section>

          <Section role="Footer">
            <Text role="Label" content="Footer Section" prominence="Strong" />
            <Block role="Toolbar">
              <Text role="Caption" content="Footer Status" />
              <Action role="Button" label="Close" />
            </Block>
          </Section>

          <Section role="Toolbar">
            <Text role="Label" content="Toolbar Section" prominence="Strong" />
            <Block role="Stack">
              <Text role="Caption" content="Dedicated Toolbar Section" />
            </Block>
          </Section>
        </Block>
      </Block>

      <Block role="Divider" />

      {/* 2. Panel Category */}
      <Block role="Container" density="Comfortable" id="panel">
        <Block role="Stack">
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
          >
            <Action role="Button" label="A" />
            <Action role="Button" label="B" />
          </Section>

          <Section
            role="Sidebar"
          >
            <Text role="Label" content="Sidebar" prominence="Strong" />
            <Block role="List">
              <Action role="ListItem">
                <Text content="Explorer" />
              </Action>
              <Action role="ListItem">
                <Text content="Search" />
              </Action>
            </Block>
          </Section>

          <Section role="Panel">
            <Text role="Label" content="Panel / Content" prominence="Strong" />
            <Text role="Body" content="Flexible content area within the layout." />
          </Section>
        </div>
      </Block>

      <Block role="Divider" />

      {/* 3. Main Category */}
      <Block role="Container" density="Comfortable" id="main">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="3. Main Category" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Primary content areas. Density: Comfortable. Allows Hero elements."
          />
        </Block>

        <Section
          role="Main"
        >
          <Text role="Title" prominence="Hero" content="Main Region" />
          <Text
            role="Body"
            content="The primary focus of the user's task. Supports rich content and deep nesting."
          />
          <Block role="Card">
            <Text role="Heading" content="Content Card" />
          </Block>
        </Section>
      </Block>

      <Block role="Divider" />

      {/* 4. Overlay Category */}
      <Block role="Container" density="Comfortable" id="overlay">
        <Block role="Stack">
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
          >
            <Section role="DialogHeader">
              <Text role="Label" content="Modal Title" prominence="Strong" />
            </Section>
            <Section role="DialogContent">
              <Text role="Body" content="This is a simulated modal content area." />
            </Section>
            <Section
              role="DialogFooter"
            >
              <Action role="Button" label="Cancel" />
              <Action role="Button" label="Confirm" prominence="Strong" />
            </Section>
          </Section>
        </div>
      </Block>

      <Block role="Divider" />

      {/* 5. Validation */}
      <Block role="Container" density="Comfortable" id="validation">
        <Block role="Stack">
          <Text role="Title" prominence="Strong" content="5. Rules & Validation" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Sections enforce rules on their children. Open Console to see warnings."
          />
        </Block>

        <Section role="Header">
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
