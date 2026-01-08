# Field 타입: 21가지 dataType 완전 정복 📝

**예상 소요 시간**: 15분
**난이도**: ⭐⭐⭐ 중급
**사전 지식**: [Primitives](../02-structure/01-primitives.md)

---

## 이 문서를 읽고 나면

- 21가지 Field dataType을 모두 이해합니다
- 각 타입이 view/edit 모드에서 어떻게 렌더링되는지 알게 됩니다
- 상황에 맞는 적절한 dataType을 선택할 수 있습니다

---

## dataType이란?

> **"Field가 어떤 종류의 데이터를 다루는지 선언"**

dataType은 **데이터의 본질**을 선언합니다. 구현이 아닌 의미를 정의합니다.

```json
{
  "type": "Field",
  "label": "Email",
  "model": "user.email",
  "dataType": "email"  // ← 이메일 데이터라는 의미
}
```

**mode에 따른 렌더링**:
- `mode="view"` → 이메일 링크로 표시
- `mode="edit"` → `<input type="email">` 렌더링

---

## 21가지 dataType 분류

### 📝 텍스트 계열 (6종)

#### 1. text - 단순 텍스트

**용도**: 일반적인 한 줄 텍스트

```json
{
  "type": "Field",
  "label": "Name",
  "model": "user.name",
  "dataType": "text",
  "placeholder": "Enter your name"
}
```

**렌더링**:
- **view**: `Teo`
- **edit**: `<input type="text">`

---

#### 2. textarea - 여러 줄 텍스트

**용도**: 긴 텍스트 입력

```json
{
  "type": "Field",
  "label": "Bio",
  "model": "user.bio",
  "dataType": "textarea",
  "constraints": {
    "maxLength": 500
  }
}
```

**렌더링**:
- **view**: 여러 줄 텍스트 표시 (줄바꿈 유지)
- **edit**: `<textarea rows="4">`

---

#### 3. richtext - 서식 있는 텍스트

**용도**: 마크다운, HTML 에디터

```json
{
  "type": "Field",
  "label": "Description",
  "model": "product.description",
  "dataType": "richtext"
}
```

**렌더링**:
- **view**: HTML 렌더링
- **edit**: WYSIWYG 에디터 (Quill, Tiptap 등)

---

#### 4. password - 비밀번호

**용도**: 비밀번호 입력

```json
{
  "type": "Field",
  "label": "Password",
  "model": "credentials.password",
  "dataType": "password",
  "required": true,
  "constraints": {
    "minLength": 8
  }
}
```

**렌더링**:
- **view**: `••••••••` (마스킹)
- **edit**: `<input type="password">`

---

#### 5. email - 이메일

**용도**: 이메일 주소

```json
{
  "type": "Field",
  "label": "Email",
  "model": "user.email",
  "dataType": "email",
  "required": true
}
```

**렌더링**:
- **view**: `<a href="mailto:teo@example.com">teo@example.com</a>`
- **edit**: `<input type="email">` (브라우저 validation)

---

#### 6. url - URL

**용도**: 웹사이트 주소

```json
{
  "type": "Field",
  "label": "Website",
  "model": "user.website",
  "dataType": "url"
}
```

**렌더링**:
- **view**: `<a href="https://example.com" target="_blank">example.com</a>`
- **edit**: `<input type="url">`

---

### 🔢 숫자 계열 (4종)

#### 7. number - 일반 숫자

**용도**: 정수/실수

```json
{
  "type": "Field",
  "label": "Age",
  "model": "user.age",
  "dataType": "number",
  "constraints": {
    "min": 0,
    "max": 120
  }
}
```

**렌더링**:
- **view**: `25` (숫자 포맷)
- **edit**: `<input type="number">`

---

#### 8. currency - 통화

**용도**: 금액

```json
{
  "type": "Field",
  "label": "Price",
  "model": "product.price",
  "dataType": "currency",
  "constraints": {
    "currency": "USD",
    "min": 0
  }
}
```

**렌더링**:
- **view**: `$1,234.56` (통화 포맷)
- **edit**: Currency Input (자동 포맷팅)

---

#### 9. rating - 평점

**용도**: 별점, 평가

```json
{
  "type": "Field",
  "label": "Rating",
  "model": "review.rating",
  "dataType": "rating",
  "constraints": {
    "max": 5
  }
}
```

**렌더링**:
- **view**: `★★★★☆ 4/5`
- **edit**: Interactive star rating

---

#### 10. range - 범위 슬라이더

**용도**: 슬라이더로 선택

```json
{
  "type": "Field",
  "label": "Volume",
  "model": "settings.volume",
  "dataType": "range",
  "constraints": {
    "min": 0,
    "max": 100,
    "step": 10
  }
}
```

**렌더링**:
- **view**: `50%`
- **edit**: `<input type="range">` + 숫자 표시

---

### 📅 날짜/시간 계열 (2종)

#### 11. date - 날짜

**용도**: 년월일

```json
{
  "type": "Field",
  "label": "Birth Date",
  "model": "user.birthDate",
  "dataType": "date"
}
```

**렌더링**:
- **view**: `2025-01-08` 또는 `January 8, 2025`
- **edit**: Date Picker

---

#### 12. datetime - 날짜+시간

**용도**: 년월일시분초

```json
{
  "type": "Field",
  "label": "Created At",
  "model": "post.createdAt",
  "dataType": "datetime"
}
```

**렌더링**:
- **view**: `2025-01-08 14:30:00`
- **edit**: DateTime Picker

---

### ✅ 선택 계열 (4종)

#### 13. boolean - 참/거짓

**용도**: 예/아니오, 켜짐/꺼짐

```json
{
  "type": "Field",
  "label": "Active",
  "model": "user.isActive",
  "dataType": "boolean"
}
```

**렌더링**:
- **view**: `✓ Yes` or `✗ No`
- **edit**: Toggle Switch 또는 Checkbox

---

#### 14. select - 단일 선택

**용도**: 드롭다운 (1개 선택)

```json
{
  "type": "Field",
  "label": "Country",
  "model": "user.country",
  "dataType": "select",
  "options": [
    { "value": "kr", "label": "South Korea" },
    { "value": "us", "label": "United States" },
    { "value": "jp", "label": "Japan" }
  ]
}
```

**렌더링**:
- **view**: `South Korea`
- **edit**: `<select>` 드롭다운

---

#### 15. multiselect - 다중 선택

**용도**: 여러 개 선택 가능

```json
{
  "type": "Field",
  "label": "Tags",
  "model": "post.tags",
  "dataType": "multiselect",
  "options": [
    { "value": "react", "label": "React" },
    { "value": "vue", "label": "Vue" },
    { "value": "svelte", "label": "Svelte" }
  ]
}
```

**렌더링**:
- **view**: `React, Vue` (콤마 구분)
- **edit**: Multi-select dropdown 또는 Checkbox group

---

#### 16. radio - 라디오 버튼

**용도**: 단일 선택 (시각적으로 모두 표시)

```json
{
  "type": "Field",
  "label": "Gender",
  "model": "user.gender",
  "dataType": "radio",
  "options": [
    { "value": "male", "label": "Male" },
    { "value": "female", "label": "Female" },
    { "value": "other", "label": "Other" }
  ]
}
```

**렌더링**:
- **view**: `Male`
- **edit**: Radio button group

---

#### 17. checkbox - 체크박스 그룹

**용도**: 다중 선택 (시각적으로 모두 표시)

```json
{
  "type": "Field",
  "label": "Interests",
  "model": "user.interests",
  "dataType": "checkbox",
  "options": [
    { "value": "sports", "label": "Sports" },
    { "value": "music", "label": "Music" },
    { "value": "reading", "label": "Reading" }
  ]
}
```

**렌더링**:
- **view**: `Sports, Music`
- **edit**: Checkbox group

---

### 📎 파일 계열 (3종)

#### 18. file - 파일 업로드

**용도**: 일반 파일

```json
{
  "type": "Field",
  "label": "Attachment",
  "model": "post.attachment",
  "dataType": "file",
  "constraints": {
    "accept": ".pdf,.docx",
    "maxSize": 5242880
  }
}
```

**렌더링**:
- **view**: `📎 document.pdf` (다운로드 링크)
- **edit**: File input

---

#### 19. image - 이미지 업로드

**용도**: 이미지 파일

```json
{
  "type": "Field",
  "label": "Profile Picture",
  "model": "user.avatar",
  "dataType": "image",
  "constraints": {
    "accept": "image/*",
    "maxSize": 2097152
  }
}
```

**렌더링**:
- **view**: `<img src="...">` (썸네일)
- **edit**: Image uploader (미리보기 포함)

---

### 🎨 기타 (2종)

#### 20. phone - 전화번호

**용도**: 전화번호

```json
{
  "type": "Field",
  "label": "Phone",
  "model": "user.phone",
  "dataType": "phone"
}
```

**렌더링**:
- **view**: `<a href="tel:+821012345678">010-1234-5678</a>`
- **edit**: Phone input (포맷팅)

---

#### 21. color - 색상

**용도**: 색상 선택

```json
{
  "type": "Field",
  "label": "Theme Color",
  "model": "settings.themeColor",
  "dataType": "color"
}
```

**렌더링**:
- **view**: `🟦 #3b82f6`
- **edit**: Color picker

---

## dataType 선택 가이드

| 데이터 | dataType |
|--------|----------|
| 이름, 제목 | `text` |
| 긴 설명 | `textarea` |
| 블로그 본문 | `richtext` |
| 비밀번호 | `password` |
| 이메일 | `email` |
| 웹사이트 | `url` |
| 나이, 수량 | `number` |
| 가격 | `currency` |
| 별점 | `rating` |
| 볼륨 조절 | `range` |
| 생일 | `date` |
| 작성 시각 | `datetime` |
| 활성화 여부 | `boolean` |
| 국가 (1개) | `select` |
| 태그 (여러 개) | `multiselect` |
| 성별 | `radio` |
| 관심사 | `checkbox` |
| PDF 첨부 | `file` |
| 프로필 사진 | `image` |
| 전화번호 | `phone` |
| 테마 색상 | `color` |

---

## 실습 1: 사용자 등록 폼

다양한 dataType을 사용하여 등록 폼을 만드세요:

```
Name:     [_______]          (text)
Email:    [_______]          (email)
Password: [_______]          (password)
Age:      [_______]          (number)
Country:  [▼ Select]         (select)
Bio:      [_______]          (textarea)
          [_______]
Active:   [Toggle]           (boolean)
```

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    {
      "type": "Field",
      "label": "Name",
      "model": "user.name",
      "dataType": "text",
      "required": true
    },
    {
      "type": "Field",
      "label": "Email",
      "model": "user.email",
      "dataType": "email",
      "required": true
    },
    {
      "type": "Field",
      "label": "Password",
      "model": "user.password",
      "dataType": "password",
      "required": true,
      "constraints": {
        "minLength": 8
      }
    },
    {
      "type": "Field",
      "label": "Age",
      "model": "user.age",
      "dataType": "number",
      "constraints": {
        "min": 18,
        "max": 120
      }
    },
    {
      "type": "Field",
      "label": "Country",
      "model": "user.country",
      "dataType": "select",
      "options": [
        { "value": "kr", "label": "South Korea" },
        { "value": "us", "label": "United States" }
      ]
    },
    {
      "type": "Field",
      "label": "Bio",
      "model": "user.bio",
      "dataType": "textarea",
      "constraints": {
        "maxLength": 500
      }
    },
    {
      "type": "Field",
      "label": "Active",
      "model": "user.isActive",
      "dataType": "boolean"
    }
  ]
}
```

</details>

---

## 실습 2: 제품 등록 폼

파일/이미지/통화를 사용한 폼:

<details>
<summary>정답 보기</summary>

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    {
      "type": "Field",
      "label": "Product Name",
      "model": "product.name",
      "dataType": "text",
      "required": true
    },
    {
      "type": "Field",
      "label": "Description",
      "model": "product.description",
      "dataType": "richtext"
    },
    {
      "type": "Field",
      "label": "Price",
      "model": "product.price",
      "dataType": "currency",
      "constraints": {
        "currency": "USD",
        "min": 0
      }
    },
    {
      "type": "Field",
      "label": "Product Image",
      "model": "product.image",
      "dataType": "image",
      "constraints": {
        "accept": "image/*",
        "maxSize": 2097152
      }
    },
    {
      "type": "Field",
      "label": "Category",
      "model": "product.category",
      "dataType": "select",
      "options": [
        { "value": "electronics", "label": "Electronics" },
        { "value": "clothing", "label": "Clothing" },
        { "value": "books", "label": "Books" }
      ]
    },
    {
      "type": "Field",
      "label": "Tags",
      "model": "product.tags",
      "dataType": "multiselect",
      "options": [
        { "value": "new", "label": "New" },
        { "value": "sale", "label": "Sale" },
        { "value": "featured", "label": "Featured" }
      ]
    }
  ]
}
```

</details>

---

## 흔한 실수

### 실수 1: 잘못된 dataType 선택

```json
// ❌ Wrong: 이메일인데 text
{
  "label": "Email",
  "dataType": "text"  // 이메일 링크로 렌더링 안됨
}

// ✅ Correct
{
  "label": "Email",
  "dataType": "email"  // 자동으로 링크 생성, 검증
}
```

### 실수 2: select vs radio 혼동

```json
// ❌ Wrong: 옵션이 3개인데 select
{
  "label": "Size",
  "dataType": "select",  // 드롭다운 불필요
  "options": [
    { "value": "s", "label": "Small" },
    { "value": "m", "label": "Medium" },
    { "value": "l", "label": "Large" }
  ]
}

// ✅ Correct: radio로 한눈에 보기
{
  "label": "Size",
  "dataType": "radio",
  "options": [...]
}
```

**규칙**: 옵션이 3-5개 이하면 `radio`, 많으면 `select`

### 실수 3: constraints 누락

```json
// ❌ Wrong: 제약 없음
{
  "label": "Age",
  "dataType": "number"
}

// ✅ Correct: 유효 범위 지정
{
  "label": "Age",
  "dataType": "number",
  "constraints": {
    "min": 0,
    "max": 120
  }
}
```

---

## 핵심 정리

### dataType 분류

```
📝 텍스트: text, textarea, richtext, password, email, url
🔢 숫자: number, currency, rating, range
📅 날짜: date, datetime
✅ 선택: boolean, select, multiselect, radio, checkbox
📎 파일: file, image
🎨 기타: phone, color
```

### 선택 가이드

```
한 줄 텍스트? → text
여러 줄? → textarea
서식 필요? → richtext
숫자? → number
금액? → currency
날짜? → date
참/거짓? → boolean
1개 선택 (많은 옵션)? → select
1개 선택 (적은 옵션)? → radio
여러 개 선택? → multiselect/checkbox
```

---

## 다음 단계

Field dataType을 완벽히 이해했습니다!
이제 **검증(Validation)**과 **constraints**를 깊이 파봅시다.

**다음**: [검증과 제약조건 →](./02-validation.md)

**관련 문서**:
- [Primitives](../02-structure/01-primitives.md) - Field 기본 개념
- [실전: 폼 패턴](../04-patterns/03-form-patterns.md) - 폼 디자인 패턴

---

**이전**: [← Page](../02-structure/05-page.md)
**다음**: [검증과 제약조건 →](./02-validation.md)
