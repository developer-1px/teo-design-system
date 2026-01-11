import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';

export function ActionShowcasePage() {
  const intents = ['Neutral', 'Brand', 'Positive', 'Caution', 'Critical', 'Info'] as const;
  const categories = [
    { id: 'matrix', label: 'Button Matrix' },
    { id: 'states', label: 'Button States' },
    { id: 'icons', label: 'Icon Buttons' },
    { id: 'links', label: 'Links' },
  ];

  return (
    <ShowcasePage
      title="Actions"
      subtitle="Interactive Elements v2.1"
      description="Interactive elements for triggering operations and navigation."
      categories={categories}
      activeCategoryId="matrix"
    >
      {/* 1. Button Matrix */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6}>
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="1. Button Matrix" />
          <Text role="Body" prominence="Subtle" content="Combinations of Prominence and Intent." />
        </Block>

        <Block role="Card" density="Standard" className="w-full p-0 overflow-hidden">
          {/* Header Row */}
          <Block
            role="Grid"
            spec={{ columns: 7 }}
            gap={4}
            className="p-4 bg-surface-raised border-b border-border-default"
          >
            <Text role="Label" content="Prominence" prominence="Subtle" />
            {intents.map((intent) => (
              <Text key={intent} role="Label" content={intent} prominence="Subtle" />
            ))}
          </Block>

          {/* Rows */}
          {['Hero', 'Strong', 'Standard', 'Subtle'].map((prominence: any) => (
            <Block
              key={prominence}
              role="Grid"
              spec={{ columns: 7 }}
              gap={4}
              className="p-4 border-b border-border-subtle items-center"
            >
              <Text role="Label" content={prominence} prominence="Subtle" />
              {intents.map((intent) => (
                <Action
                  key={intent}
                  role="Button"
                  label="Action"
                  prominence={prominence}
                  intent={intent}
                  onClick={() => {}}
                />
              ))}
            </Block>
          ))}
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* 2. Button States */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6}>
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="2. Button States" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Interactive states like Loading, Disabled, and Selected."
          />
        </Block>

        <Block role="Grid" spec={{ columns: 4 }} density="Standard" gap={6}>
          <Block role="Card" className="p-4 items-center" gap={4}>
            <Text role="Label" content="Loading" />
            <Action role="Button" label="Saving..." loading prominence="Standard" intent="Brand" />
          </Block>
          <Block role="Card" className="p-4 items-center" gap={4}>
            <Text role="Label" content="Disabled" />
            <Action role="Button" label="Submit" disabled prominence="Standard" intent="Brand" />
          </Block>
          <Block role="Card" className="p-4 items-center" gap={4}>
            <Text role="Label" content="Selected (Toggled)" />
            <Action role="Button" label="Toggle Me" selected prominence="Standard" intent="Brand" />
          </Block>
          <Block role="Card" className="p-4 items-center" gap={4}>
            <Text role="Label" content="Focus Ring" />
            <Action
              role="Button"
              label="Focusable"
              prominence="Standard"
              intent="Brand"
              className="ring-2 ring-accent ring-offset-2"
            />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* 3. Icon Buttons */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6}>
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="3. Icon Buttons" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Buttons with icons only or icons with text."
          />
        </Block>

        <Block role="Card" className="p-6" gap={8}>
          <Block role="Stack" layout="inline" gap={6} className="items-center">
            <Text role="Label" content="With Label" className="w-24" />
            <Action role="Button" label="Settings" icon="Settings" prominence="Standard" />
            <Action
              role="Button"
              label="Delete"
              icon="Trash"
              prominence="Standard"
              intent="Critical"
            />
            <Action role="Button" label="Save" icon="Save" prominence="Strong" intent="Brand" />
          </Block>
          <Block role="Divider" />

          <Block role="Stack" layout="inline" gap={6} className="items-center">
            <Text role="Label" content="Icon Only" className="w-24" />
            <Action role="IconButton" icon="Settings" prominence="Standard" label="Settings" />
            <Action
              role="IconButton"
              icon="Trash"
              prominence="Standard"
              intent="Critical"
              label="Delete"
            />
            <Action role="IconButton" icon="Plus" prominence="Strong" intent="Brand" label="Add" />
            <Action role="IconButton" icon="MoreHorizontal" prominence="Subtle" label="More" />
          </Block>
        </Block>
      </Block>

      <Block role="Divider" className="my-16" />

      {/* 4. Links */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6}>
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="4. Links" />
          <Text role="Body" prominence="Subtle" content="Hyperlinks and text buttons." />
        </Block>

        <Block role="Card" className="p-6 items-baseline" layout="inline" gap={8}>
          <Action role="Link" label="Read more" href="#" />
          <Action role="Link" label="Documentation" icon="ExternalLink" href="#" intent="Brand" />
          <Action role="Link" label="Delete Account" icon="Trash" href="#" intent="Critical" />
          <Action role="Link" label="Back to Home" icon="ArrowLeft" href="#" prominence="Subtle" />
        </Block>
      </Block>
    </ShowcasePage>
  );
}
