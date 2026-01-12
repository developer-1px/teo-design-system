/**
 * FloatingControlPanel - Draggable control panel for Page property manipulation
 *
 * Features:
 * - Draggable positioning
 * - Collapse/Expand
 * - Real-time property controls (role, prominence, density, intent, layout)
 */

import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  DENSITIES,
  FLOATING_PANEL,
  getIntentForButton,
  INTENTS,
  PAGE_ROLES,
  PROMINENCES,
} from '@/apps/PAGE/lib/page-constants';
import { PropertySelector } from '@/apps/PAGE/widgets/PropertySelector';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import type { PageLayout, PageRole } from '@/components/dsl/Page/Page.types';
import type { Density, Intent, Prominence } from '@/components/dsl/Shared.types';

interface FloatingControlPanelProps {
  // Current values
  role: PageRole;
  layout: PageLayout;
  prominence: Prominence;
  density: Density;
  intent: Intent;

  // Available options
  availableLayouts: PageLayout[];

  // Change handlers
  onRoleChange: (role: PageRole) => void;
  onLayoutChange: (layout: PageLayout) => void;
  onProminenceChange: (prominence: Prominence) => void;
  onDensityChange: (density: Density) => void;
  onIntentChange: (intent: Intent) => void;
}

export function FloatingControlPanel({
  role,
  layout,
  prominence,
  density,
  intent,
  availableLayouts,
  onRoleChange,
  onLayoutChange,
  onProminenceChange,
  onDensityChange,
  onIntentChange,
}: FloatingControlPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth - FLOATING_PANEL.INITIAL_OFFSET_X,
    y: FLOATING_PANEL.INITIAL_OFFSET_Y,
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragRef.current) {
        setPosition({
          x: e.clientX - dragRef.current.startX,
          y: e.clientY - dragRef.current.startY,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="fixed z-50 shadow-lg rounded-lg overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${FLOATING_PANEL.WIDTH}px`,
      }}
    >
      <Block role="ControlPanel">
        {/* Header */}
        <Block role="Header" className="cursor-move">
          <div className="flex items-center gap-1.5">
            <GripVertical size={14} className="text-text-tertiary" />
            <Text role="Label" content="Page Interface" prominence="Strong" />
          </div>
          <Action
            role="IconButton"
            onClick={() => setIsCollapsed(!isCollapsed)}
            prominence="Subtle"
            className="h-6 w-6"
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </Action>
        </Block>

        {/* Body */}
        {!isCollapsed && (
          <Block role="Stack" density="Comfortable" className="p-2">
            {/* Role Selection */}
            <PropertySelector
              label="PageRole"
              options={PAGE_ROLES}
              value={role}
              onChange={onRoleChange}
              columns={2}
            />

            {/* Layout Selection */}
            <PropertySelector
              label="Layout"
              options={availableLayouts}
              value={layout}
              onChange={onLayoutChange}
              columns={2}
            />

            {/* Prominence Selection */}
            <PropertySelector
              label="Prominence"
              options={PROMINENCES}
              value={prominence}
              onChange={onProminenceChange}
              columns={2}
            />

            {/* Density Selection */}
            <PropertySelector
              label="Density"
              options={DENSITIES}
              value={density}
              onChange={onDensityChange}
              columns={2}
            />

            {/* Intent Selection */}
            <PropertySelector
              label="Intent"
              options={INTENTS}
              value={intent}
              onChange={onIntentChange}
              columns={2}
              getIntent={getIntentForButton}
            />

            {/* Current Configuration Summary */}
            <Block role="Card" prominence="Subtle" density="Compact" className="mt-2">
              <Text
                role="Caption"
                content="Current Config"
                prominence="Subtle"
                className="mb-2 opacity-70"
              />
              <div className="space-y-1 opacity-80">
                <div className="flex justify-between">
                  <Text role="Micro" content="role" className="text-text-tertiary" />
                  <Text role="Micro" content={role} prominence="Strong" />
                </div>
                <div className="flex justify-between">
                  <Text role="Micro" content="layout" className="text-text-tertiary" />
                  <Text role="Micro" content={layout} prominence="Strong" />
                </div>
                <div className="flex justify-between">
                  <Text role="Micro" content="prominence" className="text-text-tertiary" />
                  <Text role="Micro" content={prominence} prominence="Strong" />
                </div>
                <div className="flex justify-between">
                  <Text role="Micro" content="density" className="text-text-tertiary" />
                  <Text role="Micro" content={density} prominence="Strong" />
                </div>
                <div className="flex justify-between">
                  <Text role="Micro" content="intent" className="text-text-tertiary" />
                  <Text role="Micro" content={intent} prominence="Strong" />
                </div>
              </div>
            </Block>
          </Block>
        )}
      </Block>
    </div>
  );
}
