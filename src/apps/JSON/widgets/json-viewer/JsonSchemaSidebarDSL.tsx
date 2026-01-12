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
import { Block } from '@/components/dsl/Block/Block';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section';

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
      <Section>
        <div className="px-4 py-3">
          <Block role="Container">
            <Code size={16} />
            <Text role="Title" prominence="Hero" content="Schema" />
          </Block>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <Block role="Card">
            <Text role="Body" content="No data to analyze" />
          </Block>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      {/* Header */}
      <div className="px-3 py-2">
        <Block role="Container">
          <Code size={14} />
          <Text role="Title" content="Schema" />
        </Block>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Schema Analysis Section */}
        {schema.analysis && (
          <Section>
            <Block role="Toolbar">
              <Block
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
              </Block>
            </Block>

            {expandedSections.has('analysis') && (
              <div className="px-3 pb-2 space-y-2">
                <Block role="Card">
                  <div className="flex justify-between px-2">
                    <Text role="Label" content="Properties" />
                    <Text
                      role="Body"
                      prominence="Hero"
                      content={String(schema.analysis.totalKeys)}
                    />
                  </div>

                  <div className="flex justify-between px-2">
                    <Text role="Label" content="Depth" />
                    <Text
                      role="Body"
                      prominence="Hero"
                      content={String(schema.analysis.depth)}
                    />
                  </div>

                  <div className="flex justify-between px-2">
                    <Text role="Label" content="Types" />
                    <Text
                      role="Body"
                      prominence="Hero"
                      content={Array.from(schema.analysis.types).join(', ')}
                    />
                  </div>
                </Block>
              </div>
            )}
          </Section>
        )}

        {/* TypeScript Interface Section */}
        <Section>
          <Block role="Toolbar">
            <Block
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
            </Block>
          </Block>

          {expandedSections.has('typescript') && (
            <div className="px-3 pb-2">
              <Block role="Container">
                <Block
                  as="pre"
                  prominence="Hero"
                >
                  {schema.typescript}
                </Block>
              </Block>
            </div>
          )}
        </Section>
      </div>
    </Section>
  );
};
