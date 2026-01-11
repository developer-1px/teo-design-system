# Text Component v2.0 - 사용 예시

## 🎯 구현 완료 Role (11개)

가장 많이 사용되는 role부터 우선 구현했습니다:

### Typography (5개) - 모든 화면 필수
- ✅ Title
- ✅ Heading
- ✅ Body
- ✅ Label
- ✅ Caption

### Inline (5개) - 자주 사용
- ✅ Strong
- ✅ Emphasis
- ✅ Mark
- ✅ Link
- ✅ Code

### Indicator (1개) - 매우 자주 사용
- ✅ Badge

---

## 📝 사용 예시

### 1. Typography Roles

#### Title - 페이지/섹션 제목
```tsx
import { Text } from '@/components/types/Element/Text/Text.v2';

// Hero title (h1)
<Text role="Title" content="Welcome to IDDL" prominence="Hero" />
// → <h1 class="text-4xl lg:text-5xl font-extrabold tracking-tight text-text">Welcome to IDDL</h1>

// Section title (h2)
<Text role="Title" content="Features" prominence="Strong" />
// → <h2 class="text-3xl font-semibold tracking-tight text-text">Features</h2>

// Subsection title (h3)
<Text role="Title" content="Getting Started" prominence="Standard" />
// → <h3 class="text-2xl font-semibold tracking-tight text-text">Getting Started</h3>

// Small section (h4)
<Text role="Title" content="Details" prominence="Subtle" />
// → <h4 class="text-xl font-semibold tracking-tight text-text">Details</h4>
```

#### Heading - 섹션 헤딩 (level 지정 가능)
```tsx
// Default h2
<Text role="Heading" content="Overview" />

// Custom level
<Text role="Heading" content="API Reference" spec={{ level: 3 }} />
// → <h3>API Reference</h3>

// With prominence
<Text role="Heading" content="Important Section" prominence="Hero" />
// → <h2 class="text-3xl ...">Important Section</h2>
```

#### Body - 본문 텍스트
```tsx
// Standard paragraph
<Text role="Body" content="This is a paragraph of text." />
// → <p class="leading-7 text-base text-text">This is a paragraph of text.</p>

// Lead text (larger)
<Text
  role="Body"
  content="This is an introduction paragraph."
  prominence="Hero"
/>
// → <p class="text-xl text-text-muted">...</p>

// Small text
<Text
  role="Body"
  content="Additional details here."
  prominence="Subtle"
/>
// → <p class="text-sm text-subtle">...</p>
```

#### Label - 폼 라벨
```tsx
// Form label
<Text role="Label" content="Email Address" spec={{ for: "email" }} />
// → <label for="email" class="text-sm font-medium text-text">Email Address</label>

// Required field
<Text role="Label" content="Password" spec={{ for: "password", required: true }} />

// Strong label
<Text role="Label" content="Important Field" prominence="Strong" />
```

#### Caption - 보조 텍스트
```tsx
// Helper text
<Text role="Caption" content="This field is optional" />
// → <span class="text-sm text-subtle">This field is optional</span>

// Image caption
<Text role="Caption" content="Figure 1: Architecture diagram" />
```

---

### 2. Inline Semantic Roles

#### Strong - 중요한 텍스트
```tsx
<Text role="Body">
  This is <Text role="Strong" content="important" /> text.
</Text>
// → This is <strong class="font-semibold">important</strong> text.
```

#### Emphasis - 강세 텍스트
```tsx
<Text role="Body">
  This is <Text role="Emphasis" content="emphasized" /> text.
</Text>
// → This is <em class="italic">emphasized</em> text.
```

#### Mark - 하이라이트
```tsx
<Text role="Body">
  Search results for <Text role="Mark" content="React" />.
</Text>
// → Search results for <mark class="bg-yellow-200 text-yellow-900 px-1 rounded">React</mark>.
```

#### Link - 링크
```tsx
// Basic link
<Text
  role="Link"
  content="Documentation"
  spec={{ href: "/docs" }}
/>
// → <a href="/docs" class="text-accent hover:underline cursor-pointer">Documentation</a>

// External link
<Text
  role="Link"
  content="GitHub"
  spec={{
    href: "https://github.com/example",
    target: "_blank",
    external: true,
  }}
/>
// → <a href="..." target="_blank" rel="noopener noreferrer">GitHub</a>

// Download link
<Text
  role="Link"
  content="Download PDF"
  spec={{
    href: "/report.pdf",
    download: "report.pdf",
  }}
/>
```

#### Code - 인라인 코드
```tsx
<Text role="Body">
  Use the <Text role="Code" content="useState" /> hook for state management.
</Text>
// → Use the <code class="bg-surface-sunken px-[0.3rem] py-[0.2rem] font-mono text-sm">useState</code> hook.
```

---

### 3. Badge - 상태 표시 (Complex Renderer)

#### Basic Badge
```tsx
// Default badge (accent color)
<Text role="Badge" content="New" />
// → <span class="bg-accent/10 text-accent border border-accent/20 px-2.5 py-1 text-xs">New</span>

// Success badge (green)
<Text role="Badge" content="Active" intent="Positive" />
// → <span class="bg-green-500/10 text-green-600 ...">Active</span>

// Warning badge (yellow)
<Text role="Badge" content="Pending" intent="Caution" />

// Error badge (red)
<Text role="Badge" content="Failed" intent="Critical" />

// Info badge (blue)
<Text role="Badge" content="Beta" intent="Info" />
```

#### Badge with Options (spec)
```tsx
// Pulse animation
<Text role="Badge" content="Live" intent="Positive" spec={{ pulse: true }} />

// Dot indicator only
<Text role="Badge" intent="Positive" spec={{ dot: true }} />
// → <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>

// Small size (via prominence)
<Text role="Badge" content="v2.0" prominence="Subtle" />
```

#### Badge as Notification Count
```tsx
<Text role="Badge" content="3" intent="Critical" spec={{ pulse: true }} />
```

---

### 4. Intent-based Styling

모든 role에서 intent prop 사용 가능:

```tsx
// Brand color
<Text role="Body" content="Brand message" intent="Brand" />
// → <p class="text-accent">Brand message</p>

// Success (green)
<Text role="Body" content="Operation successful" intent="Positive" />
// → <p class="text-green-600">Operation successful</p>

// Warning (yellow)
<Text role="Body" content="Please review" intent="Caution" />
// → <p class="text-yellow-600">Please review</p>

// Error (red)
<Text role="Body" content="Error occurred" intent="Critical" />
// → <p class="text-red-600">Error occurred</p>

// Info (blue)
<Text role="Body" content="Additional information" intent="Info" />
// → <p class="text-blue-600">Additional information</p>
```

---

### 5. Text Alignment

```tsx
<Text role="Body" content="Left aligned" align="left" />
<Text role="Body" content="Center aligned" align="center" />
<Text role="Body" content="Right aligned" align="right" />
<Text role="Body" content="Justified text" align="justify" />
```

---

### 6. Highlight Feature

```tsx
// Highlight specific terms
<Text
  role="Body"
  content="The quick brown fox jumps over the lazy dog."
  highlight="fox"
/>
// → "fox" will be highlighted with <mark class="bg-accent/20 text-accent">
```

---

### 7. Real-world Examples

#### Article Header
```tsx
<div>
  <Text role="Title" content="Introduction to IDDL" prominence="Hero" />
  <Text
    role="Body"
    content="Learn how to build declarative UIs with intent-driven design."
    prominence="Hero"
  />
  <Text role="Caption" content="Published on January 11, 2026" />
</div>
```

#### Form Field
```tsx
<div>
  <Text role="Label" content="Email Address" spec={{ for: "email", required: true }} />
  <input id="email" type="email" />
  <Text role="Caption" content="We'll never share your email." />
</div>
```

#### Status Indicators
```tsx
<div className="flex items-center gap-2">
  <Text role="Body" content="Server Status:" />
  <Text role="Badge" content="Online" intent="Positive" spec={{ pulse: true }} />
</div>

<div className="flex items-center gap-2">
  <Text role="Body" content="Build Status:" />
  <Text role="Badge" content="Failed" intent="Critical" />
</div>
```

#### Documentation Link
```tsx
<Text role="Body">
  See the{' '}
  <Text
    role="Link"
    content="API documentation"
    spec={{ href: "/docs/api", target: "_blank", external: true }}
  />{' '}
  for more details.
</Text>
```

#### Code Snippet in Text
```tsx
<Text role="Body">
  Use the <Text role="Code" content="<Text>" /> component for all text content.
</Text>
```

---

## 🚀 마이그레이션 가이드

### Before (v1.0)
```tsx
import { Text } from '@/components/types/Element/Text/Text';

<Text role="Title" content="Hello" prominence="Hero" />
<Text role="Body" content="World" />

// Badge는 별도 컴포넌트
import { Badge } from '@/components/types/Element/Text/role/Badge';
<Badge variant="success">Active</Badge>
```

### After (v2.0)
```tsx
import { Text } from '@/components/types/Element/Text/Text.v2';

// 동일한 API
<Text role="Title" content="Hello" prominence="Hero" />
<Text role="Body" content="World" />

// Badge도 Text로 통합
<Text role="Badge" content="Active" intent="Positive" />
```

---

### 8. Time - 시간 표시 (NEW - Complex Renderer)

#### Relative Time Display (상대 시간)
```tsx
// 상대 시간 ("3 minutes ago")
<Text
  role="Time"
  spec={{
    value: new Date(Date.now() - 1000 * 60 * 15),
    format: 'relative',
  }}
/>
// → "15 minutes ago"

// 실시간 업데이트 (live)
<Text
  role="Time"
  spec={{
    value: new Date(Date.now() - 1000 * 60 * 60),
    format: 'relative',
    live: true, // 매 분마다 자동 업데이트
  }}
/>
// → "1 hour ago" (자동 업데이트됨)
```

#### Absolute Time Formats (절대 시간)
```tsx
// Date only
<Text
  role="Time"
  spec={{
    value: new Date(),
    format: 'date',
  }}
/>
// → "January 11, 2026"

// Time only
<Text
  role="Time"
  spec={{
    value: new Date(),
    format: 'time',
  }}
/>
// → "14:30:00"

// DateTime
<Text
  role="Time"
  spec={{
    value: new Date(),
    format: 'datetime',
  }}
/>
// → "January 11, 2026 at 14:30"

// Short format
<Text
  role="Time"
  spec={{
    value: new Date(),
    format: 'short',
  }}
/>
// → "Jan 11, 2026"

// ISO format
<Text
  role="Time"
  spec={{
    value: new Date(),
    format: 'iso',
  }}
/>
// → "2026-01-11T14:30:00.000Z"
```

#### Time Value Types
```tsx
// Date object
<Text role="Time" spec={{ value: new Date(), format: 'relative' }} />

// ISO string
<Text role="Time" spec={{ value: '2026-01-11T14:30:00Z', format: 'date' }} />

// Timestamp (number)
<Text role="Time" spec={{ value: 1673456789000, format: 'relative' }} />
```

#### Real-world Examples
```tsx
// Comment timestamp
<div className="flex items-center gap-2">
  <Text role="Body" content="John Doe" prominence="Strong" />
  <Text
    role="Time"
    spec={{
      value: comment.createdAt,
      format: 'relative',
      live: true,
    }}
    prominence="Subtle"
  />
</div>

// Published date
<div>
  <Text role="Caption" content="Published:" />
  <Text
    role="Time"
    spec={{
      value: article.publishedAt,
      format: 'date',
    }}
  />
</div>

// Last updated (with live updates)
<div>
  <Text role="Caption" content="Last updated:" />
  <Text
    role="Time"
    spec={{
      value: document.updatedAt,
      format: 'relative',
      live: true,
    }}
  />
</div>

// Activity feed
<div className="space-y-2">
  {activities.map(activity => (
    <div key={activity.id}>
      <Text role="Body" content={activity.message} />
      <Text
        role="Time"
        spec={{
          value: activity.timestamp,
          format: 'relative',
          live: true,
        }}
        prominence="Subtle"
      />
    </div>
  ))}
</div>
```

---

## 📊 현재 지원 현황

| Category | Role | Status | Renderer |
|----------|------|--------|----------|
| Typography | Title | ✅ | Simple |
| Typography | Heading | ✅ | Simple |
| Typography | Body | ✅ | Simple |
| Typography | Label | ✅ | Simple |
| Typography | Caption | ✅ | Simple |
| Inline | Strong | ✅ | Simple |
| Inline | Emphasis | ✅ | Simple |
| Inline | Mark | ✅ | Simple |
| Inline | Code | ✅ | Simple |
| Navigation | Link | ✅ | Simple |
| Indicator | Badge | ✅ | **Complex** |
| Data | Time | ✅ | **Complex** |
| Rich | Markdown | ⏳ 다음 단계 | Complex |
| Rich | CodeBlock | ⏳ 다음 단계 | Complex |
| Data | Number | ⏳ 다음 단계 | Complex |
| Data | Json | ⏳ 다음 단계 | Complex |

---

## 🎯 다음 구현 추천 순서

1. **Time** (상대 시간 표시 - "3 minutes ago")
2. **CodeBlock** (Syntax highlighting)
3. **Number** (통화, 퍼센트 포맷팅)
4. **Markdown** (마크다운 파싱)
5. **Json** (JSON 트리 뷰어)

각 role은 독립적으로 구현 가능하며, 기존 코드에 영향을 주지 않습니다!
