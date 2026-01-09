import { ChevronDown, ChevronRight, Code, Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/Action/role/Button';
import { Section } from '@/components/Section/Section.tsx';
import { Content, ContentGroup } from '@/components/Text/role/Content';
import { analyzeJsonSchema, generateTypeScriptInterface } from '@/utils/json-schema.ts';

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
      <Section
        role="Container"
        prominence="Secondary"
        className="flex flex-col w-80 bg-layer-2-cool boundary-shadow-right overflow-hidden"
      >
        <div className="px-4 py-3">
          <Content prominence="primary">
            <h3 className="flex items-center gap-2">
              <Code size={16} />
              Schema
            </h3>
          </Content>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <Content prominence="tertiary">
            <p className="text-center">No data to analyze</p>
          </Content>
        </div>
      </Section>
    );
  }

  return (
    <Section
      role="Container"
      prominence="Secondary"
      className="flex flex-col w-80 bg-layer-2-cool boundary-shadow-right overflow-hidden"
    >
      {/* Header */}
      <div className="px-3 py-2">
        <Content prominence="secondary">
          <div className="flex items-center gap-2">
            <Code size={14} />
            Schema
          </div>
        </Content>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Schema Info Section */}
        {schema.analysis && (
          <div>
            <Button
              variant="ghost"
              onClick={() => toggleSection('analysis')}
              className="w-full justify-start px-3 py-2 h-auto rounded-none"
            >
              <Content prominence="secondary">
                <div className="flex items-center gap-1.5">
                  {expandedSections.has('analysis') ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronRight size={12} />
                  )}
                  <Info size={12} />
                  Analysis
                </div>
              </Content>
            </Button>
            {expandedSections.has('analysis') && (
              <div className="px-3 pb-2">
                <ContentGroup gap={4}>
                  <div className="flex justify-between px-2">
                    <Content prominence="tertiary">
                      <span>Properties</span>
                    </Content>
                    <Content prominence="primary">
                      <span className="font-mono">{schema.analysis.totalKeys}</span>
                    </Content>
                  </div>
                  <div className="flex justify-between px-2">
                    <Content prominence="tertiary">
                      <span>Depth</span>
                    </Content>
                    <Content prominence="primary">
                      <span className="font-mono">{schema.analysis.depth}</span>
                    </Content>
                  </div>
                  <div className="flex justify-between px-2">
                    <Content prominence="tertiary">
                      <span>Types</span>
                    </Content>
                    <Content prominence="primary">
                      <span className="font-mono">
                        {Array.from(schema.analysis.types).join(', ')}
                      </span>
                    </Content>
                  </div>
                </ContentGroup>
              </div>
            )}
          </div>
        )}

        {/* TypeScript Interface Section */}
        <div>
          <Button
            variant="ghost"
            onClick={() => toggleSection('typescript')}
            className="w-full justify-start px-3 py-2 h-auto rounded-none"
          >
            <Content prominence="secondary">
              <div className="flex items-center gap-1.5">
                {expandedSections.has('typescript') ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
                <Code size={12} />
                Interface
              </div>
            </Content>
          </Button>
          {expandedSections.has('typescript') && (
            <div className="px-3 pb-2">
              <Content prominence="primary">
                <pre className="font-mono whitespace-pre overflow-x-auto bg-layer-3 p-2 rounded">
                  {schema.typescript}
                </pre>
              </Content>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};
