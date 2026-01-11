# Separator Specification

Separator는 시각적 구분을 제공하는 Element입니다. 직접적인 수치(두께, 여백)를 prop으로 받지 않고, `prominence`와 `density` 조합을 통해 Renderer가 적절한 스타일을 자동 결정합니다.

## SeparatorRole

- `Horizontal`: 가로 구분선 (기본값)
- `Vertical`: 세로 구분선

## Props

```typescript
interface SeparatorProps extends BaseProps {
  role?: 'Horizontal' | 'Vertical';
  content?: string; // 구분선 사이에 들어갈 텍스트 (옵션)
}
```

## 규칙 (Rules)

1. **표현 속성 배제**: `thickness`, `spacing`, `color` 등을 직접 지정하지 않습니다.
2. **Density 기반 여백**: `density` 수준에 따라 상하/좌우 여백이 자동 결정됩니다.
3. **Prominence 기반 스타일**: `prominence` (Hero, Standard, Subtle)에 따라 선의 두께나 불투명도가 결정됩니다.
4. **Accessibility**: Renderer는 `role="separator"`와 적절한 `aria-orientation`을 제공해야 합니다.
