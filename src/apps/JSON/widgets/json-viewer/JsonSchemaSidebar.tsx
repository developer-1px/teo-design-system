import { ChevronDown, ChevronRight, Code, Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { analyzeJsonSchema, generateTypeScriptInterface } from '@/apps/JSON/lib/json-schema';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { Section } from '@/components/types/Section/Section';

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
    <Section
      role="SecondarySidebar"
      collapsible={{ collapsed: false }}
      className="w-80 bg-layer-2-cool border-r border-border-default"
    >
      <Block role="Toolbar" layout="inline" className="px-4 py-3">
        <Text role="Title" size="sm" prominence="Standard" className="flex items-center gap-2">
          <Code size={16} />
          Schema
        </Text>
      </Block>
      <Block role="Container" className="flex-1 flex items-center justify-center px-4 py-8">
        <Text
          role="Body"
          prominence="Subtle"
          className="text-center"
          content="No data to analyze"
        />
      </Block>
    </Section>
  );

  return (
    <Section
      role="SecondarySidebar"
      collapsible={{ collapsed: false }}
      className="w-80 bg-layer-2-cool border-r border-border-default"
    >
      {/* Header */}
      <Block role="Toolbar" layout="inline" className="px-3 py-2">
        <Text role="Body" prominence="Standard" className="flex items-center gap-2">
          <Code size={14} />
          Schema
        </Text>
      </Block>

      <Block role="ScrollArea" className="flex-1">
        {/* Schema Info Section */}
        {schema.analysis && (
          <Block role="Group">
            <Action
              role="Button"
              prominence="Subtle"
              intent="Neutral"
              className="w-full justify-start px-3 py-2 rounded-none"
              onClick={() => toggleSection('analysis')}
            >
              <Block role="Inline" layout="inline" className="gap-1.5">
                {expandedSections.has('analysis') ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
                <Info size={12} />
                <Text role="Body" size="sm">
                  Analysis
                </Text>
              </Block>
            </Action>
            {expandedSections.has('analysis') && (
              <Block role="Stack" gap={1} className="px-3 pb-2 mt-1">
                <Block role="Inline" layout="inline" justify="between" className="px-2">
                  <Text role="Caption" prominence="Subtle" content="Properties" />
                  <Text
                    role="Caption"
                    prominence="Standard"
                    className="font-mono"
                    content={String(schema.analysis?.totalKeys || 0)}
                  />
                </Block>
                <Block role="Inline" layout="inline" justify="between" className="px-2">
                  <Text role="Caption" prominence="Subtle" content="Depth" />
                  <Text
                    role="Caption"
                    prominence="Standard"
                    className="font-mono"
                    content={String(schema.analysis?.depth || 0)}
                  />
                </Block>
                <Block role="Inline" layout="inline" justify="between" className="px-2">
                  <Text role="Caption" prominence="Subtle" content="Types" />
                  <Text
                    role="Caption"
                    prominence="Standard"
                    className="font-mono"
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
            className="w-full justify-start px-3 py-2 rounded-none"
            onClick={() => toggleSection('typescript')}
          >
            <Block role="Inline" layout="inline" className="gap-1.5">
              {expandedSections.has('typescript') ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
              <Code size={12} />
              <Text role="Body" size="sm">
                Interface
              </Text>
            </Block>
          </Action>
          {expandedSections.has('typescript') && (
            <Block role="Container" className="px-3 pb-2 mt-1">
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
