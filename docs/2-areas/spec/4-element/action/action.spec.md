# Action Specification

Action은 사용자의 인터랙션(클릭, 키보드)을 트리거하는 Element입니다.

## Action Roles

- `Button`: 일반 버튼
- `IconButton`: 아이콘 버튼
- `Link`: 하이퍼링크 스타일
- `MenuItem`: 메뉴 내 항목
- `Tab`: 탭 버튼

## Props

```typescript
interface ActionProps extends BaseProps {
  label: string;
  icon?: string;
  behavior?: ActionBehavior;
  disabled?: boolean;
}

type ActionBehavior =
  | { type: 'submit' }
  | { type: 'navigate'; to: string; target?: string }
  | { type: 'command'; id: string; params?: any }
  | { type: 'open'; target: string };
```

## 규칙 (Rules)

1. Action은 자식을 가질 수 없으며, 모든 구성 요소(라벨, 아이콘)는 props로 전달됩니다.
2. `behavior`는 행동의 종류만 정의하며, 실제 실행 로직은 시스템 레이어에서 처리합니다.
3. `prominence` (Hero, Standard, Subtle)를 통해 버튼의 시각적 위계를 결정합니다.
