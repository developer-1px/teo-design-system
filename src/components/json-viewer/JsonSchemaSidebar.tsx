import { useMemo, useState } from 'react';
import { Layer } from '@/components/ui/Layer';
import { generateTypeScriptInterface, analyzeJsonSchema } from '@/utils/json-schema';
import { Code, Info, ChevronRight, ChevronDown } from 'lucide-react';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

interface JsonSchemaSidebarProps {
  data: JsonValue;
  interfaceName?: string;
}

export const JsonSchemaSidebar = ({ data, interfaceName = 'Item' }: JsonSchemaSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['analysis', 'typescript'])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const schema = useMemo(() => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return { typescript: '', analysis: null };
    }

    // If data is array, analyze first item
    const sampleData = Array.isArray(data) ? data[0] : data;

    if (!sampleData) {
      return { typescript: '', analysis: null };
    }

    const typescript = generateTypeScriptInterface(sampleData, interfaceName);
    const analysis = analyzeJsonSchema(sampleData);

    return { typescript, analysis };
  }, [data, interfaceName]);

  if (!schema.typescript) {
    return (
      <Layer
        level={2}
        rounded="md"
        className="flex flex-col w-80 bg-layer-2-cool boundary-shadow-right overflow-hidden"
      >
        <div className="px-4 py-3">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Code size={16} />
            Schema
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <p className="text-xs text-text-tertiary text-center">
            No data to analyze
          </p>
        </div>
      </Layer>
    );
  }

  return (
    <Layer
      level={2}
      rounded="md"
      className="flex flex-col w-80 bg-layer-2-cool boundary-shadow-right overflow-hidden"
    >
      {/* Header */}
      <div className="px-3 py-2 flex items-center gap-2">
        <Code size={14} className="text-text-tertiary" />
        <span className="text-xs font-medium text-text-secondary">Schema</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Schema Info Section */}
        {schema.analysis && (
          <div>
            <button
              onClick={() => toggleSection('analysis')}
              className="w-full px-3 py-2 flex items-center justify-between hover:bg-layer-3"
            >
              <div className="flex items-center gap-1.5">
                {expandedSections.has('analysis') ? (
                  <ChevronDown size={12} className="text-text-tertiary" />
                ) : (
                  <ChevronRight size={12} className="text-text-tertiary" />
                )}
                <Info size={12} className="text-text-tertiary" />
                <span className="text-xs text-text-secondary">Analysis</span>
              </div>
            </button>
            {expandedSections.has('analysis') && (
              <div className="px-3 pb-2 space-y-1 text-xs">
                <div className="flex justify-between px-2 py-0.5">
                  <span className="text-text-tertiary">Properties</span>
                  <span className="text-text-primary font-mono">{schema.analysis.totalKeys}</span>
                </div>
                <div className="flex justify-between px-2 py-0.5">
                  <span className="text-text-tertiary">Depth</span>
                  <span className="text-text-primary font-mono">{schema.analysis.depth}</span>
                </div>
                <div className="flex justify-between px-2 py-0.5">
                  <span className="text-text-tertiary">Types</span>
                  <span className="text-text-primary font-mono text-xs">
                    {Array.from(schema.analysis.types).join(', ')}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TypeScript Interface Section */}
        <div>
          <button
            onClick={() => toggleSection('typescript')}
            className="w-full px-3 py-2 flex items-center justify-between hover:bg-layer-3"
          >
            <div className="flex items-center gap-1.5">
              {expandedSections.has('typescript') ? (
                <ChevronDown size={12} className="text-text-tertiary" />
              ) : (
                <ChevronRight size={12} className="text-text-tertiary" />
              )}
              <Code size={12} className="text-text-tertiary" />
              <span className="text-xs text-text-secondary">Interface</span>
            </div>
          </button>
          {expandedSections.has('typescript') && (
            <div className="px-3 pb-2">
              <pre className="text-xs font-mono text-text-primary whitespace-pre overflow-x-auto bg-layer-3 p-2 rounded">
                {schema.typescript}
              </pre>
            </div>
          )}
        </div>
      </div>
    </Layer>
  );
};
