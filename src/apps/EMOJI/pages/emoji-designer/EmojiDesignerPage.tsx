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
import { Block } from '@/components/types/Block/Block';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/types/Block/role/Tabs';
import { Button } from '@/components/types/Atom/Action/role/Button';
import { Input } from '@/components/types/Atom/Field/role/Input';
import { Select } from '@/components/types/Atom/Field/role/Select';
import { Switch } from '@/components/types/Atom/Field/role/Switch';
import { Text } from '@/components/types/Atom/Text/Text';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';

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
      } catch (error) {
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
    <Page role="Application" layout="HolyGrail" density="Compact">
      {/* Header */}
      <Section role="Header" className="px-6 py-4">
        <Block role="Container" direction="horizontal" className="justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Paintbrush size={24} />
              <Text role="Title" prominence="Hero" content="Emoji Designer IDE" />
            </div>
            <Text role="Body" content="JSON 기반 픽셀 아트 이모지 디자이너" />
          </div>

          <Block role="Toolbar" direction="horizontal">
            <label htmlFor="import-file" className="cursor-pointer">
              <div className="inline-flex items-center justify-center gap-2 rounded-md font-medium text-sm h-9 px-4 bg-transparent text-text hover:bg-black/5 active:bg-black/10 transition-colors">
                <Upload size={16} />
                Import
              </div>
            </label>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />

            <Button variant="ghost" size="sm" onClick={handleExport}>
              <Download size={16} />
              Export JSON
            </Button>
          </Block>
        </Block>
      </Section>

      {/* Left Sidebar - Tools & Settings */}
      <Section role="Navigator" className="overflow-y-auto">
          <Section className="p-4">
            {/* Design Info */}
            <Block role="Form">
              <div>
                <Text role="Label" className="block mb-1.5" content="Emoji Name" />
                <Input
                  value={state.design.name}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      design: { ...prev.design, name: e.target.value },
                    }))
                  }
                />
              </div>

              <div>
                <Text role="Label" className="block mb-1.5" content="Grid Size" />
                <Select
                  value={state.design.size}
                  onChange={(e) => handleResizeGrid(Number(e.target.value))}
                >
                  <option value={8}>8x8</option>
                  <option value={16}>16x16</option>
                  <option value={24}>24x24</option>
                  <option value={32}>32x32</option>
                </Select>
              </div>

              <div>
                <Text role="Label" className="block mb-1.5" content="Preset Palette" />
                <Select onChange={(e) => handleLoadPreset(e.target.value)}>
                  <option value="">Select preset...</option>
                  <option value="classic">Classic</option>
                  <option value="skin">Skin Tones</option>
                  <option value="nature">Nature</option>
                </Select>
              </div>
            </Block>
          </Section>

          <Section className="p-4 border-t border-border">
            <Text role="Title" prominence="Hero" className="mb-3" content="Tools" />

            <Block role="Toolbar">
              <Button
                variant={state.tool === 'pen' ? 'accent' : 'ghost'}
                onClick={() => setState((prev) => ({ ...prev, tool: 'pen' }))}
                className="w-full justify-start"
              >
                <Paintbrush size={16} />
                Pen
              </Button>

              <Button
                variant={state.tool === 'eraser' ? 'accent' : 'ghost'}
                onClick={() => setState((prev) => ({ ...prev, tool: 'eraser' }))}
                className="w-full justify-start"
              >
                <Eraser size={16} />
                Eraser
              </Button>

              <Button
                variant={state.tool === 'fill' ? 'accent' : 'ghost'}
                onClick={() => setState((prev) => ({ ...prev, tool: 'fill' }))}
                className="w-full justify-start"
              >
                <Droplet size={16} />
                Fill
              </Button>

              <Button
                variant="outline"
                onClick={handleClear}
                className="w-full justify-start text-red-600"
              >
                <Trash2 size={16} />
                Clear Canvas
              </Button>
            </Block>

            <div className="mt-4">
              <Switch
                label="Show Grid"
                checked={state.showGrid}
                onChange={(e) => setState((prev) => ({ ...prev, showGrid: e.target.checked }))}
              />
            </div>
          </Section>

          <Section className="p-4 border-t border-border">
            <Text role="Title" prominence="Hero" className="mb-3" content="Color Palette" />

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
      <Section role="Main" className="flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="h-12 bg-layer-2 border-b border-border flex items-center justify-between px-4">
            <Block role="Card" direction="horizontal">
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
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
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
                <Section className="max-w-2xl">
                  <Block role="Container">
                    <Text role="Title" prominence="Hero" content="Emoji JSON Data" />
                    <pre className="bg-layer-1 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                      {exportDesign(state.design)}
                    </pre>

                    <Block role="Toolbar" direction="horizontal">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(exportDesign(state.design));
                        }}
                      >
                        <Copy size={16} />
                        Copy JSON
                      </Button>
                    </Block>
                  </Block>
                </Section>
              </TabsContent>
            </Tabs>
          </div>
      </Section>

      {/* Right Sidebar - Preview */}
      <Section role="Aside" className="overflow-y-auto">
          <Section className="p-4">
            <Text role="Title" prominence="Hero" className="mb-3" content="Preview" />

            <Block role="Container">
              {/* Small preview */}
              <div className="bg-layer-1 p-4 rounded-lg flex items-center justify-center">
                <div
                  className="grid gap-0"
                  style={{
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
              </div>

              {/* Medium preview */}
              <div className="bg-layer-1 p-4 rounded-lg flex items-center justify-center">
                <div
                  className="grid gap-0"
                  style={{
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
              </div>

              {/* Large preview */}
              <div className="bg-layer-1 p-4 rounded-lg flex items-center justify-center">
                <div
                  className="grid gap-0"
                  style={{
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
              </div>
            </Block>
          </Section>

          <Section className="p-4 border-t border-border">
            <Text role="Title" prominence="Hero" className="mb-3" content="Design Info" />

            <Block role="Card">
              <div className="flex justify-between">
                <Text role="Label" content="ID" />
                <Text
                  role="Body"
                  prominence="Hero"
                  className="font-mono text-xs"
                  content={state.design.id}
                />
              </div>

              <div className="flex justify-between">
                <Text role="Label" content="Created" />
                <Text
                  role="Body"
                  prominence="Hero"
                  className="text-xs"
                  content={new Date(state.design.createdAt).toLocaleString()}
                />
              </div>

              <div className="flex justify-between">
                <Text role="Label" content="Updated" />
                <Text
                  role="Body"
                  prominence="Hero"
                  className="text-xs"
                  content={new Date(state.design.updatedAt).toLocaleString()}
                />
              </div>
            </Block>
          </Section>
      </Section>
    </Page>
  );
};
