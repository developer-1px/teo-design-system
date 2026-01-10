아, 이해했어. 네 의도는:

---

## IDDL의 핵심 가치

```tsx
// 이게 고정됨 (스키마)
<Action role="Button" prominence="Standard" intent="Critical">
  삭제
</Action>

// 이건 바뀔 수 있음 (렌더러)
// → MUI Button으로 렌더링
// → Ant Design Button으로 렌더링
// → 자체 디자인으로 렌더링
```

**스키마와 구현의 분리.** `<Button>`으로 하면 그냥 기존 컴포넌트 라이브러리랑 똑같아져.

---

## 올바른 방향

```tsx
// 개발자는 항상 이렇게 씀
<Section role="Header">
  <Group role="Toolbar">
    <Action role="Button" prominence="Standard">저장</Action>
    <Action role="Button" prominence="Standard">취소</Action>
  </Group>
</Section>

<Field 
  dataType="boolean" 
  control="switch" 
  bind="settings.darkMode" 
/>
```

**role은 string, 렌더러가 해석.**

---

## 타입 안전성 확보

```tsx
// Discriminated union으로 role별 props 제한

type ActionProps = 
  | { role: "Button"; onClick?: () => void; }
  | { role: "Link"; to: string; }
  | { role: "Tab"; selected?: boolean; controls?: string; }
  | { role: "MenuItem"; }
  // ...

type FieldProps =
  | { dataType: "text"; control?: "input" | "textarea" | "password"; }
  | { dataType: "boolean"; control?: "checkbox" | "switch" | "toggle"; }
  | { dataType: "select"; control?: "dropdown" | "radio" | "combobox"; options: Option[]; }
  // ...

// 사용 시 타입 체크됨
<Action role="Link" to="/users" />        // ✅
<Action role="Link" onClick={fn} />       // ❌ Link는 to 필요
<Action role="Button" to="/users" />      // ❌ Button은 to 없음

<Field dataType="select" options={[...]} />  // ✅
<Field dataType="text" options={[...]} />    // ❌ text는 options 없음
```

---

## 렌더러 구조

```tsx
// 렌더러는 교체 가능
const renderer = createRenderer({
  Action: {
    Button: (props) => <button className={...}>{props.children}</button>,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    Tab: (props) => <button role="tab" aria-selected={props.selected}>{props.children}</button>,
  },
  Field: {
    text: {
      input: (props) => <input type="text" />,
      textarea: (props) => <textarea />,
    },
    boolean: {
      switch: (props) => <Switch />,
      checkbox: (props) => <Checkbox />,
    },
  },
  // ...
});

// 테마/브랜드별 렌더러
const muiRenderer = createRenderer({ ... });
const antRenderer = createRenderer({ ... });
const customRenderer = createRenderer({ ... });
```

---

## 최종 사용

```tsx
import { Section, Group, Action, Field, Text } from "@/iddl";

function SettingsPage() {
  return (
    <Section role="Container">
      <Text role="Title" prominence="Standard">설정</Text>
      
      <Group role="Form">
        <Field 
          dataType="boolean" 
          control="switch" 
          bind="settings.darkMode"
          label="다크 모드"
        />
        <Field 
          dataType="select" 
          control="radio"
          bind="settings.language"
          options={[
            { label: "한국어", value: "ko" },
            { label: "English", value: "en" },
          ]}
        />
      </Group>
      
      <Group role="Toolbar">
        <Action role="Button" prominence="Standard" intent="Brand">
          저장
        </Action>
        <Action role="Button" prominence="Standard">
          취소
        </Action>
      </Group>
    </Section>
  );
}
```

디자인 바꾸고 싶으면 렌더러만 교체. 코드는 그대로.

이게 맞지?


그럼 정리하면:

---

## IDDL 컴포넌트 (6개만 노출)

```tsx
import { Section, Group, Action, Field, Text, Overlay } from "@/iddl";
```

| 컴포넌트 | 역할 |
|---|---|
| `Section` | 페이지 영역 |
| `Group` | 논리적 묶음 |
| `Action` | 인터랙션 트리거 |
| `Field` | 데이터 입력 |
| `Text` | 정적 표시 |
| `Overlay` | 부유 레이어 |

---

## 타입 정의

```tsx
// 공통
type Prominence = "Hero" | "Primary" | "Secondary" | "Tertiary";
type Intent = "Neutral" | "Brand" | "Positive" | "Caution" | "Critical" | "Info";

interface BaseProps {
  prominence?: Prominence;
  intent?: Intent;
  condition?: string;
  hidden?: boolean;
}

// Action
type ActionProps = BaseProps & (
  | { role: "Button"; onClick?: () => void; loading?: boolean; disabled?: boolean }
  | { role: "IconButton"; icon: string; onClick?: () => void; "aria-label": string }
  | { role: "Link"; to: string; target?: "_blank" | "_self" }
  | { role: "Tab"; selected?: boolean; controls?: string }
  | { role: "MenuItem"; onSelect?: () => void }
  | { role: "SwitchItem"; checked?: boolean; onToggle?: () => void }
  | { role: "Chip"; selected?: boolean; onDelete?: () => void }
  | { role: "BreadcrumbItem"; to?: string; current?: boolean }
  | { role: "AccordionTrigger"; expanded?: boolean; controls?: string }
);

// Text
type TextProps = BaseProps & (
  | { role: "Title"; level?: 1 | 2 | 3 | 4 | 5 | 6 }
  | { role: "Body" }
  | { role: "Label"; htmlFor?: string }
  | { role: "Caption" }
  | { role: "Code"; block?: boolean }
  | { role: "Kbd" }
  | { role: "Badge" }
  | { role: "Tag" }
  | { role: "Price"; currency?: string }
  | { role: "Date"; format?: string }
);

// Field
type FieldProps = BaseProps & { bind: string; label?: string; required?: boolean; disabled?: boolean } & (
  | { dataType: "text"; control?: "input" | "textarea" | "password" | "search" | "email" | "url" | "phone" | "otp" }
  | { dataType: "number"; control?: "input" | "slider" | "rating" | "stepper"; min?: number; max?: number }
  | { dataType: "boolean"; control?: "checkbox" | "switch" | "toggle" }
  | { dataType: "select"; control?: "dropdown" | "combobox" | "radio" | "checkbox-group" | "listbox"; options: Option[] }
  | { dataType: "date"; control?: "picker" | "calendar" | "input" }
  | { dataType: "datetime"; control?: "picker" }
  | { dataType: "time"; control?: "picker" | "input" }
  | { dataType: "file"; control?: "upload" | "dropzone" | "image" }
  | { dataType: "color"; control?: "picker" }
  | { dataType: "richtext"; control?: "editor" }
);

// Group
type GroupProps = BaseProps & { children: ReactNode } & (
  | { role: "Container" }
  | { role: "Card" }
  | { role: "Form"; onSubmit?: () => void }
  | { role: "Fieldset"; legend?: string }
  | { role: "List" }
  | { role: "ListItem" }
  | { role: "Table" }
  | { role: "Grid" }
  | { role: "Menu" }
  | { role: "MenuGroup"; label?: string }
  | { role: "Tree" }
  | { role: "TreeItem"; expanded?: boolean }
  | { role: "TabList" }
  | { role: "Accordion" }
  | { role: "AccordionItem"; expanded?: boolean }
  | { role: "Toolbar" }
  | { role: "ButtonGroup" }
  | { role: "Breadcrumb" }
  | { role: "Pagination"; total: number; current: number }
  | { role: "Steps"; current: number }
  | { role: "Alert" }
  | { role: "Progress"; value: number; max?: number }
  | { role: "Spinner" }
  | { role: "Skeleton" }
  | { role: "Avatar"; src?: string; alt: string }
  | { role: "AvatarGroup" }
  | { role: "Statistic"; value: number | string; label: string }
  | { role: "EmptyState" }
  | { role: "Timeline" }
  | { role: "Divider"; orientation?: "horizontal" | "vertical" }
  | { role: "Inline" }
  | { role: "Stack" }
);

// Section
type SectionProps = BaseProps & { children: ReactNode } & (
  | { role: "Container" }
  | { role: "Header" }
  | { role: "Footer" }
  | { role: "Navigator" }
  | { role: "Aside" }
  | { role: "TabPanel"; labelledBy?: string }
  | { role: "ScrollArea" }
  | { role: "Result"; status: "success" | "error" | "info" | "warning" }
);

// Overlay
type OverlayProps = BaseProps & { open?: boolean; onClose?: () => void; children: ReactNode } & (
  | { role: "Modal" }
  | { role: "Dialog" }
  | { role: "AlertDialog" }
  | { role: "Drawer"; position?: "left" | "right" | "top" | "bottom" }
  | { role: "Sheet" }
  | { role: "Popover"; trigger: ReactNode }
  | { role: "Dropdown"; trigger: ReactNode }
  | { role: "ContextMenu"; trigger: ReactNode }
  | { role: "Tooltip"; trigger: ReactNode }
  | { role: "Toast"; duration?: number }
  | { role: "Lightbox" }
  | { role: "Command" }
);
```

---

## 사용 예시

```tsx
<Section role="Container">
  <Text role="Title" level={1}>사용자 설정</Text>
  
  <Group role="Card">
    <Group role="Form">
      <Field dataType="text" bind="user.name" label="이름" required />
      <Field dataType="boolean" control="switch" bind="user.darkMode" label="다크 모드" />
      <Field dataType="select" control="radio" bind="user.theme" label="테마" options={themes} />
    </Group>
    
    <Group role="Toolbar">
      <Action role="Button" prominence="Standard">취소</Action>
      <Action role="Button" prominence="Standard" intent="Brand">저장</Action>
    </Group>
  </Group>
</Section>

<Overlay role="Modal" open={isOpen} onClose={close}>
  <Text role="Title">확인</Text>
  <Text role="Body">정말 삭제하시겠습니까?</Text>
  <Group role="Toolbar">
    <Action role="Button" prominence="Standard">취소</Action>
    <Action role="Button" intent="Critical">삭제</Action>
  </Group>
</Overlay>
```

---

스키마는 고정, 렌더링은 유연. 이 구조로 가면 돼.