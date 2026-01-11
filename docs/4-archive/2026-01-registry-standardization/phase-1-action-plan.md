# Phase 1 완료 실행 계획서 (Action Plan)

**작성일**: 2026-01-11
**목표**: Phase 1 완료 (선언적 UI 렌더링 100%)
**기간**: 4주 (2026-01-11 ~ 2026-02-07)

---

## 📋 Week 1: 핵심 갭 해소 (Jan 11-17)

### Task 1.1: Field dataType 완전 구현 ⭐

**목표**: 21개 dataType 전체 커버
**예상 시간**: 2-3일

#### Step 1: 현재 구현 확인
```bash
# Field.tsx에서 dataType 분기 확인
cat src/components/types/Element/Field/Field.tsx | grep "dataType"

# 각 Renderer가 커버하는 dataType 확인
ls -la src/components/types/Element/Field/renderers/
```

**확인 항목**:
- [ ] TextField가 text, email, password, url, tel, search 모두 커버?
- [ ] NumberField가 number, currency, percentage 모두 커버?
- [ ] DateField가 date, time, datetime, month, week 모두 커버?

#### Step 2: 미구현 dataType 구현

**파일 생성 필요**:

1. **DateRangeField.tsx** (daterange)
```typescript
// src/components/types/Element/Field/renderers/DateRangeField.tsx
import { useDateRangeField } from '../headless/useDateRangeField';

export function DateRangeField(props: FieldProps) {
  const field = useDateRangeField(props);
  // startDate, endDate 두 개의 DatePicker 렌더링
}
```

2. **MultiSelectField.tsx** (multiselect)
```typescript
// src/components/types/Element/Field/renderers/MultiSelectField.tsx
import { useMultiSelectField } from '../headless/useMultiSelectField';

export function MultiSelectField(props: FieldProps) {
  const field = useMultiSelectField(props);
  // Checkbox group 또는 Multi-select dropdown 렌더링
}
```

3. **RichTextField.tsx** (richtext)
```typescript
// src/components/types/Element/Field/renderers/RichTextField.tsx
import { useRichTextField } from '../headless/useRichTextField';

export function RichTextField(props: FieldProps) {
  const field = useRichTextField(props);
  // TipTap 또는 Slate 기반 리치 에디터 렌더링
}
```

**Headless Hook 생성**:
```typescript
// src/components/types/Element/Field/headless/useDateRangeField.ts
export function useDateRangeField(props) {
  const [startDate, setStartDate] = useState(props.value?.start);
  const [endDate, setEndDate] = useState(props.value?.end);
  // ... 로직
}
```

#### Step 3: Field.tsx에 dataType 분기 추가

```typescript
// src/components/types/Element/Field/Field.tsx
export function Field({ dataType, ...props }: FieldProps) {
  // 기존 분기...

  if (dataType === 'daterange') {
    return <DateRangeField {...props} />;
  }
  if (dataType === 'multiselect') {
    return <MultiSelectField {...props} />;
  }
  if (dataType === 'richtext') {
    return <RichTextField {...props} />;
  }

  // ...
}
```

**검증**:
- [ ] 21개 dataType 모두 Field.tsx에서 분기
- [ ] 각 dataType별 예시 페이지 작성
- [ ] field.spec.md와 일치 여부 확인

---

### Task 1.2: block.spec.md 작성

**목표**: Block 컴포넌트 공식 스펙 작성
**예상 시간**: 1일

**파일 경로**: `docs/2-areas/spec/3-block/block.spec.md`

**스펙 구조**:
```markdown
# Block (Group) Specification

## 1. 개요
Block은 논리적으로 관련된 Element들을 그룹핑하는 컴포넌트

## 2. BlockRole 카탈로그 (MECE)

### 2.1 Container Roles
- Form - 폼 입력 그룹
- Card - 카드 형태 콘텐츠
- Panel - 패널 컨테이너

### 2.2 Layout Roles
- List - 리스트 아이템 컨테이너
- Grid - 그리드 레이아웃
- Stack - 수직/수평 스택

### 2.3 Navigation Roles
- Tabs - 탭 컨테이너
- Accordion - 아코디언
- Menu - 메뉴 컨테이너

### 2.4 Control Roles
- Toolbar - 도구 모음
- ButtonGroup - 버튼 그룹
- Dropdown - 드롭다운

### 2.5 Data Display Roles
- DataTable - 데이터 테이블
- Tree - 트리 구조

### 2.6 Feedback Roles
- Progress - 진행 표시
- Skeleton - 로딩 스켈레톤
- Spinner - 스피너

## 3. Props API
interface BlockProps {
  role: BlockRole;
  prominence?: Prominence;
  intent?: Intent;
  density?: Density;

  layout?: 'inline' | 'stack' | 'grid';
  gap?: number;
  clickable?: boolean;
  selected?: boolean;
}

## 4. CVA Variants
const blockVariants = cva(
  'rounded-lg transition-colors',
  {
    variants: {
      prominence: { ... },
      intent: { ... },
      density: { ... },
    }
  }
);

## 5. 사용 예시
(최소 10개 예시)

## 6. Accessibility
- ARIA roles
- Keyboard navigation

## 7. 구현 세부사항
- Headless 패턴 적용 여부
- State management
```

**작성 순서**:
1. [ ] 현재 구현된 role 13개 분석
2. [ ] MECE 기준으로 BlockRole 분류 체계 정리
3. [ ] Props API 정의
4. [ ] CVA variants 정의
5. [ ] 사용 예시 작성
6. [ ] Accessibility 가이드 작성

---

### Task 1.3: Form, List, Grid Block role 구현

**목표**: 핵심 BlockRole 3개 구현
**예상 시간**: 2일

#### 1. Form Block

**파일**: `src/components/types/Block/role/Form.tsx`

```typescript
import { cva } from 'class-variance-authority';

const formVariants = cva(
  'flex flex-col gap-4 p-4 rounded-lg',
  {
    variants: {
      prominence: {
        Primary: 'bg-white shadow-md',
        Secondary: 'bg-gray-50',
      },
      density: {
        Comfortable: 'gap-6 p-6',
        Standard: 'gap-4 p-4',
        Compact: 'gap-2 p-2',
      },
    },
    defaultVariants: {
      prominence: 'Primary',
      density: 'Standard',
    },
  }
);

export function Form({
  children,
  prominence,
  density,
  onSubmit,
  className,
}: FormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(formVariants({ prominence, density }), className)}
    >
      {children}
    </form>
  );
}
```

**사용 예시**:
```tsx
<Block role="Form" prominence="Primary" density="Standard">
  <Field label="Name" dataType="text" />
  <Field label="Email" dataType="email" />

  <Block role="Toolbar">
    <Action prominence="Secondary">Cancel</Action>
    <Action prominence="Primary" intent="Positive">Submit</Action>
  </Block>
</Block>
```

#### 2. List Block

**파일**: `src/components/types/Block/role/List.tsx`

```typescript
const listVariants = cva(
  'flex flex-col',
  {
    variants: {
      prominence: {
        Primary: 'bg-white',
        Secondary: 'bg-transparent',
      },
      density: {
        Comfortable: 'gap-3',
        Standard: 'gap-2',
        Compact: 'gap-1',
      },
    },
  }
);

export function List({
  children,
  prominence,
  density,
  className,
}: ListProps) {
  return (
    <div className={cn(listVariants({ prominence, density }), className)}>
      {children}
    </div>
  );
}
```

**사용 예시**:
```tsx
<Block role="List" density="Compact">
  {items.map(item => (
    <Block key={item.id} clickable selected={item.id === selectedId}>
      <Text role="Body">{item.name}</Text>
    </Block>
  ))}
</Block>
```

#### 3. Grid Block

**파일**: `src/components/types/Block/role/Grid.tsx`

```typescript
const gridVariants = cva(
  'grid',
  {
    variants: {
      columns: {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        6: 'grid-cols-6',
      },
      density: {
        Comfortable: 'gap-6',
        Standard: 'gap-4',
        Compact: 'gap-2',
      },
    },
    defaultVariants: {
      columns: 3,
      density: 'Standard',
    },
  }
);

export function Grid({
  children,
  columns,
  density,
  className,
}: GridProps) {
  return (
    <div className={cn(gridVariants({ columns, density }), className)}>
      {children}
    </div>
  );
}
```

**Block.tsx 통합**:
```typescript
// src/components/types/Block/Block.tsx
import { Form } from './role/Form';
import { List } from './role/List';
import { Grid } from './role/Grid';

export function Block({ role, ...props }: BlockProps) {
  if (role === 'Form') return <Form {...props} />;
  if (role === 'List') return <List {...props} />;
  if (role === 'Grid') return <Grid {...props} />;
  // ... 기존 role들
}
```

**검증**:
- [ ] Form, List, Grid 구현 완료
- [ ] CVA variants 적용
- [ ] 사용 예시 페이지 작성
- [ ] block.spec.md에 문서화

---

## 📋 Week 2: 스펙 문서 작성 및 Action 완성 (Jan 18-24)

### Task 2.1: text.spec.md 작성

**파일**: `docs/2-areas/spec/4-element/text/text.spec.md`

**구조**:
```markdown
# Text Element Specification

## TextRole 카탈로그 (10개)
1. Title (h1-h6)
2. Body (p)
3. Label (label)
4. Code (code, pre)
5. Badge (상태 뱃지)
6. Alert (알림 메시지)
7. Avatar (프로필)
8. Kbd (키보드 단축키)
9. Tag (태그)
10. Caption (작은 설명)

## Props API
## CVA Variants (prominence × intent)
## Accessibility
```

**작업**:
- [ ] 현재 구현된 TextRole 9개 정리
- [ ] Title role 추가 여부 결정 (Content와 통합?)
- [ ] Caption role 추가 검토
- [ ] Props API 표준화

---

### Task 2.2: action.spec.md 작성

**파일**: `docs/2-areas/spec/4-element/action/action.spec.md`

**구조**:
```markdown
# Action Element Specification

## ActionRole 카탈로그 (4개)
1. Button - 일반 버튼
2. IconButton - 아이콘 버튼
3. Link - 탐색 링크
4. MenuItem - 메뉴 아이템

## Props API
## CVA Variants (prominence × intent × state)
## Keyboard Shortcuts
## Loading States
## Accessibility
```

---

### Task 2.3: Link, MenuItem Action role 구현

#### 1. Link Action

**파일**: `src/components/types/Element/Action/role/Link.tsx`

```typescript
const linkVariants = cva(
  'inline-flex items-center gap-1 transition-colors',
  {
    variants: {
      prominence: {
        Primary: 'font-medium',
        Secondary: 'font-normal',
        Tertiary: 'text-sm',
      },
      intent: {
        Neutral: 'text-text-primary hover:text-text-secondary',
        Brand: 'text-accent hover:text-accent-dark',
        Positive: 'text-green-600 hover:text-green-700',
        Critical: 'text-red-600 hover:text-red-700',
      },
    },
  }
);

export function Link({
  children,
  href,
  target,
  prominence,
  intent,
  className,
}: LinkProps) {
  return (
    <a
      href={href}
      target={target}
      className={cn(linkVariants({ prominence, intent }), className)}
    >
      {children}
      {target === '_blank' && <ExternalLink size={16} />}
    </a>
  );
}
```

#### 2. MenuItem Action

**파일**: `src/components/types/Element/Action/role/MenuItem.tsx`

```typescript
const menuItemVariants = cva(
  'flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors',
  {
    variants: {
      intent: {
        Neutral: 'hover:bg-gray-100',
        Critical: 'text-red-600 hover:bg-red-50',
      },
      selected: {
        true: 'bg-accent/10 text-accent',
        false: '',
      },
    },
  }
);

export function MenuItem({
  children,
  onClick,
  intent,
  selected,
  shortcut,
  icon,
  className,
}: MenuItemProps) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(menuItemVariants({ intent, selected }), className)}
    >
      {icon && <span>{icon}</span>}
      <span className="flex-1">{children}</span>
      {shortcut && <Kbd>{shortcut}</Kbd>}
    </button>
  );
}
```

**Action.tsx 통합**:
```typescript
// src/components/types/Element/Action/Action.tsx
export function Action({ role = 'Button', ...props }: ActionProps) {
  if (role === 'Button') return <Button {...props} />;
  if (role === 'IconButton') return <IconButton {...props} />;
  if (role === 'Link') return <Link {...props} />;
  if (role === 'MenuItem') return <MenuItem {...props} />;
}
```

---

### Task 2.4: Toast 시스템 구현 ⭐

**목표**: 알림 시스템 구현 (엔터프라이즈 필수)
**예상 시간**: 1-2일

#### Step 1: Toast Provider 구현

**파일**: `src/components/types/Overlay/ToastProvider.tsx`

```typescript
import { createContext, useContext, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  intent: Intent;
  duration?: number;
}

const ToastContext = createContext<{
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}>(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36);
    setToasts(prev => [...prev, { ...toast, id }]);

    if (toast.duration !== 0) {
      setTimeout(() => removeToast(id), toast.duration || 3000);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
```

#### Step 2: Toast Component 구현

**파일**: `src/components/types/Overlay/role/Toast.tsx`

```typescript
const toastVariants = cva(
  'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
  {
    variants: {
      intent: {
        Positive: 'bg-green-500 text-white',
        Critical: 'bg-red-500 text-white',
        Caution: 'bg-yellow-500 text-white',
        Info: 'bg-blue-500 text-white',
        Neutral: 'bg-gray-800 text-white',
      },
    },
  }
);

export function Toast({ message, intent, onClose }: ToastProps) {
  return (
    <div className={toastVariants({ intent })}>
      {getIcon(intent)}
      <span>{message}</span>
      <IconButton size="sm" onClick={onClose}>
        <X size={16} />
      </IconButton>
    </div>
  );
}
```

#### Step 3: 사용 예시

```typescript
function MyComponent() {
  const { addToast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      addToast({
        message: 'Changes saved successfully!',
        intent: 'Positive',
      });
    } catch (error) {
      addToast({
        message: 'Failed to save changes.',
        intent: 'Critical',
      });
    }
  };
}
```

**검증**:
- [ ] ToastProvider 구현
- [ ] Toast component 구현
- [ ] useToast hook 작동
- [ ] 4가지 intent 스타일링
- [ ] 자동 닫기 (duration)
- [ ] 수동 닫기 (X 버튼)

---

## 📋 Week 3: Overlay 완성 및 CVA 표준화 시작 (Jan 25-31)

### Task 3.1: overlay.spec.md 작성

**파일**: `docs/2-areas/spec/5-overlay/overlay.spec.md`

**구조**:
```markdown
# Overlay Specification

## OverlayRole 카탈로그 (7개)
1. Dialog - 모달 대화상자
2. Drawer - 사이드 패널
3. Popover - 팝오버
4. Toast - 알림 토스트
5. Tooltip - 툴팁
6. ContextMenu - 컨텍스트 메뉴
7. Dropdown - 드롭다운

## Position System
- top, top-start, top-end
- bottom, bottom-start, bottom-end
- left, right

## Z-Index Hierarchy
- Tooltip: 800
- Popover/Dropdown: 900
- ContextMenu: 950
- Dialog/Drawer: 1000
- Toast: 1100

## Focus Management
## Animation System
## Accessibility
```

---

### Task 3.2: Drawer 구현

**파일**: `src/components/types/Overlay/role/Drawer.tsx`

```typescript
const drawerVariants = cva(
  'fixed bg-white shadow-2xl transition-transform duration-300',
  {
    variants: {
      position: {
        left: 'left-0 top-0 bottom-0',
        right: 'right-0 top-0 bottom-0',
        top: 'left-0 right-0 top-0',
        bottom: 'left-0 right-0 bottom-0',
      },
      open: {
        true: 'translate-x-0 translate-y-0',
        false: '', // 방향별로 다름
      },
    },
  }
);

export function Drawer({
  open,
  onClose,
  position = 'right',
  width = 400,
  children,
}: DrawerProps) {
  return (
    <Overlay open={open} onClose={onClose} backdrop>
      <div
        className={drawerVariants({ position, open })}
        style={{ width: position === 'left' || position === 'right' ? width : undefined }}
      >
        {children}
      </div>
    </Overlay>
  );
}
```

---

### Task 3.3: CVA Variants 표준화 시작

**목표**: 모든 컴포넌트에 prominence × intent × density 적용
**예상 시간**: 3-4일 (Week 3-4에 걸쳐 진행)

#### 표준화 대상:

1. **Block (13개 role)**:
   - [ ] Card
   - [ ] Tabs
   - [ ] Toolbar
   - [ ] Accordion
   - [ ] DataTable
   - [ ] 기타 8개

2. **Element - Text (9개 role)**:
   - [ ] Alert
   - [ ] Badge
   - [ ] Code
   - [ ] Label
   - [ ] 기타 5개

3. **Element - Action (4개 role)**:
   - [x] Button (이미 적용?)
   - [x] IconButton (이미 적용?)
   - [ ] Link
   - [ ] MenuItem

4. **Element - Field (12개 renderer)**:
   - 각 Field renderer에 CVA 적용

#### CVA 패턴 템플릿:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const componentVariants = cva(
  // base classes
  'transition-colors',
  {
    variants: {
      prominence: {
        Hero: '...',
        Primary: '...',
        Secondary: '...',
        Tertiary: '...',
      },
      intent: {
        Neutral: '...',
        Brand: '...',
        Positive: '...',
        Caution: '...',
        Critical: '...',
        Info: '...',
      },
      density: {
        Comfortable: '...',
        Standard: '...',
        Compact: '...',
      },
    },
    compoundVariants: [
      // prominence × intent 조합
      {
        prominence: 'Primary',
        intent: 'Brand',
        class: '...',
      },
    ],
    defaultVariants: {
      prominence: 'Primary',
      intent: 'Neutral',
      density: 'Standard',
    },
  }
);

type ComponentVariants = VariantProps<typeof componentVariants>;

interface ComponentProps extends ComponentVariants {
  children: React.ReactNode;
  className?: string;
}

export function Component({
  prominence,
  intent,
  density,
  children,
  className,
}: ComponentProps) {
  return (
    <div className={cn(componentVariants({ prominence, intent, density }), className)}>
      {children}
    </div>
  );
}
```

---

## 📋 Week 4: CVA 표준화 완료 및 통합 테스트 (Feb 1-7)

### Task 4.1: CVA Variants 표준화 완료

- [ ] 모든 Block role CVA 적용 완료
- [ ] 모든 Element role CVA 적용 완료
- [ ] prominence × intent × density 조합 테스트
- [ ] Compound variants 정리

### Task 4.2: Phase 1 통합 테스트

#### 테스트 체크리스트:

**1. Page**:
- [ ] 4가지 PageRole 모두 작동
- [ ] Dynamic Grid Template 정상 작동
- [ ] Resizable panels 정상 작동

**2. Section**:
- [ ] 모든 SectionRole 렌더링
- [ ] Collapsible 기능 작동
- [ ] Scrollable 기능 작동

**3. Block**:
- [ ] 모든 BlockRole 렌더링
- [ ] CVA variants 적용 확인
- [ ] Form, List, Grid 정상 작동

**4. Element - Text**:
- [ ] 모든 TextRole 렌더링
- [ ] prominence × intent variants 작동

**5. Element - Field**:
- [ ] 21개 dataType 모두 작동
- [ ] 검증 시스템 작동
- [ ] 에러 메시지 표시

**6. Element - Action**:
- [ ] 4개 ActionRole 모두 작동
- [ ] Link 탐색 정상
- [ ] MenuItem 클릭 정상

**7. Overlay**:
- [ ] Dialog, Drawer, Toast 작동
- [ ] Focus trap 작동
- [ ] Backdrop dismiss 작동

### Task 4.3: 버그 수정 및 문서 업데이트

- [ ] 발견된 버그 수정
- [ ] 각 스펙 문서 최신화
- [ ] README 업데이트
- [ ] CLAUDE.md 업데이트
- [ ] Coverage analysis 업데이트

---

## 🎯 완료 기준 (Definition of Done)

Phase 1이 완료되었다고 판단하는 기준:

### 스펙 문서 (5개)
- [x] Page ✅
- [x] Section ✅
- [ ] Block
- [ ] Text
- [ ] Action
- [ ] (Separator - P2)
- [x] Field ✅
- [ ] Overlay

### 구현 완료
- [x] Page (4 roles) ✅
- [x] Section (12+ roles) ✅
- [ ] Block (15+ roles, 최소 Form/List/Grid 필수)
- [ ] Text (10 roles)
- [ ] Field (21 dataTypes)
- [ ] Action (4 roles)
- [x] Separator ✅
- [ ] Overlay (최소 Dialog/Drawer/Toast/Tooltip)

### CVA Variants
- [ ] 모든 컴포넌트에 prominence 적용
- [ ] 모든 컴포넌트에 intent 적용 (해당 시)
- [ ] 모든 컴포넌트에 density 적용
- [ ] Compound variants 정의

### Accessibility
- [ ] 모든 컴포넌트에 ARIA 속성
- [ ] 키보드 탐색 지원
- [ ] Focus management
- [ ] Screen reader 지원

### 테스트
- [ ] 각 컴포넌트별 예시 페이지
- [ ] 통합 테스트 통과
- [ ] 크로스 브라우저 테스트

---

## 📞 블로커 및 리스크

### 예상 블로커:
1. **RichText Field** - 외부 라이브러리 선택 (TipTap vs Slate)
2. **Focus Trap** - 복잡한 Overlay 구조에서 focus management
3. **CVA Compound Variants** - prominence × intent 조합 수가 많음 (4 × 6 = 24개)

### 리스크 완화:
1. RichText는 TipTap으로 결정 (더 간단)
2. Focus Trap은 react-focus-lock 라이브러리 사용
3. CVA Compound Variants는 필수 조합만 정의

---

## 📈 진행 추적

### Week 1 체크포인트 (Jan 17):
- [ ] Field 21 dataTypes 완료
- [ ] block.spec.md 완료
- [ ] Form/List/Grid 구현 완료

### Week 2 체크포인트 (Jan 24):
- [ ] text.spec.md, action.spec.md 완료
- [ ] Link/MenuItem 구현 완료
- [ ] Toast 시스템 완료

### Week 3 체크포인트 (Jan 31):
- [ ] overlay.spec.md 완료
- [ ] Drawer 구현 완료
- [ ] CVA 표준화 50% 완료

### Week 4 체크포인트 (Feb 7):
- [ ] CVA 표준화 100% 완료
- [ ] 통합 테스트 통과
- [ ] Phase 1 완료 선언 🎉

---

**문서 작성자**: Claude Code
**최종 업데이트**: 2026-01-11
**다음 체크인**: 2026-01-17 (Week 1 완료)
