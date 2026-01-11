import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';

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
      <Block role="Container" layout="stack" density="Comfortable" className="gap-6">
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="1. Button Matrix" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Combinations of Prominence and Intent."
          />
        </div>

        <Block role="Table" density="Standard" className="w-full">
          {/* Header Row */}
          <div className="grid grid-cols-7 gap-4 p-4 bg-surface-raised border-b border-border-default font-medium text-sm text-text-secondary">
            <div>Prominence</div>
            {intents.map((intent) => (
              <div key={intent}>{intent}</div>
            ))}
          </div>

          {/* Rows */}
          {['Hero', 'Strong', 'Standard', 'Subtle'].map((prominence: any) => (
            <div
              key={prominence}
              className="grid grid-cols-7 gap-4 p-4 border-b border-border-subtle items-center"
            >
              <Text role="Label" content={prominence} prominence="Subtle" />
              {intents.map((intent) => (
                <Action
                  key={intent}
                  role="Button"
                  label="Action"
                  prominence={prominence}
                  intent={intent}
                  onClick={() => { }}
                />
              ))}
            </div>
          ))}
        </Block>
      </Block>

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 2. Button States */}
      <Block role="Container" layout="stack" density="Comfortable" className="gap-6">
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="2. Button States" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Interactive states like Loading, Disabled, and Selected."
          />
        </div>

        <Block
          role="Grid"
          layout="grid"
          density="Standard"
          className="grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Block role="Card" className="p-4 items-center gap-4 flex flex-col">
            <Text role="Label" content="Loading" />
            <Action
              role="Button"
              label="Saving..."
              loading
              prominence="Standard"
              intent="Brand"
            />
          </Block>
          <Block role="Card" className="p-4 items-center gap-4 flex flex-col">
            <Text role="Label" content="Disabled" />
            <Action
              role="Button"
              label="Submit"
              disabled
              prominence="Standard"
              intent="Brand"
            />
          </Block>
          <Block role="Card" className="p-4 items-center gap-4 flex flex-col">
            <Text role="Label" content="Selected (Toggled)" />
            <Action
              role="Button"
              label="Toggle Me"
              selected
              prominence="Standard"
              intent="Brand"
            />
          </Block>
          <Block role="Card" className="p-4 items-center gap-4 flex flex-col">
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

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 3. Icon Buttons */}
      <Block role="Container" layout="stack" density="Comfortable" className="gap-6">
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="3. Icon Buttons" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Buttons with icons only or icons with text."
          />
        </div>

        <Block role="Card" className="p-6 gap-8">
          <div className="flex items-center gap-6">
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
          </div>

          <div className="flex items-center gap-6">
            <Text role="Label" content="Icon Only" className="w-24" />
            <Action role="IconButton" icon="Settings" prominence="Standard" label="Settings" />
            <Action
              role="IconButton"
              icon="Trash"
              prominence="Standard"
              intent="Critical"
              label="Delete"
            />
            <Action
              role="IconButton"
              icon="Plus"
              prominence="Strong"
              intent="Brand"
              label="Add"
            />
            <Action role="IconButton" icon="MoreHorizontal" prominence="Subtle" label="More" />
          </div>
        </Block>
      </Block>

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 4. Links */}
      <Block role="Container" layout="stack" density="Comfortable" className="gap-6">
        <div className="flex flex-col gap-1">
          <Text role="Title" prominence="Strong" content="4. Links" />
          <Text role="Body" prominence="Subtle" content="Hyperlinks and text buttons." />
        </div>

        <Block role="Card" className="p-6 flex flex-row gap-8 items-baseline">
          <Action role="Link" label="Read more" href="#" />
          <Action
            role="Link"
            label="Documentation"
            icon="ExternalLink"
            href="#"
            intent="Brand"
          />
          <Action role="Link" label="Delete Account" icon="Trash" href="#" intent="Critical" />
          <Action
            role="Link"
            label="Back to Home"
            icon="ArrowLeft"
            href="#"
            prominence="Subtle"
          />
        </Block>
      </Block>
    </ShowcasePage>
  );
}
