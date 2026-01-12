import { Frame } from '@/components/dsl/shared/Frame';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';

export function BlockNavigationDemo() {
  return (
    <Frame.Column gap={6}>
      <div className="flex flex-col gap-1">
        <Text role="Title" prominence="Strong" content="5. Navigation" />
        <Text role="Body" prominence="Subtle" content="Components for wayfinding and structure." />
      </div>

      {/* Breadcrumbs */}
      <Block role="Card">
        <Text role="Label" content="Breadcrumbs (role='Breadcrumbs')" />
        <Block role="Breadcrumbs">
          <Text role="Caption" content="Home" />
          <Action
            role="Button"
            icon="ChevronRight"
            label=""
            prominence="Subtle"
            density="Compact"
            disabled
          />
          <Text role="Caption" content="Category" />
          <Action
            role="Button"
            icon="ChevronRight"
            label=""
            prominence="Subtle"
            density="Compact"
            disabled
          />
          <Text role="Caption" content="Current Page" prominence="Standard" />
        </Block>
      </Block>

      {/* Accordion */}
      <Block role="Card">
        <Text role="Label" content="Accordion (role='Accordion')" />
        <Block role="Accordion">
          {/* Note: Accordion implementation handles Items internally if using the specialized renderer context */}
          {/* But effectively we use AccordionItem, AccordionTrigger, AccordionContent exported from Block */}
          {/* Dummy content */}
          <div className="p-2">Accordion Content</div>
        </Block>
        <Text
          role="Caption"
          content="* Requires usage of AccordionItem sub-components (see Docs)"
          prominence="Subtle"
        />
      </Block>

      {/* Stepper */}
      <Block role="Card">
        <Text role="Label" content="Stepper (role='Stepper')" />
        <Block role="Stepper">
          <Frame.Inline gap={2}>
            <div className="w-6 h-6 rounded-full bg-surface-accent-default text-text-inverse flex items-center justify-center text-xs">
              1
            </div>
            <Text role="Body" content="Step 1" />
          </Frame.Inline>
          <div className="w-8 h-px bg-border-default" />
          <Frame.Inline gap={2}>
            <div className="w-6 h-6 rounded-full bg-surface-raised border border-border-default flex items-center justify-center text-xs">
              2
            </div>
            <Text role="Body" content="Step 2" prominence="Subtle" />
          </Frame.Inline>
        </Block>
      </Block>
    </Frame.Column>
  );
}
