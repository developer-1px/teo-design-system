import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Field } from '@/components/dsl/Element/Field/Field';
import { Section } from '@/components/dsl/Section/Section';
import { SidebarHeader } from './SidebarHeader';

export const SettingsView = () => {
  return (
    <>
      <SidebarHeader
        title="SETTINGS"
        actions={
          <Block role="Toolbar">
            <Action
              role="IconButton"
              icon="FileJson"
              label="Open Settings (JSON)"
              prominence="Subtle"
              density="Compact"
            />
          </Block>
        }
      />

      <Section role="Container">
        {/* Search */}
        <Field role="Searchbox" placeholder="Search Settings" prominence="Standard" />

        {/* Categories */}
        <Block role="List">
          {/* Editor */}
          <Block role="Accordion">
            <Action role="Button" icon="ChevronDown" label="Text Editor" prominence="Subtle" />

            <Block role="Form">
              <Field
                role="TextInput"
                label="Font Family"
                description="Controls the font family."
                defaultValue="JetBrains Mono, Menlo, Monaco, 'Courier New', monospace"
                prominence="Standard"
              />

              <Field
                role="NumberInput"
                label="Font Size"
                description="Controls the font size in pixels."
                defaultValue="13"
                prominence="Standard"
              />

              <Field
                role="Switch"
                label="Mini Map"
                description="Controls whether the minimap is shown."
                value={true}
                prominence="Standard"
              />

              <Field
                role="Switch"
                label="Word Wrap"
                description="Controls how lines should wrap."
                prominence="Standard"
              />
            </Block>
          </Block>

          {/* Workbench */}
          <Block role="Accordion">
            <Action role="Button" icon="ChevronDown" label="Workbench" prominence="Subtle" />

            <Block role="Form">
              <Field
                role="Select"
                label="Color Theme"
                description="Specifies the color theme used in the workbench."
                options={[
                  { label: 'IDDL Dark', value: 'IDDL Dark' },
                  { label: 'GitHub Dark', value: 'GitHub Dark' },
                  { label: 'Monokai', value: 'Monokai' },
                ]}
                defaultValue="IDDL Dark"
                prominence="Standard"
              />

              <Field
                role="Select"
                label="Icon Theme"
                description="Specifies the file icon theme used in the workbench."
                options={[
                  { label: 'Lucide Icons', value: 'Lucide Icons' },
                  { label: 'Material Items', value: 'Material Items' },
                  { label: 'None', value: 'None' },
                ]}
                defaultValue="Lucide Icons"
                prominence="Standard"
              />
            </Block>
          </Block>
        </Block>
      </Section>
    </>
  );
};
