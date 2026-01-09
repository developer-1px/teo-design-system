# Headless Hook 구현 현황 및 로드맵

> **작성일**: 2026-01-10
> **버전**: IDDL v2.0.0
> **상태**: In Progress

## 📋 개요

### Headless Hook 패턴이란?

**Headless Hook 패턴**은 UI 로직(상태 관리, 이벤트 핸들링, 검증)을 프레젠테이션(렌더링)과 완전히 분리하는 React 디자인 패턴입니다.

```tsx
// ❌ Before: 로직과 프레젠테이션이 혼재
function TextField({ label, value, onChange }) {
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length < 3) {
      setError('Minimum 3 characters');
    }
    onChange(newValue);
  };

  return (
    <div>
      <label>{label}</label>
      <input value={value} onChange={handleChange} onBlur={() => setTouched(true)} />
      {touched && error && <span>{error}</span>}
    </div>
  );
}

// ✅ After: 로직과 프레젠테이션 분리
// Hook: 로직만 담당
function useTextField({ value, required, minLength, onChange }) {
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  const validate = (val) => {
    if (required && !val) return 'Required';
    if (minLength && val.length < minLength) return `Min ${minLength} chars`;
    return null;
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setError(touched ? validate(newValue) : null);
    onChange(newValue);
  };

  return {
    value,
    error,
    getInputProps: () => ({
      value,
      onChange: handleChange,
      onBlur: () => setTouched(true),
      'aria-invalid': !!error,
    }),
  };
}

// Renderer: 프레젠테이션만 담당
function TextField({ label, ...options }) {
  const field = useTextField(options);

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <input {...field.getInputProps()} className={styles.input} />
      {field.error && <span className={styles.error}>{field.error}</span>}
    </div>
  );
}
```

### 장점

1. **재사용성**: 같은 로직을 여러 디자인에 적용 가능
2. **테스트 용이성**: 로직과 UI를 독립적으로 테스트
3. **유지보수성**: 로직 변경이 UI에 영향 없음
4. **타입 안전성**: TypeScript 타입 추론 개선
5. **접근성**: ARIA props를 자동으로 생성

### IDDL v2.0.0의 핵심 아키텍처

```
┌─────────────────────────────────────────┐
│ IDDL Component (Field, Group, Overlay)  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Headless Hook (Logic)           │   │
│  │ - State management              │   │
│  │ - Event handlers                │   │
│  │ - Validation                    │   │
│  │ - Accessibility (ARIA)          │   │
│  │ - Keyboard navigation           │   │
│  └─────────────────────────────────┘   │
│           ↓ Props Getter                │
│  ┌─────────────────────────────────┐   │
│  │ Renderer (Presentation)         │   │
│  │ - CVA styles                    │   │
│  │ - Design tokens                 │   │
│  │ - HTML structure                │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## ✅ 현재 구현된 Hooks

### 1. Keyboard 관련 (`src/shared/lib/keyboard/`)

#### `useNavigableCursor`
- **목적**: 리스트/테이블/그리드 키보드 네비게이션
- **파일**: `src/shared/lib/keyboard/useNavigableCursor.ts`
- **완성도**: ✅ 완료
- **기능**:
  - Arrow 키로 커서 이동 (Up/Down/Left/Right)
  - Home/End로 첫/마지막 이동
  - Enter/Space로 선택
  - Vertical/Horizontal 방향 지원
  - Loop 모드 지원
  - `getItemProps()` - 아이템별 props 자동 생성
- **사용처**:
  - `DataTable.tsx`: 테이블 행 네비게이션
  - `SearchModal.tsx`: 검색 결과 네비게이션
  - `SlideList.tsx`: 슬라이드 목록 네비게이션

**예제**:
```tsx
const { cursorIndex, getItemProps } = useNavigableCursor({
  type: 'list',
  items: users,
  onSelect: (user) => console.log('Selected:', user),
});

return users.map((user, index) => (
  <div {...getItemProps(index)} data-cursor={index === cursorIndex}>
    {user.name}
  </div>
));
```

---

#### `useTreeNavigation`
- **목적**: 트리 구조 전용 키보드 네비게이션
- **파일**: `src/shared/lib/keyboard/useTreeNavigation.ts`
- **완성도**: ✅ 완료
- **기능**:
  - Arrow Up/Down: 노드 이동
  - Arrow Right: 폴더 펼치기 또는 첫 자식으로 이동
  - Arrow Left: 폴더 접기 또는 부모로 이동
  - Enter/Space: 폴더 토글 또는 파일 선택
  - Home/End: 첫/마지막 노드로 이동
  - 플랫한 노드 리스트 자동 생성 (열린 노드만)
- **사용처**:
  - `FileTree.tsx`: 파일 탐색기
  - `TreeView.tsx`: DSL Builder 트리뷰

**예제**:
```tsx
const { flatNodes, getNodeProps, toggleFolder } = useTreeNavigation({
  data: fileTree,
  defaultOpenIds: ['src', 'components'],
  onFileSelect: (node) => openFile(node.id),
});

return flatNodes.map((node, index) => (
  <div {...getNodeProps(index)} style={{ paddingLeft: node.level * 16 }}>
    {node.type === 'folder' ? <FolderIcon /> : <FileIcon />}
    {node.name}
  </div>
));
```

---

#### `useFocusScope`
- **목적**: 모달, 패널에서 포커스 트랩 및 복원
- **파일**: `src/shared/lib/keyboard/useFocusScope.ts`
- **완성도**: ✅ 완료
- **기능**:
  - 포커스 가두기 (contain)
  - 자동 포커스 (autoFocus)
  - 포커스 복원 (restoreFocus)
- **사용처**: 모달, 드로어, 팝오버 등 Overlay 컴포넌트

**예제**:
```tsx
const ref = useFocusScope({
  contain: true,
  autoFocus: true,
  restoreFocus: true,
});

return (
  <div ref={ref} role="dialog">
    <input /> {/* 자동 포커스됨 */}
    <button>Close</button>
  </div>
);
```

---

#### `useShortcut`
- **목적**: 단축키 등록 시스템 (컨텍스트 기반)
- **파일**: `src/shared/lib/keyboard/useShortcut.ts`
- **완성도**: ✅ 완료
- **기능**:
  - VSCode when-clause 스타일 컨텍스트 시스템
  - 우선순위 기반 단축키 관리
  - `useGlobalShortcut()`, `useModalShortcut()` 편의 함수
- **사용처**: 전역 단축키 (Cmd+K, Cmd+P 등)

**예제**:
```tsx
useShortcut('cmd+k', () => {
  openCommandPalette();
}, {
  context: KeyboardContext.GLOBAL,
  description: 'Open command palette',
  priority: PRIORITY.GLOBAL,
});

useModalShortcut('escape', () => {
  closeModal();
}, {
  description: 'Close modal',
});
```

---

### 2. Selection 관련 (`src/shared/lib/selection/`)

#### `useSelection`
- **목적**: 상용 앱 수준의 멀티 선택 관리
- **파일**: `src/shared/lib/selection/useSelection.ts`
- **완성도**: ✅ 완료
- **기능**:
  - 단일/멀티 선택
  - Cmd/Ctrl + Click: 토글 선택
  - Shift + Click: 범위 선택
  - Cmd+A: 전체 선택
  - Cmd+C/X/V: 복사/잘라내기/붙여넣기
  - Delete/Backspace: 삭제
  - ESC: 선택 해제
  - Arrow 키로 네비게이션 (선택 이동)
  - `getItemProps()`, `getContainerProps()` - Props 자동 생성
  - Focus management (브라우저 포커스 자동 동기화)
- **사용처**:
  - DataTable (계획 중)
  - FileTree (계획 중)
  - IDDL Inspector (vanilla JS로 패턴 적용됨)

**예제**:
```tsx
const selection = useSelection({
  items: files,
  getId: (file) => file.id,
  multiSelect: true,
  onCopy: (files) => copyToClipboard(files),
  onDelete: (files) => deleteFiles(files),
  keyboardNavigation: true,
});

return (
  <div {...selection.getContainerProps()}>
    {files.map((file) => (
      <div
        key={file.id}
        {...selection.getItemProps(file.id)}
        ref={(el) => selection.registerItemRef(file.id, el)}
        className={selection.isSelected(file.id) ? 'selected' : ''}
      >
        {file.name}
      </div>
    ))}
  </div>
);
```

---

### 3. Field 관련 (`src/components/types/Atom/Field/headless/`)

#### `useTextField`
- **목적**: 텍스트 입력 필드 로직
- **파일**: `src/components/types/Atom/Field/headless/useTextField.ts`
- **완성도**: ✅ 완료
- **지원 타입**: `text`, `email`, `url`, `phone`, `password`
- **기능**:
  - Controlled/Uncontrolled 모드
  - 실시간 검증 (minLength, maxLength, pattern, required)
  - Clearable 버튼 지원
  - ARIA 접근성 자동 설정
  - `getInputProps()`, `getClearButtonProps()`
- **사용처**: `TextField.tsx` 렌더러

**예제**:
```tsx
const field = useTextField({
  model: 'email',
  value: email,
  required: true,
  constraints: { pattern: '^[^@]+@[^@]+\\.[^@]+$' },
  clearable: true,
  onChange: setEmail,
});

return (
  <div>
    <input {...field.getInputProps()} />
    {field.showClearButton && (
      <button {...field.getClearButtonProps()}>×</button>
    )}
    {field.error && <span>{field.error}</span>}
  </div>
);
```

---

#### `useNumberField`
- **목적**: 숫자 입력 필드 로직
- **파일**: `src/components/types/Atom/Field/headless/useNumberField.ts`
- **완성도**: ✅ 완료
- **지원 타입**: `number`, `currency`, `range`
- **기능**:
  - min/max/step 검증
  - 키보드 증감 (ArrowUp/ArrowDown)
  - 통화 포맷팅 (Intl.NumberFormat)
  - `getInputProps()`, `getRangeProps()`
  - `increment()`, `decrement()`, `formatCurrency()`
- **사용처**: `NumberField.tsx` 렌더러

**예제**:
```tsx
const field = useNumberField({
  model: 'price',
  value: 99.99,
  constraints: { min: 0, max: 999, step: 0.01 },
  currency: 'USD',
  onChange: setPrice,
});

return (
  <div>
    <input {...field.getInputProps()} />
    <span>{field.formatCurrency(field.value)}</span>
    <button onClick={field.increment}>+</button>
    <button onClick={field.decrement}>-</button>
  </div>
);
```

---

#### `useSelectField`
- **목적**: 선택 입력 필드 로직
- **파일**: `src/components/types/Atom/Field/headless/useSelectField.ts`
- **완성도**: ✅ 완료
- **지원 타입**: `select`, `multiselect`, `radio`, `checkbox-group`
- **기능**:
  - 단일/다중 선택 관리
  - 검색/필터링 (searchable)
  - 키보드 네비게이션 (Arrow keys, Enter, Space)
  - `getSelectProps()`, `getOptionProps()`, `getInputProps()`
- **사용처**: `SelectField.tsx`, `RadioField.tsx` 렌더러

**예제**:
```tsx
const field = useSelectField({
  model: 'country',
  options: [
    { label: 'Korea', value: 'kr' },
    { label: 'USA', value: 'us' },
  ],
  value: 'kr',
  searchable: true,
  onChange: setCountry,
});

return (
  <div>
    <input
      value={field.searchQuery}
      onChange={(e) => field.setSearchQuery(e.target.value)}
      placeholder="Search..."
    />
    <select {...field.getSelectProps()}>
      {field.options.map(opt => (
        <option key={opt.value} {...field.getOptionProps(opt)}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
```

---

#### `useBooleanField`
- **목적**: 체크박스/스위치 상태 관리
- **파일**: `src/components/types/Atom/Field/headless/useBooleanField.ts`
- **완성도**: ✅ 완료 (파일 존재 확인됨)
- **지원 타입**: `checkbox`, `switch`, `toggle`

---

#### `useRatingField`
- **목적**: 별점 입력 로직
- **파일**: `src/components/types/Atom/Field/headless/useRatingField.ts`
- **완성도**: ✅ 완료 (파일 존재 확인됨)
- **지원 타입**: `rating`
- **사용처**: `RatingField.tsx` 렌더러

---

## 🚧 앞으로 구현할 Hooks

### 1. Field용 추가 Hooks

#### `useDateField`
- **목적**: 날짜/시간 입력 로직
- **지원 타입**: `date`, `datetime`, `time`, `month`, `week`
- **기능**:
  - 날짜 파싱 및 포맷팅 (Intl.DateTimeFormat)
  - min/max 날짜 검증
  - 키보드 네비게이션 (Arrow keys로 날짜 증감)
  - 캘린더 팝오버 통합
- **우선순위**: 🔴 High (Phase 1)

**예상 API**:
```tsx
const field = useDateField({
  model: 'birthday',
  value: new Date('1990-01-01'),
  constraints: { min: '1900-01-01', max: '2025-12-31' },
  format: 'yyyy-MM-dd',
  onChange: setBirthday,
});

// getInputProps(), getCalendarProps(), formatDate()
```

---

#### `useFileField`
- **목적**: 파일 업로드 로직
- **지원 타입**: `file`, `image`, `video`, `audio`
- **기능**:
  - 파일 선택 및 미리보기
  - 파일 크기/타입 검증
  - 드래그 앤 드롭 지원
  - 다중 파일 업로드
  - 진행률 표시
- **우선순위**: 🔴 High (Phase 1)

**예상 API**:
```tsx
const field = useFileField({
  model: 'avatar',
  accept: 'image/*',
  maxSize: 5 * 1024 * 1024, // 5MB
  multiple: false,
  onChange: (files) => uploadFiles(files),
});

// getInputProps(), getDropzoneProps(), removeFile(), preview
```

---

#### `useCodeField`
- **목적**: 코드 에디터 입력 로직
- **지원 타입**: `code`, `json`, `markdown`
- **기능**:
  - 구문 강조 (syntax highlighting)
  - 자동 들여쓰기
  - 괄호 자동 완성
  - JSON 검증
- **우선순위**: 🟡 Medium (Phase 2)

---

#### `useColorField`
- **목적**: 색상 선택 로직
- **지원 타입**: `color`
- **기능**:
  - HEX/RGB/HSL 포맷 변환
  - 색상 팔레트
  - 최근 사용 색상
- **우선순위**: 🟡 Medium (Phase 2)

---

#### `useSliderField`
- **목적**: 슬라이더/범위 입력 로직
- **지원 타입**: `range`, `slider`
- **기능**:
  - 단일/이중 핸들 (min-max range)
  - 스텝 단위 스냅
  - 값 표시 툴팁
- **우선순위**: 🟡 Medium (Phase 2)

---

#### `useTagsField`
- **목적**: 태그 입력 로직
- **지원 타입**: `tags`, `chips`
- **기능**:
  - 태그 추가/삭제
  - 자동완성
  - 중복 방지
  - 키보드 네비게이션 (Backspace로 마지막 태그 삭제)
- **우선순위**: 🟡 Medium (Phase 2)

---

#### `useRelationField`
- **목적**: 관계형 필드 로직 (Foreign Key)
- **지원 타입**: `relation`
- **기능**:
  - 외래 키 선택
  - 관계된 데이터 로딩
  - 검색/필터링
- **우선순위**: 🟢 Low (Phase 3)

---

### 2. Form 관련 Hooks

#### `useForm`
- **목적**: 폼 전체 상태 관리
- **기능**:
  - 필드 등록 및 값 관리
  - 전체 폼 검증
  - 제출(submit) 핸들링
  - 초기화(reset)
  - Dirty/Touched 상태 추적
- **우선순위**: 🔴 High (Phase 1)
- **참고**: React Hook Form 통합 또는 독자적 구현 결정 필요

**예상 API**:
```tsx
const form = useForm({
  initialValues: { name: '', email: '' },
  onSubmit: (values) => console.log(values),
  validate: (values) => {
    const errors = {};
    if (!values.email) errors.email = 'Required';
    return errors;
  },
});

// register(), handleSubmit(), reset(), formState
```

---

#### `useFormValidation`
- **목적**: 폼 검증 로직 (Zod 통합)
- **기능**:
  - Zod 스키마 기반 검증
  - 필드별 에러 메시지
  - 비동기 검증 (서버 검증)
- **우선순위**: 🔴 High (Phase 1)

---

#### `useFieldArray`
- **목적**: 동적 필드 배열 관리
- **기능**:
  - 필드 추가/삭제/이동
  - 배열 항목 검증
  - 드래그 앤 드롭 재정렬
- **우선순위**: 🟡 Medium (Phase 2)

**예상 API**:
```tsx
const { fields, append, remove, move } = useFieldArray({
  name: 'contacts',
  control: form.control,
});

// fields.map((field, index) => ...)
```

---

### 3. Overlay 관련 Hooks

#### `useModal`
- **목적**: 모달 상태 관리
- **기능**:
  - 열기/닫기 상태
  - 포커스 트랩
  - ESC 키로 닫기
  - 배경 클릭으로 닫기
  - 스택 관리 (여러 모달)
- **우선순위**: 🟡 Medium (Phase 2)

**예상 API**:
```tsx
const modal = useModal({
  defaultOpen: false,
  dismissable: true,
  onClose: () => console.log('closed'),
});

// isOpen, open(), close(), toggle(), getOverlayProps()
```

---

#### `usePopover`
- **목적**: 팝오버 위치 계산 및 상태 관리
- **기능**:
  - 자동 위치 조정 (viewport 고려)
  - Arrow 포인터
  - Placement (top, bottom, left, right)
  - Offset 조정
- **우선순위**: 🟡 Medium (Phase 2)
- **참고**: Floating UI 라이브러리 통합

---

#### `useToast`
- **목적**: 토스트 알림 관리
- **기능**:
  - 토스트 추가/제거
  - 자동 닫기 타이머
  - 위치 지정 (top-right, bottom-left 등)
  - 스택 관리
- **우선순위**: 🟡 Medium (Phase 2)

**예상 API**:
```tsx
const toast = useToast();

toast.success('Saved successfully!', { duration: 3000 });
toast.error('An error occurred');
toast.info('Info message');
```

---

#### `useDrawer`
- **목적**: 드로어 상태 관리
- **기능**:
  - 열기/닫기 애니메이션
  - 방향 (left, right, top, bottom)
  - 크기 조절
- **우선순위**: 🟢 Low (Phase 3)

---

### 4. Data 관련 Hooks

#### `usePagination`
- **목적**: 페이지네이션 로직
- **기능**:
  - 페이지 이동 (next, prev, goto)
  - 페이지 크기 변경
  - 총 페이지 수 계산
- **우선순위**: 🟡 Medium (Phase 2)

**예상 API**:
```tsx
const pagination = usePagination({
  totalItems: 1000,
  pageSize: 20,
  currentPage: 1,
});

// currentPage, totalPages, goToPage(), nextPage(), prevPage()
```

---

#### `useSort`
- **목적**: 정렬 로직
- **기능**:
  - 컬럼별 정렬
  - 오름차순/내림차순
  - 다중 컬럼 정렬
- **우선순위**: 🟡 Medium (Phase 2)

---

#### `useFilter`
- **목적**: 필터링 로직
- **기능**:
  - 필터 조건 추가/제거
  - 다중 필터 조합 (AND/OR)
  - 실시간 필터링
- **우선순위**: 🟡 Medium (Phase 2)

---

#### `useVirtualization`
- **목적**: 가상 스크롤링 로직
- **기능**:
  - 대용량 데이터 렌더링 최적화
  - Windowing (보이는 항목만 렌더링)
  - 동적 높이 지원
- **우선순위**: 🟢 Low (Phase 3)
- **참고**: @tanstack/react-virtual 통합

---

## 🔧 기존 Hook 개선 계획

### `useSelection` + React Hook Form 통합
- **현재**: 독립적으로 동작
- **개선**: React Hook Form의 `useController`와 통합
- **목표**: 폼 검증 시스템과 선택 상태를 동기화
- **우선순위**: 🟡 Medium (Phase 2)

---

### `useNavigableCursor` + Virtual Scrolling
- **현재**: 모든 항목이 DOM에 렌더링됨
- **개선**: @tanstack/react-virtual 통합
- **목표**: 10,000+ 항목에서도 부드러운 네비게이션
- **우선순위**: 🟢 Low (Phase 3)

---

### `useTreeNavigation` + Drag & Drop
- **현재**: 키보드 네비게이션만 지원
- **개선**: @dnd-kit 통합
- **목표**: 트리 구조 재정렬 (파일 이동, 폴더 재배치)
- **우선순위**: 🟢 Low (Phase 4)

---

## 📅 구현 우선순위 및 일정

### Phase 1 (즉시 - 1주일)
**목표**: 필수 Field hooks 완성

- [ ] `useDateField` (date, datetime, time)
- [ ] `useFileField` (file, image)
- [ ] `useForm` (폼 전체 관리)
- [ ] `useFormValidation` (Zod 통합)

**완료 기준**: TextField, NumberField, SelectField처럼 완전한 렌더러 + 문서 작성

---

### Phase 2 (단기 - 2주일)
**목표**: 주요 기능 hooks 완성

- [ ] `useCodeField` (code, json, markdown)
- [ ] `useColorField` (color)
- [ ] `useSliderField` (range, slider)
- [ ] `useTagsField` (tags, chips)
- [ ] `useFieldArray` (동적 필드 배열)
- [ ] `useModal` (모달 상태 관리)
- [ ] `usePopover` (팝오버 위치 계산)
- [ ] `useToast` (토스트 알림)
- [ ] `usePagination` (페이지네이션)
- [ ] `useSort` (정렬)
- [ ] `useFilter` (필터링)

---

### Phase 3 (중기 - 1개월)
**목표**: 고급 기능 및 통합

- [ ] `useRelationField` (relation - foreign key)
- [ ] `useDrawer` (드로어 상태 관리)
- [ ] `useVirtualization` (가상 스크롤링)
- [ ] `useSelection` + React Hook Form 통합

---

### Phase 4 (장기 - 2개월)
**목표**: 최적화 및 확장

- [ ] `useNavigableCursor` + Virtual Scrolling
- [ ] `useTreeNavigation` + Drag & Drop
- [ ] 성능 최적화 (메모이제이션, lazy loading)
- [ ] 스토리북 문서 작성
- [ ] 유닛 테스트 작성 (Jest + React Testing Library)

---

## 📚 참고 자료

### 외부 라이브러리
- **React Hook Form**: https://react-hook-form.com/
- **Zod**: https://zod.dev/
- **@tanstack/react-table**: https://tanstack.com/table/latest
- **@tanstack/react-virtual**: https://tanstack.com/virtual/latest
- **Floating UI**: https://floating-ui.com/
- **react-hotkeys-hook**: https://github.com/JohannesKlauss/react-hotkeys-hook
- **@dnd-kit**: https://dndkit.com/

### 내부 문서
- `docs/2-areas/spec/iddl-spec-1.0.1.md`: IDDL 공식 스펙
- `docs/2-areas/core/3-reference/field-reference.md`: Field 컴포넌트 API
- `docs/2-areas/patterns/01-behavior-patterns.md`: 동작 패턴
- `docs/2-areas/patterns/02-accessibility-patterns.md`: 접근성 패턴

### Headless UI 참고 사례
- **Headless UI**: https://headlessui.com/ (Tailwind Labs)
- **Radix UI**: https://www.radix-ui.com/ (primitives)
- **React Aria**: https://react-spectrum.adobe.com/react-aria/ (Adobe)
- **Downshift**: https://www.downshift-js.com/ (autocomplete/select)

---

## 🎯 성공 지표

### 1. 재사용성
- 같은 hook을 3개 이상의 다른 디자인에 적용 가능

### 2. 타입 안전성
- 모든 hook이 완전한 TypeScript 타입 지원
- Props getter의 반환 타입이 HTML 속성과 정확히 일치

### 3. 접근성
- 모든 ARIA 속성이 자동으로 생성됨
- 키보드 네비게이션 100% 지원

### 4. 성능
- 10,000개 항목에서 60fps 유지 (가상 스크롤링)
- 불필요한 리렌더링 최소화 (useMemo, useCallback)

### 5. 테스트 커버리지
- 각 hook마다 80% 이상 커버리지
- Edge case 테스트 포함

---

## 🤝 기여 가이드

### Hook 작성 규칙

1. **명명 규칙**: `use{ComponentType}Field` (예: `useTextField`, `useDateField`)
2. **파일 위치**: `src/components/types/Atom/Field/headless/`
3. **타입 정의**: `{HookName}Options`, `{HookName}Return` 인터페이스 필수
4. **Props Getter**: `getInputProps()`, `getClearButtonProps()` 등 일관된 네이밍
5. **ARIA**: 모든 접근성 속성 자동 생성
6. **문서**: JSDoc 주석으로 사용 예제 포함

### 예제 템플릿

```tsx
/**
 * use{Name}Field - {설명}
 *
 * 제공 기능:
 * - 기능 1
 * - 기능 2
 *
 * @example
 * const field = use{Name}Field({
 *   model: 'fieldName',
 *   value: defaultValue,
 *   onChange: handleChange,
 * });
 *
 * <input {...field.getInputProps()} />
 */

export interface Use{Name}FieldOptions {
  model: string;
  value?: any;
  required?: boolean;
  onChange?: (value: any) => void;
  // ...
}

export interface Use{Name}FieldReturn {
  value: any;
  error: string | null;
  getInputProps: () => Record<string, any>;
  // ...
}

export function use{Name}Field(options: Use{Name}FieldOptions): Use{Name}FieldReturn {
  // Implementation
}
```

---

## 📝 변경 이력

- **2026-01-10**: 초기 문서 작성
- **Phase 1 시작 예정**: 2026-01-11

---

**다음 단계**: Phase 1 hooks 구현 시작 (`useDateField`, `useFileField`, `useForm`)
