/**
 * JsonSchemaSidebarDSL - DSL로 재구성된 JSON 스키마 사이드바
 *
 * Why-First 접근법 적용:
 * - purpose="info" → 분석 데이터
 * - purpose="action" → 토글 버튼
 * - prominence로 중요도 자동 조절
 */

import { useMemo, useState } from 'react';
import { Section, Group, Item } from '@/components/dsl';
import { generateTypeScriptInterface, analyzeJsonSchema } from '@/utils/json-schema';
import { Code, Info, ChevronRight, ChevronDown } from 'lucide-react';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

interface JsonSchemaSidebarDSLProps {
  data: JsonValue;
  interfaceName?: string;
}

export const JsonSchemaSidebarDSL = ({
  data,
  interfaceName = 'Item'
}: JsonSchemaSidebarDSLProps) => {
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

    const sampleData = Array.isArray(data) ? data[0] : data;
    if (!sampleData) {
      return { typescript: '', analysis: null };
    }

    const typescript = generateTypeScriptInterface(sampleData, interfaceName);
    const analysis = analyzeJsonSchema(sampleData);

    return { typescript, analysis };
  }, [data, interfaceName]);

  // No data state
  if (!schema.typescript) {
    return (
      <Section
        prominence={2}
        className="flex flex-col w-80 bg-layer-2-cool boundary-shadow-right overflow-hidden rounded-md"
      >
        <div className="px-4 py-3">
          <Group purpose="content">
            <Item as="div" prominence={1} className="flex items-center gap-2">
              <Code size={16} />
              <span>Schema</span>
            </Item>
          </Group>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <Group purpose="info">
            <Item as="p" prominence={3} className="text-center">
              No data to analyze
            </Item>
          </Group>
        </div>
      </Section>
    );
  }

  return (
    <Section
      prominence={2}
      className="flex flex-col w-80 bg-layer-2-cool boundary-shadow-right overflow-hidden rounded-md"
    >
      {/* Header */}
      <div className="px-3 py-2">
        <Group purpose="content">
          <Item as="div" prominence={2} className="flex items-center gap-2">
            <Code size={14} />
            <span>Schema</span>
          </Item>
        </Group>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Schema Analysis Section */}
        {schema.analysis && (
          <Section prominence={2}>
            <Group purpose="action">
              <Item
                as="button"
                prominence={2}
                onClick={() => toggleSection('analysis')}
                className="w-full justify-start px-3 py-2 flex items-center gap-1.5"
              >
                {expandedSections.has('analysis') ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
                <Info size={12} />
                <span>Analysis</span>
              </Item>
            </Group>

            {expandedSections.has('analysis') && (
              <div className="px-3 pb-2 space-y-2">
                <Group purpose="info">
                  <div className="flex justify-between px-2">
                    <Item as="span" prominence={3}>
                      Properties
                    </Item>
                    <Item as="span" prominence={1} className="font-mono">
                      {schema.analysis.totalKeys}
                    </Item>
                  </div>

                  <div className="flex justify-between px-2">
                    <Item as="span" prominence={3}>
                      Depth
                    </Item>
                    <Item as="span" prominence={1} className="font-mono">
                      {schema.analysis.depth}
                    </Item>
                  </div>

                  <div className="flex justify-between px-2">
                    <Item as="span" prominence={3}>
                      Types
                    </Item>
                    <Item as="span" prominence={1} className="font-mono">
                      {Array.from(schema.analysis.types).join(', ')}
                    </Item>
                  </div>
                </Group>
              </div>
            )}
          </Section>
        )}

        {/* TypeScript Interface Section */}
        <Section prominence={2}>
          <Group purpose="action">
            <Item
              as="button"
              prominence={2}
              onClick={() => toggleSection('typescript')}
              className="w-full justify-start px-3 py-2 flex items-center gap-1.5"
            >
              {expandedSections.has('typescript') ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
              <Code size={12} />
              <span>Interface</span>
            </Item>
          </Group>

          {expandedSections.has('typescript') && (
            <div className="px-3 pb-2">
              <Group purpose="content">
                <Item
                  as="pre"
                  prominence={1}
                  className="font-mono whitespace-pre overflow-x-auto bg-layer-3 p-2 rounded text-xs"
                >
                  {schema.typescript}
                </Item>
              </Group>
            </div>
          )}
        </Section>
      </div>
    </Section>
  );
};
