import { ChevronDown, ChevronRight, Code, Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { analyzeJsonSchema, generateTypeScriptInterface } from '@/apps/JSON/lib/json-schema';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section';

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

  return (
    <Section role="SecondarySidebar" collapsible={{ collapsed: false }}>
      {/* Header */}
      <Block role="Toolbar">
        <Text role="Body" prominence="Standard">
          <Code size={14} />
          Schema
        </Text>
      </Block>

      <Block role="ScrollArea">
        {/* Schema Info Section */}
        {schema.analysis && (
          <Block role="Group">
            <Action
              role="Button"
              prominence="Subtle"
              intent="Neutral"
              onClick={() => toggleSection('analysis')}
            >
              <Block role="Toolbar">
                {expandedSections.has('analysis') ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
                <Info size={12} />
                <Text role="Body">Analysis</Text>
              </Block>
            </Action>
            {expandedSections.has('analysis') && (
              <Block role="Stack">
                <Block role="Toolbar">
                  <Text role="Caption" prominence="Subtle" content="Properties" />
                  <Text
                    role="Caption"
                    prominence="Standard"
                    content={String(schema.analysis?.totalKeys || 0)}
                  />
                </Block>
                <Block role="Toolbar">
                  <Text role="Caption" prominence="Subtle" content="Depth" />
                  <Text
                    role="Caption"
                    prominence="Standard"
                    content={String(schema.analysis?.depth || 0)}
                  />
                </Block>
                <Block role="Toolbar">
                  <Text role="Caption" prominence="Subtle" content="Types" />
                  <Text
                    role="Caption"
                    prominence="Standard"
                    content={Array.from(schema.analysis?.types || []).join(', ')}
                  />
                </Block>
              </Block>
            )}
          </Block>
        )}

        {/* TypeScript Interface Section */}
        <Block role="Group">
          <Action
            role="Button"
            prominence="Subtle"
            intent="Neutral"
            onClick={() => toggleSection('typescript')}
          >
            <Block role="Toolbar">
              {expandedSections.has('typescript') ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
              <Code size={12} />
              <Text role="Body">Interface</Text>
            </Block>
          </Action>
          {expandedSections.has('typescript') && (
            <Block role="Container">
              <pre className="font-mono text-xs whitespace-pre overflow-x-auto bg-layer-3 p-2 rounded border border-border-default shadow-inner">
                {schema.typescript}
              </pre>
            </Block>
          )}
        </Block>
      </Block>
    </Section>
  );
};
