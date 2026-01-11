# Text Element 스펙

Text는 **정적 콘텐츠 표시를 위한 Element**로, 사용자 입력을 받지 않는 읽기 전용 텍스트를 렌더링합니다.

## 🎯 TextRole 타입

| Role | 용도 | HTML | ARIA | 예시 |
|------|------|------|------|------|
| **Title** | 제목, 헤딩 | `<h1>` ~ `<h6>` | - | 페이지 제목, 섹션 제목 |
| **Body** | 본문 텍스트 | `<p>` | - | 설명, 단락 |
| **Label** | 입력 필드 레이블 | `<label>` | - | 폼 레이블 |
| **Code** | 코드 블록 | `<code>` | - | 인라인 코드, 코드 스니펫 |
| **Badge** | 상태 뱃지 | `<span>` | `role="status"` | 알림 개수, 상태 표시 |
| **Alert** | 경고/알림 메시지 | `<div>` | `role="alert"` | 에러, 성공, 경고 메시지 |
| **Avatar** | 프로필 이미지/아이콘 | `<div>` | `role="img"` | 사용자 아바타 |
| **Kbd** | 키보드 단축키 | `<kbd>` | - | Cmd+S, Ctrl+C |

## 📋 Props API (예상)

```tsx
interface TextProps {
  // Core IDDL Props
  role: TextRole;
  prominence?: 'Hero' | 'Primary' | 'Secondary' | 'Tertiary';
  intent?: 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';
  density?: 'Comfortable' | 'Standard' | 'Compact';

  // Text-specific Props
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label' | 'code' | 'kbd';
  truncate?: boolean;
  ellipsis?: boolean;
  maxLines?: number;

  // Styling
  className?: string;
}
```

## 💡 사용 예시

```tsx
// Title
<Text role="Title" prominence="Primary" as="h1">
  Welcome to IDE UI Kit
</Text>

// Body
<Text role="Body" prominence="Secondary">
  This is a description text that explains the content.
</Text>

// Label
<Text role="Label" prominence="Primary">
  Email Address
</Text>

// Code
<Text role="Code">
  npm install @ide-ui-kit/core
</Text>

// Badge
<Text role="Badge" intent="Positive">
  3 new
</Text>

// Alert
<Text role="Alert" intent="Critical">
  Failed to save changes. Please try again.
</Text>

// Kbd
<Text role="Kbd">Cmd+S</Text>
```

## 🎨 Prominence × Intent 패턴

Text는 **prominence × intent** 조합으로 자동 스타일링됩니다:

| Prominence | Font Size | Font Weight | Opacity |
|-----------|-----------|-------------|---------|
| Hero | 48px | 600 | 100% |
| Primary | 16px | 500 | 100% |
| Secondary | 14px | 400 | 80% |
| Tertiary | 12px | 400 | 60% |

| Intent | Color | Use Case |
|--------|-------|----------|
| Neutral | text-text-primary | 기본 텍스트 |
| Brand | text-accent | 브랜드 강조 |
| Positive | text-green-600 | 성공 메시지 |
| Caution | text-yellow-600 | 경고 |
| Critical | text-red-600 | 에러 |
| Info | text-blue-600 | 정보 |

## 🚧 현재 상태

**구현 상태**:
- ✅ 코드 구현됨 (`src/components/types/Element/Text/`)
- ⚠️ 공식 스펙 문서 필요

**다음 작업**:
1. `text.spec.md` 작성 - 공식 스펙 정의
2. TextRole 별 상세 가이드 작성
3. Accessibility 가이드 추가

## 🔗 관련 문서

- [../../0-core/](../../0-core/) - IDDL 핵심 스펙
- [../field/](../field/) - Field Element 스펙
- [../action/](../action/) - Action Element 스펙

## 📍 구현 위치

- **Component**: `src/components/types/Element/Text/Text.tsx`
- **Roles**: `src/components/types/Element/Text/role/`

---

**최종 업데이트**: 2026-01-11
**IDDL 버전**: 1.0
**상태**: 🚧 스펙 문서 작성 필요
