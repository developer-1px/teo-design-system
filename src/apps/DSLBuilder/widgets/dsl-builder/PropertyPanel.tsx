/**
 * PropertyPanel - DSL 노드 속성 편집 패널
 */

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import type { AnyDSLNode, GroupNode, SectionNode } from '@/apps/DSLBuilder/lib/dsl-builder/types';
import type { BlockRole as GroupRole } from '@/components/types/Block/Block.types';
// Custom imports removed
import type { Prominence } from '@/components/types/Shared.types';

export interface PropertyPanelProps {
  node: AnyDSLNode | null;
  onUpdate: (updates: Partial<AnyDSLNode>) => void;
}

const groupRoles: GroupRole[] = [
  'Container',
  'Form',
  'Fieldset',
  'Toolbar',
  'List',
  'Grid',
  'Table',
  'Tabs',
  'Steps',
  'Split',
  'Card',
  'Inline',
];
const prominences: Prominence[] = ['Hero', 'Standard', 'Standard', 'Subtle'];

export function PropertyPanel({ node, onUpdate }: PropertyPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyPropsToClipboard = async () => {
    if (!node) return;

    const json = JSON.stringify(node, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!node) {
    return (
      <div className="p-2 text-center text-text-tertiary text-xs">
        Select a node to edit its properties
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2">
      {/* Common Properties */}
      <div>
        <h3 className="text-xs font-semibold text-text mb-2">
          {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Properties
        </h3>

        {/* ID (read-only) */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-text-secondary">ID</label>
          <input
            className="w-full text-xs bg-layer-2 border border-border rounded px-2 py-1.5 opacity-60 cursor-not-allowed"
            value={node.id}
            disabled
          />
        </div>
      </div>

      {/* Section-specific */}
      {node.type === 'section' && (
        <div className="space-y-1">
          <label className="text-xs font-medium text-text-secondary">Prominence</label>
          <select
            className="w-full text-xs bg-layer-2 border border-border rounded px-2 py-1.5 focus:outline-none focus:border-accent"
            value={(node as SectionNode).prominence || 'Standard'}
            onChange={(e) => onUpdate({ prominence: e.target.value as Prominence })}
          >
            {prominences.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Block-specific */}
      {node.type === 'group' && (
        <>
          <div className="space-y-1">
            <div className="flex gap-0.5">
              <label className="text-xs font-medium text-text-secondary">Role</label>
              <span className="text-red-500 text-xs">*</span>
            </div>
            <select
              className="w-full text-xs bg-layer-2 border border-border rounded px-2 py-1.5 focus:outline-none focus:border-accent"
              value={(node as GroupNode).role}
              onChange={(e) => onUpdate({ role: e.target.value as GroupRole })}
            >
              {groupRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">Prominence</label>
            <select
              className="w-full text-xs bg-layer-2 border border-border rounded px-2 py-1.5 focus:outline-none focus:border-accent"
              value={(node as GroupNode).prominence || ''}
              onChange={(e) => {
                const value = e.target.value;
                onUpdate({
                  prominence: value ? (value as Prominence) : undefined,
                });
              }}
            >
              <option value="">Inherit</option>
              {prominences.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">Direction</label>
            <select
              className="w-full text-xs bg-layer-2 border border-border rounded px-2 py-1.5 focus:outline-none focus:border-accent"
              value={(node as GroupNode).direction || 'vertical'}
              onChange={(e) =>
                onUpdate({
                  direction: e.target.value as 'horizontal' | 'vertical',
                })
              }
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
        </>
      )}

      {/* Common className */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-text-secondary">Custom Class</label>
        <input
          className="w-full text-xs bg-layer-2 border border-border rounded px-2 py-1.5 focus:outline-none focus:border-accent"
          value={node.className || ''}
          onChange={(e) => onUpdate({ className: e.target.value })}
          placeholder="Enter custom classes..."
        />
      </div>

      {/* Node Props JSON Viewer */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-text">Node Props (JSON)</h3>
          <button
            onClick={copyPropsToClipboard}
            className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text bg-layer-1 hover:bg-layer-2 rounded transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check size={12} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="p-2 bg-layer-1 rounded text-xs font-mono text-text-secondary overflow-x-auto max-h-64 overflow-y-auto">
          {JSON.stringify(node, null, 2)}
        </pre>
      </div>
    </div>
  );
}
