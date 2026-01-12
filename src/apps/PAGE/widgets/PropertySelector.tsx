import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import type { Intent } from '@/components/dsl/Shared.types';

interface PropertySelectorProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3;
  getIntent?: (option: T) => Intent;
}

export function PropertySelector<T extends string>({
  label,
  options,
  value,
  onChange,
  columns = 2,
  getIntent,
}: PropertySelectorProps<T>) {
  return (
    <Block role="PropertyGrid" spec={{ columns: 1 }}>
      <Text
        role="Micro"
        content={label}
        prominence="Strong"
        className="uppercase tracking-wider opacity-60"
      />
      <Block role="PropertyGrid" spec={{ columns }}>
        {options.map((option) => (
          <Action
            key={option}
            role="Option"
            label={option}
            prominence={value === option ? 'Strong' : 'Standard'}
            intent={value === option ? 'Brand' : getIntent?.(option) || 'Neutral'}
            density="Compact"
            onClick={() => onChange(option)}
            selected={value === option}
          />
        ))}
      </Block>
    </Block>
  );
}
