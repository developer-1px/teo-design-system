/**
 * Adaptive Scale System Demo
 *
 * prominence × density × sectionType 조합을 시각적으로 확인
 */

import { useState } from 'react';
import type { Density, Prominence } from '@/components/dsl/Shared.types';
import {
  calculateAdaptiveSpacing,
  getTypeScaleToken,
  type SectionType,
} from '@/shared/config/adaptive-scale-tokens';
import { TYPE_DESCRIPTIONS } from '@/shared/config/type-scale-tokens';

const SECTION_TYPES: SectionType[] = ['Bar', 'Rail', 'Panel', 'Stage', 'Layer', 'Float'];
const PROMINENCES: Prominence[] = ['Hero', 'Standard', 'Strong', 'Subtle'];
const DENSITIES: Density[] = ['Comfortable', 'Standard', 'Compact'];

// Type별 물리적 제약을 반영한 컨테이너 스타일
const getTypeContainerStyles = (type: SectionType) => {
  const baseStyles = 'border-2 border-dashed border-border-muted rounded-lg bg-surface-subtle/30';

  switch (type) {
    case 'Bar':
      return {
        className: `${baseStyles} flex flex-row items-center`,
        style: { height: '56px', width: '100%' },
      };
    case 'Rail':
      return {
        className: `${baseStyles} flex flex-col`,
        style: { width: '64px', height: '400px' },
      };
    case 'Panel':
      return {
        className: `${baseStyles} flex flex-col`,
        style: { width: '300px', minHeight: '400px' },
      };
    case 'Stage':
      return {
        className: `${baseStyles} flex flex-col`,
        style: { width: '100%', minHeight: '300px' },
      };
    case 'Layer':
      return {
        className: `${baseStyles} flex flex-col`,
        style: { maxWidth: '560px', minHeight: '300px', margin: '0 auto' },
      };
    case 'Float':
      return {
        className: `${baseStyles} flex flex-col`,
        style: { maxWidth: '320px', minHeight: '200px' },
      };
  }
};

export function AdaptiveScaleDemoPage() {
  const [selectedType, setSelectedType] = useState<SectionType>('Stage');
  const [selectedProminence, setSelectedProminence] = useState<Prominence>('Standard');
  const [selectedDensity, setSelectedDensity] = useState<Density>('Standard');

  const spacing = calculateAdaptiveSpacing(selectedType, selectedProminence, selectedDensity);
  const typeToken = getTypeScaleToken(selectedType);
  const containerStyles = getTypeContainerStyles(selectedType);

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Adaptive Scale System Demo</h1>
          <p className="text-text-subtle">prominence × density × sectionType → adaptive spacing</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Section Type Selector */}
          <div className="bg-white border border-border-default rounded-lg p-4">
            <h3 className="font-bold mb-3">Section Type</h3>
            <div className="space-y-2">
              {SECTION_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedType === type
                      ? 'bg-accent text-white'
                      : 'bg-surface-subtle hover:bg-surface-hover'
                  }`}
                >
                  <div className="font-medium">{type}</div>
                  <div className="text-xs opacity-75 mt-0.5">{TYPE_DESCRIPTIONS[type]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prominence Selector */}
          <div className="bg-white border border-border-default rounded-lg p-4">
            <h3 className="font-bold mb-3">Prominence</h3>
            <div className="space-y-2">
              {PROMINENCES.map((prom) => (
                <button
                  key={prom}
                  onClick={() => setSelectedProminence(prom)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedProminence === prom
                      ? 'bg-accent text-white'
                      : 'bg-surface-subtle hover:bg-surface-hover'
                  }`}
                >
                  {prom}
                </button>
              ))}
            </div>
          </div>

          {/* Density Selector */}
          <div className="bg-white border border-border-default rounded-lg p-4">
            <h3 className="font-bold mb-3">Density</h3>
            <div className="space-y-2">
              {DENSITIES.map((dens) => (
                <button
                  key={dens}
                  onClick={() => setSelectedDensity(dens)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedDensity === dens
                      ? 'bg-accent text-white'
                      : 'bg-surface-subtle hover:bg-surface-hover'
                  }`}
                >
                  {dens}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Display */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Left: Visual Preview */}
          <div className="bg-white border border-border-default rounded-lg p-6">
            <h3 className="font-bold mb-4">Visual Preview</h3>
            <div className="mb-4">
              <div className="text-sm text-text-subtle mb-1">
                {selectedType} × {selectedProminence} × {selectedDensity}
              </div>
              <div className="text-xs text-text-subtle italic">
                {TYPE_DESCRIPTIONS[selectedType]}
              </div>
            </div>

            {/* Physical Constraints Info */}
            <div className="mb-4 bg-surface-subtle/50 rounded p-3 text-xs">
              <div className="font-medium mb-1">Physical Constraints:</div>
              {typeToken.dimensions.fixedWidth && (
                <div>• Fixed Width: {typeToken.dimensions.fixedWidth}px</div>
              )}
              {typeToken.dimensions.fixedHeight && (
                <div>• Fixed Height: {typeToken.dimensions.fixedHeight}px</div>
              )}
              {typeToken.dimensions.minWidth && (
                <div>• Min Width: {typeToken.dimensions.minWidth}px</div>
              )}
              {typeToken.dimensions.maxWidth && (
                <div>• Max Width: {typeToken.dimensions.maxWidth}px</div>
              )}
              {!typeToken.dimensions.fixedWidth &&
                !typeToken.dimensions.fixedHeight &&
                !typeToken.dimensions.minWidth &&
                !typeToken.dimensions.maxWidth && <div>• No constraints (free layout)</div>}
            </div>

            {/* Preview Container */}
            <div
              className={containerStyles.className}
              style={{
                ...containerStyles.style,
                gap: `${spacing.gap}px`,
                paddingLeft: `${spacing.paddingX}px`,
                paddingRight: `${spacing.paddingX}px`,
                paddingTop: `${spacing.paddingY}px`,
                paddingBottom: `${spacing.paddingY}px`,
              }}
            >
              <div className="bg-primary/20 p-2 rounded text-center font-medium text-sm flex-shrink-0">
                Item 1
              </div>
              <div className="bg-primary/20 p-2 rounded text-center font-medium text-sm flex-shrink-0">
                Item 2
              </div>
              <div className="bg-primary/20 p-2 rounded text-center font-medium text-sm flex-shrink-0">
                Item 3
              </div>
            </div>

            {/* Measurements */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-subtle">Gap:</span>
                <span className="font-mono font-bold text-accent">{spacing.gap}px</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-subtle">Padding X:</span>
                <span className="font-mono font-bold text-accent">{spacing.paddingX}px</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-subtle">Padding Y:</span>
                <span className="font-mono font-bold text-accent">{spacing.paddingY}px</span>
              </div>
              <div className="border-t border-border-subtle pt-2 mt-2">
                <div className="text-text-subtle">Tailwind:</div>
                <code className="text-xs bg-surface-sunken px-2 py-1 rounded mt-1 inline-block">
                  {spacing.className}
                </code>
              </div>
            </div>
          </div>

          {/* Right: Calculation Breakdown */}
          <div className="bg-white border border-border-default rounded-lg p-6">
            <h3 className="font-bold mb-4">Calculation Breakdown</h3>

            {/* Gap Calculation */}
            <div className="mb-6">
              <h4 className="font-medium mb-2 text-sm">Gap</h4>
              <div className="space-y-1 text-sm bg-surface-subtle p-3 rounded">
                <div className="flex justify-between">
                  <span>Base Value:</span>
                  <span className="font-mono">{spacing.breakdown.gap.breakdown.baseValue}px</span>
                </div>
                <div className="flex justify-between">
                  <span>× Type Factor:</span>
                  <span className="font-mono">
                    {spacing.breakdown.gap.breakdown.typeFactor.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>× Prominence Factor:</span>
                  <span className="font-mono">
                    {spacing.breakdown.gap.breakdown.prominenceFactor.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>× Density Factor:</span>
                  <span className="font-mono">
                    {spacing.breakdown.gap.breakdown.densityFactor.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-border-subtle pt-1 mt-1 flex justify-between font-medium">
                  <span>Raw Value:</span>
                  <span className="font-mono">{spacing.breakdown.gap.rawValue.toFixed(2)}px</span>
                </div>
                <div className="flex justify-between font-bold text-accent">
                  <span>Final (snapped):</span>
                  <span className="font-mono">{spacing.breakdown.gap.finalValue}px</span>
                </div>
              </div>
            </div>

            {/* Type Scale Info */}
            <div className="border-t border-border-subtle pt-4">
              <h4 className="font-medium mb-2 text-sm">Type Scale Token</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-subtle">Hero Text:</span>
                  <span className="font-mono">{typeToken.text.Hero}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-subtle">Standard Text:</span>
                  <span className="font-mono">{typeToken.text.Standard}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-subtle">Subtle Text:</span>
                  <span className="font-mono">{typeToken.text.Subtle}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-subtle">Action Height:</span>
                  <span className="font-mono">{typeToken.action.height}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-subtle">Default Density:</span>
                  <span className="font-mono">{typeToken.defaultDensity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-border-default rounded-lg p-6">
          <h3 className="font-bold mb-4">All Section Types Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-subtle border-b border-border-default">
                <tr>
                  <th className="text-left p-3">Type</th>
                  <th className="text-right p-3">Gap</th>
                  <th className="text-right p-3">Padding X</th>
                  <th className="text-right p-3">Padding Y</th>
                  <th className="text-left p-3">Tailwind</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {SECTION_TYPES.map((type) => {
                  const typeSpacing = calculateAdaptiveSpacing(
                    type,
                    selectedProminence,
                    selectedDensity
                  );
                  const isSelected = type === selectedType;

                  return (
                    <tr
                      key={type}
                      className={`${isSelected ? 'bg-accent/10' : 'hover:bg-surface-hover'} transition-colors cursor-pointer`}
                      onClick={() => setSelectedType(type)}
                    >
                      <td className="p-3 font-medium">{type}</td>
                      <td className="p-3 text-right font-mono">{typeSpacing.gap}px</td>
                      <td className="p-3 text-right font-mono">{typeSpacing.paddingX}px</td>
                      <td className="p-3 text-right font-mono">{typeSpacing.paddingY}px</td>
                      <td className="p-3">
                        <code className="text-xs bg-surface-subtle px-2 py-0.5 rounded">
                          {typeSpacing.className}
                        </code>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-text-subtle">
          <p>
            📄 Research Doc:{' '}
            <code className="bg-surface-subtle px-2 py-0.5 rounded">
              docs/1-project/adaptive-scale-system.md
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
