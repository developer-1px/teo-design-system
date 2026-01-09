/**
 * CodeGenerator - TSX 코드 자동 생성 및 복사
 *
 * 현재 레이아웃 구성을 TSX 코드로 변환하여 표시
 */

import { useState } from 'react';
import type { GridTemplate } from '@/components/types/Atom/types';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';
import { Action } from '@/components/types/Atom/Action/Action';

interface CodeGeneratorProps {
  template: GridTemplate;
  sections: string[];
}

export function CodeGenerator({ template, sections }: CodeGeneratorProps) {
  const [copied, setCopied] = useState(false);

  // TSX 코드 생성 (v2: gridArea 자동 매핑, prop 불필요)
  const generatedCode = `import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';

export function MyApp() {
  return (
    <Page role="App" template="${template}">
${sections
  .map((sectionRole) => {
    return `      <Section role="${sectionRole}">
        {/* ${sectionRole} content */}
      </Section>`;
  })
  .join('\n\n')}
    </Page>
  );
}

// Section은 Page의 template과 자신의 role을 보고
// 자동으로 gridArea를 계산합니다. (gridArea prop 불필요)`;

  // 클립보드로 복사
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Group role="Container" layout="stack" className="h-full overflow-y-auto p-4">
      <Group role="Toolbar" className="justify-between items-center mb-2">
        <Text role="Title" content="생성된 코드" prominence="Strong" />
        <Action
          prominence="Standard"
          intent={copied ? 'Positive' : 'Neutral'}
          onClick={handleCopy}
        >
          {copied ? '✓ 복사됨' : '복사'}
        </Action>
      </Group>

      <Group
        role="Container"
        className="bg-surface-sunken rounded-lg p-4 overflow-x-auto font-mono text-sm"
      >
        <pre className="text-text-primary">
          <code>{generatedCode}</code>
        </pre>
      </Group>

      <Text
        role="Caption"
        content="위 코드를 복사하여 프로젝트에 붙여넣으세요"
        prominence="Subtle"
        className="text-xs mt-2"
      />
    </Group>
  );
}
