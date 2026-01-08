# 디자인 원칙 위반 사항 보고서

**검토 일자**: 2026-01-08
**검토 범위**: `src/components/` 전체
**검토 기준**: `docs/DESIGN_PRINCIPLES.md`

---

## 요약

총 **33개의 위반 사항**을 발견했습니다.

| 심각도 | 개수 | 설명 |
|--------|------|------|
| 🔴 ERROR | 12 | 즉시 수정 필요 (디자인 원칙 위반) |
| ⚠️ WARNING | 21 | 검토 및 개선 권장 |

---

## 🔴 ERROR: 즉시 수정 필요

### 1. Border + Background 동시 사용

**원칙**: Part 3.3 - border와 background를 동시에 사용하는 것은 outline variant를 제외하고 금지

#### 위반 사항:

**`src/components/presentation/FormatSidebar.tsx:14`**
```tsx
// ❌ 잘못됨
className="flex w-56 flex-col overflow-hidden border-l border-border bg-layer-2-cool"

// ✅ 올바른 방법
className="flex w-56 flex-col overflow-hidden bg-layer-2"
// 구분은 배경색 차이로만 표현
```

---

### 2. 정의되지 않은 토큰 사용

**원칙**: 모든 디자인 값은 `src/design-system/tokens.ts`에 정의된 것만 사용

#### 위반 사항:

**`src/components/chat/AIAgentChat.tsx:63`**
```tsx
// ❌ 'bg-layer-2-neutral', 'boundary-shadow-left' 토큰이 정의되지 않음
className="flex w-96 flex-col overflow-hidden bg-layer-2-neutral boundary-shadow-left"

// ✅ 올바른 방법
className="flex w-96 flex-col overflow-hidden bg-layer-2"
```

**`src/components/presentation/SlideList.tsx:32`**
```tsx
// ❌ 'bg-layer-2-cool' 토큰이 정의되지 않음
className="flex w-48 flex-col overflow-hidden bg-layer-2-cool boundary-shadow-left"

// ✅ 올바른 방법
className="flex w-48 flex-col overflow-hidden bg-layer-2"
```

**`src/components/ui/DataTable.tsx:67`**
```tsx
// ❌ 'accent-primary' 토큰이 정의되지 않음
className="... focus:ring-accent-primary ..."

// ✅ 올바른 방법
className="... focus:ring-accent ..."
```

**`src/components/ui/DataTable.tsx:79,105,107,140`**
```tsx
// ❌ 'bg-layer-2-cool', 'text-accent-primary' 토큰이 정의되지 않음
className="bg-layer-2-cool"
className="text-accent-primary"

// ✅ 올바른 방법
className="bg-layer-2"
className="text-accent"
```

---

### 3. 인라인 스타일로 그림자 직접 지정

**원칙**: Part 4 - 그림자는 Layer 컴포넌트의 level prop을 통해서만 지정해야 함

#### 위반 사항:

**`src/components/ui/TopToolbar.tsx:51`**
```tsx
// ❌ 인라인 스타일 사용
<Layer level={4} className="..." style={{ boxShadow: 'var(--elevation-1)' }}>

// ✅ 올바른 방법
<Layer level={4} className="...">
// Layer 컴포넌트가 자동으로 shadow-layer-4를 적용
```

**`src/components/ui/TopToolbar.tsx:69,95,124,149`**
```tsx
// ❌ 드롭다운에 인라인 그림자
style={{ boxShadow: 'var(--elevation-2)' }}

// ✅ 올바른 방법
// Layer level={5}가 이미 shadow-layer-5를 적용하므로 style 불필요
<Layer level={5} rounded="lg" className="...">
```

**`src/components/ui/BottomPanel.tsx:46`**
```tsx
// ❌ 인라인 스타일 사용
style={{ height: `${height}px`, boxShadow: 'var(--elevation-1)' }}

// ✅ 올바른 방법
style={{ height: `${height}px` }}
// Layer level={1}이 이미 shadow-layer-1을 적용
```

**`src/components/modal/SearchModal.tsx:118`**
```tsx
// ❌ 인라인 스타일 사용
style={{ boxShadow: 'var(--elevation-3)' }}

// ✅ 올바른 방법
// Layer level={6}이 이미 shadow-layer-6를 적용하므로 불필요
```

---

### 4. 비표준 아이콘 크기 사용

**원칙**: Part 7.2 - 아이콘 크기는 16/20/24px만 허용

#### 위반 사항:

**`src/components/ui/TopToolbar.tsx:61,87,116`**
```tsx
// ❌ 18px 사용
<MenuIcon size={18} />
<ChevronDownIcon size={14} />

// ✅ 올바른 방법
<MenuIcon size={16} /> // 또는 size={20}
<ChevronDownIcon size={16} />
```

**`src/components/editor/EditorTabs.tsx:28,76`**
```tsx
// ❌ 14px, 12px 사용
<FileCode size={14} />
<X size={12} />

// ✅ 올바른 방법
<FileCode size={16} />
<X size={16} />
```

**`src/components/chat/AIAgentChat.tsx:73,129`**
```tsx
// ❌ 12px, 14px 사용
<Code size={12} />
<Send size={14} />

// ✅ 올바른 방법
<Code size={16} />
<Send size={16} />
```

**`src/components/presentation/SlideList.tsx:92`**
```tsx
// ❌ 10px 사용
<Trash2 size={10} />

// ✅ 올바른 방법
<Trash2 size={16} />
```

---

## ⚠️ WARNING: 검토 및 개선 권장

### 1. Accent 색상 과다 사용

**원칙**: Part 5.3 - 화면당 accent 색상은 1-2개소만 사용 (Primary CTA, 선택 상태, 포커스만)

#### 의심 사항:

**`src/components/ui/TopToolbar.tsx:312`**
```tsx
// ⚠️ 장식용 accent 사용
<span className="text-accent">▶</span>

// 제안: 이것이 현재 실행 중인 항목을 나타내는 의미적 표시라면 허용
// 단순 장식이라면 text-text-primary로 변경
```

**`src/components/ui/BottomPanel.tsx:72,111,117`**
```tsx
// ⚠️ 여러 곳에 accent 사용
'bg-accent text-white'  // 카운트 뱃지
<span className="text-accent">user@macbook</span>
<span className="text-accent">$</span>

// 제안: 터미널 프롬프트는 의미적 사용이므로 허용 가능
// 하지만 전체 화면에서 accent 개수 확인 필요
```

**`src/components/file-tree/FileTree.tsx:43,96`**
```tsx
// ⚠️ 여러 아이콘에 accent 사용
<FileText {...iconProps} className="text-accent" />  // 마크다운
<FolderOpen size={16} className="text-accent" />     // 열린 폴더

// 제안: 아이콘 강조는 선택 상태나 특별한 의미가 있을 때만
// 단순 파일 타입 구분이라면 text-tertiary 사용
```

**`src/components/editor/EditorTabs.tsx:70`**
```tsx
// ⚠️ Dirty indicator에 accent 사용
<span className="w-1.5 h-1.5 rounded-full bg-accent" />

// 제안: 의미적 표시이므로 허용 가능하지만,
// semantic.warning 색상 사용도 고려
```

**`src/components/chat/AIAgentChat.tsx:66,96,127`**
```tsx
// ⚠️ 한 컴포넌트 내 여러 accent 사용
<Sparkles size={16} className="text-accent" />  // 헤더 아이콘
'bg-accent/10': message.role === 'user',        // 메시지 배경
className="bg-accent text-white hover:bg-accent-hover"  // 전송 버튼

// 제안: 전송 버튼만 accent 유지, 나머지는 제거
```

**`src/components/modal/SettingsModal.tsx:241`**
```tsx
// ⚠️ 선택된 카테고리에 accent 사용
'bg-accent/10 text-accent': activeCategory === category.id,

// 제안: 선택 상태 표시는 허용되지만,
// 같은 화면에 "Apply" 버튼도 accent이므로 총 개수 확인 필요
```

**`src/components/modal/SearchModal.tsx:96,98,151`**
```tsx
// ⚠️ 여러 곳에 accent 사용
<Folder {...iconProps} className="text-accent" />
<Command {...iconProps} className="text-accent" />
'bg-accent/10': index === selectedIndex,

// 제안: 선택된 항목 배경만 accent 유지
```

**`src/components/ui/ThemeSwitcher.tsx:92,108,131,158`**
```tsx
// ⚠️ 한 화면에서 여러 선택 항목이 accent 사용 가능
'bg-accent text-text-inverse': config.theme === 'light',
'bg-accent text-text-inverse': config.theme === 'dark',
'bg-accent text-text-inverse': config.colorScheme === scheme.value,
'bg-accent text-text-inverse': config.density === density.value,

// 제안: 설정 UI이므로 여러 선택 상태 표시 필요
// 하지만 accent/10 (subtle) 사용 검토
```

**`src/components/presentation/SlideList.tsx:52`**
```tsx
// ⚠️ 선택된 슬라이드에 accent ring
'ring-1 ring-accent': activeSlideId === slide.id,

// 제안: 선택 상태 표시이므로 허용
```

**`src/components/ui/FloatingBar.tsx:63`**
```tsx
// ⚠️ 선택된 앱에 accent 배경
"bg-accent/10"

// 제안: 선택 상태 표시이므로 허용
```

---

### 2. Border 사용 검토

**원칙**: Part 3 - 선은 최소한으로, 허용된 케이스만 사용

#### 검토 필요:

**`src/components/ui/TopToolbar.tsx:103,176`**
```tsx
// ⚠️ Divider로 사용
<div className="h-6 w-px bg-border" />

// 참고: Part 3.2에서 "의미적 구분"은 허용됨
// 현재 사용은 적절하지만 주석으로 예외 문서화 필요
```

**`src/components/ui/BottomPanel.tsx:246,282,316,334`**
```tsx
// ⚠️ 섹션 구분선
<div className="h-px bg-border my-1" />

// 참고: 의미적 구분이므로 허용되지만 문서화 필요
```

**`src/components/presentation/SlideCanvas.tsx:42`**
```tsx
// ⚠️ 제목 하단 구분선
border-b border-text-primary/10

// 참고: 허용되지만 Layer 차이로 대체 가능한지 검토
```

**`src/components/presentation/SlideCanvas.tsx:56,59`**
```tsx
// ⚠️ Placeholder 박스에 dashed border
border border-dashed border-text-secondary/20

// 참고: Placeholder 표시이므로 허용 가능
```

---

### 3. 예외 문서화 누락

**원칙**: Part 15 - 디자인 원칙에서 벗어나는 모든 경우 인라인 주석으로 이유 설명 필수

#### 문서화 필요:

위의 모든 WARNING 항목들은 허용될 수 있는 예외 케이스이지만, 다음 형식으로 문서화가 필요합니다:

```tsx
// EXCEPTION: [X 대신 Y를 사용]
// 이유: [구체적 이유]
// 참고: DESIGN_PRINCIPLES.md Part X.X
```

---

## 수정 우선순위

### High Priority (즉시 수정)

1. **정의되지 않은 토큰 제거** - `bg-layer-2-cool`, `accent-primary` 등
2. **인라인 스타일 그림자 제거** - Layer 컴포넌트가 자동으로 처리
3. **Border + Background 동시 사용 제거** - FormatSidebar
4. **비표준 아이콘 크기 수정** - 16/20/24px만 사용

### Medium Priority (개선 권장)

1. **Accent 색상 사용 최적화** - 화면당 1-2개로 줄이기
2. **예외 케이스 문서화** - 모든 border 사용에 주석 추가

### Low Priority (리팩토링 시 고려)

1. **Border를 Layer 차이로 대체** - 가능한 경우
2. **일관성 검토** - 비슷한 패턴의 컴포넌트들 간 통일

---

## 참고사항

### 정의된 토큰 (tokens.ts)

사용 가능한 토큰:
- **색상**: `accent`, `layer.{0-5}`, `text.{primary,secondary,tertiary,inverse}`, `border`, `semantic.{success,warning,error,info}`
- **그림자**: `shadow.{0-4}`
- **간격**: `spacing.{1,2,3,4,6,8,12,16,24}` (4,8,12,16,24,32,48,64,96px)
- **아이콘**: `iconSize.{sm:16, md:20, lg:24}`
- **폰트**: `fontWeight.{regular:400, medium:500, semibold:600}`

### 정의되지 않은 토큰 (사용 불가)

- `bg-layer-2-cool` ❌
- `bg-layer-2-neutral` ❌
- `boundary-shadow-left` ❌
- `accent-primary` ❌
- `layer-{n}-interactive` ⚠️ (Tailwind config에 정의 필요 확인)

---

## 다음 단계

1. ✅ 보고서 작성 완료
2. ⏳ ERROR 항목 수정
3. ⏳ WARNING 항목 검토 및 문서화
4. ⏳ 수정 완료 후 재검토
