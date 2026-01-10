import { Block } from '@/components/types/Block/Block';
import { Field } from '@/components/types/Element/Field/Field';
import { Text } from '@/components/types/Element/Text/Text';

export function BlockFormsDemo() {
  return (
    <Block role="Container" density="Comfortable" className="gap-6">
      <div className="flex flex-col gap-1">
        <Text role="Title" prominence="Strong" content="3. Forms & Fieldsets" />
        <Text role="Body" prominence="Subtle" content="Semantic grouping for input controls." />
      </div>

      <Block role="Form" className="max-w-md">
        <Block role="Fieldset" density="Comfortable">
          <Text role="Label" content="User Information" className="text-lg font-medium mb-2" />
          <Field label="Username" type="text" model="demo.username" />
          <Field label="Email" type="email" model="demo.email" />
        </Block>
      </Block>
    </Block>
  );
}
