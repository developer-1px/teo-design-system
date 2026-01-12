import { Frame } from '@/components/dsl/shared/Frame';
import { Block } from '@/components/dsl/Block/Block';
import { Field } from '@/components/dsl/Element/Field/Field';
import { Text } from '@/components/dsl/Element/Text/Text';

export function BlockFormsDemo() {
  return (
    <Frame.Column gap={6}>
      <div className="flex flex-col gap-1">
        <Text role="Title" prominence="Strong" content="3. Forms & Fieldsets" />
        <Text role="Body" prominence="Subtle" content="Semantic grouping for input controls." />
      </div>

      <Block role="Form">
        <Block role="FieldGroup" density="Comfortable">
          <Text role="Label" content="User Information" />
          <Field label="Username" type="text" model="demo.username" />
          <Field label="Email" type="email" model="demo.email" />
        </Block>
      </Block>
    </Frame.Column>
  );
}
