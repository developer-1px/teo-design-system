/**
 * RadiusToken - 둥근 모서리 토큰 시각화 (Pure IDDL)
 *
 * 실제 border-radius를 적용한 박스로 표시합니다.
 */

import { useState } from 'react';
import type { Token } from '@/apps/tokens/parser/types';
import { Group } from '@/components/types/Group/Group.tsx';
import { Text } from '@/components/types/Atom/Text/Text';

export function RadiusToken({ token }: { token: Token }) {
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
      {/* 둥근 모서리 미리보기 */}
      <Group
        role="Container"
        prominence="Strong"
        className="relative w-full h-20 bg-surface-sunken rounded-md flex items-center justify-center"
      >
        <div
          className="w-15 h-15 bg-accent border-2 border-white"
          style={{
            borderRadius: token.resolvedValue,
          }}
        />
        {/* 크기 라벨 */}
        <Group
          role="Container"
          prominence="Hero"
          className="absolute bottom-1.5 right-1.5 bg-gray-900/60 text-white px-1.5 py-1 rounded"
        >
          <Text role="Caption" content={token.resolvedValue} className="text-white text-[10px] font-mono" />
        </Group>
      </Group>

      {/* 토큰 정보 */}
      <Group role="Container" layout="stack" gap={1} className="p-2">
        <Text role="Label" prominence="Standard" content={token.name} className="font-mono text-xs truncate" />
        <Text role="Caption" prominence="Subtle" content={token.resolvedValue} className="font-mono text-xs font-semibold" />

        {/* CSS Variable (clickable) */}
        <Group
          role="Container"
          clickable
          onClick={() => handleCopy(`var(${token.name})`)}
          prominence="Strong"
          className="bg-surface-sunken px-2 py-1.5 rounded border border-border-subtle cursor-pointer hover:bg-surface-raised transition-colors"
        >
          <Text role="Caption" prominence="Standard" content={`var(${token.name})`} className="font-mono text-[10px] truncate" />
        </Group>
      </Group>
    </Group>
  );
}
