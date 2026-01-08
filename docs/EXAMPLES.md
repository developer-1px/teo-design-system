# Design System Examples

> 디자인 원칙이 실제 코드에서 어떻게 적용되는지 보여주는 예제 모음

## 📋 목차

1. [Layer System 예제](#1-layer-system-예제)
2. [Button 조합 예제](#2-button-조합-예제)
3. [Form 예제](#3-form-예제)
4. [Card 예제](#4-card-예제)
5. [Navigation 예제](#5-navigation-예제)
6. [Modal 예제](#6-modal-예제)
7. [Before/After 비교](#7-beforeafter-비교)

---

## 1. Layer System 예제

### 기본 Panel + Input

```tsx
import { Layer } from '@/components/ui/layer';

function SettingsPanel() {
  return (
    <Layer level={2} className="w-80 p-4">
      {/* Surface layer - 패널 */}
      <h2 className="text-base font-semibold mb-4">설정</h2>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-text-secondary mb-1 block">
            사용자 이름
          </label>
          {/* Sunken layer - 인풋 */}
          <Layer level={1} rounded className="p-2">
            <input
              type="text"
              className="w-full bg-transparent border-none outline-none text-sm"
              placeholder="이름을 입력하세요"
            />
          </Layer>
        </div>
      </div>
    </Layer>
  );
}
```

**원칙 적용:**
- ✅ Layer 2 (패널) → Layer 1 (인풋) 순서로 중첩
- ✅ 선(border) 없이 배경색 차이로 구분
- ✅ 표준 간격 사용 (12px = space-y-3, 8px = p-2)

---

## 2. Button 조합 예제

### Dialog 액션 버튼

```tsx
import { Button } from '@/components/ui/button';

function DialogActions() {
  return (
    <div className="flex justify-end gap-2 mt-6">
      {/* Secondary action - ghost */}
      <Button variant="ghost" onClick={onCancel}>
        취소
      </Button>

      {/* Primary action - accent (화면당 1개만) */}
      <Button variant="accent" onClick={onSave}>
        저장
      </Button>
    </div>
  );
}
```

### 위험한 액션

```tsx
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

function DeleteAction() {
  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-text-secondary">
        이 작업은 되돌릴 수 없습니다
      </p>

      {/* Dangerous action - outline */}
      <Button variant="outline" onClick={onDelete}>
        <Trash2 size={16} className="mr-2" />
        삭제
      </Button>
    </div>
  );
}
```

**원칙 적용:**
- ✅ accent variant는 화면당 1개만
- ✅ 버튼에 그림자 없음
- ✅ outline variant는 위험한 액션에만
- ✅ 아이콘 크기 16px (인라인)

---

## 3. Form 예제

### 로그인 폼

```tsx
import { Layer } from '@/components/ui/layer';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function LoginForm() {
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <Layer level={3} className="w-96 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-6">로그인</h2>

      <form className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="text-xs text-text-secondary mb-1 block">
            이메일
          </label>
          <Layer
            level={1}
            rounded
            className={cn(
              'transition-all',
              focused === 'email'
                ? 'ring-2 ring-accent' // Focus 상태 - accent border
                : 'ring-0'
            )}
          >
            <input
              type="email"
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              className="w-full bg-transparent px-3 py-2 outline-none text-sm"
            />
          </Layer>
        </div>

        {/* Password Field */}
        <div>
          <label className="text-xs text-text-secondary mb-1 block">
            비밀번호
          </label>
          <Layer
            level={1}
            rounded
            className={cn(
              'transition-all',
              focused === 'password'
                ? 'ring-2 ring-accent'
                : 'ring-0'
            )}
          >
            <input
              type="password"
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              className="w-full bg-transparent px-3 py-2 outline-none text-sm"
            />
          </Layer>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            className="text-sm text-text-tertiary hover:text-text-primary"
          >
            비밀번호 찾기
          </button>
          <Button variant="accent" type="submit">
            로그인
          </Button>
        </div>
      </form>
    </Layer>
  );
}
```

**원칙 적용:**
- ✅ Focus 상태: accent 색상 ring 사용
- ✅ Layer 3 (카드) → Layer 1 (인풋)
- ✅ accent는 CTA 버튼 1개만
- ✅ 표준 간격: 16px (p-4), 24px (mt-6)

---

## 4. Card 예제

### File Card with Hover

```tsx
import { Layer } from '@/components/ui/layer';
import { File, MoreVertical } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { useState } from 'react';

function FileCard({ file }: { file: { name: string; size: string } }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Layer
      level={isHovered ? 3 : 2} // Hover 시 level 상승
      rounded
      className="p-4 transition-all cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-layer-1 rounded">
            <File size={20} className="text-text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-medium">{file.name}</h3>
            <p className="text-xs text-text-tertiary mt-1">{file.size}</p>
          </div>
        </div>

        {isHovered && (
          <IconButton size="sm" title="More options">
            <MoreVertical size={16} />
          </IconButton>
        )}
      </div>
    </Layer>
  );
}
```

**원칙 적용:**
- ✅ 호버 시 Layer level 상승 (shadow 변화)
- ✅ 선 없이 Layer만으로 구분
- ✅ 아이콘 크기: 20px (메뉴), 16px (인라인)
- ✅ 표준 간격: 12px (gap-3), 16px (p-4)

---

## 5. Navigation 예제

### Sidebar Navigation

```tsx
import { Layer } from '@/components/ui/layer';
import { IconButton } from '@/components/ui/icon-button';
import { Files, Search, GitBranch, Settings } from 'lucide-react';
import { useState } from 'react';

function SidebarNav() {
  const [active, setActive] = useState('files');

  const items = [
    { id: 'files', icon: Files, label: '파일' },
    { id: 'search', icon: Search, label: '검색' },
    { id: 'git', icon: GitBranch, label: 'Git' },
    { id: 'settings', icon: Settings, label: '설정' },
  ];

  return (
    <Layer level={2} className="w-12 flex flex-col items-center py-2 gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <IconButton
            key={item.id}
            size="md"
            active={active === item.id}
            onClick={() => setActive(item.id)}
            title={item.label}
          >
            <Icon size={20} />
          </IconButton>
        );
      })}
    </Layer>
  );
}
```

**원칙 적용:**
- ✅ 아이콘만 사용 가능한 케이스 (title prop 제공)
- ✅ active 상태: accent 색상 indicator
- ✅ 표준 아이콘 크기: 20px
- ✅ Layer 2 사용 (사이드바)

---

## 6. Modal 예제

### Confirmation Modal

```tsx
import { Layer } from '@/components/ui/layer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';

function ConfirmModal({ onClose, onConfirm }: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-layer-5" onClick={onClose} />

      {/* Modal */}
      <Layer
        level={5}
        rounded
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 p-6 z-layer-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">삭제 확인</h2>
            <p className="text-sm text-text-secondary mt-1">
              이 작업은 되돌릴 수 없습니다
            </p>
          </div>
          <IconButton size="sm" onClick={onClose} title="닫기">
            <X size={16} />
          </IconButton>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-sm">
            정말로 이 파일을 삭제하시겠습니까?
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button variant="outline" onClick={onConfirm}>
            삭제
          </Button>
        </div>
      </Layer>
    </>
  );
}
```

**원칙 적용:**
- ✅ Layer 5 (최상위 모달)
- ✅ 위험한 액션: outline variant
- ✅ 닫기 버튼: 아이콘만 허용 (title 제공)
- ✅ Backdrop: 50% 투명도
- ✅ 표준 간격: 24px (mb-6), 8px (gap-2)

---

## 7. Before/After 비교

### ❌ Before - 디자인 원칙 위반

```tsx
function BadExample() {
  return (
    // ❌ border + background 동시 사용
    <div className="bg-white border border-gray-200 shadow-lg p-4">
      <h2 className="text-2xl font-bold text-accent mb-4">
        {/* ❌ accent를 장식용으로 사용 */}
        제목
      </h2>

      <div className="flex gap-2">
        {/* ❌ accent 버튼 중복 */}
        <button className="bg-accent text-white px-4 py-2 shadow-md rounded">
          저장
        </button>
        <button className="bg-accent text-white px-4 py-2 shadow-md rounded">
          발행
        </button>
      </div>

      {/* ❌ 비표준 간격 */}
      <div style={{ marginTop: '15px' }}>
        {/* ❌ 클릭 가능하지만 키보드 접근성 없음 */}
        <div onClick={handleClick} className="cursor-pointer outline-none">
          클릭하세요
        </div>
      </div>
    </div>
  );
}
```

### ✅ After - 디자인 원칙 준수

```tsx
import { Layer } from '@/components/ui/layer';
import { Button } from '@/components/ui/button';

function GoodExample() {
  return (
    // ✅ Layer로 깊이 표현, border 없음
    <Layer level={3} rounded className="p-4">
      {/* ✅ 장식 없는 제목 */}
      <h2 className="text-xl font-semibold mb-4">
        제목
      </h2>

      {/* ✅ 표준 간격 (8px) */}
      <div className="flex gap-2 justify-end">
        {/* ✅ ghost variant (secondary) */}
        <Button variant="ghost" onClick={onSave}>
          저장
        </Button>
        {/* ✅ accent variant (primary, 1개만) */}
        <Button variant="accent" onClick={onPublish}>
          발행
        </Button>
      </div>

      {/* ✅ 표준 간격 (16px) */}
      <div className="mt-4">
        {/* ✅ 키보드 접근성 + 포커스 스타일 */}
        <button
          onClick={handleClick}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
          className="focus-visible:ring-2 focus-visible:ring-accent rounded px-3 py-2"
        >
          클릭하세요
        </button>
      </div>
    </Layer>
  );
}
```

**개선 사항:**
1. ✅ border 제거 → Layer로 깊이 표현
2. ✅ 그림자 제거 → Layer shadow 자동 적용
3. ✅ accent 색상 1개로 제한
4. ✅ 표준 간격 사용 (4, 8, 16)
5. ✅ 키보드 접근성 추가
6. ✅ 포커스 스타일 추가

---

## 🎯 실전 팁

### 1. 영역 구분이 필요할 때

```tsx
// ❌ 나쁜 방법 - 선 사용
<div className="border-b pb-4 mb-4">
  <Section1 />
</div>
<div>
  <Section2 />
</div>

// ✅ 좋은 방법 - Layer 차이
<Layer level={2} className="pb-4 mb-4">
  <Section1 />
</Layer>
<Layer level={1} className="pt-4">
  <Section2 />
</Layer>
```

### 2. 요소를 강조해야 할 때

```tsx
// ❌ 나쁜 방법 - accent 남용
<div className="text-accent font-bold">강조</div>

// ✅ 좋은 방법 - weight 변화
<div className="font-semibold">강조</div>

// ✅ 또는 Layer 변화
<Layer level={3} className="p-2">
  <div>강조</div>
</Layer>
```

### 3. 리스트 아이템 구분

```tsx
// ❌ 나쁜 방법 - 모든 아이템에 border
{items.map(item => (
  <div key={item.id} className="border-b py-2">
    {item.name}
  </div>
))}

// ✅ 좋은 방법 - gap 또는 배경색 교차
<div className="space-y-2">
  {items.map(item => (
    <div key={item.id} className="hover:bg-layer-1 p-2 rounded">
      {item.name}
    </div>
  ))}
</div>
```

---

## 📝 체크리스트

새 컴포넌트를 만들 때 이 체크리스트를 사용하세요:

- [ ] Layer 시스템 사용 (border 대신)
- [ ] accent는 1-2개소만
- [ ] 표준 간격만 사용 (4,8,12,16,24,32,48,64,96)
- [ ] 버튼에 그림자 없음
- [ ] 아이콘 크기 표준 (16/20/24)
- [ ] 키보드 접근성 (tabIndex, onKeyDown)
- [ ] 포커스 스타일 (ring-accent)
- [ ] font-weight 400/500/600만 사용

더 자세한 내용은 [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md)를 참조하세요.
