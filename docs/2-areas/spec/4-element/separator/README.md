# Separator Element 스펙

Separator는 **시각적 구분선을 제공하는 Element**로, UI 영역을 논리적으로 분리하는 장식적 요소입니다.

## 🎯 SeparatorRole 타입

| Role | 방향 | 용도 | 예시 |
|------|------|------|------|
| **Horizontal** | 가로 | 섹션 구분, 리스트 아이템 구분 | 설정 그룹 구분, 메뉴 구분선 |
| **Vertical** | 세로 | 인라인 요소 구분, 툴바 구분 | 버튼 그룹 구분, 헤더 아이템 구분 |

## 📋 Props API (예상)

```tsx
interface SeparatorProps {
  // Core IDDL Props
  role?: 'Horizontal' | 'Vertical';
  prominence?: 'Primary' | 'Secondary' | 'Tertiary';
  density?: 'Comfortable' | 'Standard' | 'Compact';

  // Separator-specific Props
  spacing?: number;  // 상하/좌우 여백
  thickness?: number;  // 선 두께
  color?: string;  // 선 색상

  // Styling
  className?: string;
}
```

## 💡 사용 예시

### Horizontal Separator

```tsx
// 기본 가로 구분선
<Separator role="Horizontal" />

// 섹션 구분 (두꺼운 선)
<Separator
  role="Horizontal"
  prominence="Primary"
  thickness={2}
/>

// 리스트 아이템 구분 (얇은 선)
<Separator
  role="Horizontal"
  prominence="Tertiary"
  spacing={8}
/>

// 실제 사용 예시
<Block role="Form">
  <Field label="Name" dataType="text" />
  <Field label="Email" dataType="email" />

  <Separator role="Horizontal" />

  <Field label="Password" dataType="password" />
  <Field label="Confirm Password" dataType="password" />
</Block>
```

### Vertical Separator

```tsx
// 기본 세로 구분선
<Separator role="Vertical" />

// 툴바 버튼 그룹 구분
<Block role="Toolbar" layout="inline">
  <Action>Undo</Action>
  <Action>Redo</Action>

  <Separator role="Vertical" />

  <Action>Cut</Action>
  <Action>Copy</Action>
  <Action>Paste</Action>
</Block>

// 헤더 아이템 구분
<Block role="Header" layout="inline">
  <Text role="Title">IDE UI Kit</Text>

  <Separator role="Vertical" />

  <Text role="Body">v1.0.0</Text>
</Block>
```

## 🎨 Prominence 스타일링

| Prominence | Border Color | Opacity | Thickness |
|-----------|-------------|---------|-----------|
| Primary | border-border | 100% | 1px |
| Secondary | border-border | 60% | 1px |
| Tertiary | border-border | 30% | 1px |

## 🎨 Density 스타일링

| Density | Spacing (상하/좌우) |
|---------|-------------------|
| Comfortable | 16px |
| Standard | 12px |
| Compact | 8px |

## ♿ Accessibility

### ARIA Role
```tsx
<div role="separator" aria-orientation="horizontal" />
<div role="separator" aria-orientation="vertical" />
```

### 시맨틱 의미
- Separator는 **장식적 요소**로, 스크린 리더는 무시하거나 간단히 "구분선"으로 읽음
- 의미적으로 중요한 구분은 `<section>`, `<article>`, `<hr>` 사용 고려

## 🔧 구현 세부사항

### Horizontal (가로)

```tsx
// Tailwind 스타일 예시
className={cn(
  'w-full border-t border-border',
  prominence === 'Primary' && 'opacity-100',
  prominence === 'Secondary' && 'opacity-60',
  prominence === 'Tertiary' && 'opacity-30',
  density === 'Comfortable' && 'my-4',
  density === 'Standard' && 'my-3',
  density === 'Compact' && 'my-2'
)}
```

### Vertical (세로)

```tsx
// Tailwind 스타일 예시
className={cn(
  'h-full border-l border-border',
  prominence === 'Primary' && 'opacity-100',
  prominence === 'Secondary' && 'opacity-60',
  prominence === 'Tertiary' && 'opacity-30',
  density === 'Comfortable' && 'mx-4',
  density === 'Standard' && 'mx-3',
  density === 'Compact' && 'mx-2'
)}
```

## 🚧 현재 상태

**구현 상태**:
- ✅ Horizontal 구현됨
- ✅ Vertical 구현됨
- ⚠️ 공식 스펙 문서 필요

**다음 작업**:
1. `separator.spec.md` 작성 - 공식 스펙 정의
2. Prominence × Density variants 표준화
3. Custom color/thickness 지원 여부 검토

## 🔗 관련 문서

- [../../0-core/](../../0-core/) - IDDL 핵심 스펙
- [../text/](../text/) - Text Element 스펙
- [../action/](../action/) - Action Element 스펙

## 📍 구현 위치

- **Component**: `src/components/types/Element/Separator/Separator.tsx`

---

**최종 업데이트**: 2026-01-11
**IDDL 버전**: 1.0
**상태**: ✅ 구현 완료, ⚠️ 스펙 문서 필요
