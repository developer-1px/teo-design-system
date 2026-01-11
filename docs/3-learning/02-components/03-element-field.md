# Field 컴포넌트

**난이도**: ⭐⭐⭐⭐☆
**소요 시간**: 45분
**선행 학습**: [Action 컴포넌트](./02-element-action.md)

---

## 📌 이 문서에서 배울 내용

- Field Element가 무엇인가?
- 18가지 Field Role 완전 이해
- role × spec 조합 패턴
- 데이터 바인딩 기초
- 실전 폼 구성
- 자주 하는 실수와 해결법

---

## 🎯 Field란?

**Field**는 데이터 입력을 받는 IDDL Element입니다.

```tsx
// 사용자 입력을 받아 데이터를 바인딩
<Field
  role="TextInput"
  label="Email"
  model="user.email"
  required
/>
```

**핵심 특징**:
- **Type**: Element (원자적 요소)
- **용도**: 텍스트, 숫자, 날짜, 선택 등 모든 입력
- **데이터 바인딩**: model prop으로 데이터 연결
- **18가지 Role**: 입력 유형별로 최적화된 UI

---

## 📚 Field Role 분류

### 카테고리별 정리

| 카테고리 | Role | 용도 |
|---------|------|------|
| **Text** | TextInput | 일반 텍스트 |
| | TextArea | 여러 줄 텍스트 |
| | PasswordInput | 비밀번호 |
| | EmailInput | 이메일 |
| | SearchInput | 검색어 |
| **Number** | NumberInput | 숫자 |
| | Slider | 슬라이더 |
| | Rating | 별점 |
| **Selection** | Select | 드롭다운 선택 |
| | Combobox | 자동완성 선택 |
| | RadioGroup | 라디오 그룹 |
| **Toggle** | Checkbox | 체크박스 |
| | Switch | 스위치 |
| **Date/Time** | DateInput | 날짜 |
| | TimeInput | 시간 |
| | DateTimeInput | 날짜+시간 |
| **Specialized** | FileInput | 파일 업로드 |
| | OTPInput | OTP 코드 |
| | TagInput | 태그 입력 |

---

## 📝 Text Inputs

### TextInput (기본 텍스트)

**HTML 매핑**: `<input type="text">`

**예시**:
```tsx
// 기본 텍스트
<Field
  role="TextInput"
  label="Name"
  model="user.name"
  required
/>

// inputMode 지정
<Field
  role="TextInput"
  label="Phone"
  model="user.phone"
  spec={{ inputMode: 'tel' }}
/>

// maxLength 제한
<Field
  role="TextInput"
  label="Username"
  model="user.username"
  spec={{ maxLength: 20 }}
  description="최대 20자까지 입력 가능"
/>

// pattern 검증
<Field
  role="TextInput"
  label="Zip Code"
  model="address.zipCode"
  spec={{ pattern: '[0-9]{5}' }}
  description="5자리 우편번호"
/>
```

**spec**:
- `inputMode`: 모바일 키보드 타입 (text, numeric, email, tel, url)
- `maxLength`: 최대 글자 수
- `pattern`: 정규식 검증

---

### TextArea (여러 줄 텍스트)

**HTML 매핑**: `<textarea>`

**예시**:
```tsx
<Field
  role="TextArea"
  label="Description"
  model="product.description"
  spec={{ rows: 5, maxLength: 500 }}
  description="상품 설명 (최대 500자)"
/>

// 코멘트
<Field
  role="TextArea"
  label="Comment"
  model="comment.content"
  spec={{ rows: 3 }}
  placeholder="의견을 남겨주세요"
/>
```

**spec**:
- `rows`: 기본 높이 (줄 수)
- `maxLength`: 최대 글자 수

---

### PasswordInput (비밀번호)

**HTML 매핑**: `<input type="password">`

**예시**:
```tsx
<Field
  role="PasswordInput"
  label="Password"
  model="user.password"
  required
  spec={{ revealable: true }}
  description="8자 이상, 영문+숫자 조합"
/>

// 비밀번호 확인
<Field
  role="PasswordInput"
  label="Confirm Password"
  model="user.passwordConfirm"
  required
/>
```

**spec**:
- `revealable`: 표시/숨기기 토글 버튼 (true/false)

---

### EmailInput (이메일)

**HTML 매핑**: `<input type="email">`

**예시**:
```tsx
<Field
  role="EmailInput"
  label="Email"
  model="user.email"
  required
  spec={{ autoComplete: 'email' }}
  description="로그인에 사용될 이메일"
/>
```

**spec**:
- `autoComplete`: 자동완성 힌트

**자동 처리**:
- 이메일 형식 검증
- 모바일에서 이메일 키보드

---

### SearchInput (검색)

**HTML 매핑**: `<input type="search">`

**예시**:
```tsx
<Field
  role="SearchInput"
  label="Search"
  model="query"
  spec={{ clearable: true }}
  placeholder="검색어를 입력하세요"
/>
```

**spec**:
- `clearable`: X 버튼으로 전체 삭제 (true/false)

**자동 처리**:
- 검색 아이콘
- 모바일에서 검색 키보드

---

## 🔢 Number Inputs

### NumberInput (숫자)

**HTML 매핑**: `<input type="number">`

**예시**:
```tsx
// 기본 숫자
<Field
  role="NumberInput"
  label="Age"
  model="user.age"
  spec={{ min: 0, max: 120 }}
/>

// 소수점
<Field
  role="NumberInput"
  label="Price"
  model="product.price"
  spec={{ min: 0, step: 0.01 }}
  description="원 단위"
/>

// 수량
<Field
  role="NumberInput"
  label="Quantity"
  model="order.quantity"
  spec={{ min: 1, max: 100, step: 1 }}
/>
```

**spec**:
- `min`: 최소값
- `max`: 최대값
- `step`: 증감 단위 (기본 1)

---

### Slider (슬라이더)

**HTML 매핑**: `<input type="range">`

**예시**:
```tsx
// 볼륨
<Field
  role="Slider"
  label="Volume"
  model="settings.volume"
  spec={{ min: 0, max: 100, step: 1 }}
/>

// 가격 범위
<Field
  role="Slider"
  label="Price Range"
  model="filter.priceRange"
  spec={{ min: 0, max: 1000, step: 10, range: true }}
  description="최소-최대 가격"
/>
```

**spec**:
- `min`: 최소값 (필수)
- `max`: 최대값 (필수)
- `step`: 증감 단위
- `range`: 범위 선택 (두 개의 핸들)

---

### Rating (별점)

**HTML 매핑**: Custom component

**예시**:
```tsx
<Field
  role="Rating"
  label="Rating"
  model="review.rating"
  spec={{ max: 5, step: 0.5 }}
  description="별점을 매겨주세요"
/>

// 읽기 전용
<Field
  role="Rating"
  label="Average Rating"
  model="product.avgRating"
  spec={{ max: 5 }}
  disabled
/>
```

**spec**:
- `max`: 최대 별 개수 (필수)
- `step`: 증감 단위 (0.5 = 반별, 1 = 정수)

---

## 🎯 Selection

### Select (드롭다운)

**HTML 매핑**: `<select>`

**예시**:
```tsx
<Field
  role="Select"
  label="Country"
  model="user.country"
  spec={{
    options: [
      { label: 'South Korea', value: 'kr' },
      { label: 'United States', value: 'us' },
      { label: 'Japan', value: 'jp' },
    ]
  }}
  required
/>

// 다중 선택
<Field
  role="Select"
  label="Categories"
  model="product.categories"
  spec={{
    options: categories,
    multiple: true
  }}
/>
```

**spec**:
- `options`: 선택 항목 배열 (필수)
- `multiple`: 다중 선택 허용

**Option 타입**:
```tsx
type Option = {
  label: string;
  value: string | number;
  disabled?: boolean;
};
```

---

### Combobox (자동완성)

**HTML 매핑**: `<input>` + `<datalist>` or custom

**예시**:
```tsx
<Field
  role="Combobox"
  label="City"
  model="user.city"
  spec={{
    options: cities,
    freeSolo: true,
    filter: 'contains'
  }}
  placeholder="도시를 입력하거나 선택하세요"
/>
```

**spec**:
- `options`: 자동완성 항목 (필수)
- `freeSolo`: 목록에 없는 값 입력 허용
- `filter`: 필터링 방식 (contains, startsWith, none)

**Select vs Combobox**:
- Select: 목록에서만 선택
- Combobox: 검색 + 자유 입력 가능

---

### RadioGroup (라디오)

**HTML 매핑**: `<input type="radio">` 그룹

**예시**:
```tsx
<Field
  role="RadioGroup"
  label="Gender"
  model="user.gender"
  spec={{
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' },
    ],
    legend: 'Select your gender'
  }}
/>
```

**spec**:
- `options`: 선택 항목 배열 (필수)
- `legend`: 그룹 설명 (접근성)

---

## 🔘 Toggle

### Checkbox (체크박스)

**HTML 매핑**: `<input type="checkbox">`

**예시**:
```tsx
// 단일 체크박스
<Field
  role="Checkbox"
  label="Agree to Terms"
  model="user.agreedToTerms"
  required
/>

// indeterminate (일부 선택)
<Field
  role="Checkbox"
  label="Select All"
  model="selectAll"
  spec={{ indeterminate: someSelected && !allSelected }}
/>
```

**spec**:
- `indeterminate`: 일부 선택 상태 표시

---

### Switch (스위치)

**HTML 매핑**: `<input type="checkbox" role="switch">`

**예시**:
```tsx
<Field
  role="Switch"
  label="Enable Notifications"
  model="settings.notificationsEnabled"
/>

<Field
  role="Switch"
  label="Dark Mode"
  model="settings.darkMode"
/>
```

**Checkbox vs Switch**:
- Checkbox: 동의, 선택, 포함 여부
- Switch: 기능 활성화/비활성화, 설정 토글

---

## 📅 Date/Time

### DateInput (날짜)

**HTML 매핑**: `<input type="date">`

**예시**:
```tsx
<Field
  role="DateInput"
  label="Birth Date"
  model="user.birthDate"
  spec={{ min: '1900-01-01', max: '2025-12-31' }}
  required
/>
```

**spec**:
- `min`: 최소 날짜 (YYYY-MM-DD)
- `max`: 최대 날짜 (YYYY-MM-DD)

---

### TimeInput (시간)

**HTML 매핑**: `<input type="time">`

**예시**:
```tsx
<Field
  role="TimeInput"
  label="Appointment Time"
  model="appointment.time"
  spec={{ min: '09:00', max: '18:00', step: 1800 }}
  description="영업시간: 9am-6pm"
/>
```

**spec**:
- `min`: 최소 시간 (HH:mm)
- `max`: 최대 시간 (HH:mm)
- `step`: 증감 단위 (초, 기본 60)

---

### DateTimeInput (날짜+시간)

**HTML 매핑**: `<input type="datetime-local">`

**예시**:
```tsx
<Field
  role="DateTimeInput"
  label="Event Start"
  model="event.startDateTime"
  spec={{ min: '2026-01-01T00:00', max: '2026-12-31T23:59' }}
/>
```

**spec**:
- `min`: 최소 날짜시간
- `max`: 최대 날짜시간

---

## 🎨 Specialized

### FileInput (파일 업로드)

**HTML 매핑**: `<input type="file">`

**예시**:
```tsx
// 이미지만
<Field
  role="FileInput"
  label="Profile Picture"
  model="user.avatar"
  spec={{ accept: 'image/*' }}
/>

// 다중 파일
<Field
  role="FileInput"
  label="Attachments"
  model="email.attachments"
  spec={{ accept: '.pdf,.doc,.docx', multiple: true }}
  description="PDF, DOC 파일만 가능"
/>
```

**spec**:
- `accept`: 허용 파일 타입 (MIME 또는 확장자)
- `multiple`: 다중 파일 선택

---

### OTPInput (OTP 코드)

**HTML 매핑**: Custom component (여러 개의 input)

**예시**:
```tsx
<Field
  role="OTPInput"
  label="Verification Code"
  model="auth.otp"
  spec={{ length: 6, numeric: true }}
  description="이메일로 전송된 6자리 코드를 입력하세요"
/>
```

**spec**:
- `length`: 자릿수 (필수)
- `numeric`: 숫자만 허용

**자동 처리**:
- 자동 포커스 이동
- 붙여넣기 처리
- 자동 submit (마지막 자리 입력 시)

---

### TagInput (태그)

**HTML 매핑**: Custom component

**예시**:
```tsx
<Field
  role="TagInput"
  label="Tags"
  model="article.tags"
  spec={{
    suggestions: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'typescript' },
      { label: 'IDDL', value: 'iddl' },
    ],
    maxItems: 5
  }}
  description="최대 5개까지 입력 가능"
/>
```

**spec**:
- `suggestions`: 자동완성 추천
- `maxItems`: 최대 개수

**자동 처리**:
- Enter로 추가
- X 버튼으로 삭제
- 자동완성

---

## 🎨 Prominence × Intent

Field도 prominence와 intent를 지원합니다:

```tsx
// 에러 상태
<Field
  role="TextInput"
  label="Email"
  model="user.email"
  intent="Critical"
  error="유효하지 않은 이메일 주소"
/>

// 성공 상태
<Field
  role="TextInput"
  label="Username"
  model="user.username"
  intent="Positive"
  description="사용 가능한 아이디입니다"
/>

// 경고
<Field
  role="NumberInput"
  label="Age"
  model="user.age"
  intent="Caution"
  description="18세 미만은 보호자 동의 필요"
/>
```

---

## 📝 실전 패턴

### 1. 로그인 폼

```tsx
<Block role="Form" prominence="Strong">
  <Text role="Title" prominence="Strong">
    Sign In
  </Text>

  <Field
    role="EmailInput"
    label="Email"
    model="auth.email"
    required
    placeholder="you@example.com"
  />

  <Field
    role="PasswordInput"
    label="Password"
    model="auth.password"
    required
    spec={{ revealable: true }}
  />

  <Block role="Toolbar">
    <Action role="Link" href="/forgot-password" prominence="Subtle">
      Forgot Password?
    </Action>
    <Action role="Button" prominence="Strong" intent="Brand">
      Sign In
    </Action>
  </Block>
</Block>
```

---

### 2. 회원가입 폼

```tsx
<Block role="Form" prominence="Strong">
  <Text role="Title" prominence="Strong">
    Create Account
  </Text>

  <Field
    role="TextInput"
    label="Name"
    model="user.name"
    required
  />

  <Field
    role="EmailInput"
    label="Email"
    model="user.email"
    required
  />

  <Field
    role="PasswordInput"
    label="Password"
    model="user.password"
    required
    spec={{ revealable: true }}
    description="8자 이상, 영문+숫자 조합"
  />

  <Field
    role="DateInput"
    label="Birth Date"
    model="user.birthDate"
    required
  />

  <Field
    role="Checkbox"
    label="I agree to the Terms and Conditions"
    model="user.agreedToTerms"
    required
  />

  <Block role="Toolbar">
    <Action role="Button" prominence="Standard">
      Cancel
    </Action>
    <Action role="Button" prominence="Strong" intent="Brand">
      Sign Up
    </Action>
  </Block>
</Block>
```

---

### 3. 설정 페이지

```tsx
<Block role="Form" prominence="Standard">
  <Text role="Title" prominence="Strong">
    Settings
  </Text>

  {/* Profile */}
  <Text role="Title" prominence="Standard">Profile</Text>

  <Field
    role="TextInput"
    label="Display Name"
    model="settings.displayName"
  />

  <Field
    role="TextArea"
    label="Bio"
    model="settings.bio"
    spec={{ rows: 3, maxLength: 200 }}
  />

  {/* Notifications */}
  <Text role="Title" prominence="Standard">Notifications</Text>

  <Field
    role="Switch"
    label="Email Notifications"
    model="settings.emailNotifications"
  />

  <Field
    role="Switch"
    label="Push Notifications"
    model="settings.pushNotifications"
  />

  {/* Privacy */}
  <Text role="Title" prominence="Standard">Privacy</Text>

  <Field
    role="RadioGroup"
    label="Profile Visibility"
    model="settings.profileVisibility"
    spec={{
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Friends Only', value: 'friends' },
        { label: 'Private', value: 'private' },
      ]
    }}
  />

  <Block role="Toolbar">
    <Action role="Button" prominence="Standard">
      Reset
    </Action>
    <Action role="Button" prominence="Strong" intent="Positive">
      Save Changes
    </Action>
  </Block>
</Block>
```

---

### 4. 필터 폼

```tsx
<Block role="Form" prominence="Standard">
  <Text role="Title" prominence="Standard">Filters</Text>

  <Field
    role="SearchInput"
    label="Search"
    model="filter.query"
    spec={{ clearable: true }}
    placeholder="Search products..."
  />

  <Field
    role="Select"
    label="Category"
    model="filter.category"
    spec={{ options: categories }}
  />

  <Field
    role="Slider"
    label="Price Range"
    model="filter.priceRange"
    spec={{ min: 0, max: 1000, step: 10, range: true }}
  />

  <Field
    role="Rating"
    label="Minimum Rating"
    model="filter.minRating"
    spec={{ max: 5 }}
  />

  <Block role="Toolbar">
    <Action role="Button" prominence="Standard">
      Clear
    </Action>
    <Action role="Button" prominence="Strong" intent="Brand">
      Apply Filters
    </Action>
  </Block>
</Block>
```

---

## 🚫 자주 하는 실수

### 실수 1: role과 spec 불일치

```tsx
// ❌ BAD - Select인데 options 없음
<Field
  role="Select"
  label="Country"
  model="user.country"
/>

// ✅ GOOD - spec에 options 포함
<Field
  role="Select"
  label="Country"
  model="user.country"
  spec={{ options: countries }}
/>
```

---

### 실수 2: required 누락

```tsx
// ❌ BAD - 필수 입력인데 required 없음
<Field
  role="EmailInput"
  label="Email"
  model="user.email"
/>

// ✅ GOOD - required 명시
<Field
  role="EmailInput"
  label="Email"
  model="user.email"
  required
/>
```

---

### 실수 3: label 누락

```tsx
// ❌ BAD - label 없음 (접근성 문제)
<Field
  role="TextInput"
  model="user.name"
/>

// ✅ GOOD - label 필수
<Field
  role="TextInput"
  label="Name"
  model="user.name"
/>
```

---

### 실수 4: Checkbox를 RadioGroup 대신 사용

```tsx
// ❌ BAD - 단일 선택인데 Checkbox 여러 개
<Field role="Checkbox" label="Option A" model="choice" />
<Field role="Checkbox" label="Option B" model="choice" />
<Field role="Checkbox" label="Option C" model="choice" />

// ✅ GOOD - RadioGroup 사용
<Field
  role="RadioGroup"
  label="Select One"
  model="choice"
  spec={{
    options: [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
      { label: 'Option C', value: 'c' },
    ]
  }}
/>
```

---

## 📝 실습: 상품 등록 폼

### 요구사항

다음 요구사항을 만족하는 상품 등록 폼을 만드세요:

1. 상품명 (필수, 텍스트)
2. 카테고리 (필수, 드롭다운)
3. 가격 (필수, 숫자, 0 이상)
4. 설명 (선택, 여러 줄, 최대 500자)
5. 이미지 (선택, 파일 업로드, 이미지만)
6. 재고 있음 (체크박스)

### 정답 예시

```tsx
function ProductForm() {
  const categories = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' },
  ];

  return (
    <Block role="Form" prominence="Strong">
      <Text role="Title" prominence="Strong">
        Add New Product
      </Text>

      <Field
        role="TextInput"
        label="Product Name"
        model="product.name"
        required
      />

      <Field
        role="Select"
        label="Category"
        model="product.category"
        spec={{ options: categories }}
        required
      />

      <Field
        role="NumberInput"
        label="Price"
        model="product.price"
        spec={{ min: 0, step: 0.01 }}
        required
        description="USD"
      />

      <Field
        role="TextArea"
        label="Description"
        model="product.description"
        spec={{ rows: 5, maxLength: 500 }}
        description="최대 500자"
      />

      <Field
        role="FileInput"
        label="Product Image"
        model="product.image"
        spec={{ accept: 'image/*' }}
      />

      <Field
        role="Checkbox"
        label="In Stock"
        model="product.inStock"
      />

      <Block role="Toolbar">
        <Action role="Button" prominence="Standard">
          Cancel
        </Action>
        <Action role="Button" prominence="Strong" intent="Positive">
          Add Product
        </Action>
      </Block>
    </Block>
  );
}
```

**체크리스트**:
- [ ] 필수 필드에 `required`가 있는가?
- [ ] 모든 Field에 `label`이 있는가?
- [ ] Select에 `options`가 있는가?
- [ ] NumberInput에 `min`이 설정되어 있는가?
- [ ] TextArea에 `maxLength`가 있는가?
- [ ] FileInput에 `accept`가 설정되어 있는가?

---

## ✅ 이 문서를 읽고 나면

- [x] Field Element의 역할을 이해했다
- [x] 18가지 Field Role을 파악했다
- [x] role × spec 조합을 활용할 수 있다
- [x] 실전 폼을 구성할 수 있다
- [x] 적절한 Role을 선택할 수 있다

---

## 🔗 다음 단계

[Block 컴포넌트](./04-block.md) - Form, Card, Toolbar 등 논리적 그룹핑을 배웁니다.

---

**최종 업데이트**: 2026-01-11
**난이도**: 중고급
**예상 소요 시간**: 45분
