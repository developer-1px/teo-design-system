# DataType Reference: 21가지 필드 타입 상세 가이드 📝

**IDDL Specification v1.0.1**

모든 Field dataType의 완전한 레퍼런스입니다.

---

## 목차

1. [텍스트 계열 (6개)](#텍스트-계열)
2. [숫자 계열 (4개)](#숫자-계열)
3. [날짜 계열 (2개)](#날짜-계열)
4. [선택 계열 (5개)](#선택-계열)
5. [파일 계열 (2개)](#파일-계열)
6. [기타 (2개)](#기타)

---

## 텍스트 계열

### text

**용도**: 일반 텍스트 입력

**view 모드**: 일반 텍스트
**edit 모드**: `<input type="text">`

```json
{
  "type": "Field",
  "label": "Username",
  "model": "user.username",
  "dataType": "text",
  "required": true,
  "placeholder": "Enter username",
  "constraints": {
    "minLength": 3,
    "maxLength": 20,
    "pattern": "^[a-zA-Z0-9_]+$"
  },
  "errorMessages": {
    "required": "Username is required",
    "minLength": "Username must be at least 3 characters",
    "pattern": "Only letters, numbers, and underscores allowed"
  }
}
```

**Constraints**:
- `minLength`: 최소 길이
- `maxLength`: 최대 길이
- `pattern`: 정규식

**속성**:
- `clearable`: 입력 내용 지우기 버튼 표시 (v1.0.2)

---

### textarea

**용도**: 여러 줄 텍스트 입력

**view 모드**: 여러 줄 텍스트 (줄바꿈 유지)
**edit 모드**: `<textarea>`

```json
{
  "type": "Field",
  "label": "Description",
  "model": "product.description",
  "dataType": "textarea",
  "placeholder": "Enter description",
  "helpText": "Maximum 500 characters",
  "constraints": {
    "maxLength": 500
  }
}
```

**Constraints**:
- `minLength`: 최소 길이
- `maxLength`: 최대 길이
- `rows`: 행 수 (기본: 3)

---

### richtext

**용도**: HTML 리치 텍스트 입력

**view 모드**: HTML 렌더링
**edit 모드**: WYSIWYG 에디터

```json
{
  "type": "Field",
  "label": "Content",
  "model": "post.content",
  "dataType": "richtext",
  "helpText": "Use the editor to format your content"
}
```

**Constraints**:
- `maxLength`: 최대 길이 (HTML 포함)

**렌더링**:
```html
<!-- view 모드 -->
<div dangerouslySetInnerHTML={{ __html: value }} />

<!-- edit 모드 -->
<RichTextEditor value={value} onChange={onChange} />
```

---

### password

**용도**: 비밀번호 입력

**view 모드**: `••••••` (마스킹)
**edit 모드**: `<input type="password">`

```json
{
  "type": "Field",
  "label": "Password",
  "model": "user.password",
  "dataType": "password",
  "required": true,
  "placeholder": "Enter password",
  "helpText": "At least 8 characters with 1 uppercase, 1 lowercase, and 1 number",
  "constraints": {
    "minLength": 8,
    "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"
  },
  "errorMessages": {
    "minLength": "Password must be at least 8 characters",
    "pattern": "Password must include uppercase, lowercase, and number"
  }
}
```

**Constraints**:
- `minLength`: 최소 길이
- `pattern`: 정규식 (강도 검증)

**속성**:
- `clearable`: 입력 내용 지우기 버튼 표시 (v1.0.2)

---

### email

**용도**: 이메일 주소 입력

**view 모드**: 이메일 링크 (`<a href="mailto:">`)
**edit 모드**: `<input type="email">`

```json
{
  "type": "Field",
  "label": "Email",
  "model": "user.email",
  "dataType": "email",
  "required": true,
  "placeholder": "you@example.com",
  "constraints": {
    "pattern": "^[^@]+@[^@]+\\.[^@]+$"
  },
  "errorMessages": {
    "required": "Email is required",
    "pattern": "Please enter a valid email address"
  }
}
```

**Constraints**:
- `pattern`: 이메일 정규식 (기본 제공)

**속성**:
- `clearable`: 입력 내용 지우기 버튼 표시 (v1.0.2)

**렌더링**:
```html
<!-- view 모드 -->
<a href="mailto:user@example.com">user@example.com</a>
```

---

### url

**용도**: URL 입력

**view 모드**: URL 링크 (`<a href="" target="_blank">`)
**edit 모드**: `<input type="url">`

```json
{
  "type": "Field",
  "label": "Website",
  "model": "company.website",
  "dataType": "url",
  "placeholder": "https://example.com",
  "constraints": {
    "pattern": "^https?://.*"
  }
}
```

**Constraints**:
- `pattern`: URL 정규식 (기본 제공)

**속성**:
- `clearable`: 입력 내용 지우기 버튼 표시 (v1.0.2)

**렌더링**:
```html
<!-- view 모드 -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  https://example.com
</a>
```

---

## 숫자 계열

### number

**용도**: 숫자 입력

**view 모드**: 숫자
**edit 모드**: `<input type="number">`

```json
{
  "type": "Field",
  "label": "Age",
  "model": "user.age",
  "dataType": "number",
  "required": true,
  "constraints": {
    "min": 18,
    "max": 120,
    "step": 1
  },
  "errorMessages": {
    "min": "You must be at least 18 years old",
    "max": "Invalid age"
  }
}
```

**Constraints**:
- `min`: 최솟값
- `max`: 최댓값
- `step`: 증감 단위 (기본: 1)

---

### currency

**용도**: 통화 입력

**view 모드**: `$1,234.56` (포맷팅)
**edit 모드**: Currency Input (포맷팅 + 검증)

```json
{
  "type": "Field",
  "label": "Price",
  "model": "product.price",
  "dataType": "currency",
  "required": true,
  "currency": "USD",
  "constraints": {
    "min": 0,
    "max": 1000000
  }
}
```

**속성**:
- `currency`: 통화 코드 (USD, EUR, KRW 등)
- `locale`: 로케일 (en-US, ko-KR 등)

**Constraints**:
- `min`: 최솟값
- `max`: 최댓값

**렌더링**:
```html
<!-- view 모드 (USD) -->
$1,234.56

<!-- view 모드 (KRW) -->
₩1,234

<!-- edit 모드 -->
<input type="text" value="$1,234.56" />
```

---

### rating

**용도**: 별점 입력

**view 모드**: `★★★★☆` (4/5)
**edit 모드**: 클릭 가능한 별

```json
{
  "type": "Field",
  "label": "Rating",
  "model": "review.rating",
  "dataType": "rating",
  "required": true,
  "max": 5,
  "helpText": "Click to rate"
}
```

**Constraints**:
- `max`: 최대 별 개수 (기본: 5)
- `min`: 최소 값 (기본: 0)
- `step`: 증감 단위 (0.5, 1 등)

---

### range

**용도**: 범위 슬라이더

**view 모드**: `50%` (퍼센트 또는 값)
**edit 모드**: `<input type="range">`

```json
{
  "type": "Field",
  "label": "Volume",
  "model": "settings.volume",
  "dataType": "range",
  "constraints": {
    "min": 0,
    "max": 100,
    "step": 5
  },
  "suffix": "%"
}
```

**Constraints**:
- `min`: 최솟값
- `max`: 최댓값
- `step`: 증감 단위

**속성**:
- `suffix`: 접미사 (%, px 등)

---

## 날짜 계열

### date

**용도**: 날짜 선택

**view 모드**: `2025-01-08` (포맷팅)
**edit 모드**: Date Picker

```json
{
  "type": "Field",
  "label": "Birth Date",
  "model": "user.birthDate",
  "dataType": "date",
  "required": true,
  "constraints": {
    "min": "1900-01-01",
    "max": "2025-12-31"
  }
}
```

**Constraints**:
- `min`: 최소 날짜 (ISO 8601)
- `max`: 최대 날짜 (ISO 8601)

**렌더링**:
```html
<!-- view 모드 -->
January 8, 2025

<!-- edit 모드 -->
<DatePicker value={value} onChange={onChange} />
```

---

### datetime

**용도**: 날짜 + 시간 선택

**view 모드**: `2025-01-08 14:30` (포맷팅)
**edit 모드**: DateTime Picker

```json
{
  "type": "Field",
  "label": "Appointment",
  "model": "appointment.datetime",
  "dataType": "datetime",
  "required": true,
  "constraints": {
    "min": "2025-01-01T00:00:00",
    "max": "2025-12-31T23:59:59"
  }
}
```

**Constraints**:
- `min`: 최소 날짜+시간 (ISO 8601)
- `max`: 최대 날짜+시간 (ISO 8601)

**렌더링**:
```html
<!-- view 모드 -->
January 8, 2025 at 2:30 PM

<!-- edit 모드 -->
<DateTimePicker value={value} onChange={onChange} />
```

---

## 선택 계열

### boolean

**용도**: 참/거짓 토글

**view 모드**: `Yes` / `No`
**edit 모드**: Toggle Switch 또는 Checkbox

```json
{
  "type": "Field",
  "label": "Receive Newsletter",
  "model": "user.newsletter",
  "dataType": "boolean",
  "helpText": "Get weekly updates"
}
```

**렌더링**:
```html
<!-- view 모드 -->
Yes

<!-- edit 모드 (toggle) -->
<Switch checked={value} onChange={onChange} />

<!-- edit 모드 (checkbox) -->
<Checkbox checked={value} onChange={onChange} />
```

---

### select

**용도**: 단일 선택 (드롭다운)

**view 모드**: 선택된 항목 레이블
**edit 모드**: `<select>`

```json
{
  "type": "Field",
  "label": "Country",
  "model": "user.country",
  "dataType": "select",
  "required": true,
  "placeholder": "Select country",
  "options": [
    { "value": "us", "label": "United States" },
    { "value": "kr", "label": "South Korea" },
    { "value": "jp", "label": "Japan" }
  ]
}
```

**속성**:
- `options`: 선택 항목 배열
  - `value`: 실제 값
  - `label`: 표시 텍스트

---

### multiselect

**용도**: 다중 선택

**view 모드**: `Item1, Item2, Item3`
**edit 모드**: Multi-select (체크박스 드롭다운)

```json
{
  "type": "Field",
  "label": "Skills",
  "model": "user.skills",
  "dataType": "multiselect",
  "placeholder": "Select skills",
  "options": [
    { "value": "react", "label": "React" },
    { "value": "vue", "label": "Vue" },
    { "value": "angular", "label": "Angular" }
  ],
  "constraints": {
    "minItems": 1,
    "maxItems": 5
  }
}
```

**Constraints**:
- `minItems`: 최소 선택 개수
- `maxItems`: 최대 선택 개수

---

### radio

**용도**: 단일 선택 (라디오 버튼)

**view 모드**: 선택된 항목 레이블
**edit 모드**: Radio Group

```json
{
  "type": "Field",
  "label": "Gender",
  "model": "user.gender",
  "dataType": "radio",
  "required": true,
  "options": [
    { "value": "male", "label": "Male" },
    { "value": "female", "label": "Female" },
    { "value": "other", "label": "Other" }
  ]
}
```

**렌더링**:
```html
<!-- edit 모드 -->
<div>
  <label><input type="radio" name="gender" value="male" /> Male</label>
  <label><input type="radio" name="gender" value="female" /> Female</label>
  <label><input type="radio" name="gender" value="other" /> Other</label>
</div>
```

---

### checkbox

**용도**: 다중 선택 (체크박스)

**view 모드**: `Item1, Item2`
**edit 모드**: Checkbox Group

```json
{
  "type": "Field",
  "label": "Interests",
  "model": "user.interests",
  "dataType": "checkbox",
  "options": [
    { "value": "sports", "label": "Sports" },
    { "value": "music", "label": "Music" },
    { "value": "travel", "label": "Travel" }
  ],
  "constraints": {
    "minItems": 1
  }
}
```

**Constraints**:
- `minItems`: 최소 선택 개수
- `maxItems`: 최대 선택 개수

---

## 파일 계열

### file

**용도**: 파일 업로드

**view 모드**: 다운로드 링크
**edit 모드**: File Input

```json
{
  "type": "Field",
  "label": "Resume",
  "model": "user.resume",
  "dataType": "file",
  "required": true,
  "constraints": {
    "accept": ".pdf,.doc,.docx",
    "maxSize": 5242880
  },
  "helpText": "Max 5MB, PDF or Word"
}
```

**Constraints**:
- `accept`: 허용 파일 타입 (MIME type 또는 확장자)
- `maxSize`: 최대 파일 크기 (bytes)

**렌더링**:
```html
<!-- view 모드 -->
<a href="/files/resume.pdf" download>resume.pdf</a>

<!-- edit 모드 -->
<input type="file" accept=".pdf,.doc,.docx" />
```

---

### image

**용도**: 이미지 업로드

**view 모드**: `<img>` 썸네일
**edit 모드**: Image Uploader (드래그 앤 드롭)

```json
{
  "type": "Field",
  "label": "Profile Picture",
  "model": "user.avatar",
  "dataType": "image",
  "constraints": {
    "accept": "image/jpeg,image/png,image/webp",
    "maxSize": 2097152
  },
  "helpText": "Max 2MB, JPG or PNG",
  "lazy": true,
  "placeholder": "/placeholder-avatar.png"
}
```

**Constraints**:
- `accept`: 허용 이미지 타입
- `maxSize`: 최대 파일 크기 (bytes)

**속성**:
- `lazy`: 지연 로딩
- `placeholder`: 플레이스홀더 이미지
- `alt`: 대체 텍스트 (model 참조)

**렌더링**:
```html
<!-- view 모드 -->
<img src="/avatar.jpg" alt="Profile Picture" loading="lazy" />

<!-- edit 모드 -->
<ImageUploader value={value} onChange={onChange} />
```

---

## 기타

### phone

**용도**: 전화번호 입력

**view 모드**: 전화번호 링크 (`<a href="tel:">`)
**edit 모드**: Phone Input (국가 코드 + 포맷팅)

```json
{
  "type": "Field",
  "label": "Phone",
  "model": "user.phone",
  "dataType": "phone",
  "required": true,
  "placeholder": "+1 (555) 123-4567",
  "constraints": {
    "pattern": "^\\+?[1-9]\\d{1,14}$"
  }
}
```

**Constraints**:
- `pattern`: E.164 형식 정규식

**속성**:
- `clearable`: 입력 내용 지우기 버튼 표시 (v1.0.2)

**렌더링**:
```html
<!-- view 모드 -->
<a href="tel:+15551234567">+1 (555) 123-4567</a>

<!-- edit 모드 -->
<PhoneInput value={value} onChange={onChange} />
```

---

### color

**용도**: 색상 선택

**view 모드**: 색상 칩 + 색상 코드
**edit 모드**: Color Picker

```json
{
  "type": "Field",
  "label": "Brand Color",
  "model": "brand.color",
  "dataType": "color",
  "helpText": "Choose your brand color"
}
```

**렌더링**:
```html
<!-- view 모드 -->
<div>
  <div class="color-chip" style="background: #3b82f6"></div>
  <span>#3b82f6</span>
</div>

<!-- edit 모드 -->
<ColorPicker value={value} onChange={onChange} />
```

---

## 빠른 참조

### 텍스트 계열

| dataType | view | edit | Constraints |
|----------|------|------|-------------|
| text | 일반 텍스트 | input[type=text] | minLength, maxLength, pattern |
| textarea | 여러 줄 | textarea | minLength, maxLength, rows |
| richtext | HTML | WYSIWYG | maxLength |
| password | ••••••• | input[type=password] | minLength, pattern |
| email | 이메일 링크 | input[type=email] | pattern |
| url | URL 링크 | input[type=url] | pattern |

---

### 숫자 계열

| dataType | view | edit | Constraints |
|----------|------|------|-------------|
| number | 숫자 | input[type=number] | min, max, step |
| currency | $1,234.56 | Currency Input | min, max |
| rating | ★★★★☆ | Star Rating | min, max, step |
| range | 50% | input[type=range] | min, max, step |

---

### 날짜 계열

| dataType | view | edit | Constraints |
|----------|------|------|-------------|
| date | 2025-01-08 | Date Picker | min, max |
| datetime | 2025-01-08 14:30 | DateTime Picker | min, max |

---

### 선택 계열

| dataType | view | edit | Constraints |
|----------|------|------|-------------|
| boolean | Yes/No | Toggle/Checkbox | - |
| select | 선택된 항목 | select | required |
| multiselect | 항목1, 항목2 | Multi-select | minItems, maxItems |
| radio | 선택된 항목 | Radio group | required |
| checkbox | 항목1, 항목2 | Checkbox group | minItems, maxItems |

---

### 파일 계열

| dataType | view | edit | Constraints |
|----------|------|------|-------------|
| file | 다운로드 링크 | File input | accept, maxSize |
| image | img 썸네일 | Image uploader | accept, maxSize |

---

### 기타

| dataType | view | edit | Constraints |
|----------|------|------|-------------|
| phone | 전화번호 링크 | Phone input | pattern |
| color | 🟦 #3b82f6 | Color picker | - |

---

## Constraints 참조

### 문자열

| Constraint | 적용 dataType | 설명 | 예시 |
|------------|---------------|------|------|
| `minLength` | text, textarea, richtext, password, email, url, phone | 최소 길이 | 3 |
| `maxLength` | 위와 동일 | 최대 길이 | 100 |
| `pattern` | 위와 동일 | 정규식 | `^[a-zA-Z0-9]+$` |

---

### 숫자

| Constraint | 적용 dataType | 설명 | 예시 |
|------------|---------------|------|------|
| `min` | number, currency, range, rating | 최솟값 | 0 |
| `max` | 위와 동일 | 최댓값 | 100 |
| `step` | 위와 동일 | 증감 단위 | 0.5 |

---

### 날짜

| Constraint | 적용 dataType | 설명 | 예시 |
|------------|---------------|------|------|
| `min` | date, datetime | 최소 날짜 | `"2025-01-01"` |
| `max` | 위와 동일 | 최대 날짜 | `"2025-12-31"` |

---

### 파일

| Constraint | 적용 dataType | 설명 | 예시 |
|------------|---------------|------|------|
| `accept` | file, image | 허용 파일 타입 | `".pdf,.doc"` |
| `maxSize` | 위와 동일 | 최대 크기 (bytes) | 5242880 (5MB) |

---

### 다중 선택

| Constraint | 적용 dataType | 설명 | 예시 |
|------------|---------------|------|------|
| `minItems` | multiselect, checkbox | 최소 선택 개수 | 1 |
| `maxItems` | 위와 동일 | 최대 선택 개수 | 5 |

---

## 선택 가이드

### 텍스트 입력

```
짧은 한 줄 → text
여러 줄 → textarea
HTML 필요 → richtext
비밀번호 → password
이메일 → email
URL → url
전화번호 → phone
```

---

### 숫자 입력

```
일반 숫자 → number
금액 → currency
별점 → rating
슬라이더 → range
```

---

### 날짜/시간

```
날짜만 → date
날짜 + 시간 → datetime
```

---

### 선택

```
예/아니오 → boolean
드롭다운 (단일) → select
드롭다운 (다중) → multiselect
라디오 버튼 (단일) → radio
체크박스 (다중) → checkbox
```

---

### 파일

```
일반 파일 → file
이미지 → image
```

---

## 핵심 정리

### 21가지 dataType

```
텍스트: text, textarea, richtext, password, email, url (6개)
숫자: number, currency, rating, range (4개)
날짜: date, datetime (2개)
선택: boolean, select, multiselect, radio, checkbox (5개)
파일: file, image (2개)
기타: phone, color (2개)
```

### 모든 Field 공통 속성

```
label: 필드 레이블 (필수)
model: 데이터 바인딩 경로 (필수)
dataType: 필드 타입 (필수)
mode: view | edit
required: 필수 여부
placeholder: 플레이스홀더
helpText: 도움말
constraints: 검증 규칙
errorMessages: 에러 메시지
```

---

## 참고

- **전체 스펙**: [IDDL Specification v1.0.1](/spec/iddl-spec-1.0.1.md)
- **API 레퍼런스**: [API Reference](./api-reference.md)
- **검증 가이드**: [Level 3-2: 검증과 에러 처리](../03-data-interaction/02-validation.md)

---

**이전**: [← Role Taxonomy](./role-taxonomy.md)
**다음**: [Troubleshooting →](./troubleshooting.md)
