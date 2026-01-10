# IDDL Missing Cases & Design System Gaps

이 문서는 실제 앱 개발 중 발견된 IDDL 스펙의 한계와 개선 필요사항을 기록합니다.

## Case 1: Color/Pattern Swatch Buttons (2025-01-09)

### 발견 위치
- 파일: `src/apps/showcase/widgets/components/Toolbar.tsx`
- 기능: Storybook-style Canvas 배경색 선택 버튼

### 문제 상황

배경색을 선택하는 버튼들이 필요:
1. **White Background** - 흰색 사각형 버튼
2. **Dark Background** - 검정색 사각형 버튼
3. **Transparent Background** - 체커보드 패턴 버튼 (CSS gradient)

```tsx
// 현재 구현 시도 (실패)
<Action
  prominence={background === 'transparent' ? 'Primary' : 'Secondary'}
  intent="Neutral"
  onClick={() => onBackgroundChange('transparent')}
  className="w-6 h-6 p-0 rounded border-2 border-border-default"
  style={{  // ❌ Action에 style prop 없음
    backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%, ...)',
    backgroundSize: '8px 8px',
    backgroundPosition: '0 0, 4px 4px',
  }}
  aria-label="Transparent background"
/>
```

### 근본 원인

**IDDL Action 컴포넌트의 한계:**
- `style` prop이 없음 (의도적 설계)
- IDDL 철학: "why"를 선언하면 시스템이 "how"를 처리
- 하지만 **동적 배경색/패턴**은 "why"로 표현 불가능

**이것은 Action인가?**
- ✅ 클릭 가능 (onClick)
- ✅ 사용자 상호작용 트리거
- ❌ 하지만 "시각적 샘플"을 보여주는 역할도 함
- ❌ 버튼의 시각적 모양 자체가 **데이터** (색상 값)

### 분석: 새로운 패턴 발견

이 버튼들은 **두 가지 역할**을 동시에 수행:
1. **Action** - 클릭 시 배경색 변경
2. **Preview** - 선택할 색상/패턴을 미리 보여줌

**기존 IDDL 분류:**
- Action (상호작용) - onClick만 처리
- Text (정적 콘텐츠) - 클릭 불가능
- Field (데이터 입력) - 폼 데이터 바인딩

**새로운 요구사항:**
- **Interactive Preview** - 클릭 가능 + 데이터를 시각적으로 표현

### 해결 방안 검토

#### 옵션 1: Action에 `style` prop 추가
```tsx
// Action.tsx
export interface ActionProps {
  // ...
  style?: React.CSSProperties;  // ❌ IDDL 철학 위반
}
```

**장점:**
- 간단하고 빠른 해결
- React 표준 패턴

**단점:**
- IDDL "why-based" 철학 위반
- "how"를 직접 지정하게 됨
- 스펙의 일관성 파괴

**판정:** ❌ 거부

---

#### 옵션 2: 새로운 Item role 추가 - `Swatch`
```tsx
// types.ts
export type ItemRole =
  | 'Action'
  | 'Field'
  | 'Text'
  | 'Swatch';  // ✅ NEW

// Item/Swatch/Swatch.tsx
export interface SwatchProps {
  prominence: Prominence;
  intent?: Intent;
  value: string | { type: 'pattern'; css: string };  // 색상 또는 패턴
  selected?: boolean;
  onClick: () => void;
  label: string;  // aria-label
}

// 사용
<Swatch
  prominence="Standard"
  value="#ffffff"
  selected={background === 'light'}
  onClick={() => onBackgroundChange('light')}
  label="White background"
/>

<Swatch
  prominence="Standard"
  value={{
    type: 'pattern',
    css: 'linear-gradient(45deg, #ccc 25%, transparent 25%, ...)'
  }}
  selected={background === 'transparent'}
  onClick={() => onBackgroundChange('transparent')}
  label="Transparent background"
/>
```

**장점:**
- IDDL 철학 유지 (why-based)
- `value` prop으로 "무엇을 보여줄지" 선언
- 시스템이 렌더링 처리
- 재사용 가능 (ColorPicker, ThemeSwitcher 등)

**단점:**
- 새로운 컴포넌트 구현 필요
- 스펙 확장 필요

**판정:** ✅ 추천

---

#### 옵션 3: Field `dataType="color"` 확장
```tsx
<Field
  dataType="color"
  control="swatch-group"
  model="canvasBackground"
  options={[
    { value: 'light', preview: '#ffffff' },
    { value: 'dark', preview: '#000000' },
    { value: 'transparent', preview: 'checkerboard' },
  ]}
/>
```

**장점:**
- 기존 Field 스펙 재사용
- 폼 데이터 바인딩 가능

**단점:**
- Toolbar의 단순 버튼에 Field는 과함
- 폼 컨텍스트가 아닌 곳에서도 필요

**판정:** ⚠️ 보류 (다른 케이스에서 고려)

---

### 최종 권장사항

**새로운 Item role 추가: `Swatch`**

#### 1. Type 정의
```tsx
// src/components/types/Item/types.ts
export type ItemRole =
  | 'Action'
  | 'Field'
  | 'Text'
  | 'Swatch';  // v1.3.0
```

#### 2. 컴포넌트 구현
```tsx
// src/components/types/Item/Swatch/Swatch.tsx
/**
 * Swatch - 선택 가능한 색상/패턴 샘플 (IDDL v1.3.0)
 *
 * 역할: 색상, 패턴, 테마를 시각적으로 미리 보여주는 클릭 가능한 샘플
 *
 * 사용 사례:
 * - ColorPicker의 색상 팔레트
 * - ThemeSwitcher의 테마 미리보기
 * - Canvas의 배경 선택
 * - Syntax highlighter 스킴 선택
 */

export type SwatchValue =
  | string  // CSS color: '#ffffff', 'rgb(0,0,0)', 'var(--accent-default)'
  | { type: 'pattern'; css: string };  // CSS pattern

export interface SwatchProps {
  role?: 'Swatch';
  prominence: Prominence;
  intent?: Intent;
  value: SwatchValue;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;  // Required for accessibility
  size?: 'sm' | 'md' | 'lg';  // 16px, 24px, 32px
  className?: string;
}

export function Swatch({
  prominence = 'Secondary',
  intent = 'Neutral',
  value,
  selected = false,
  disabled = false,
  onClick,
  label,
  size = 'md',
  className,
}: SwatchProps) {
  const swatchVariants = cva('rounded border-2 transition-all cursor-pointer', {
    variants: {
      size: {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
      },
      prominence: {
        Standard: 'border-accent-default',
        Strong: 'border-border-default hover:border-border-muted',
        Subtle: 'border-border-muted hover:border-border-default',
      },
      selected: {
        true: 'ring-2 ring-accent-default ring-offset-2',
        false: '',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
  });

  const style: React.CSSProperties = typeof value === 'string'
    ? { backgroundColor: value }
    : { backgroundImage: value.css, backgroundSize: '8px 8px', backgroundPosition: '0 0, 4px 4px' };

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(swatchVariants({ size, prominence, selected, disabled }), className)}
      style={style}
      aria-label={label}
      aria-pressed={selected}
      data-dsl-component="swatch"
      data-prominence={prominence}
      data-intent={intent}
      data-selected={selected}
    />
  );
}
```

#### 3. 사용 예시
```tsx
// Toolbar.tsx
import { Swatch } from '@/components/types/Item/Swatch/Swatch';

<Group role="Toolbar" layout="inline" density="Compact">
  <Swatch
    prominence={background === 'light' ? 'Primary' : 'Secondary'}
    value="#ffffff"
    selected={background === 'light'}
    onClick={() => onBackgroundChange('light')}
    label="White background"
    size="md"
  />
  <Swatch
    prominence={background === 'dark' ? 'Primary' : 'Secondary'}
    value="#1a1a1a"
    selected={background === 'dark'}
    onClick={() => onBackgroundChange('dark')}
    label="Dark background"
    size="md"
  />
  <Swatch
    prominence={background === 'transparent' ? 'Primary' : 'Secondary'}
    value={{
      type: 'pattern',
      css: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)',
    }}
    selected={background === 'transparent'}
    onClick={() => onBackgroundChange('transparent')}
    label="Transparent background"
    size="md"
  />
</Group>
```

#### 4. 명세 업데이트

**docs/1-project/1-type-role-aria-mapping-1.md 업데이트:**

```markdown
### 0. Item

Item은 UI 프리미티브(Action, Field, Text, Swatch)를 그룹화하는 타입입니다.

**Item 하위 타입**:
- **Action**: 사용자 상호작용 트리거 (버튼, 링크 등)
- **Field**: 데이터 입력 및 수정 (input, select 등)
- **Text**: 정적 콘텐츠 표시 (텍스트, 라벨 등)
- **Swatch**: 선택 가능한 색상/패턴 샘플 (v1.3.0)

---

### 1.5 Swatch (v1.3.0)

| Role | FE Component | HTML Tag | ARIA Role | 필수 속성 / 비고 |
|---|---|---|---|---|
| `ColorSwatch` | Swatch | `<button>` | `button` | `aria-label`, `aria-pressed` (선택 시) |
| `PatternSwatch` | Swatch | `<button>` | `button` | `aria-label`, `aria-pressed`, CSS pattern |
```

---

### 다른 활용 사례

**1. ColorPicker 팔레트**
```tsx
<Group role="Grid" layout="grid">
  {colors.map(color => (
    <Swatch
      key={color}
      value={color}
      selected={selectedColor === color}
      onClick={() => setSelectedColor(color)}
      label={color}
    />
  ))}
</Group>
```

**2. Theme Switcher**
```tsx
<Group role="Inline" layout="inline">
  <Swatch
    value="var(--theme-emerald-accent)"
    selected={theme === 'emerald'}
    onClick={() => setTheme('emerald')}
    label="Emerald theme"
  />
  <Swatch
    value="var(--theme-blue-accent)"
    selected={theme === 'blue'}
    onClick={() => setTheme('blue')}
    label="Blue theme"
  />
</Group>
```

---

## 배운 교훈

### IDDL 설계 원칙 재확인

1. **"Why-based" 철학 유지**
   - `style` prop 같은 "how" 노출 금지
   - 대신 `value` 같은 "what" prop 제공

2. **역할 기반 분류**
   - "클릭 가능 + 시각적 데이터 표현" = 새로운 역할
   - Action과 구분되는 명확한 use case

3. **스펙 확장 기준**
   - 기존 컴포넌트로 표현 불가능한가?
   - 재사용 가능한 패턴인가?
   - 다른 앱에서도 필요한가?

4. **예외보다 확장**
   - "특수한 경우"를 만들지 말고
   - 스펙을 확장하여 정식 지원

---

## Action Items

- [ ] `Swatch` 컴포넌트 구현
- [ ] `ItemRole` 타입에 'Swatch' 추가
- [ ] 명세 문서 업데이트 (v1.3.0)
- [ ] Toolbar.tsx에서 Swatch 사용
- [ ] ColorPicker 예제 추가 (showcase)
- [ ] ThemeSwitcher 예제 추가 (showcase)

---

## 버전 히스토리

- **v1.3.0** (2025-01-09): Swatch role 추가
- **v1.2.0** (2025-01-09): Section Toolbar role 추가
- **v1.1.0**: IDE/Studio layout roles 추가
- **v1.0.1**: Aside role 추가, condition 지원
