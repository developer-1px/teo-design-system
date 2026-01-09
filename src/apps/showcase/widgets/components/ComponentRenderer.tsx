/**
 * ComponentRenderer - 동적으로 컴포넌트 import 및 렌더링
 */

import { createElement, useMemo, useState, useEffect } from 'react';
import { Group } from '@/components/Group/Group.tsx';
import { Text } from '@/components/Text/Text';
import type { ComponentMetadata, PropValue, MockData } from '@/apps/showcase/widgets/parser/types';

interface ComponentRendererProps {
  metadata: ComponentMetadata;
  propValues: Record<string, PropValue>;
  mockData: MockData;
  componentModule?: () => Promise<any>; // Vite glob loader
}

/**
 * PropType에 맞는 기본값 생성
 */
function getDefaultValue(propType: any, componentName: string, propName: string): any {
  // Action 컴포넌트 특별 처리
  if (componentName === 'Action') {
    if (propName === 'behavior') {
      return { action: 'command', command: 'example.command' };
    }
    if (propName === 'label') {
      return 'Click Me';
    }
  }

  switch (propType.kind) {
    case 'string':
      return propName === 'label' ? 'Example Label' : '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'enum':
      return propType.values?.[0] || '';
    case 'ReactNode':
      return componentName;
    case 'object':
      return {};
    case 'array':
      return [];
    default:
      return undefined;
  }
}

export function ComponentRenderer({
  metadata,
  propValues,
  mockData,
  componentModule,
}: ComponentRendererProps) {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    // 컴포넌트 변경 시 초기화
    setComponent(null);

    if (!metadata) {
      console.error('[ComponentRenderer] No metadata provided');
      return;
    }

    if (!componentModule) {
      console.error(`[ComponentRenderer] No componentModule provided for ${metadata.name}`);
      return;
    }

    console.log(`[ComponentRenderer] 🔄 Loading module for ${metadata.name} (${metadata.filePath})`);

    // Vite glob loader를 사용하여 컴포넌트 로드
    componentModule()
      .then((module) => {
        console.log(`[ComponentRenderer] Loaded module for ${metadata.name}:`, {
          moduleKeys: Object.keys(module),
          hasDefault: !!module.default,
          hasNamedExport: !!module[metadata.name],
        });

        // 컴포넌트 이름으로 export된 것을 먼저 찾고, 없으면 default export 사용
        const componentName = metadata.name;
        const comp = module[componentName] || module.default;

        if (!comp) {
          console.error(`[ComponentRenderer] No export found for ${componentName}`, module);
          return;
        }

        console.log(`[ComponentRenderer] Setting component for ${metadata.name}:`, comp);
        setComponent(() => comp);
      })
      .catch((error) => {
        console.error(`[ComponentRenderer] Failed to load ${metadata.name}:`, error);
      });
  }, [metadata?.filePath, componentModule]);

  // Props 준비
  const props = useMemo(() => {
    if (!metadata) {
      return {};
    }

    const finalProps: Record<string, any> = {};

    console.log(`[ComponentRenderer] ${metadata.name} - metadata.props:`, metadata.props);

    for (const [name, propInfo] of Object.entries(metadata.props)) {
      let value = propValues[name];

      // 값이 없는 경우 기본값 생성 (required 여부와 관계없이)
      if (value === undefined) {
        value = getDefaultValue(propInfo.type, metadata.name, name);
      }

      // 값이 있는 경우만 추가
      if (value !== undefined) {
        // ReactNode 타입은 children으로
        if (propInfo.type.kind === 'ReactNode') {
          finalProps.children = value;
        } else {
          finalProps[name] = value;
        }
      }
    }

    console.log(`[ComponentRenderer] ${metadata.name} - finalProps:`, finalProps);
    return finalProps;
  }, [metadata, propValues]);

  if (!Component) {
    return (
      <Group role="Container" prominence="Tertiary">
        <Text role="Body" prominence="Tertiary">
          Loading component...
        </Text>
      </Group>
    );
  }

  try {
    return createElement(Component, props);
  } catch (error) {
    console.error('Component render error:', error);
    return (
      <Group role="Container" prominence="Primary">
        <Text role="Body" prominence="Primary" intent="Critical">
          Failed to render component: {String(error)}
        </Text>
      </Group>
    );
  }
}
