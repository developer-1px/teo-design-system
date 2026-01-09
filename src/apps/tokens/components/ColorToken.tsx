/**
 * ColorToken - 색상 토큰 시각화
 *
 * 색상 스와치와 토큰 정보를 표시합니다.
 * 클릭 시 토큰 이름을 클립보드에 복사합니다.
 */

import { useState } from 'react';
import { Group } from '@/components/Group/Group.tsx';
import { Text } from '@/components/Text/Text';
import type { Token } from '@/apps/tokens/parser/types';

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
    <Group role="Card" prominence="Primary" gap={0}>
      {/* 색상 스와치 (클릭 가능) */}
      <div
        onClick={() => handleCopy(token.name)}
        style={{
          width: '100%',
          height: '80px',
          backgroundColor: token.resolvedValue,
          borderRadius: '0.375rem',
          border: '1px solid var(--color-border-muted)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'transform 100ms',
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.98)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {/* 복사 완료 피드백 */}
        {copied && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Copied!
          </div>
        )}
      </div>

      {/* 토큰 정보 (compact) */}
      <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <Text role="Label" prominence="Primary" className="font-mono text-xs truncate" title={token.name}>
          {token.name}
        </Text>
        <Text role="Caption" prominence="Secondary" className="font-mono text-xs">
          <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
            {token.resolvedValue.toUpperCase()}
          </span>
        </Text>
        {token.value !== token.resolvedValue && (
          <Text role="Caption" prominence="Tertiary" className="font-mono text-xs truncate">
            → {token.value}
          </Text>
        )}

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
