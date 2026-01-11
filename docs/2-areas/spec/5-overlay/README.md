# 5-overlay: Overlay 컴포넌트 스펙

Overlay는 **메인 콘텐츠 위에 떠있는 UI 요소**로, 모달, 팝오버, 툴팁 등 floating UI를 담당합니다.

## 📄 스펙 문서

> **현재 작성 중**: Overlay 컴포넌트의 공식 스펙 문서를 작성해야 합니다.

계획된 문서:
- `overlay.spec.md` - Overlay 컴포넌트 공식 스펙
- `overlay-roles-catalog.md` - OverlayRole 카탈로그

## 🎯 OverlayRole 타입 (예상)

| Role | Z-Index | 모달 배경 | 용도 |
|------|---------|----------|------|
| **Dialog** | 1000 | ✅ | 모달 대화상자 (설정, 확인) |
| **Drawer** | 1000 | ✅ | 사이드 패널 (메뉴, 상세 정보) |
| **Popover** | 900 | ❌ | 팝오버 (추가 정보, 액션) |
| **Toast** | 1100 | ❌ | 알림 토스트 (성공, 에러) |
| **Tooltip** | 800 | ❌ | 툴팁 (도움말) |
| **ContextMenu** | 950 | ❌ | 컨텍스트 메뉴 (우클릭 메뉴) |
| **Dropdown** | 900 | ❌ | 드롭다운 메뉴 (셀렉트 옵션) |

## 🔧 주요 기능 (예상)

### 1. Position System

```tsx
<Overlay
  role="Popover"
  anchor={anchorRef}
  position="bottom-start"
  offset={8}
>
  Content
</Overlay>
```

**Position 옵션**:
- `top`, `top-start`, `top-end`
- `bottom`, `bottom-start`, `bottom-end`
- `left`, `left-start`, `left-end`
- `right`, `right-start`, `right-end`

### 2. Modal 배경 (Backdrop)

```tsx
<Overlay
  role="Dialog"
  backdrop
  backdropBlur
  backdropDismiss  // 배경 클릭 시 닫기
>
  Dialog Content
</Overlay>
```

### 3. 애니메이션

```tsx
<Overlay
  role="Toast"
  animation="fade"
  duration={3000}  // 자동 닫기
>
  Success! Changes saved.
</Overlay>
```

**Animation 옵션**:
- `fade` - 페이드 인/아웃
- `slide` - 슬라이드 (방향별)
- `scale` - 스케일 애니메이션
- `none` - 애니메이션 없음

### 4. 포커스 트랩 (Focus Trap)

```tsx
<Overlay
  role="Dialog"
  trapFocus
  initialFocus={firstInputRef}
  restoreFocus  // 닫을 때 원래 요소로 포커스 복귀
>
  Dialog Content
</Overlay>
```

## 💡 사용 예시

### Dialog (모달)

```tsx
<Overlay
  role="Dialog"
  open={isOpen}
  onClose={handleClose}
  backdrop
  backdropDismiss
  trapFocus
>
  <Block role="Card">
    <Text role="Title">Confirm Delete</Text>
    <Text role="Body">Are you sure you want to delete this item?</Text>

    <Block role="Toolbar">
      <Action prominence="Secondary" onClick={handleClose}>
        Cancel
      </Action>
      <Action prominence="Primary" intent="Critical" onClick={handleDelete}>
        Delete
      </Action>
    </Block>
  </Block>
</Overlay>
```

### Drawer (사이드 패널)

```tsx
<Overlay
  role="Drawer"
  open={isOpen}
  onClose={handleClose}
  position="right"
  width={400}
  backdrop
  animation="slide"
>
  <Section role="Container">
    {/* Drawer 콘텐츠 */}
  </Section>
</Overlay>
```

### Popover

```tsx
<Overlay
  role="Popover"
  anchor={buttonRef}
  position="bottom-start"
  offset={8}
>
  <Block role="Card">
    <Text role="Body">Additional information</Text>
  </Block>
</Overlay>
```

### Toast

```tsx
<Overlay
  role="Toast"
  position="top-center"
  duration={3000}
  intent="Positive"
  animation="slide"
>
  <Text role="Alert" intent="Positive">
    Changes saved successfully!
  </Text>
</Overlay>
```

### Tooltip

```tsx
<Overlay
  role="Tooltip"
  anchor={iconRef}
  position="top"
  offset={4}
>
  <Text role="Body" density="Compact">
    Click to open settings
  </Text>
</Overlay>
```

## 🎨 Z-Index Hierarchy

| Role | Z-Index | 용도 |
|------|---------|------|
| Tooltip | 800 | 툴팁 (최하위) |
| Popover | 900 | 팝오버, 드롭다운 |
| ContextMenu | 950 | 컨텍스트 메뉴 |
| Dialog/Drawer | 1000 | 모달 대화상자 |
| Toast | 1100 | 알림 (최상위) |

## ♿ Accessibility

### 키보드 탐색
- **Esc**: Overlay 닫기
- **Tab**: 포커스 순환 (Dialog/Drawer)
- **Arrow Keys**: 메뉴 아이템 탐색 (ContextMenu, Dropdown)

### ARIA 속성
- `role="dialog"`: Dialog
- `role="menu"`: ContextMenu, Dropdown
- `role="tooltip"`: Tooltip
- `aria-modal="true"`: 모달 대화상자
- `aria-labelledby`: 제목 참조
- `aria-describedby`: 설명 참조

## 🚧 현재 상태

**구현 상태**:
- ✅ Dialog 구현됨 (SettingsModal, SearchModal)
- ✅ Tooltip 구현됨
- ⚠️ Drawer 구현 필요
- ⚠️ Toast 시스템 구현 필요
- ⚠️ ContextMenu 구현 필요
- ⚠️ Popover 구현 필요
- ⚠️ 공식 스펙 문서 필요

**다음 작업**:
1. `overlay.spec.md` 작성 - 공식 스펙 정의
2. OverlayRole 별 상세 가이드 작성
3. Positioning system 표준화
4. Animation system 통합
5. Focus trap 구현 개선

## 🔗 관련 문서

- [../0-core/](../0-core/) - IDDL 핵심 스펙
- [../1-page/](../1-page/) - Page 컴포넌트 스펙
- [../4-element/](../4-element/) - Element 컴포넌트 스펙

## 📍 구현 위치

- **Component**: `src/components/types/Overlay/Overlay.tsx`
- **Dialogs**: `src/components/types/Overlay/SettingsModal.tsx`, `SearchModal.tsx`
- **Roles**: `src/components/types/Overlay/role/`

---

**최종 업데이트**: 2026-01-11
**IDDL 버전**: 1.0
**상태**: 🚧 일부 구현 완료, 스펙 문서 작성 필요
