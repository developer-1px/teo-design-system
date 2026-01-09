/**
 * ShadowToken - 그림자 토큰 시각화
 *
 * 실제 box-shadow를 적용한 박스로 표시합니다.
 */

import { useState } from 'react';
import { Group } from '@/components/Group/Group.tsx';
import { Text } from '@/components/Text/Text';
import type { Token } from '@/apps/tokens/parser/types';

export function ShadowToken({ token }: { token: Token }) {
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
    <Group role="Card" prominence="Primary" gap={0}>
      {/* 그림자 미리보기 (compact) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '80px',
          backgroundColor: 'var(--color-surface-sunken)',
          borderRadius: '0.375rem',
          padding: '0.75rem',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            boxShadow: token.resolvedValue,
          }}
        />
      </div>

      {/* 토큰 정보 (compact) */}
      <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <Text role="Label" prominence="Primary" className="font-mono text-xs truncate" title={token.name}>
          {token.name}
        </Text>
        <Text role="Caption" prominence="Tertiary" className="font-mono text-xs break-all line-clamp-2">
          {token.resolvedValue}
        </Text>

        {/* CSS Variable (compact) */}
        <div
          onClick={() => handleCopy(`var(${token.name})`)}
          style={{
            backgroundColor: 'var(--color-surface-sunken)',
            padding: '0.375rem',
            borderRadius: '0.25rem',
            fontFamily: 'monospace',
            fontSize: '0.625rem',
            cursor: 'pointer',
            border: '1px solid var(--color-border-subtle)',
            transition: 'background-color 100ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-sunken)';
          }}
          title="Click to copy"
        >
          <Text role="Caption" prominence="Primary" className="font-mono truncate">
            var({token.name})
          </Text>
        </div>
      </div>
    </Group>
  );
}
