# Text Component 개선 제안서

## 📋 현재 문제점

### 1. Switch-Case의 한계
```tsx
// ❌ 현재 구조 (Text.tsx:20-39)
const getRoleElement = (role: TextRole, prominence?: string) => {
  switch (role) {
    case 'Title': return prominence === 'Hero' ? 'h1' : 'h2';
    case 'Body': return 'p';
    case 'Label': return 'span';
    case 'Caption': return 'small';
    case 'Code': return 'code';
    default: return 'span';
  }
};
```

**문제점:**
- ❌ 스펙에는 21개 role이 정의되어 있지만 5개만 구현
- ❌ 새로운 role 추가 시 switch-case 수정 필요 (Open-Closed Principle 위반)
- ❌ Role별 복잡한 로직(파싱, 포맷팅) 처리 불가
- ❌ Markdown, Code, Time, Number, Json 같은 Rich role 지원 불가능
- ❌ 테스트 어려움 (전체 컴포넌트 마운트 필요)

### 2. 확장성 부족
- Badge, Kbd, Time, Number 등의 role은 `role/` 폴더에 별도 컴포넌트로 존재
- Text.tsx와 분리되어 일관성 부족
- role prop으로 통합 사용 불가능

---

## 🎯 개선 목표

1. ✅ **확장성**: 새로운 role 추가 시 기존 코드 수정 없이 등록만으로 가능
2. ✅ **유지보수성**: Role별 로직이 독립적으로 관리됨
3. ✅ **테스트 용이성**: Role별 독립 테스트 가능
4. ✅ **명세 준수**: text.spec.md의 21개 role 완전 지원
5. ✅ **타입 안정성**: TypeScript로 컴파일 타임 검증

---

## 🏗️ 제안 아키텍처

### Pattern 1: **Hybrid Configuration + Renderer Pattern** (권장)

Field 패턴을 참고하되, Text의 특성에 맞게 최적화합니다.

```
Text/
├── Text.tsx                    # Main component (registry 기반)
├── Text.types.ts              # Type definitions
├── configs/                    # ⭐ NEW: Configuration system
│   ├── types.ts               # Config types
│   ├── registry.ts            # Role → Config/Renderer mapping
│   ├── simple/                # Simple role configs (HTML mapping)
│   │   ├── typography.ts      # Title, Heading, Body, Label, Caption
│   │   └── inline.ts          # Strong, Emphasis, Mark, etc.
│   └── complex/               # Complex role configs
│       ├── rich.ts            # Markdown, Code configs
│       ├── data.ts            # Time, Number, Json configs
│       └── indicator.ts       # Badge, Kbd configs
├── renderers/                  # ⭐ Custom renderers (complex roles)
│   ├── MarkdownRenderer.tsx   # Markdown parsing & rendering
│   ├── CodeRenderer.tsx       # Syntax highlighting
│   ├── TimeRenderer.tsx       # Date/time formatting
│   ├── NumberRenderer.tsx     # Number formatting
│   ├── JsonRenderer.tsx       # JSON tree viewer
│   ├── BadgeRenderer.tsx      # Badge with icons/animations
│   └── KbdRenderer.tsx        # Keyboard shortcut display
├── role/                       # ⭐ Primitive role components (optional)
│   ├── Heading.tsx            # Heading with anchor generation
│   ├── Link.tsx               # Link with external indicator
│   └── ...
└── init-texts.ts              # ⭐ Default role registration
```

---

## 📐 구현 상세

### Step 1: Configuration Types

```tsx
// configs/types.ts
import type { ComponentType } from 'react';
import type { TextProps } from '../Text.types';

/**
 * Simple Role Configuration
 * HTML 태그 매핑만으로 충분한 role용 (Typography, Inline)
 */
export interface SimpleRoleConfig {
  type: 'simple';
  htmlTag: keyof React.JSX.IntrinsicElements;
  ariaRole?: string;
  baseStyles?: string;
  prominence?: {
    Hero?: string;      // prominence별 추가 스타일
    Strong?: string;
    Standard?: string;
    Subtle?: string;
  };
}

/**
 * Complex Role Configuration
 * Custom renderer가 필요한 role용 (Rich, Data, Indicator)
 */
export interface ComplexRoleConfig {
  type: 'complex';
  renderer: ComponentType<TextProps>;
  fallback?: SimpleRoleConfig;  // Renderer 실패 시 fallback
}

export type RoleConfig = SimpleRoleConfig | ComplexRoleConfig;
```

---

### Step 2: Simple Role Configurations

```tsx
// configs/simple/typography.ts
import type { SimpleRoleConfig } from '../types';

export const Title: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'h1',  // Default, prominence로 override 가능
  baseStyles: 'font-semibold tracking-tight text-text scroll-m-20',
  prominence: {
    Hero: 'text-4xl lg:text-5xl font-extrabold',  // h1
    Strong: 'text-3xl font-semibold',              // h2
    Standard: 'text-2xl font-semibold',            // h3
    Subtle: 'text-xl font-semibold',               // h4
  },
};

export const Heading: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'h2',  // spec.level로 h1-h6 결정
  baseStyles: 'font-semibold tracking-tight text-text',
  prominence: {
    Hero: 'text-3xl',
    Strong: 'text-2xl',
    Standard: 'text-xl',
    Subtle: 'text-lg',
  },
};

export const Body: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'p',
  baseStyles: 'leading-7 text-text',
  prominence: {
    Hero: 'text-xl text-text-muted',
    Strong: 'text-lg font-medium',
    Standard: 'text-base',
    Subtle: 'text-sm text-subtle',
  },
};

export const Label: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'label',
  baseStyles: 'text-sm font-medium leading-none text-text',
};

export const Caption: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'span',
  baseStyles: 'text-sm text-subtle',
};

// configs/simple/inline.ts
export const Strong: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'strong',
  baseStyles: 'font-semibold',
};

export const Emphasis: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'em',
  baseStyles: 'italic',
};

export const Mark: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'mark',
  baseStyles: 'bg-yellow-200 text-yellow-900 px-1 rounded',
};

export const Deletion: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'del',
  baseStyles: 'line-through text-muted',
};

export const Insertion: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'ins',
  baseStyles: 'underline text-green-600',
};

export const Subscript: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'sub',
  baseStyles: 'text-xs align-sub',
};

export const Superscript: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'sup',
  baseStyles: 'text-xs align-super',
};
```

---

### Step 3: Complex Role Configurations

```tsx
// configs/complex/rich.ts
import type { ComplexRoleConfig } from '../types';
import { MarkdownRenderer } from '../../renderers/MarkdownRenderer';
import { CodeRenderer } from '../../renderers/CodeRenderer';

export const Markdown: ComplexRoleConfig = {
  type: 'complex',
  renderer: MarkdownRenderer,
  fallback: {
    type: 'simple',
    htmlTag: 'div',
    baseStyles: 'prose prose-slate max-w-none',
  },
};

export const Code: ComplexRoleConfig = {
  type: 'complex',
  renderer: CodeRenderer,
  fallback: {
    type: 'simple',
    htmlTag: 'code',
    baseStyles: 'relative rounded bg-surface-sunken px-[0.3rem] py-[0.2rem] font-mono text-sm',
  },
};

// configs/complex/data.ts
export const Time: ComplexRoleConfig = {
  type: 'complex',
  renderer: TimeRenderer,
  fallback: {
    type: 'simple',
    htmlTag: 'time',
    baseStyles: 'text-subtle',
  },
};

export const Number: ComplexRoleConfig = {
  type: 'complex',
  renderer: NumberRenderer,
  fallback: {
    type: 'simple',
    htmlTag: 'span',
    baseStyles: 'font-mono tabular-nums',
  },
};

export const Json: ComplexRoleConfig = {
  type: 'complex',
  renderer: JsonRenderer,
  fallback: {
    type: 'simple',
    htmlTag: 'pre',
    baseStyles: 'font-mono text-sm bg-surface-sunken p-4 rounded overflow-auto',
  },
};

// configs/complex/indicator.ts
export const Badge: ComplexRoleConfig = {
  type: 'complex',
  renderer: BadgeRenderer,
  fallback: {
    type: 'simple',
    htmlTag: 'span',
    baseStyles: 'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
  },
};

export const Kbd: ComplexRoleConfig = {
  type: 'complex',
  renderer: KbdRenderer,
  fallback: {
    type: 'simple',
    htmlTag: 'kbd',
    baseStyles: 'px-2 py-1 text-xs font-semibold bg-surface-sunken border rounded shadow-sm',
  },
};
```

---

### Step 4: Registry

```tsx
// configs/registry.ts
import type { RoleConfig } from './types';

// Import all configs
import * as Typography from './simple/typography';
import * as Inline from './simple/inline';
import * as Rich from './complex/rich';
import * as Data from './complex/data';
import * as Indicator from './complex/indicator';

/**
 * Role Registry
 * Role → Config mapping
 */
export const ROLE_REGISTRY: Record<string, RoleConfig> = {
  // Typography
  Title: Typography.Title,
  Heading: Typography.Heading,
  Body: Typography.Body,
  Label: Typography.Label,
  Caption: Typography.Caption,

  // Inline
  Strong: Inline.Strong,
  Emphasis: Inline.Emphasis,
  Mark: Inline.Mark,
  Deletion: Inline.Deletion,
  Insertion: Inline.Insertion,
  Subscript: Inline.Subscript,
  Superscript: Inline.Superscript,

  // Rich
  Markdown: Rich.Markdown,
  Code: Rich.Code,

  // Data
  Time: Data.Time,
  Number: Data.Number,
  Json: Data.Json,

  // Navigation
  Link: {
    type: 'simple',
    htmlTag: 'a',
    ariaRole: 'link',
    baseStyles: 'text-accent hover:underline cursor-pointer',
  },

  // Indicator
  Badge: Indicator.Badge,
  Kbd: Indicator.Kbd,
};

/**
 * Get role configuration
 */
export function getRoleConfig(role: string): RoleConfig {
  return ROLE_REGISTRY[role] || {
    type: 'simple',
    htmlTag: 'span',
    baseStyles: '',
  };
}

/**
 * Check if role has custom renderer
 */
export function hasRenderer(role: string): boolean {
  const config = ROLE_REGISTRY[role];
  return config?.type === 'complex';
}
```

---

### Step 5: Main Text Component (Refactored)

```tsx
// Text.tsx
import { cva } from 'class-variance-authority';
import { useLayoutContext } from '@/components/context/IDDLContext';
import type { TextProps } from './Text.types';
import { getRoleConfig, hasRenderer } from './configs/registry';
import { cn } from '@/shared/lib/utils';

/**
 * Text Component (v2.0 - Registry-based)
 */
export function Text({ role, prominence, intent, ...props }: TextProps) {
  const ctx = useLayoutContext();

  const computedProminence = prominence ?? ctx.prominence ?? 'Standard';
  const computedIntent = intent ?? ctx.intent ?? 'Neutral';

  if (props.hidden) return null;

  // 1. Get role configuration
  const config = getRoleConfig(role);

  // 2. Complex role → Use custom renderer
  if (config.type === 'complex') {
    const Renderer = config.renderer;
    return <Renderer role={role} prominence={computedProminence} intent={computedIntent} {...props} />;
  }

  // 3. Simple role → Direct rendering
  const { htmlTag, baseStyles, prominence: prominenceStyles } = config;

  // Determine HTML tag (consider prominence for headings)
  let Element: any = htmlTag;
  if (role === 'Title') {
    if (computedProminence === 'Hero') Element = 'h1';
    else if (computedProminence === 'Strong') Element = 'h2';
    else if (computedProminence === 'Standard') Element = 'h3';
    else Element = 'h4';
  }
  if (role === 'Heading' && props.spec?.level) {
    Element = `h${props.spec.level}` as any;
  }

  // Get prominence-specific styles
  const prominenceClass = prominenceStyles?.[computedProminence as keyof typeof prominenceStyles] || '';

  // Intent-based styles (via CVA or direct mapping)
  const intentClasses = {
    Neutral: '',
    Brand: 'text-accent',
    Positive: 'text-green-600',
    Caution: 'text-yellow-600',
    Critical: 'text-red-600',
    Info: 'text-blue-600',
  };

  return (
    <Element
      className={cn(
        baseStyles,
        prominenceClass,
        intentClasses[computedIntent as keyof typeof intentClasses],
        props.className
      )}
      data-dsl-component="text"
      data-role={role}
      data-prominence={computedProminence}
      data-intent={computedIntent}
      {...props}
    >
      {props.children || props.content}
    </Element>
  );
}
```

---

### Step 6: Example Custom Renderer (Code)

```tsx
// renderers/CodeRenderer.tsx
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { TextProps } from '../Text.types';
import { cn } from '@/shared/lib/utils';

export function CodeRenderer({
  content,
  spec,
  className,
  children,
  ...props
}: TextProps) {
  const [copied, setCopied] = useState(false);

  const codeContent = children || content || '';
  const isInline = spec?.inline ?? false;
  const language = spec?.language || 'text';
  const showLineNumbers = spec?.lineNumbers ?? false;
  const copyable = spec?.copyable ?? false;
  const filename = spec?.filename;

  // Inline code
  if (isInline) {
    return (
      <code
        className={cn(
          'relative rounded bg-surface-sunken px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
          className
        )}
        {...props}
      >
        {codeContent}
      </code>
    );
  }

  // Code block with syntax highlighting
  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(codeContent));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {filename && (
        <div className="bg-surface-elevated px-4 py-2 text-sm font-mono text-subtle border-b border-border">
          {filename}
        </div>
      )}

      {copyable && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-2 py-1 text-xs bg-surface-elevated hover:bg-surface-raised rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}

      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
        }}
        {...props}
      >
        {String(codeContent)}
      </SyntaxHighlighter>
    </div>
  );
}
```

---

## 🎯 사용 예시

### Before (현재)
```tsx
// ❌ Limited to 5 roles
<Text role="Title" content="Hello" prominence="Hero" />
<Text role="Body" content="World" />
<Text role="Code" content="const x = 1;" />

// ❌ Markdown, Time, Number 등은 별도 컴포넌트 필요
<MarkdownText content="# Hello" />  // 별도 컴포넌트
<TimeText value={new Date()} />     // 별도 컴포넌트
```

### After (개선 후)
```tsx
// ✅ All 21 roles supported via single Text component
<Text role="Title" content="Hello" prominence="Hero" />
<Text role="Heading" content="Section" spec={{ level: 2 }} />
<Text role="Body" content="Paragraph" />
<Text role="Strong" content="Important" />
<Text role="Emphasis" content="Stressed" />
<Text role="Mark" content="Highlighted" />

// ✅ Rich content with custom renderers
<Text
  role="Markdown"
  content="# Hello\n\nThis is **bold** and *italic*."
  spec={{ flavor: 'gfm', syntaxHighlight: true }}
/>

<Text
  role="Code"
  content={`function greet() {\n  return "Hello";\n}`}
  spec={{
    language: 'javascript',
    lineNumbers: true,
    copyable: true,
    filename: 'greet.js',
  }}
/>

// ✅ Data formatting
<Text
  role="Time"
  spec={{
    value: new Date(),
    format: 'relative',
    live: true,
  }}
/>
<!-- Renders: "3 minutes ago" -->

<Text
  role="Number"
  spec={{
    value: 1234567.89,
    format: 'currency',
    currency: 'KRW',
    locale: 'ko-KR',
  }}
/>
<!-- Renders: "₩1,234,568" -->

// ✅ Interactive indicators
<Text role="Badge" content="New" intent="Positive" spec={{ pulse: true }} />
<Text role="Kbd" spec={{ keys: ['⌘', 'K'] }} />
```

---

## 📊 비교표

| Feature | Current (Switch-Case) | Proposed (Registry) |
|---------|----------------------|---------------------|
| **지원 Role 수** | 5개 | 21개 (전체 스펙 준수) |
| **확장성** | ❌ Switch 수정 필요 | ✅ Config 추가만으로 확장 |
| **유지보수** | ❌ 단일 파일에 모든 로직 | ✅ Role별 분리된 파일 |
| **테스트** | ❌ 전체 컴포넌트 테스트 | ✅ Config/Renderer 독립 테스트 |
| **Rich Content** | ❌ 지원 불가 | ✅ Custom renderer로 지원 |
| **타입 안정성** | ⚠️ Any 타입 다수 | ✅ 명확한 타입 정의 |
| **코드 라인** | ~170줄 (단일 파일) | ~50줄 (메인) + Config 파일들 |
| **OCP 준수** | ❌ 수정에 열림 | ✅ 확장에 열림, 수정에 닫힘 |

---

## 🚀 마이그레이션 전략

### Phase 1: Config System 구축 (Breaking Change 없음)
1. `configs/` 폴더 생성
2. Simple role configs 작성
3. Registry 구축
4. 기존 코드와 병행 운영

### Phase 2: Renderer 구현
1. Complex role renderers 작성 (Markdown, Code, Time, Number, Json)
2. 단위 테스트 작성
3. Storybook 예제 추가

### Phase 3: 메인 컴포넌트 리팩토링
1. Text.tsx를 registry 기반으로 전환
2. 기존 switch-case 제거
3. 테스트 통과 확인

### Phase 4: 레거시 제거
1. `role/` 폴더의 중복 컴포넌트 정리
2. 문서 업데이트

---

## 💡 추가 최적화 아이디어

### 1. Lazy Loading for Heavy Renderers
```tsx
// configs/complex/rich.ts
export const Markdown: ComplexRoleConfig = {
  type: 'complex',
  renderer: lazy(() => import('../../renderers/MarkdownRenderer')),
  fallback: { ... },
};
```

### 2. Plugin System
```tsx
// 사용자 정의 role 등록
registerTextRole('CustomRole', {
  type: 'complex',
  renderer: MyCustomRenderer,
});
```

### 3. Theme-aware Renderers
```tsx
// renderers/CodeRenderer.tsx
const theme = useTheme();
const syntaxTheme = theme === 'dark' ? vscDarkPlus : vsLight;
```

---

## ✅ 결론

### 권장 사항: **Hybrid Configuration + Renderer Pattern**

**이유:**
1. ✅ **Field 패턴과 일관성** - 프로젝트 전체 아키텍처 통일
2. ✅ **점진적 마이그레이션** - Breaking change 없이 단계적 도입 가능
3. ✅ **확장성 극대화** - 21개 role 완전 지원 + 무한 확장 가능
4. ✅ **테스트 용이성** - Config, Renderer 독립 테스트
5. ✅ **명세 준수** - text.spec.md 100% 구현 가능

**다음 단계:**
1. 승인되면 `configs/` 폴더 구조 생성
2. Simple role configs 먼저 구현 (빠른 성과)
3. Complex renderers 순차 구현 (Markdown → Code → Time → Number → Json)
4. Storybook 예제 및 문서화
