/**
 * TokenTable - 디자인 토큰을 테이블 형식으로 표시
 */

import { Section } from '@/components/Section/Section.tsx';
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
import { useState } from 'react';

interface TokenRow {
  name: string;
  value: string;
  description?: string;
  preview?: 'color' | 'spacing' | 'typography' | 'shadow';
}

interface TokenTableProps {
  title?: string;
  tokens: TokenRow[];
  className?: string;
}

export const TokenTable = ({ title, tokens, className }: TokenTableProps) => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const renderPreview = (token: TokenRow) => {
    if (!token.preview) return null;

    switch (token.preview) {
      case 'color':
        return (
          <div
            className="w-10 h-10 rounded border border-border"
            style={{
              backgroundColor: `var(${token.value})`
            }}
          />
        );

      case 'spacing':
        return (
          <div className="flex items-center gap-2">
            <div
              className="bg-accent rounded"
              style={{
                width: `var(${token.value})`,
                height: '1rem'
              }}
            />
            <span className="text-xs text-text-tertiary">
              {getComputedStyle(document.documentElement).getPropertyValue(token.value)}
            </span>
          </div>
        );

      case 'typography':
        return (
          <span
            className="text-text"
            style={{
              fontSize: `var(${token.value})`
            }}
          >
            Ag
          </span>
        );

      case 'shadow':
        return (
          <div
            className="w-10 h-10 rounded bg-layer-3"
            style={{
              boxShadow: `var(${token.value})`
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Section role="Container" prominence="Secondary" className={cn("overflow-hidden", className)}>
      {title && (
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-text">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-layer-1">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-text-secondary">
                Token Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-text-secondary">
                Value
              </th>
              {tokens.some(t => t.preview) && (
                <th className="px-4 py-2 text-left text-xs font-semibold text-text-secondary">
                  Preview
                </th>
              )}
              {tokens.some(t => t.description) && (
                <th className="px-4 py-2 text-left text-xs font-semibold text-text-secondary">
                  Description
                </th>
              )}
              <th className="px-4 py-2 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tokens.map((token, index) => (
              <tr
                key={index}
                className="hover:bg-layer-1/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <code className="text-xs text-text font-mono">
                    {token.name}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs text-accent font-mono bg-layer-1 px-2 py-1 rounded">
                    {token.value}
                  </code>
                </td>
                {tokens.some(t => t.preview) && (
                  <td className="px-4 py-3">
                    {renderPreview(token)}
                  </td>
                )}
                {tokens.some(t => t.description) && (
                  <td className="px-4 py-3">
                    <span className="text-xs text-text-secondary">
                      {token.description}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleCopy(token.value)}
                    className="text-text-tertiary hover:text-accent transition-colors p-1"
                    title="Copy value"
                  >
                    {copiedValue === token.value ? (
                      <span className="text-xs text-accent">✓</span>
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
};
