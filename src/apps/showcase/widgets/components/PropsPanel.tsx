/**
 * PropsPanel - Props 인터랙티브 조작 패널 (IDDL)
 */

import { Section } from '@/components/dsl/Section';
import { Group } from '@/components/dsl/Group';
import { Field } from '@/components/atoms/Field';
import { Text } from '@/components/atoms/Text';
import type { ComponentMetadata, PropValue, MockData } from '@/apps/showcase/widgets/parser/types';
import type { PropType } from '@/apps/showcase/widgets/parser/types';
import type { DataType } from '@/components/atoms/Field';

interface PropsPanelProps {
  metadata: ComponentMetadata;
  propValues: Record<string, PropValue>;
  mockData: MockData;
  onPropChange: (name: string, value: PropValue) => void;
  onMockChange: (mockData: MockData) => void;
}

/**
 * PropType.kind를 Field의 DataType으로 매핑
 */
function mapPropTypeToDataType(propType: PropType): DataType {
  switch (propType.kind) {
    case 'string':
      return 'text';
    case 'number':
      return 'number';
    case 'boolean':
      return 'checkbox';
    case 'enum':
      return 'select';
    case 'array':
    case 'object':
      return 'textarea';
    case 'ReactNode':
      return 'textarea';
    default:
      return 'text';
  }
}

export function PropsPanel({
  metadata,
  propValues,
  mockData,
  onPropChange,
  onMockChange,
}: PropsPanelProps) {
  return (
    <Section role="Form" prominence="Secondary" gap={2}>
      {/* Props Section */}
      <Group role="Info" prominence="Primary">
        <Text role="Label" prominence="Primary">
          Props
        </Text>
      </Group>

      <Group role="Form" prominence="Secondary" gap={1}>
        {Object.entries(metadata.props).map(([name, prop]) => {
          const value = propValues[name];
          const dataType = mapPropTypeToDataType(prop.type);

          // enum options 추출
          const options = prop.type.kind === 'enum' && prop.type.values
            ? prop.type.values.map((v) => ({ label: v, value: v }))
            : undefined;

          // value 처리 (array/object는 JSON string으로 변환)
          let fieldValue = value;
          if (dataType === 'textarea' && (prop.type.kind === 'array' || prop.type.kind === 'object')) {
            fieldValue = typeof value === 'string' ? value : JSON.stringify(value || (prop.type.kind === 'array' ? [] : {}), null, 2);
          }

          return (
            <Field
              key={name}
              dataType={dataType}
              label={`${name}${prop.required ? ' *' : ''}`}
              value={fieldValue}
              options={options}
              onChange={(newValue) => {
                // JSON parsing for array/object
                if (dataType === 'textarea' && (prop.type.kind === 'array' || prop.type.kind === 'object')) {
                  try {
                    onPropChange(name, JSON.parse(newValue as string));
                  } catch {
                    // Invalid JSON, ignore
                  }
                } else {
                  onPropChange(name, newValue);
                }
              }}
              placeholder={prop.description || `Enter ${name}...`}
            />
          );
        })}
      </Group>

      {/* Mock Data Section */}
      {metadata.externalDeps.length > 0 && (
        <Group role="Form" prominence="Tertiary" gap={1}>
          <Text role="Label" prominence="Secondary">
            Mocks (External Dependencies)
          </Text>
          <Text role="Caption" prominence="Tertiary">
            This component uses: {metadata.externalDeps.join(', ')}
          </Text>
          <Field
            dataType="textarea"
            label="Mock Data (JSON)"
            value={JSON.stringify(mockData, null, 2)}
            onChange={(value) => {
              try {
                onMockChange(JSON.parse(value as string));
              } catch {
                // Invalid JSON, ignore
              }
            }}
            placeholder='{ "ChevronDown": { "size": 16 } }'
          />
        </Group>
      )}
    </Section>
  );
}
