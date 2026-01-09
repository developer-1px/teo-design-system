/**
 * PreviewPanel - DSL 트리를 실시간으로 렌더링 (IDDL v1.0.1)
 */

import { useState } from 'react';
import { Page } from '@/components/Page/Page';
import { Section } from '@/components/Section/Section';
import { Group } from '@/components/Group/Group';
import { Text } from '@/components/Text/Text';
import { Field } from '@/components/Field/Field';
import { Action } from '@/components/Action/Action';
import { Overlay } from '@/components/Overlay/Overlay';
import type {
  AnyDSLNode,
  PageNode,
  RegionNode,
  SectionNode,
  GroupNode,
  TextNode,
  FieldNode,
  ActionNode,
  OverlayNode,
} from '@/lib/dsl-builder/types.ts';

// 노드 경로 정보
export interface NodePath {
  type: string;
  id: string;
  role?: string;
  purpose?: string;
  prominence?: number;
}

export interface PreviewPanelProps {
  tree: AnyDSLNode;
  selectedId: string | null;
  onNodeClick?: (node: AnyDSLNode, path: NodePath[]) => void;
}

function renderNode(
  node: AnyDSLNode,
  selectedId: string | null,
  onNodeClick?: (node: AnyDSLNode, path: NodePath[]) => void,
  parentPath: NodePath[] = [],
  hoveredNodeId: string | null = null,
  setHoveredNodeId?: (id: string | null) => void
): React.ReactNode {
  const isSelected = node.id === selectedId;
  const isHovered = node.id === hoveredNodeId;
  const highlightClass = isSelected
    ? 'outline outline-2 outline-accent outline-offset-2'
    : '';

  // 현재 노드의 경로 정보 생성
  const currentPath: NodePath = {
    type: node.type,
    id: node.id,
  };

  // 타입별 추가 정보
  if (node.type === 'region') {
    currentPath.role = (node as RegionNode).role;
  } else if (node.type === 'group') {
    currentPath.role = (node as GroupNode).role;
  }
  if ('prominence' in node && node.prominence) {
    currentPath.prominence = node.prominence as any;
  }

  const fullPath = [...parentPath, currentPath];

  // 클릭 핸들러
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeClick?.(node, fullPath);
  };

  // Hover 핸들러
  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHoveredNodeId?.(node.id);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHoveredNodeId?.(null);
  };

  // 컴포넌트명 가져오기 함수
  const getComponentName = (node: AnyDSLNode): string => {
    const typeMap: Record<string, string> = {
      page: 'Page',
      region: 'Region',
      section: 'Section',
      group: 'Group',
      item: 'Item',
      text: 'Text',
      field: 'Field',
      action: 'Action',
      overlay: 'Overlay',
    };

    let name = typeMap[node.type] || node.type;

    // 추가 정보
    if (node.type === 'region' && (node as RegionNode).role) {
      name += ` [${(node as RegionNode).role}]`;
    } else if (node.type === 'group' && (node as GroupNode).role) {
      name += ` [${(node as GroupNode).role}]`;
    } else if (node.type === 'text' && (node as TextNode).role) {
      name += ` [${(node as TextNode).role}]`;
    } else if (node.type === 'field' && (node as FieldNode).dataType) {
      name += ` [${(node as FieldNode).dataType}]`;
    } else if (node.type === 'action' && (node as ActionNode).behavior) {
      name += ` [${(node as ActionNode).behavior.action}]`;
    } else if (node.type === 'overlay' && (node as OverlayNode).role) {
      name += ` [${(node as OverlayNode).role}]`;
    }

    return name;
  };

  // Wrapper component with hover tooltip
  const NodeWrapper = ({ children }: { children: React.ReactNode }) => (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {isHovered && (
        <div className="absolute -top-6 left-0 z-50 px-2 py-1 bg-gray-900 text-white text-xs font-mono rounded shadow-lg pointer-events-none whitespace-nowrap">
          {getComponentName(node)}
        </div>
      )}
    </div>
  );

  switch (node.type) {
    case 'page': {
      const pageNode = node as PageNode;
      return (
        <Page
          title={pageNode.title}
          description={pageNode.description}
          layout={pageNode.layout}
          breadcrumbs={pageNode.breadcrumbs}
          className={`${pageNode.className || ''} ${highlightClass}`}
          onClick={handleClick}
        >
          {pageNode.children?.map((child) =>
            renderNode(child, selectedId, onNodeClick, fullPath, hoveredNodeId, setHoveredNodeId)
          )}
        </Page>
      );
    }

    case 'region': {
      // @deprecated: Region은 스펙아웃, Section으로 렌더링
      const regionNode = node as RegionNode;
      return (
        <Section
          key={regionNode.id}
          className={`${regionNode.className || ''} ${highlightClass}`}
          onClick={handleClick}
        >
          {regionNode.children?.map((child) =>
            renderNode(child, selectedId, onNodeClick, fullPath, hoveredNodeId, setHoveredNodeId)
          )}
        </Section>
      );
    }

    case 'section': {
      const sectionNode = node as SectionNode;
      return (
        <Section
          key={sectionNode.id}
          role={sectionNode.role}
          prominence={sectionNode.prominence}
          density={sectionNode.density}
          mode={sectionNode.mode}
          className={`${sectionNode.className || ''} ${highlightClass}`}
          onClick={handleClick}
        >
          {sectionNode.children?.map((child) =>
            renderNode(child, selectedId, onNodeClick, fullPath, hoveredNodeId, setHoveredNodeId)
          )}
        </Section>
      );
    }

    case 'group': {
      const groupNode = node as GroupNode;
      return (
        <Group
          key={groupNode.id}
          role={groupNode.role}
          prominence={groupNode.prominence}
          direction={groupNode.direction}
          layout={groupNode.layout}
          state={groupNode.state}
          emptyContent={groupNode.emptyContent}
          errorContent={groupNode.errorContent}
          className={`${groupNode.className || ''} ${highlightClass}`}
          onClick={handleClick}
        >
          {groupNode.children?.map((child) =>
            renderNode(child, selectedId, onNodeClick, fullPath, hoveredNodeId, setHoveredNodeId)
          )}
        </Group>
      );
    }

    // IDDL v1.0 - New Leaf Nodes
    case 'text': {
      const textNode = node as TextNode;
      return (
        <NodeWrapper key={textNode.id}>
          <div className={highlightClass}>
            <Text
              role={textNode.role}
              content={textNode.content}
              prominence={textNode.prominence}
              intent={textNode.intent}
              align={textNode.align}
              hidden={textNode.hidden}
              className={textNode.className}
            />
          </div>
        </NodeWrapper>
      );
    }

    case 'field': {
      const fieldNode = node as FieldNode;
      return (
        <NodeWrapper key={fieldNode.id}>
          <div className={highlightClass}>
            <Field
              label={fieldNode.label}
              model={fieldNode.model}
              dataType={fieldNode.dataType}
              prominence={fieldNode.prominence}
              intent={fieldNode.intent}
              required={fieldNode.required}
              options={fieldNode.options}
              constraints={fieldNode.constraints}
              dependsOn={fieldNode.dependsOn}
              placeholder={fieldNode.placeholder}
              modeOverride={fieldNode.modeOverride}
              hidden={fieldNode.hidden}
              className={fieldNode.className}
            />
          </div>
        </NodeWrapper>
      );
    }

    case 'action': {
      const actionNode = node as ActionNode;
      return (
        <NodeWrapper key={actionNode.id}>
          <div className={highlightClass}>
            <Action
              label={actionNode.label}
              icon={actionNode.icon}
              prominence={actionNode.prominence}
              intent={actionNode.intent}
              behavior={actionNode.behavior}
              disabled={actionNode.disabled}
              confirm={actionNode.confirm}
              loading={actionNode.loading}
              hidden={actionNode.hidden}
              className={actionNode.className}
            />
          </div>
        </NodeWrapper>
      );
    }

    case 'overlay': {
      const overlayNode = node as OverlayNode;
      return (
        <Overlay
          key={overlayNode.id}
          id={overlayNode.id}
          role={overlayNode.role}
          prominence={overlayNode.prominence}
          density={overlayNode.density}
          placement={overlayNode.placement}
          isOpen={overlayNode.isOpen}
          dismissable={overlayNode.dismissable}
          className={`${overlayNode.className || ''} ${highlightClass}`}
        >
          {overlayNode.children?.map((child) =>
            renderNode(child, selectedId, onNodeClick, fullPath, hoveredNodeId, setHoveredNodeId)
          )}
        </Overlay>
      );
    }

    default:
      return null;
  }
}

export function PreviewPanel({ tree, selectedId, onNodeClick }: PreviewPanelProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  return (
    <div className="h-full overflow-y-auto bg-layer-0 relative">
      {renderNode(tree, selectedId, onNodeClick, [], hoveredNodeId, setHoveredNodeId)}
    </div>
  );
}
