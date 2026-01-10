/**
 * JsonSchemaSidebarDSL - DSL로 재구성된 JSON 스키마 사이드바
 *
 * Why-First 접근법 적용:
 * - role="Card" → 분석 데이터
 * - role="Toolbar" → 토글 버튼
 * - prominence로 중요도 자동 조절
 */

import { ChevronDown, ChevronRight, Code, Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { analyzeJsonSchema, generateTypeScriptInterface } from '@/apps/JSON/lib/json-schema';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';
import { Section } from '@/components/types/Section/Section';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

interface JsonSchemaSidebarDSLProps {
  data: JsonValue;
  interfaceName?: string;
}

export const JsonSchemaSidebarDSL = ({
  data,
  interfaceName = 'Item',
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
      <Section className="flex flex-col w-80 bg-layer-2-cool boundary-shadow-right overflow-hidden rounded-md">
        <div className="px-4 py-3">
          <Group role="Container" className="flex items-center gap-2">
            <Code size={16} />
            <Text role="Title" prominence="Hero" content="Schema" />
          </Group>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <Group role="Card">
            <Text role="Body" className="text-center" content="No data to analyze" />
          </Group>
        </div>
      </Section>
    );
  }

  return (
    <Section className="flex flex-col w-80 bg-layer-2-cool boundary-shadow-right overflow-hidden rounded-md">
      {/* Header */}
      <div className="px-3 py-2">
        <Group role="Container" className="flex items-center gap-2">
          <Code size={14} />
          <Text role="Title" content="Schema" />
        </Group>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Schema Analysis Section */}
        {schema.analysis && (
          <Section>
            <Group role="Toolbar">
              <Item
                as="button"
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
                <Group role="Card">
                  <div className="flex justify-between px-2">
                    <Text role="Label" content="Properties" />
                    <Text
                      role="Body"
                      prominence="Hero"
                      className="font-mono"
                      content={String(schema.analysis.totalKeys)}
                    />
                  </div>

                  <div className="flex justify-between px-2">
                    <Text role="Label" content="Depth" />
                    <Text
                      role="Body"
                      prominence="Hero"
                      className="font-mono"
                      content={String(schema.analysis.depth)}
                    />
                  </div>

                  <div className="flex justify-between px-2">
                    <Text role="Label" content="Types" />
                    <Text
                      role="Body"
                      prominence="Hero"
                      className="font-mono"
                      content={Array.from(schema.analysis.types).join(', ')}
                    />
                  </div>
                </Group>
              </div>
            )}
          </Section>
        )}

        {/* TypeScript Interface Section */}
        <Section>
          <Group role="Toolbar">
            <Item
              as="button"
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
              <Group role="Container">
                <Item
                  as="pre"
                  prominence="Hero"
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
