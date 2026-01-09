# Composition Patterns (합성 패턴)

컴포넌트를 조합하고 재사용하는 고급 패턴입니다.

---

## 개요

Composition Patterns는 **컴포넌트를 조합하여 복잡한 UI를 구성**하는 패턴입니다. Props drilling을 피하고, API를 더 직관적으로 만들며, 컴포넌트 간 관계를 명확하게 표현합니다.

### 왜 필요한가?
- **유연성**: 컴포넌트를 자유롭게 조합
- **가독성**: 선언적 API로 의도 명확히 전달
- **재사용성**: 로직 공유하면서 UI는 자유롭게
- **Props Drilling 방지**: Context를 통한 암시적 공유

---

## 1. Compound Components Pattern

### 1.1 개념

#### 설명
여러 컴포넌트가 암시적으로 상태를 공유하며 함께 작동하는 패턴입니다.

#### 장점
- Props drilling 없이 상태 공유
- 선언적이고 유연한 API
- 컴포넌트 간 관계 명확

#### 단점
- Context 오버헤드
- 컴포넌트 순서/구조 제약

---

### 1.2 Tabs 예제

#### 기본 구현

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// Context 생성
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within Tabs');
  }
  return context;
}

// Root 컴포넌트
interface TabsProps {
  defaultTab: string;
  children: ReactNode;
  onChange?: (tab: string) => void;
}

export function Tabs({ defaultTab, children, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div role="tablist">{children}</div>
    </TabsContext.Provider>
  );
}

// TabList 컴포넌트
Tabs.List = function TabList({ children }: { children: ReactNode }) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '1px solid var(--color-border-default)',
      }}
    >
      {children}
    </div>
  );
};

// Tab 컴포넌트
interface TabProps {
  id: string;
  children: ReactNode;
}

Tabs.Tab = function Tab({ id, children }: TabProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === id;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      id={`tab-${id}`}
      onClick={() => setActiveTab(id)}
      style={{
        padding: '8px 16px',
        border: 'none',
        background: isActive ? 'var(--color-surface-base)' : 'transparent',
        borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
        cursor: 'pointer',
        color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
      }}
    >
      {children}
    </button>
  );
};

// TabPanels 컴포넌트
Tabs.Panels = function TabPanels({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
};

// TabPanel 컴포넌트
interface TabPanelProps {
  id: string;
  children: ReactNode;
}

Tabs.Panel = function TabPanel({ id, children }: TabPanelProps) {
  const { activeTab } = useTabs();
  const isActive = activeTab === id;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      style={{ padding: '16px' }}
    >
      {children}
    </div>
  );
};
```

#### 사용 예제

```tsx
// ✅ 선언적이고 읽기 쉬운 API
<Tabs defaultTab="profile" onChange={(tab) => console.log(tab)}>
  <Tabs.List>
    <Tabs.Tab id="profile">Profile</Tabs.Tab>
    <Tabs.Tab id="settings">Settings</Tabs.Tab>
    <Tabs.Tab id="notifications">Notifications</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panels>
    <Tabs.Panel id="profile">
      <ProfileContent />
    </Tabs.Panel>
    <Tabs.Panel id="settings">
      <SettingsContent />
    </Tabs.Panel>
    <Tabs.Panel id="notifications">
      <NotificationsContent />
    </Tabs.Panel>
  </Tabs.Panels>
</Tabs>
```

#### IDDL 통합

```tsx
import { Group } from '@/components/dsl/Group';
import { Action } from '@/components/dsl/Action';
import { Section } from '@/components/dsl/Section';

// IDDL + Compound Components
<Tabs defaultTab="profile">
  <Group role="TabList" prominence="Primary">
    <Tabs.Tab id="profile">
      <Action role="Tab">Profile</Action>
    </Tabs.Tab>
    <Tabs.Tab id="settings">
      <Action role="Tab">Settings</Action>
    </Tabs.Tab>
  </Group>

  <Section role="TabPanel" prominence="Primary">
    <Tabs.Panel id="profile">
      <ProfileContent />
    </Tabs.Panel>
    <Tabs.Panel id="settings">
      <SettingsContent />
    </Tabs.Panel>
  </Section>
</Tabs>
```

---

### 1.3 Accordion 예제

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (id: string) => void;
  multiple?: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion compound components must be used within Accordion');
  }
  return context;
}

interface AccordionProps {
  children: ReactNode;
  multiple?: boolean;
  defaultOpen?: string[];
}

export function Accordion({ children, multiple = false, defaultOpen = [] }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return multiple ? [...prev, id] : [id];
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, multiple }}>
      <div role="region">{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  id: string;
  children: ReactNode;
}

Accordion.Item = function AccordionItem({ id, children }: AccordionItemProps) {
  const { openItems } = useAccordion();
  const isOpen = openItems.includes(id);

  return (
    <div
      style={{
        borderBottom: '1px solid var(--color-border-default)',
      }}
      data-state={isOpen ? 'open' : 'closed'}
    >
      {children}
    </div>
  );
};

interface AccordionTriggerProps {
  id: string;
  children: ReactNode;
}

Accordion.Trigger = function AccordionTrigger({ id, children }: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordion();
  const isOpen = openItems.includes(id);

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={`panel-${id}`}
      id={`trigger-${id}`}
      onClick={() => toggleItem(id)}
      style={{
        width: '100%',
        padding: '12px 16px',
        background: 'none',
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {children}
      <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}>
        ▼
      </span>
    </button>
  );
};

interface AccordionContentProps {
  id: string;
  children: ReactNode;
}

Accordion.Content = function AccordionContent({ id, children }: AccordionContentProps) {
  const { openItems } = useAccordion();
  const isOpen = openItems.includes(id);

  return (
    <div
      role="region"
      id={`panel-${id}`}
      aria-labelledby={`trigger-${id}`}
      hidden={!isOpen}
      style={{
        padding: isOpen ? '12px 16px' : '0 16px',
        maxHeight: isOpen ? '500px' : '0',
        overflow: 'hidden',
        transition: 'max-height 300ms, padding 300ms',
      }}
    >
      {children}
    </div>
  );
};

// 사용 예제
<Accordion multiple defaultOpen={['item-1']}>
  <Accordion.Item id="item-1">
    <Accordion.Trigger id="item-1">Section 1</Accordion.Trigger>
    <Accordion.Content id="item-1">Content 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item id="item-2">
    <Accordion.Trigger id="item-2">Section 2</Accordion.Trigger>
    <Accordion.Content id="item-2">Content 2</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

---

## 2. Polymorphic Components Pattern

### 2.1 개념

#### 설명
`as` prop을 통해 렌더링할 HTML 태그나 컴포넌트를 동적으로 변경하는 패턴입니다.

#### 장점
- 하나의 컴포넌트로 여러 HTML 요소 지원
- 타입 안전성 유지
- 접근성 향상 (semantic HTML)

---

### 2.2 구현 예제

```tsx
import { ElementType, ComponentPropsWithoutRef } from 'react';

// Polymorphic 타입 정의
type PolymorphicRef<C extends ElementType> = ComponentPropsWithoutRef<C>['ref'];

type PolymorphicComponentProps<
  C extends ElementType,
  Props = {}
> = Props &
  Omit<ComponentPropsWithoutRef<C>, keyof Props> & {
    as?: C;
  };

type PolymorphicComponent = <C extends ElementType = 'div'>(
  props: PolymorphicComponentProps<C, { children: React.ReactNode }>
) => React.ReactElement | null;

// Box 컴포넌트 (Polymorphic)
export const Box: PolymorphicComponent = ({
  as,
  children,
  ...restProps
}) => {
  const Component = as || 'div';
  return <Component {...restProps}>{children}</Component>;
};

// Text 컴포넌트 (Polymorphic with styles)
interface TextOwnProps {
  size?: 'sm' | 'md' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold';
}

export function Text<C extends ElementType = 'span'>({
  as,
  size = 'md',
  weight = 'normal',
  children,
  style,
  ...restProps
}: PolymorphicComponentProps<C, TextOwnProps>) {
  const Component = as || 'span';

  const sizeStyles = {
    sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
    md: { fontSize: '1rem', lineHeight: '1.5rem' },
    lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },
  };

  const weightStyles = {
    normal: { fontWeight: 400 },
    medium: { fontWeight: 500 },
    semibold: { fontWeight: 600 },
  };

  return (
    <Component
      style={{
        ...sizeStyles[size],
        ...weightStyles[weight],
        ...style,
      }}
      {...restProps}
    >
      {children}
    </Component>
  );
}
```

#### 사용 예제

```tsx
// ✅ 다양한 HTML 요소로 렌더링 가능
<Box as="section" className="container">
  <Text as="h1" size="lg" weight="semibold">
    Title
  </Text>
  <Text as="p" size="md">
    Description
  </Text>
  <Box as="button" onClick={handleClick}>
    Click me
  </Box>
</Box>

// ✅ TypeScript가 해당 요소의 props를 자동 추론
<Text as="a" href="/home" target="_blank">
  {/* href, target이 자동 완성됨 */}
  Link
</Text>

<Text as="button" onClick={handleClick} disabled>
  {/* onClick, disabled가 자동 완성됨 */}
  Button
</Text>
```

---

## 3. Slots Pattern

### 3.1 개념

#### 설명
미리 정의된 슬롯에 컴포넌트를 주입하는 패턴입니다. Vue의 Named Slots과 유사합니다.

#### 장점
- 레이아웃 구조 명확
- Props drilling 없이 구성 가능
- 선택적으로 슬롯 채우기 가능

---

### 3.2 구현 예제

```tsx
import { ReactNode, ReactElement, Children, isValidElement } from 'react';

// Slot 컴포넌트 정의
interface SlotProps {
  name: string;
  children: ReactNode;
}

function Slot({ children }: { name: string; children: ReactNode }) {
  return <>{children}</>;
}

// Card 컴포넌트 (Slots 사용)
interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  // 자식에서 슬롯 추출
  const slots: Record<string, ReactNode> = {};

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Slot) {
      const slotName = (child.props as SlotProps).name;
      slots[slotName] = child.props.children;
    }
  });

  return (
    <div
      style={{
        border: '1px solid var(--color-border-default)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Header Slot */}
      {slots.header && (
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid var(--color-border-default)',
            background: 'var(--color-surface-elevated)',
          }}
        >
          {slots.header}
        </div>
      )}

      {/* Content Slot (기본) */}
      <div style={{ padding: '16px' }}>
        {slots.content || slots.default}
      </div>

      {/* Footer Slot */}
      {slots.footer && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--color-border-default)',
            background: 'var(--color-surface-sunken)',
          }}
        >
          {slots.footer}
        </div>
      )}
    </div>
  );
}

// Slot 내보내기
Card.Slot = Slot;
```

#### 사용 예제

```tsx
// ✅ 선언적으로 슬롯 채우기
<Card>
  <Card.Slot name="header">
    <h3>Card Title</h3>
  </Card.Slot>

  <Card.Slot name="content">
    <p>This is the main content of the card.</p>
  </Card.Slot>

  <Card.Slot name="footer">
    <button>Action</button>
  </Card.Slot>
</Card>

// ✅ 선택적 슬롯
<Card>
  <Card.Slot name="content">
    <p>Content only, no header or footer.</p>
  </Card.Slot>
</Card>
```

---

### 3.3 Modal with Slots

```tsx
interface ModalSlotProps {
  name: 'header' | 'content' | 'footer';
  children: ReactNode;
}

function ModalSlot({ children }: ModalSlotProps) {
  return <>{children}</>;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  const slots: Record<string, ReactNode> = {};

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === ModalSlot) {
      const slotName = (child.props as ModalSlotProps).name;
      slots[slotName] = child.props.children;
    }
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          background: 'white',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {slots.header && (
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--color-border-default)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {slots.header}
            <button onClick={onClose}>✕</button>
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {slots.content}
        </div>

        {/* Footer */}
        {slots.footer && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--color-border-default)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            {slots.footer}
          </div>
        )}
      </div>
    </div>
  );
}

Modal.Slot = ModalSlot;

// 사용 예제
<Modal open={isOpen} onClose={handleClose}>
  <Modal.Slot name="header">
    <h2>Confirm Action</h2>
  </Modal.Slot>
  <Modal.Slot name="content">
    <p>Are you sure you want to proceed?</p>
  </Modal.Slot>
  <Modal.Slot name="footer">
    <button onClick={handleClose}>Cancel</button>
    <button onClick={handleConfirm}>Confirm</button>
  </Modal.Slot>
</Modal>
```

---

## 4. Render Props Pattern

### 4.1 개념

#### 설명
함수를 children이나 prop으로 전달하여, 렌더링 로직을 부모가 제어하는 패턴입니다.

#### 장점
- 렌더링 로직과 상태 로직 분리
- 최대한의 유연성
- 로직 재사용

#### 단점
- Callback hell (중첩 시)
- Hook의 등장으로 사용 빈도 감소

---

### 4.2 구현 예제

```tsx
// MouseTracker (Render Props)
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  children: (position: MousePosition) => ReactNode;
}

export function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setPosition({ x: e.clientX, y: e.clientY });
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <>{children(position)}</>;
}

// 사용 예제
<MouseTracker>
  {({ x, y }) => (
    <div>
      Mouse position: {x}, {y}
    </div>
  )}
</MouseTracker>
```

---

### 4.3 DataFetcher 예제

```tsx
interface DataFetcherProps<T> {
  url: string;
  children: (state: {
    data: T | null;
    loading: boolean;
    error: Error | null;
  }) => ReactNode;
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return <>{children({ data, loading, error })}</>;
}

// 사용 예제
<DataFetcher<User> url="/api/user/123">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    if (!data) return null;
    return <UserProfile user={data} />;
  }}
</DataFetcher>
```

---

### 4.4 Form with Render Props

```tsx
interface FormRenderProps<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  handleChange: (field: keyof T, value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isValid: boolean;
}

interface FormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => void;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  children: (props: FormRenderProps<T>) => ReactNode;
}

export function Form<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
  children,
}: FormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        onSubmit(values);
      }
    } else {
      onSubmit(values);
    }
  };

  const isValid = Object.keys(errors).length === 0;

  return (
    <form onSubmit={handleSubmit}>
      {children({ values, errors, handleChange, handleSubmit, isValid })}
    </form>
  );
}

// 사용 예제
interface LoginFormData {
  email: string;
  password: string;
}

<Form<LoginFormData>
  initialValues={{ email: '', password: '' }}
  onSubmit={(values) => console.log(values)}
  validate={(values) => {
    const errors: Partial<Record<keyof LoginFormData, string>> = {};
    if (!values.email) errors.email = 'Email is required';
    if (!values.password) errors.password = 'Password is required';
    return errors;
  }}
>
  {({ values, errors, handleChange, isValid }) => (
    <>
      <input
        type="email"
        value={values.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      {errors.email && <span>{errors.email}</span>}

      <input
        type="password"
        value={values.password}
        onChange={(e) => handleChange('password', e.target.value)}
      />
      {errors.password && <span>{errors.password}</span>}

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </>
  )}
</Form>
```

---

## 구현 우선순위

### 🔴 High Priority (즉시 구현)
1. **Compound Components** - Tabs, Accordion 등 복잡한 UI 필수
2. **Polymorphic Components** - 접근성과 유연성 향상

### 🟡 Medium Priority
3. **Slots Pattern** - Card, Modal 등 구조화된 컴포넌트

### 🟢 Low Priority
4. **Render Props** - Hook으로 대체 가능한 경우가 많음

---

## 참고 자료

### 주요 라이브러리
- **Radix UI**: https://www.radix-ui.com/ (Compound Components 패턴)
- **Headless UI**: https://headlessui.com/ (Compound Components)
- **React Aria**: https://react-spectrum.adobe.com/react-aria/ (Polymorphic)
- **Chakra UI**: https://chakra-ui.com/ (Polymorphic `as` prop)
- **Stitches**: https://stitches.dev/ (Polymorphic with CSS-in-JS)

### 아티클
- **Kent C. Dodds - Compound Components**: https://kentcdodds.com/blog/compound-components-with-react-hooks
- **React TypeScript Cheatsheet - Polymorphic**: https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#polymorphic-components

### 관련 문서
- [Behavior Patterns](./01-behavior-patterns.md)
- [Component Role Mapping](../component-role-mapping.md)
