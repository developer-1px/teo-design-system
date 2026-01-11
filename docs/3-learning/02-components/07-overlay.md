# Overlay 컴포넌트

**난이도**: ⭐⭐⭐⭐☆
**소요 시간**: 30분
**선행 학습**: [Type](../01-fundamentals/05-type.md), [Page](./06-page.md)

---

## 📌 이 문서에서 배울 내용

- Overlay가 무엇인가?
- 8가지 OverlayRole 완전 이해
- Z-Index 계층 시스템
- Placement & Positioning
- 실전 활용 패턴 (Dialog, Drawer, Toast, Tooltip)
- Accessibility (Focus Trap, 키보드 탐색)
- 자주 하는 실수와 해결법

---

## 🎯 Overlay란?

**Overlay**는 **메인 콘텐츠 위에 떠있는 UI 요소**를 담당하는 IDDL 컴포넌트입니다.

```tsx
// Overlay = 화면 위에 떠있는 모든 UI
<Overlay
  role="Dialog"
  isOpen={isOpen}
  onClose={handleClose}
  placement="center"
  dismissable
>
  <Block role="Card">
    <Text role="Title">Confirm Delete</Text>
    <Text role="Body">Are you sure?</Text>
  </Block>
</Overlay>
```

**핵심 특징**:
- **Type**: Overlay (Page와 독립적으로 존재)
- **용도**: Dialog, Drawer, Toast, Tooltip 등 floating UI
- **위치**: 메인 콘텐츠 위에 떠있음 (z-index 사용)
- **자식**: Section 또는 Block 허용

---

## 📚 OverlayRole (8가지)

### 1. Dialog (모달 대화상자)

**용도**: 사용자의 주의를 끌고 결정을 요구하는 모달

**특징**:
- Backdrop (어두운 배경) 필수
- Focus Trap (탭 순환이 Dialog 내부에만)
- Center 정렬
- Z-Index: 1000

**Use Case**: 확인 대화상자, 설정 모달, 폼 모달

```tsx
function ConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Action onClick={() => setIsOpen(true)}>Delete</Action>

      <Overlay
        role="Dialog"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="center"
        dismissable
      >
        <Block role="Card" prominence="Strong" className="max-w-md">
          <Text role="Title" prominence="Strong">
            Confirm Delete
          </Text>
          <Text role="Body">
            Are you sure you want to delete this item? This action cannot be undone.
          </Text>

          <Block role="Toolbar" className="justify-end">
            <Action prominence="Standard" onClick={() => setIsOpen(false)}>
              Cancel
            </Action>
            <Action
              prominence="Strong"
              intent="Critical"
              onClick={handleDelete}
            >
              Delete
            </Action>
          </Block>
        </Block>
      </Overlay>
    </>
  );
}
```

---

### 2. Drawer (사이드 패널)

**용도**: 화면 옆에서 슬라이드되는 패널

**특징**:
- Backdrop 선택적
- Left 또는 Right에서 슬라이드
- 고정 너비 (예: 300px, 400px)
- Z-Index: 1000

**Use Case**: 사이드 메뉴, 상세 정보 패널, 필터 패널

```tsx
function FilterDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Action onClick={() => setIsOpen(true)}>Filters</Action>

      <Overlay
        role="Drawer"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="right"
        dismissable
        className="w-[400px]"  {/* 너비는 className으로 제어 */}
      >
        <Section role="Main">
          <Block role="Stack">
            <Text role="Title" prominence="Strong">Filters</Text>

            <Block role="Fieldset">
              <Field label="Category" role="Select" spec={{ options: categories }} />
              <Field label="Price Range" role="Slider" spec={{ min: 0, max: 1000 }} />
              <Field label="In Stock" role="Switch" />
            </Block>

            <Block role="Toolbar" className="justify-end">
              <Action prominence="Standard">Reset</Action>
              <Action prominence="Strong" intent="Positive">Apply</Action>
            </Block>
          </Block>
        </Section>
      </Overlay>
    </>
  );
}
```

---

### 3. Popover

**용도**: 추가 정보나 액션을 표시하는 작은 오버레이

**특징**:
- No Backdrop (배경 어둡게 하지 않음)
- Anchor 요소 기반 위치
- 작은 크기
- Z-Index: 900

**Use Case**: 추가 정보, 빠른 액션, 메뉴

```tsx
function UserPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  return (
    <>
      <Action ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        User Menu
      </Action>

      <Overlay
        role="Popover"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        anchor={buttonRef}
        placement="bottom-start"
        dismissable
      >
        <Block role="Menu" prominence="Standard">
          <Action role="MenuItem">Profile</Action>
          <Action role="MenuItem">Settings</Action>
          <Block role="Divider" />
          <Action role="MenuItem" intent="Critical">Sign Out</Action>
        </Block>
      </Overlay>
    </>
  );
}
```

---

### 4. Toast (알림 메시지)

**용도**: 일시적인 피드백 메시지

**특징**:
- No Backdrop
- 화면 모서리에 고정 위치
- 자동 닫힘 (duration)
- Z-Index: 1100 (최상위)

**Use Case**: 성공 메시지, 에러 알림, 정보 알림

```tsx
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, intent: Intent = 'Neutral') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, intent }]);

    // 3초 후 자동 제거
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return { toasts, showToast };
}

function ToastContainer() {
  const { toasts } = useToast();

  return (
    <>
      {toasts.map(toast => (
        <Overlay
          key={toast.id}
          role="Toast"
          placement="top-right"
          isOpen={true}
        >
          <Block role="Card" prominence="Strong" intent={toast.intent}>
            <Text role="Body">{toast.message}</Text>
          </Block>
        </Overlay>
      ))}
    </>
  );
}

// 사용 예시
function Example() {
  const { showToast } = useToast();

  return (
    <Action onClick={() => showToast('Changes saved!', 'Positive')}>
      Save
    </Action>
  );
}
```

---

### 5. Tooltip (툴팁)

**용도**: 요소에 대한 간단한 설명

**특징**:
- No Backdrop
- Anchor 요소 기반 위치
- 작은 크기, 간결한 텍스트
- Hover 또는 Focus에 표시
- Z-Index: 800 (최하위)

**Use Case**: 아이콘 설명, 버튼 힌트, 도움말

```tsx
function IconWithTooltip() {
  const [isOpen, setIsOpen] = useState(false);
  const iconRef = useRef(null);

  return (
    <>
      <Action
        role="IconButton"
        ref={iconRef}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        title="Settings"
      >
        <Settings size={20} />
      </Action>

      <Overlay
        role="Tooltip"
        isOpen={isOpen}
        anchor={iconRef}
        placement="top"
      >
        <Text role="Caption" density="Compact">
          Open Settings
        </Text>
      </Overlay>
    </>
  );
}
```

---

### 6. Sheet (Bottom Sheet)

**용도**: 모바일에서 화면 하단에서 올라오는 패널

**특징**:
- Backdrop 선택적
- Bottom에서 슬라이드
- 모바일 최적화
- Z-Index: 1000

**Use Case**: 모바일 필터, 옵션 선택, 공유 메뉴

```tsx
function MobileActionSheet() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Action onClick={() => setIsOpen(true)}>Share</Action>

      <Overlay
        role="Sheet"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom"
        dismissable
      >
        <Block role="Menu">
          <Action role="MenuItem">Copy Link</Action>
          <Action role="MenuItem">Share to Twitter</Action>
          <Action role="MenuItem">Share to Facebook</Action>
          <Block role="Divider" />
          <Action role="MenuItem">Cancel</Action>
        </Block>
      </Overlay>
    </>
  );
}
```

---

### 7. Lightbox (이미지 뷰어)

**용도**: 이미지/미디어 전체 화면 뷰

**특징**:
- Backdrop (검은색 배경)
- Fullscreen
- Zoom, 이전/다음 탐색
- Z-Index: 1000

**Use Case**: 이미지 갤러리, 미디어 뷰어

```tsx
function ImageLightbox({ images }: { images: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <>
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          onClick={() => {
            setCurrentIndex(index);
            setIsOpen(true);
          }}
          className="cursor-pointer"
        />
      ))}

      <Overlay
        role="Lightbox"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="center"
        dismissable
      >
        <Block className="relative">
          <img src={images[currentIndex]} className="max-h-screen" />

          <Block role="Toolbar" className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Action
              role="IconButton"
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft />
            </Action>
            <Action
              role="IconButton"
              onClick={() => setCurrentIndex(prev => Math.min(images.length - 1, prev + 1))}
              disabled={currentIndex === images.length - 1}
            >
              <ChevronRight />
            </Action>
          </Block>
        </Block>
      </Overlay>
    </>
  );
}
```

---

### 8. Floating (Persistent Overlay)

**용도**: 화면에 계속 떠있는 인터랙티브 요소

**특징**:
- No Backdrop
- 드래그 가능 (선택적)
- Minimize 가능
- Z-Index: 900

**Use Case**: 채팅 위젯, 비디오 플레이어, 헬프 버튼

```tsx
function ChatWidget() {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <Overlay
      role="Floating"
      placement="bottom-right"
      isOpen={true}
    >
      <Block role="Card" prominence="Strong" className="w-80">
        <Block role="Toolbar">
          <Text role="Title" prominence="Standard">Support Chat</Text>
          <Block role="Spacer" />
          <Action
            role="IconButton"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize />
          </Action>
        </Block>

        {!isMinimized && (
          <Block role="Stack">
            {/* Chat messages */}
            <Field label="Message" dataType="text" />
            <Action prominence="Strong" intent="Positive">Send</Action>
          </Block>
        )}
      </Block>
    </Overlay>
  );
}
```

---

## 🎨 Z-Index 계층 시스템

Overlay는 **z-index 계층**을 통해 겹침 순서를 관리합니다.

| Role | Z-Index | 우선순위 | Use Case |
|------|---------|----------|----------|
| **Toast** | 1100 | 최상위 | 항상 최상위에 표시 |
| **Dialog** | 1000 | 높음 | 모달 대화상자 |
| **Drawer** | 1000 | 높음 | 사이드 패널 |
| **Sheet** | 1000 | 높음 | Bottom sheet |
| **Lightbox** | 1000 | 높음 | 이미지 뷰어 |
| **ContextMenu** | 950 | 중간 | 컨텍스트 메뉴 |
| **Popover** | 900 | 중간 | 팝오버, 드롭다운 |
| **Floating** | 900 | 중간 | 채팅 위젯 |
| **Tooltip** | 800 | 최하위 | 툴팁 |

**규칙**:
1. Toast는 항상 최상위 (사용자에게 가장 중요한 피드백)
2. Dialog/Drawer는 다른 UI를 가림 (모달 동작)
3. Tooltip은 최하위 (방해하지 않음)

---

## 🗺️ Placement (위치 배치)

Overlay의 위치는 `placement` prop으로 제어합니다.

### Placement 옵션

| Placement | 설명 | Use Case |
|-----------|------|----------|
| `center` | 화면 중앙 | Dialog |
| `top` | 상단 중앙 | Toast (상단 알림) |
| `bottom` | 하단 중앙 | Sheet |
| `left` | 좌측 중앙 | Drawer (왼쪽) |
| `right` | 우측 중앙 | Drawer (오른쪽) |
| `top-left` | 좌상단 | Toast |
| `top-right` | 우상단 | Toast, Notification |
| `bottom-left` | 좌하단 | Chat Widget |
| `bottom-right` | 우하단 | Chat Widget |

```tsx
// 중앙 모달
<Overlay role="Dialog" placement="center">...</Overlay>

// 우상단 토스트
<Overlay role="Toast" placement="top-right">...</Overlay>

// 우측 드로어
<Overlay role="Drawer" placement="right" className="w-[400px]">...</Overlay>
```

---

## ♿ Accessibility (접근성)

### Focus Trap (포커스 가두기)

Dialog와 Drawer는 **Focus Trap**을 사용하여 탭 순환을 내부에만 제한합니다.

```tsx
<Overlay
  role="Dialog"
  isOpen={isOpen}
  onClose={handleClose}
  trapFocus  // Tab 키가 Dialog 내부에만 순환
  initialFocus={firstInputRef}  // 첫 포커스 요소
  restoreFocus  // 닫을 때 원래 요소로 포커스 복귀
>
  <Block role="Form">
    <Field label="Name" dataType="text" ref={firstInputRef} />
    <Field label="Email" dataType="email" />
    <Action>Submit</Action>
  </Block>
</Overlay>
```

---

### 키보드 탐색

| 키 | 동작 | Overlay Role |
|----|------|--------------|
| **Esc** | Overlay 닫기 | 모든 Overlay |
| **Tab** | 다음 포커스 요소 | Dialog, Drawer |
| **Shift+Tab** | 이전 포커스 요소 | Dialog, Drawer |
| **Arrow Keys** | 메뉴 아이템 탐색 | Popover, Menu |

---

### ARIA 속성 자동 적용

```tsx
// Dialog
<Overlay role="Dialog">...</Overlay>
// 자동 생성:
// role="dialog"
// aria-modal="true"
// aria-labelledby="dialog-title"

// Tooltip
<Overlay role="Tooltip">...</Overlay>
// 자동 생성:
// role="tooltip"
// aria-describedby="tooltip-content"
```

---

## 🎯 실전 패턴

### 1. 설정 Dialog

```tsx
function SettingsDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Action onClick={() => setIsOpen(true)}>Settings</Action>

      <Overlay
        role="Dialog"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="center"
        dismissable
      >
        <Block role="Card" prominence="Strong" className="max-w-2xl">
          <Block role="Toolbar">
            <Text role="Title" prominence="Strong">Settings</Text>
            <Block role="Spacer" />
            <Action role="IconButton" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </Action>
          </Block>

          <Block role="Tabs">
            <Action role="Tab" selected>Profile</Action>
            <Action role="Tab">Security</Action>
            <Action role="Tab">Notifications</Action>
          </Block>

          <Block role="Form">
            <Field label="Name" dataType="text" />
            <Field label="Email" dataType="email" />
            <Field label="Bio" dataType="textarea" />

            <Block role="Toolbar" className="justify-end">
              <Action prominence="Standard" onClick={() => setIsOpen(false)}>
                Cancel
              </Action>
              <Action prominence="Strong" intent="Positive">
                Save
              </Action>
            </Block>
          </Block>
        </Block>
      </Overlay>
    </>
  );
}
```

---

### 2. 필터 Drawer

```tsx
function ProductFilters() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Action onClick={() => setIsOpen(true)}>
        <Filter size={20} /> Filters
      </Action>

      <Overlay
        role="Drawer"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="left"
        dismissable
        className="w-80"
      >
        <Section role="Main">
          <Block role="Stack">
            <Block role="Toolbar">
              <Text role="Title" prominence="Strong">Filters</Text>
              <Block role="Spacer" />
              <Action role="IconButton" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </Action>
            </Block>

            <Block role="Fieldset">
              <Text role="Label">Category</Text>
              <Field role="Checkbox" label="Electronics" />
              <Field role="Checkbox" label="Clothing" />
              <Field role="Checkbox" label="Books" />
            </Block>

            <Block role="Fieldset">
              <Text role="Label">Price Range</Text>
              <Field role="Slider" spec={{ min: 0, max: 1000 }} />
            </Block>

            <Block role="Toolbar" className="justify-between">
              <Action prominence="Standard">Reset</Action>
              <Action prominence="Strong" intent="Positive">Apply</Action>
            </Block>
          </Block>
        </Section>
      </Overlay>
    </>
  );
}
```

---

### 3. Success Toast

```tsx
function SuccessToast({ message }: { message: string }) {
  return (
    <Overlay role="Toast" placement="top-right" isOpen={true}>
      <Block role="Card" prominence="Strong" intent="Positive">
        <Block role="Row" className="items-center">
          <CheckCircle size={20} />
          <Text role="Body">{message}</Text>
        </Block>
      </Block>
    </Overlay>
  );
}

// 사용 예시
function SaveButton() {
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    // Save logic...
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <Action onClick={handleSave} prominence="Strong" intent="Positive">
        Save
      </Action>
      {showToast && <SuccessToast message="Changes saved successfully!" />}
    </>
  );
}
```

---

## 🚫 자주 하는 실수

### 실수 1: Dialog에 dismissable 누락

```tsx
// ❌ BAD - 배경 클릭해도 안 닫힘
<Overlay role="Dialog" isOpen={isOpen}>
  ...
</Overlay>

// ✅ GOOD - dismissable 명시
<Overlay role="Dialog" isOpen={isOpen} dismissable onClose={handleClose}>
  ...
</Overlay>
```

**이유**: 사용자는 배경 클릭으로 Dialog를 닫을 수 있어야 함.

---

### 실수 2: Toast에 backdrop 사용

```tsx
// ❌ BAD - Toast에 backdrop은 부적절
<Overlay role="Toast" backdrop>
  ...
</Overlay>

// ✅ GOOD - Toast는 backdrop 없이
<Overlay role="Toast" placement="top-right">
  ...
</Overlay>
```

**이유**: Toast는 비차단적 알림으로 배경을 어둡게 하면 안 됨.

---

### 실수 3: Drawer에 너비 prop 사용

```tsx
// ❌ BAD - Drawer에 width prop은 없음
<Overlay role="Drawer" width={400}>
  ...
</Overlay>

// ✅ GOOD - className으로 너비 제어
<Overlay role="Drawer" className="w-[400px]">
  ...
</Overlay>
```

**이유**: 레이아웃은 Page가 className으로 제어.

---

### 실수 4: Tooltip에 긴 텍스트

```tsx
// ❌ BAD - Tooltip에 긴 설명
<Overlay role="Tooltip">
  <Text>This is a very long explanation that should be in a popover...</Text>
</Overlay>

// ✅ GOOD - 간결한 텍스트만
<Overlay role="Tooltip">
  <Text role="Caption" density="Compact">Open Settings</Text>
</Overlay>
```

**이유**: Tooltip은 간결한 힌트만, 긴 설명은 Popover 사용.

---

### 실수 5: z-index 직접 지정

```tsx
// ❌ BAD - z-index 직접 지정
<Overlay role="Dialog" className="z-[9999]">
  ...
</Overlay>

// ✅ GOOD - role이 자동으로 z-index 관리
<Overlay role="Dialog">
  ...
</Overlay>
```

**이유**: role에 따라 z-index가 자동 설정됨.

---

## 📝 실습: 프로필 편집 Dialog

### 요구사항

다음 요구사항을 만족하는 프로필 편집 Dialog를 만드세요:

1. **Dialog**:
   - Center 배치
   - Dismissable (배경 클릭 시 닫힘)
   - 최대 너비 500px

2. **구조**:
   - 제목: "Edit Profile" + 닫기 버튼
   - 폼 필드:
     - Name (text, required)
     - Email (email, required)
     - Bio (textarea)
   - 버튼:
     - "Cancel" (Standard)
     - "Save" (Strong, Positive)

### 정답 예시

```tsx
function ProfileDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Action onClick={() => setIsOpen(true)}>
        Edit Profile
      </Action>

      <Overlay
        role="Dialog"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="center"
        dismissable
      >
        <Block role="Card" prominence="Strong" className="max-w-md">
          {/* Header */}
          <Block role="Toolbar">
            <Text role="Title" prominence="Strong">
              Edit Profile
            </Text>
            <Block role="Spacer" />
            <Action role="IconButton" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </Action>
          </Block>

          {/* Form */}
          <Block role="Form">
            <Field label="Name" dataType="text" required />
            <Field label="Email" dataType="email" required />
            <Field label="Bio" dataType="textarea" />

            {/* Buttons */}
            <Block role="Toolbar" className="justify-end">
              <Action prominence="Standard" onClick={() => setIsOpen(false)}>
                Cancel
              </Action>
              <Action prominence="Strong" intent="Positive">
                Save
              </Action>
            </Block>
          </Block>
        </Block>
      </Overlay>
    </>
  );
}
```

**체크리스트**:
- [ ] Dialog role 사용?
- [ ] placement="center", dismissable?
- [ ] 최대 너비 500px?
- [ ] 닫기 버튼 (X icon)?
- [ ] 3개 필드 (Name, Email, Bio)?
- [ ] 버튼 2개 (Cancel, Save)?

---

## 💡 고급 기능

### 1. Animation

```tsx
<Overlay role="Drawer" animation="slide" duration={300}>
  ...
</Overlay>
```

---

### 2. Stack Management (여러 Overlay 중첩)

```tsx
// Dialog 1 (z-index: 1000)
<Overlay role="Dialog" isOpen={dialog1Open}>
  ...
  <Action onClick={() => setDialog2Open(true)}>Open Another</Action>
</Overlay>

// Dialog 2 (z-index: 1001, 자동 증가)
<Overlay role="Dialog" isOpen={dialog2Open}>
  ...
</Overlay>
```

---

### 3. Custom Backdrop

```tsx
<Overlay role="Dialog" backdropBlur backdropOpacity={0.8}>
  ...
</Overlay>
```

---

## ✅ 이 문서를 읽고 나면

- [x] Overlay의 역할을 이해했다
- [x] 8가지 OverlayRole을 파악했다
- [x] Z-Index 계층 시스템을 이해했다
- [x] Placement와 Positioning을 활용할 수 있다
- [x] 실전 패턴 (Dialog, Drawer, Toast)을 익혔다
- [x] Accessibility (Focus Trap, 키보드 탐색)를 이해했다

---

## 🔗 다음 단계

[폼 패턴](../../03-patterns/01-form.md) - 실전 폼 구현 패턴

---

**최종 업데이트**: 2026-01-11
**난이도**: 고급
**예상 소요 시간**: 30분
