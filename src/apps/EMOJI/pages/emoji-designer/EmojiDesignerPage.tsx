import { Frame } from '@/components/dsl/shared/Frame';
/**
 * EmojiDesignerPage - 이모지 디자인 IDE
 *
 * JSON 기반 픽셀 아트 이모지 디자이너
 * 완전히 DSL로 구성됨
 */

import { Copy, Download, Droplet, Eraser, Paintbrush, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import type { DesignerState, PixelColor } from '@/apps/EMOJI/lib/emoji-designer/types';
import { PRESET_PALETTES } from '@/apps/EMOJI/lib/emoji-designer/types';
import {
  createNewDesign,
  exportDesign,
  floodFill,
  importDesign,
  resizeGrid,
} from '@/apps/EMOJI/lib/emoji-designer/utils';
import { ColorPalette } from '@/apps/EMOJI/widgets/emoji-designer/ColorPalette';
import { EmojiCanvas } from '@/apps/EMOJI/widgets/emoji-designer/EmojiCanvas';
import { Block } from '@/components/dsl/Block/Block';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dsl/Block/role/Tabs';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Field } from '@/components/dsl/Element/Field/Field';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Page } from '@/components/dsl/Page/Page';
import { Section } from '@/components/dsl/Section/Section';

export const EmojiDesignerPage = () => {
  const [state, setState] = useState<DesignerState>(() => ({
    design: createNewDesign('My Emoji', 16, PRESET_PALETTES.classic),
    selectedColor: '#000000',
    tool: 'pen',
    showGrid: true,
  }));

  const [previewTab, setPreviewTab] = useState('canvas');

  // Handle grid change
  const handleGridChange = (newGrid: PixelColor[][]) => {
    setState((prev) => ({
      ...prev,
      design: {
        ...prev.design,
        grid: newGrid,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  // Handle flood fill
  const handleFill = (row: number, col: number) => {
    const newGrid = floodFill(state.design.grid, row, col, state.selectedColor);
    handleGridChange(newGrid);
  };

  // Handle add color
  const handleAddColor = (color: PixelColor) => {
    if (!state.design.palette.includes(color)) {
      setState((prev) => ({
        ...prev,
        design: {
          ...prev.design,
          palette: [...prev.design.palette, color],
        },
      }));
    }
  };

  // Handle remove color
  const handleRemoveColor = (index: number) => {
    setState((prev) => ({
      ...prev,
      design: {
        ...prev.design,
        palette: prev.design.palette.filter((_, i) => i !== index),
      },
    }));
  };

  // Clear canvas
  const handleClear = () => {
    const newGrid = state.design.grid.map((row) => row.map(() => '#FFFFFF00'));
    handleGridChange(newGrid);
  };

  // Export JSON
  const handleExport = () => {
    const json = exportDesign(state.design);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.design.name}.emoji.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const design = importDesign(json);
        setState((prev) => ({ ...prev, design }));
      } catch (_error) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  // Change grid size
  const handleResizeGrid = (newSize: number) => {
    const newGrid = resizeGrid(state.design.grid, newSize);
    setState((prev) => ({
      ...prev,
      design: {
        ...prev.design,
        size: newSize,
        grid: newGrid,
      },
    }));
  };

  // Load preset palette
  const handleLoadPreset = (presetName: string) => {
    setState((prev) => ({
      ...prev,
      design: {
        ...prev.design,
        palette: PRESET_PALETTES[presetName],
      },
      selectedColor: PRESET_PALETTES[presetName][0],
    }));
  };

  return (
    <Page title="Emoji Designer" role="Application" density="Compact">
      {/* Header */}
      <Section role="Header">
        <Block role="Toolbar">
          <Frame.Column>
            <Block role="Toolbar">
              <Paintbrush size={24} />
              <Text role="Title" prominence="Hero" content="Emoji Designer IDE" />
            </Block>
            <Text role="Body" content="JSON 기반 픽셀 아트 이모지 디자이너" />
          </Frame.Column>

          <Block role="Toolbar">
            <label htmlFor="import-file">
              <Action role="Button" prominence="Subtle">
                <Upload size={16} />
                Import
              </Action>
            </label>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />

            <Action role="Button" prominence="Subtle" onClick={handleExport}>
              <Download size={16} />
              Export JSON
            </Action>
          </Block>
        </Block>
      </Section>

      {/* Left Sidebar - Tools & Settings */}
      <Section role="Navigator">
        <Section>
          {/* Design Info */}
          <Block role="Form">
            <Field
              role="TextInput"
              label="Emoji Name"
              value={state.design.name}
              onChange={(value) =>
                setState((prev) => ({
                  ...prev,
                  design: { ...prev.design, name: value },
                }))
              }
              prominence="Standard"
            />

            <Field
              role="Select"
              label="Grid Size"
              value={state.design.size.toString()}
              onChange={(value) => handleResizeGrid(Number(value))}
              options={[
                { value: '8', label: '8x8' },
                { value: '16', label: '16x16' },
                { value: '24', label: '24x24' },
                { value: '32', label: '32x32' },
              ]}
              prominence="Standard"
            />

            <Field
              role="Select"
              label="Preset Palette"
              onChange={(value) => handleLoadPreset(value)}
              options={[
                { value: '', label: 'Select preset...' },
                { value: 'classic', label: 'Classic' },
                { value: 'skin', label: 'Skin Tones' },
                { value: 'nature', label: 'Nature' },
              ]}
              prominence="Standard"
            />
          </Block>
        </Section>

        <Section>
          <Text role="Title" prominence="Hero" content="Tools" />

          <Block role="Toolbar">
            <Action
              role="Button"
              prominence={state.tool === 'pen' ? 'Hero' : 'Subtle'}
              onClick={() => setState((prev) => ({ ...prev, tool: 'pen' }))}
            >
              <Paintbrush size={16} />
              Pen
            </Action>

            <Action
              role="Button"
              prominence={state.tool === 'eraser' ? 'Hero' : 'Subtle'}
              onClick={() => setState((prev) => ({ ...prev, tool: 'eraser' }))}
            >
              <Eraser size={16} />
              Eraser
            </Action>

            <Action
              role="Button"
              prominence={state.tool === 'fill' ? 'Hero' : 'Subtle'}
              onClick={() => setState((prev) => ({ ...prev, tool: 'fill' }))}
            >
              <Droplet size={16} />
              Fill
            </Action>

            <Action role="Button" prominence="Standard" onClick={handleClear}>
              <Trash2 size={16} />
              Clear Canvas
            </Action>
          </Block>

          <Field
            role="Checkbox"
            label="Show Grid"
            value={state.showGrid}
            onChange={(checked) => setState((prev) => ({ ...prev, showGrid: checked }))}
            prominence="Standard"
          />
        </Section>

        <Section>
          <Text role="Title" prominence="Hero" content="Color Palette" />

          <ColorPalette
            palette={state.design.palette}
            selectedColor={state.selectedColor}
            onSelectColor={(color) => setState((prev) => ({ ...prev, selectedColor: color }))}
            onAddColor={handleAddColor}
            onRemoveColor={handleRemoveColor}
          />
        </Section>
      </Section>

      {/* Center - Canvas */}
      <Section role="Main">
        {/* Toolbar */}
        <Block role="Toolbar">
          <Block role="Toolbar">
            <Text role="Body" content={`${state.design.size}x${state.design.size} pixels`} />
            <Text role="Body" content="•" />
            <Text role="Body" content={`${state.design.palette.length} colors`} />
          </Block>

          <Tabs value={previewTab} onValueChange={setPreviewTab}>
            <TabsList>
              <TabsTrigger value="canvas">Canvas</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>
          </Tabs>
        </Block>

        {/* Content */}
        <Section role="Container">
          <Tabs value={previewTab} onValueChange={setPreviewTab}>
            <TabsContent value="canvas">
              <EmojiCanvas
                grid={state.design.grid}
                selectedColor={state.selectedColor}
                tool={state.tool}
                showGrid={state.showGrid}
                onChange={handleGridChange}
                onFill={handleFill}
              />
            </TabsContent>

            <TabsContent value="json">
              <Section>
                <Frame.Column>
                  <Text role="Title" prominence="Hero" content="Emoji JSON Data" />
                  <Text role="Code" content={exportDesign(state.design)} />

                  <Block role="Toolbar">
                    <Action
                      role="Button"
                      prominence="Subtle"
                      onClick={() => {
                        navigator.clipboard.writeText(exportDesign(state.design));
                      }}
                    >
                      <Copy size={16} />
                      Copy JSON
                    </Action>
                  </Block>
                </Frame.Column>
              </Section>
            </TabsContent>
          </Tabs>
        </Section>
      </Section>

      {/* Right Sidebar - Preview */}
      <Section role="Aside">
        <Section>
          <Text role="Title" prominence="Hero" content="Preview" />

          <Frame.Column>
            {/* Small preview */}
            <Block role="Card">
              <div
                style={{
                  display: 'grid',
                  gap: 0,
                  gridTemplateColumns: `repeat(${state.design.size}, 4px)`,
                  gridTemplateRows: `repeat(${state.design.size}, 4px)`,
                }}
              >
                {state.design.grid.map((row, rowIndex) =>
                  row.map((color, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      style={{
                        width: '4px',
                        height: '4px',
                        backgroundColor: color === '#FFFFFF00' ? 'transparent' : color,
                      }}
                    />
                  ))
                )}
              </div>
            </Block>

            {/* Medium preview */}
            <Block role="Card">
              <div
                style={{
                  display: 'grid',
                  gap: 0,
                  gridTemplateColumns: `repeat(${state.design.size}, 8px)`,
                  gridTemplateRows: `repeat(${state.design.size}, 8px)`,
                }}
              >
                {state.design.grid.map((row, rowIndex) =>
                  row.map((color, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: color === '#FFFFFF00' ? 'transparent' : color,
                      }}
                    />
                  ))
                )}
              </div>
            </Block>

            {/* Large preview */}
            <Block role="Card">
              <div
                style={{
                  display: 'grid',
                  gap: 0,
                  gridTemplateColumns: `repeat(${state.design.size}, 12px)`,
                  gridTemplateRows: `repeat(${state.design.size}, 12px)`,
                }}
              >
                {state.design.grid.map((row, rowIndex) =>
                  row.map((color, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: color === '#FFFFFF00' ? 'transparent' : color,
                      }}
                    />
                  ))
                )}
              </div>
            </Block>
          </Frame.Column>
        </Section>

        <Section>
          <Text role="Title" prominence="Hero" content="Design Info" />

          <Block role="Card">
            <Action role="ListItem">
              <Text role="Label" content="ID" />
              <Text role="Body" content={state.design.id} />
            </Action>

            <Action role="ListItem">
              <Text role="Label" content="Created" />
              <Text
                role="Body"
                content={new Date(state.design.createdAt).toLocaleString()}
              />
            </Action>

            <Action role="ListItem">
              <Text role="Label" content="Updated" />
              <Text
                role="Body"
                content={new Date(state.design.updatedAt).toLocaleString()}
              />
            </Action>
          </Block>
        </Section>
      </Section>
    </Page>
  );
};
