/**
 * ColorSwatch - 디자인 토큰 색상을 시각화하는 컴포넌트
 */

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Section } from '@/components/Section/Section.tsx';
import { cn } from '@/shared/lib/utils';

interface ColorSwatchProps {
  name: string;
  varName: string;
  description?: string;
  className?: string;
  showCode?: boolean;
}

export const ColorSwatch = ({
  name,
  varName,
  description,
  className,
  showCode = true,
}: ColorSwatchProps) => {
  const [computedColor, setComputedColor] = useState<string>('');
  const [hexColor, setHexColor] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const cssVar = getComputedStyle(root).getPropertyValue(varName).trim();

    if (cssVar) {
      const rgb = `rgb(${cssVar})`;
      setComputedColor(rgb);

      // Convert RGB to HEX
      const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const [, r, g, b] = match;
        const hex = '#' + [r, g, b].map((x) => parseInt(x).toString(16).padStart(2, '0')).join('');
        setHexColor(hex);
      }
    }
  }, [varName]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section role="Container" prominence="Secondary" className={cn('overflow-hidden', className)}>
      {/* Color Preview */}
      <div
        className="h-32 relative group cursor-pointer"
        style={{ backgroundColor: computedColor }}
        onClick={() => handleCopy(hexColor)}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2">
            {copied ? (
              <>
                <Check size={16} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy {hexColor}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Color Info */}
      <div className="p-4 space-y-2">
        <div>
          <h3 className="text-sm font-semibold text-text">{name}</h3>
          {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
        </div>

        {showCode && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-tertiary">CSS Variable</span>
              <button
                onClick={() => handleCopy(varName)}
                className="text-xs text-accent hover:text-accent/80 transition-colors"
              >
                Copy
              </button>
            </div>
            <code className="block text-xs text-text bg-layer-1 px-2 py-1.5 rounded font-mono">
              {varName}
            </code>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-xs text-text-tertiary block mb-1">RGB</span>
                <code className="block text-xs text-text bg-layer-1 px-2 py-1 rounded font-mono">
                  {computedColor}
                </code>
              </div>
              <div>
                <span className="text-xs text-text-tertiary block mb-1">HEX</span>
                <code className="block text-xs text-text bg-layer-1 px-2 py-1 rounded font-mono">
                  {hexColor}
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};
