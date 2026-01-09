/**
 * ComponentRenderer - 동적으로 컴포넌트 import 및 렌더링
 */

import { createElement, useEffect, useMemo, useState } from 'react';
import type { ComponentMetadata, MockData, PropValue } from '@/apps/showcase/widgets/parser/types';
import { Group } from '@/components/types/Group/Group.tsx';
import { Text } from '@/components/types/Atom/Text/Text';

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
  mockData: _mockData,
  componentModule,
}: ComponentRendererProps) {
  const [Component, setComponent] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // 컴포넌트 변경 시 초기화
    setComponent(null);
    setLoadError(null);

    if (!metadata) {
      console.error('[ComponentRenderer] No metadata provided');
      setLoadError('메타데이터가 없습니다');
      return;
    }

    if (!componentModule) {
      console.error(`[ComponentRenderer] No componentModule provided for ${metadata.name}`);
      setLoadError(`컴포넌트 모듈을 찾을 수 없습니다: ${metadata.name}`);
      return;
    }

    console.log(
      `[ComponentRenderer] 🔄 Loading module for ${metadata.name} (${metadata.filePath})`
    );

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
          setLoadError(
            `컴포넌트를 찾을 수 없습니다: "${componentName}"\n사용 가능한 export: ${Object.keys(module).join(', ')}`
          );
          return;
        }

        console.log(`[ComponentRenderer] Setting component for ${metadata.name}:`, comp);
        setComponent(() => comp);
      })
      .catch((error) => {
        console.error(`[ComponentRenderer] Failed to load ${metadata.name}:`, error);
        setLoadError(`모듈 로드 실패: ${error.message}`);
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

  // 로드 에러 표시
  if (loadError) {
    return (
      <Group role="Container" prominence="Standard" className="p-4 rounded-lg bg-surface">
        <Group role="Container" gap={2}>
          <Text role="Title" prominence="Strong" intent="Critical" content="모듈 로드 에러" />
          <Text role="Body" prominence="Standard" intent="Critical" content={loadError} />
        </Group>
      </Group>
    );
  }

  // 로딩 중
  if (!Component) {
    return (
      <Group role="Container">
        <Text role="Body" prominence="Standard" content="Loading component..." />
      </Group>
    );
  }

  // 렌더링 시도
  try {
    return createElement(Component, props);
  } catch (error) {
    console.error('[ComponentRenderer] Render error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    return (
      <Group role="Container" prominence="Standard" className="p-4 rounded-lg bg-surface">
        <Group role="Container" gap={2}>
          <Text role="Title" prominence="Strong" intent="Critical" content="렌더링 에러 (동기)" />
          <Text role="Body" prominence="Standard" intent="Critical" content={errorMessage} />
          {errorStack && (
            <pre className="text-xs text-muted bg-surface-sunken p-3 rounded overflow-auto max-h-48 mt-2">
              {errorStack}
            </pre>
          )}
        </Group>
      </Group>
    );
  }
}
