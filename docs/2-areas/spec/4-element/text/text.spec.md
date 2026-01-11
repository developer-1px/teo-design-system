# Text Specification

Text는 정적 콘텐츠를 표시하는 Element입니다.

## TextRole

- `Title`: 최상위 제목 (h1 수준)
- `Heading`: 섹션 제목 (h2-h6 수준)
- `Body`: 본문 텍스트
- `Label`: 필드 라벨 또는 식별자
- `Caption`: 보조 설명 또는 캡션

## Props

```typescript
interface TextProps extends BaseProps {
  role: TextRole;
  content?: string;
  icon?: string;
}
```

## 규칙 (Rules)

1. Text는 자식을 가질 수 없습니다. (단, Markdown 등의 특수한 Role은 렌더링 시 내부 구조를 가질 수 있습니다.)
2. `align` 속성은 직접 prop으로 받지 않고, `role`과 `intent`에 따라 Renderer가 자동 결정하는 것을 지향합니다.
3. 시각적 스타일(Font size, weight, line-height)은 `prominence`와 `role`의 조합으로 결정됩니다.