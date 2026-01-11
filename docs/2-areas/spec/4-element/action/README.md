# Action Element 스펙

Action은 **사용자 인터랙션을 트리거하는 Element**로, 클릭, 제출, 탐색 등의 행동을 유발합니다.

## 🎯 ActionRole 타입

| Role | 용도 | HTML | ARIA | 예시 |
|------|------|------|------|------|
| **Button** | 일반 버튼 | `<button>` | `role="button"` | Save, Cancel, Submit |
| **IconButton** | 아이콘 버튼 | `<button>` | `role="button"` + `aria-label` | Close, Menu, Settings |
| **Link** | 탐색 링크 | `<a>` | - | 페이지 이동, 외부 링크 |
| **MenuItem** | 메뉴 아이템 | `<button>` | `role="menuitem"` | 컨텍스트 메뉴, 드롭다운 |

## 📋 Props API (예상)

```tsx
interface ActionProps {
  // Core IDDL Props
  role?: ActionRole;
  prominence?: 'Hero' | 'Primary' | 'Secondary' | 'Tertiary';
  intent?: 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';
  density?: 'Comfortable' | 'Standard' | 'Compact';

  // Action-specific Props
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';  // for Button role
  href?: string;  // for Link role
  target?: '_blank' | '_self';  // for Link role

  // Icon (for IconButton)
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';

  // Keyboard Accessibility
  shortcut?: string;  // e.g., "Cmd+S"

  // Styling
  className?: string;
}
```

## 💡 사용 예시

### Button

```tsx
// Primary action
<Action prominence="Primary" intent="Positive" onClick={handleSave}>
  Save Changes
</Action>

// Secondary action
<Action prominence="Secondary" onClick={handleCancel}>
  Cancel
</Action>

// Dangerous action
<Action prominence="Primary" intent="Critical" onClick={handleDelete}>
  Delete
</Action>

// With loading state
<Action prominence="Primary" loading={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save'}
</Action>

// With keyboard shortcut
<Action prominence="Primary" shortcut="Cmd+S" onClick={handleSave}>
  Save
</Action>
```

### IconButton

```tsx
// Icon only button
<Action
  role="IconButton"
  prominence="Secondary"
  icon={<Settings size={20} />}
  aria-label="Open Settings"
  onClick={openSettings}
/>

// With tooltip
<Action
  role="IconButton"
  prominence="Secondary"
  icon={<Search size={20} />}
  aria-label="Search"
  title="Search (Cmd+K)"
  onClick={openSearch}
/>
```

### Link

```tsx
// Internal navigation
<Action role="Link" href="/docs">
  Documentation
</Action>

// External link
<Action role="Link" href="https://example.com" target="_blank">
  Learn More
</Action>
```

### MenuItem

```tsx
<Action role="MenuItem" onClick={handleCopy}>
  Copy
</Action>

<Action role="MenuItem" onClick={handlePaste}>
  Paste
</Action>

<Action role="MenuItem" intent="Critical" onClick={handleDelete}>
  Delete
</Action>
```

## 🎨 Prominence × Intent 패턴

Action은 **prominence × intent** 조합으로 자동 스타일링됩니다:

### Prominence

| Prominence | Background | Border | Padding | Font Weight |
|-----------|-----------|--------|---------|-------------|
| Hero | Filled | None | px-8 py-4 | 600 |
| Primary | Filled | None | px-6 py-3 | 500 |
| Secondary | Transparent | 1px | px-4 py-2 | 400 |
| Tertiary | Transparent | None | px-2 py-1 | 400 |

### Intent

| Intent | Background Color | Text Color | Hover |
|--------|-----------------|------------|-------|
| Neutral | bg-gray-100 | text-gray-900 | bg-gray-200 |
| Brand | bg-accent | text-white | bg-accent-dark |
| Positive | bg-green-500 | text-white | bg-green-600 |
| Caution | bg-yellow-500 | text-white | bg-yellow-600 |
| Critical | bg-red-500 | text-white | bg-red-600 |
| Info | bg-blue-500 | text-white | bg-blue-600 |

## ♿ Accessibility

### 키보드 탐색
- **Enter/Space**: 버튼 활성화
- **Tab**: 다음 버튼으로 이동
- **Shift+Tab**: 이전 버튼으로 이동

### ARIA 속성
- `aria-label`: IconButton 필수 (텍스트 없을 때)
- `aria-disabled`: 비활성화 상태
- `aria-pressed`: 토글 버튼 상태
- `role="button"`: 비-버튼 요소를 버튼처럼 사용할 때

### Focus 표시
- 모든 Action은 `focus-visible:ring-2` 스타일 필수
- 키보드 사용자를 위한 명확한 포커스 표시

## 🚧 현재 상태

**구현 상태**:
- ✅ Button 구현됨
- ✅ IconButton 구현됨
- ⚠️ Link 구현 필요
- ⚠️ MenuItem 구현 필요
- ⚠️ 공식 스펙 문서 필요

**다음 작업**:
1. `action.spec.md` 작성 - 공식 스펙 정의
2. Link, MenuItem renderer 구현
3. Keyboard shortcut 시스템 통합
4. Loading state 스타일링 표준화

## 🔗 관련 문서

- [../../0-core/](../../0-core/) - IDDL 핵심 스펙
- [../text/](../text/) - Text Element 스펙
- [../field/](../field/) - Field Element 스펙

## 📍 구현 위치

- **Component**: `src/components/types/Element/Action/Action.tsx`
- **Renderers**: `src/components/types/Element/Action/renderers/`
- **Roles**: `src/components/types/Element/Action/role/`

---

**최종 업데이트**: 2026-01-11
**IDDL 버전**: 1.0
**상태**: 🚧 Button/IconButton 완료, Link/MenuItem 필요
