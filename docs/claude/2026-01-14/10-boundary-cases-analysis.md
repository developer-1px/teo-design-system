# 경계 케이스 분석: Field vs Action vs Block

**목적**: 분류가 애매한 컴포넌트들의 판단 기준 확립
**방법**: 실제 사례 분석 및 의사결정 트리
**작성일**: 2026-01-14

---

## 🎯 분류 원칙 요약

### Field (입력 프리미티브)
- **목적**: 단일 값 입력/선택
- **폼 데이터**: 포함됨 (name 속성 가짐)
- **제출 시**: 서버로 전송
- **복잡도**: 상관없음 (복잡해도 단일 값이면 Field)

### Action (행동 프리미티브)
- **목적**: 이벤트 트리거 (즉각 반응)
- **폼 데이터**: 포함 안 됨
- **제출 시**: 서버 전송 없음
- **복잡도**: 일반적으로 단순

### Block (패턴)
- **목적**: 완전한 기능 유닛
- **폼 데이터**: Field 여러 개 포함 가능
- **제출 시**: 자체적으로 처리
- **복잡도**: 항상 복잡 (여러 프리미티브 조합)

---

## 📋 의사결정 트리

```
컴포넌트를 분류하려면?
│
├─ Q1: 여러 프리미티브의 조합인가?
│   │
│   ├─ YES → Q2: 독립적인 완전한 기능인가?
│   │         │
│   │         ├─ YES → **Block**
│   │         │   (예: SearchBar, LoginForm, Wizard)
│   │         │
│   │         └─ NO → Q3: 단일 값을 선택하는가?
│   │                   │
│   │                   ├─ YES → **Field**
│   │                   │   (예: DatePicker, ColorPicker)
│   │                   │
│   │                   └─ NO → 재검토 필요
│   │
│   └─ NO (단일 컴포넌트) → Q4: 값을 저장하는가?
│                           │
│                           ├─ YES → **Field**
│                           │   (예: Input, Select, Checkbox)
│                           │
│                           └─ NO → **Action**
│                               (예: Button, Link)
```

---

## 🔍 Case Study: 30개 경계 케이스

### Category 1: 명확한 Field (✅)

#### 1. Input
```tsx
<Field.Input name="email" value="" />
```
- **판단**: Field ✅
- **이유**: 단일 텍스트 값 입력
- **폼 제출**: ✅ 전송됨

#### 2. Select / Dropdown
```tsx
<Field.Select name="country" options={countries} />
```
- **판단**: Field ✅
- **이유**: 단일 선택 값
- **폼 제출**: ✅ 전송됨

#### 3. Checkbox
```tsx
<Field.Checkbox name="agree" checked={true} />
```
- **판단**: Field ✅
- **이유**: Boolean 값 저장
- **폼 제출**: ✅ 전송됨

#### 4. Radio
```tsx
<Field.Radio name="gender" value="male" />
```
- **판단**: Field ✅
- **이유**: 단일 선택 값
- **폼 제출**: ✅ 전송됨

#### 5. Textarea
```tsx
<Field.Textarea name="message" />
```
- **판단**: Field ✅
- **이유**: 긴 텍스트 값 입력
- **폼 제출**: ✅ 전송됨

---

### Category 2: 명확한 Action (✅)

#### 6. Button
```tsx
<Action.Button onClick={handleClick}>Click</Action.Button>
```
- **판단**: Action ✅
- **이유**: 클릭 이벤트 트리거
- **폼 제출**: ❌ 값 전송 안 됨

#### 7. IconButton
```tsx
<Action.IconButton icon={TrashIcon} onClick={deleteItem} />
```
- **판단**: Action ✅
- **이유**: 삭제 행동 트리거
- **폼 제출**: ❌

#### 8. Link
```tsx
<Action.Link href="/about">About</Action.Link>
```
- **판단**: Action ✅
- **이유**: 네비게이션 행동
- **폼 제출**: ❌

#### 9. Submit Button
```tsx
<Action.Submit>Submit Form</Action.Submit>
```
- **판단**: Action ✅
- **이유**: 폼 제출 트리거 (값 저장 안 함)
- **폼 제출**: ❌ (트리거만 함)

---

### Category 3: 복잡한 Field (🟡 토론 필요)

#### 10. DatePicker
```tsx
<Field.DatePicker name="birthday" value="2026-01-14" />
```
- **판단**: Field ✅
- **이유**: 날짜 "값" 선택 (복잡한 UI지만 단일 값)
- **구성**: Input + Calendar Overlay
- **폼 제출**: ✅ `birthday: "2026-01-14"` 전송

**논쟁 포인트**:
- 🔴 반대: Calendar는 복잡한 UI → Block 아닌가?
- 🟢 찬성: 최종 목적은 "날짜 값 하나 선택" → Field 맞음

**결론**: **Field.DatePicker** ✅

---

#### 11. ColorPicker
```tsx
<Field.ColorPicker name="brandColor" value="#ff0000" />
```
- **판단**: Field ✅
- **이유**: 색상 "값" 선택
- **구성**: Input + 색상환 + RGB 슬라이더
- **폼 제출**: ✅ `brandColor: "#ff0000"` 전송

**논쟁 포인트**:
- 🔴 반대: 매우 복잡한 UI (색상환, 팔레트, 슬라이더)
- 🟢 찬성: 결국 색상 문자열 하나 선택 → Field

**결론**: **Field.ColorPicker** ✅

---

#### 12. RichTextEditor
```tsx
<Field.RichTextEditor name="content" value="<p>Hello</p>" />
```
- **판단**: Field ✅
- **이유**: HTML 텍스트 "값" 입력
- **구성**: Toolbar + Contenteditable + Formatting
- **폼 제출**: ✅ `content: "<p>Hello</p>"` 전송

**논쟁 포인트**:
- 🔴 반대: 엄청 복잡함 (Toolbar는 Block 아닌가?)
- 🟢 찬성: 목적은 "텍스트 값 입력" → Field

**결론**: **Field.RichTextEditor** ✅

---

#### 13. FileUpload
```tsx
<Field.FileUpload name="avatar" accept="image/*" />
```
- **판단**: Field ✅
- **이유**: 파일 "값" 선택
- **구성**: Input + Drag & Drop + Preview
- **폼 제출**: ✅ `avatar: File` 전송

**논쟁 포인트**:
- 🔴 반대: Drag & Drop, Progress Bar 복잡함
- 🟢 찬성: 파일 하나 선택이 목적 → Field

**결론**: **Field.FileUpload** ✅

---

#### 14. Slider / Range
```tsx
<Field.Slider name="volume" min={0} max={100} value={50} />
```
- **판단**: Field ✅
- **이유**: 숫자 "값" 선택
- **폼 제출**: ✅ `volume: 50` 전송

**논쟁 포인트**:
- 🔴 반대: 드래그 인터랙션 = Action 아닌가?
- 🟢 찬성: 최종 목적은 숫자 값 저장 → Field

**결론**: **Field.Slider** ✅

---

#### 15. Rating
```tsx
<Field.Rating name="rating" max={5} value={4} />
```
- **판단**: Field ✅
- **이유**: 별점 "값" 선택
- **폼 제출**: ✅ `rating: 4` 전송

**논쟁 포인트**:
- 🔴 반대: 별 클릭 = Action 같음
- 🟢 찬성: 평점 값 저장 → Field

**결론**: **Field.Rating** ✅

---

### Category 4: 애매한 Field vs Action (🔥 치열한 토론)

#### 16. Toggle / Switch
```tsx
<Field.Toggle name="darkMode" checked={true} />
```
- **판단**: Field ✅
- **이유**: Boolean 값 저장
- **폼 제출**: ✅ `darkMode: true` 전송

**논쟁 포인트**:
- 🔴 Action 주장: 클릭 즉시 변경 = 행동 아닌가?
- 🟢 Field 주장: 최종적으로 값 저장 = 입력 맞음

**실제 사용 사례**:
```tsx
// 폼 설정 (Field 맞음)
<form>
  <Field.Toggle name="notifications" />
  <Action.Submit>Save Settings</Action.Submit>
</form>

// 즉시 모드 전환 (Action 같음)
<Action.Toggle checked={darkMode} onChange={toggleDarkMode} />
```

**결론**: **맥락 의존적**
- 폼 데이터로 쓰이면 → **Field.Toggle**
- 즉시 실행 UI 전환이면 → **Action.Toggle**

**MDK 권장**: 둘 다 제공
```tsx
<Field.Toggle name="setting" />     // 폼용
<Action.Toggle onChange={fn} />      // 즉시 전환용
```

---

#### 17. Star Button (찜하기)
```tsx
<???.Star active={true} onClick={toggleFavorite} />
```
- **판단**: Action ✅
- **이유**: 즉시 서버 요청 (찜하기/취소)
- **폼 제출**: ❌ 폼과 무관

**논쟁 포인트**:
- 🔴 Field 주장: favorite 상태 저장 아닌가?
- 🟢 Action 주장: 클릭 즉시 API 호출 → 행동

**결론**: **Action.Star** ✅

---

#### 18. Like Button
```tsx
<Action.Like count={42} onClick={handleLike} />
```
- **판단**: Action ✅
- **이유**: 즉시 좋아요 실행
- **폼 제출**: ❌

**결론**: **Action.Like** ✅

---

### Category 5: 명확한 Block (✅)

#### 19. SearchBar
```tsx
<Block.SearchBar onSearch={handleSearch} />
```
- **판단**: Block ✅
- **이유**: Input + Button + Autocomplete 조합
- **독립적 기능**: 즉시 검색 실행
- **폼 제출**: ❌ (독립적)

**구성**:
```tsx
<Block.SearchBar>
  <Field.Input />
  <Action.Button />
  <Overlay.Dropdown>
    <Data.List />
  </Overlay.Dropdown>
</Block.SearchBar>
```

---

#### 20. LoginForm
```tsx
<Block.LoginForm onSubmit={handleLogin} />
```
- **판단**: Block ✅
- **이유**: Email + Password + Submit 조합
- **독립적 기능**: 로그인 처리
- **폼 제출**: ✅ (자체 처리)

**구성**:
```tsx
<Block.LoginForm>
  <Field.Input name="email" />
  <Field.Input name="password" type="password" />
  <Action.Submit>Login</Action.Submit>
</Block.LoginForm>
```

---

#### 21. Pagination
```tsx
<Block.Pagination page={1} total={10} onChange={setPage} />
```
- **판단**: Block ✅
- **이유**: Prev + Numbers + Next 버튼 조합
- **독립적 기능**: 페이지 전환

**구성**:
```tsx
<Block.Pagination>
  <Action.Button>Prev</Action.Button>
  <Action.Button>1</Action.Button>
  <Action.Button>2</Action.Button>
  <Action.Button>Next</Action.Button>
</Block.Pagination>
```

---

#### 22. Wizard / Stepper
```tsx
<Block.Wizard steps={['Personal', 'Address', 'Payment']} />
```
- **판단**: Block ✅
- **이유**: 여러 Step + Navigation 조합
- **독립적 기능**: 다단계 폼 처리

---

### Category 6: 논란의 케이스 (🔥🔥🔥)

#### 23. Combobox (Select + Search)
```tsx
<???.Combobox name="country" options={countries} searchable />
```
- **Option A**: Field.Combobox (단일 값 선택이 목적)
- **Option B**: Block.Combobox (Select + Input 조합)

**토론**:
- 🔴 Block 주장: Select Dropdown + Search Input 두 개 조합
- 🟢 Field 주장: 최종 목적은 "국가 하나 선택" → 단일 값

**다른 시스템**:
- shadcn/ui: "Forms & Input"에 포함 → **Field**
- Material Design: "Combobox" 별도 → **Field**

**결론**: **Field.Combobox** ✅
- 이유: 복잡한 UI지만 단일 값 선택이 주목적

---

#### 24. Autocomplete
```tsx
<Field.Autocomplete name="city" suggestions={cities} />
```
- **판단**: Field ✅
- **이유**: Input + Suggestions 조합이지만, 최종 목적은 "값 입력"
- **폼 제출**: ✅ `city: "Seoul"` 전송

**논쟁 포인트**:
- 🔴 Block 주장: Input + Overlay + List 복잡함
- 🟢 Field 주장: 향상된 Input일 뿐 (목적은 입력)

**결론**: **Field.Autocomplete** ✅

---

#### 25. MultiSelect (다중 선택)
```tsx
<Field.MultiSelect name="skills" value={['React', 'TypeScript']} />
```
- **판단**: Field ✅
- **이유**: 배열 값 선택
- **폼 제출**: ✅ `skills: ['React', 'TypeScript']` 전송

**논쟁 포인트**:
- 🔴 Block 주장: Checkbox 여러 개 + Select UI 복잡
- 🟢 Field 주장: 여전히 단일 "배열 값" 입력

**결론**: **Field.MultiSelect** ✅

---

#### 26. TagInput (태그 입력)
```tsx
<Field.TagInput name="tags" value={['react', 'ui']} />
```
- **판단**: Field ✅
- **이유**: 배열 값 입력 (사용자가 태그 추가/제거)
- **폼 제출**: ✅ `tags: ['react', 'ui']` 전송

**논쟁 포인트**:
- 🔴 Block 주장: Input + Chip + Remove Button 복잡
- 🟢 Field 주장: 최종 목적은 "태그 배열 입력"

**결론**: **Field.TagInput** ✅

---

#### 27. ImageCrop
```tsx
<Field.ImageCrop name="avatar" src="/photo.jpg" />
```
- **판단**: Field ✅
- **이유**: 크롭된 이미지 "파일" 선택
- **구성**: Image + Crop Tool + Preview
- **폼 제출**: ✅ `avatar: CroppedFile` 전송

**논쟁 포인트**:
- 🔴 Block 주장: 매우 복잡한 UI (캔버스, 핸들, 줌)
- 🟢 Field 주장: 목적은 "이미지 값 선택"

**결론**: **Field.ImageCrop** ✅

---

#### 28. CodeEditor (Monaco, CodeMirror)
```tsx
<Field.CodeEditor name="code" language="tsx" />
```
- **판단**: Field ✅
- **이유**: 코드 "텍스트 값" 입력
- **폼 제출**: ✅ `code: "const x = 1;"` 전송

**논쟁 포인트**:
- 🔴 Block 주장: 엄청 복잡 (Syntax Highlight, Autocomplete, Linting)
- 🟢 Field 주장: Textarea의 고급 버전, 목적은 "텍스트 입력"

**결론**: **Field.CodeEditor** ✅

---

#### 29. PhoneInput (국제 번호)
```tsx
<Field.PhoneInput name="phone" country="US" />
```
- **판단**: Field ✅
- **이유**: 전화번호 "값" 입력
- **구성**: Country Select + Number Input + Validation
- **폼 제출**: ✅ `phone: "+1-555-1234"` 전송

**논쟁 포인트**:
- 🔴 Block 주장: Select + Input 두 개 조합
- 🟢 Field 주장: 최종 결과는 "단일 전화번호 문자열"

**결론**: **Field.PhoneInput** ✅

---

#### 30. AddressInput (주소 검색)
```tsx
<Field.AddressInput name="address" />
```
- **판단**: 🔥 **가장 논란**
- **구성**: Input + Google Maps API + Autocomplete + Address Fields

**Option A: Field.AddressInput**
- 이유: 최종 목적은 "주소 문자열 하나" 선택
- 폼 제출: ✅ `address: "123 Main St, Seoul"` 전송

**Option B: Block.AddressForm**
- 이유: 실제로는 여러 필드 (Street, City, Zip, Country) 조합
- 폼 제출: ✅ `street, city, zip, country` 여러 값

**결론**: **맥락 의존적**
```tsx
// 단일 주소 문자열 → Field
<Field.AddressInput name="address" />

// 구조화된 주소 → Block
<Block.AddressForm>
  <Field.Input name="street" />
  <Field.Input name="city" />
  <Field.Input name="zip" />
  <Field.Select name="country" />
</Block.AddressForm>
```

---

## 📐 최종 판단 매트릭스

| 컴포넌트 | 분류 | 복잡도 | 폼 제출 | 주목적 | 논란도 |
|---------|------|-------|---------|--------|--------|
| Input | Field | 단순 | ✅ | 값 입력 | 없음 |
| Button | Action | 단순 | ❌ | 행동 트리거 | 없음 |
| DatePicker | Field | 복잡 | ✅ | 날짜 선택 | 🟡 낮음 |
| ColorPicker | Field | 복잡 | ✅ | 색상 선택 | 🟡 낮음 |
| RichTextEditor | Field | 매우 복잡 | ✅ | 텍스트 입력 | 🟡 중간 |
| Toggle | Field/Action | 단순 | ✅/❌ | 맥락 의존 | 🔥 높음 |
| SearchBar | Block | 복잡 | ❌ | 검색 실행 | 없음 |
| LoginForm | Block | 복잡 | ✅ | 로그인 처리 | 없음 |
| Combobox | Field | 복잡 | ✅ | 값 선택 | 🔥 중간 |
| AddressInput | Field/Block | 매우 복잡 | ✅ | 맥락 의존 | 🔥🔥 매우 높음 |

---

## 🎯 명확한 판단 규칙 (최종)

### Rule 1: 폼 제출 테스트
```tsx
<form onSubmit={handleSubmit}>
  <Component name="fieldName" />
  <button type="submit">Submit</button>
</form>
```
- `name` 속성이 필요한가? → **Field**
- `name` 속성이 불필요한가? → **Action** or **Block**

### Rule 2: 단일 값 테스트
```tsx
const value = component.getValue()
```
- 단일 원시 값(string, number, boolean, File)? → **Field**
- 단일 객체/배열 값? → **Field** (여전히 단일 값)
- 여러 개의 독립적 값? → **Block**

### Rule 3: 독립성 테스트
- 다른 컴포넌트 없이 완전한 기능? → **Block**
- 다른 컴포넌트와 조합 필요? → **Field** or **Action**

### Rule 4: 목적 테스트
- 주 목적이 "값 저장"? → **Field**
- 주 목적이 "행동 트리거"? → **Action**
- 주 목적이 "완전한 기능 제공"? → **Block**

---

## 🚨 Edge Case 처리 방침

### 1. Toggle/Switch의 이중 정체성
**해결책**: 두 가지 모두 제공
```tsx
// 폼 데이터용
<Field.Toggle name="notifications" checked={true} />

// UI 전환용
<Action.Toggle checked={darkMode} onChange={toggleDarkMode} />
```

### 2. AddressInput의 맥락 의존성
**해결책**: 사용 사례별 분리
```tsx
// 간단한 주소 입력
<Field.AddressInput name="address" />

// 상세 주소 폼
<Block.AddressForm>
  <Field.Input name="street" />
  <Field.Input name="city" />
</Block.AddressForm>
```

### 3. RichTextEditor의 복잡도
**해결책**: 복잡도보다 "목적" 우선
- 아무리 복잡해도 목적이 "텍스트 입력"이면 → **Field**

---

## ✅ 커뮤니티 가이드라인

새로운 컴포넌트를 추가할 때:

1. **4가지 Rule 테스트** 실행
2. **비슷한 기존 컴포넌트** 참고
3. **논란 예상되면** GitHub Discussion 생성
4. **명확하지 않으면** Field 우선 (보수적 접근)

---

**작성자**: MDK Core Team
**리뷰**: 6명 참석 회의 기반
**최종 업데이트**: 2026-01-14
