/**
 * ColorToken - 색상 토큰 시각화 (Pure IDDL)
 *
 * 색상 스와치와 토큰 정보를 표시합니다.
 * 클릭 시 토큰 이름을 클립보드에 복사합니다.
 */

import { useState } from 'react';
import type { Token } from '@/apps/tokens/parser/types';
import { Group } from '@/components/types/Group/Group.tsx';
import { Text } from '@/components/types/Atom/Text/Text';

export function ColorToken({ token }: { token: Token }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <Group role="Card" layout="stack" gap={0} prominence="Standard" density="Compact">
      {/* 색상 스와치 (클릭 가능) */}
      <Group
        role="Container"
        clickable
        onClick={() => handleCopy(token.name)}
        className="relative w-full h-20 rounded-md border border-border-muted cursor-pointer transition-transform hover:scale-[0.98]"
        style={{
          backgroundColor: token.resolvedValue,
        }}
      >
        {/* 복사 완료 피드백 */}
        {copied && (
          <Group
            role="Container"
            prominence="Standard"
            className="absolute inset-0 flex items-center justify-center"
          >
            <Group
              role="Card"
              prominence="Hero"
              className="bg-gray-900/80 text-white px-4 py-2 rounded-md"
            >
              <Text role="Label" content="Copied!" className="text-white font-medium" />
            </Group>
          </Group>
        )}
      </Group>

      {/* 토큰 정보 */}
      <Group role="Container" layout="stack" gap={1} className="p-2">
        <Text
          role="Label"
          prominence="Standard"
          content={token.name}
          className="font-mono text-xs truncate"
        />
        <Text
          role="Caption"
          prominence="Subtle"
          content={token.resolvedValue.toUpperCase()}
          className="font-mono text-xs font-semibold"
        />
        {token.value !== token.resolvedValue && (
          <Text
            role="Caption"
            prominence="Subtle"
            content={`→ ${token.value}`}
            className="font-mono text-xs truncate"
          />
        )}

        {/* CSS Variable (clickable) */}
        <Group
          role="Container"
          clickable
          onClick={() => handleCopy(`var(${token.name})`)}
          prominence="Strong"
          className="bg-surface-sunken px-2 py-1.5 rounded border border-border-subtle cursor-pointer hover:bg-surface-raised transition-colors"
        >
          <Text
            role="Caption"
            prominence="Standard"
            content={`var(${token.name})`}
            className="font-mono text-[10px] truncate"
          />
        </Group>
      </Group>
    </Group>
  );
}
