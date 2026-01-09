# IDDL Field 빠른 참조 가이드 🚀

**버전**: IDDL v1.0.2
**최종 업데이트**: 2026-01-09
**대상**: PPT, EMOJI, DSLBuilder 등 입력 컨트롤이 필요한 모든 앱

---

## 🎯 핵심 원칙

### ❌ 하지 말아야 할 것
```tsx
// ❌ Wrong: HTML 태그 직접 사용
<input type="text" />
<select><option>...</option></select>
<input type="color" />
<input type="number" />
```

### ✅ 해야 할 것
```tsx
// ✅ Correct: IDDL Field 사용
<Field label="이름" model="name" dataType="text" />
<Field label="색상" model="color" dataType="color" />
<Field label="크기" model="size" dataType="number" />
```

---

## 📝 21가지 dataType 치트시트

### 텍스트 입력이 필요하면

| 입력 종류 | dataType | 예시 |
|---------|----------|------|
| 한 줄 텍스트 | `text` | 이름, 제목 |
| 여러 줄 텍스트 | `textarea` | 설명, 메모 |
| 서식 있는 텍스트 | `richtext` | 블로그 본문 |
| 비밀번호 | `password` | 암호 입력 |
| 이메일 | `email` | 이메일 주소 |
| URL | `url` | 웹사이트 주소 |
| 전화번호 | `phone` | 전화번호 |

**사용 예시:**
```tsx
<Field label="제목" model="title" dataType="text" />
<Field label="설명" model="description" dataType="textarea" />
<Field label="이메일" model="email" dataType="email" />
```

---

### 숫자 입력이 필요하면

| 입력 종류 | dataType | 예시 |
|---------|----------|------|
| 일반 숫자 | `number` | 나이, 수량 |
| 금액 | `currency` | 가격 |
| 별점 | `rating` | 평점 (★★★★☆) |
| 슬라이더 | `range` | 볼륨, 투명도 |

**사용 예시:**
```tsx
<Field
  label="글꼴 크기"
  model="fontSize"
  dataType="number"
  constraints={{ min: 8, max: 72 }}
/>

<Field
  label="투명도"
  model="opacity"
  dataType="range"
  constraints={{ min: 0, max: 100, step: 5 }}
/>
```

---

### 선택 입력이 필요하면

| 입력 종류 | dataType | UI | 예시 |
|---------|----------|----|----|
| 예/아니오 | `boolean` | Toggle | 활성화 여부 |
| 드롭다운 (1개) | `select` | Dropdown | 국가 선택 |
| 드롭다운 (여러 개) | `multiselect` | Multi-select | 태그 선택 |
| 라디오 버튼 | `radio` | Radio group | 성별, 색상 프리셋 |
| 체크박스 | `checkbox` | Checkbox group | 관심사 |

**사용 예시:**
```tsx
// 라디오 버튼 (프리셋 색상)
<Field
  label="배경 프리셋"
  model="bgPreset"
  dataType="radio"
  options={[
    { label: '흰색', value: '#ffffff' },
    { label: '검정', value: '#000000' },
    { label: '파랑', value: '#e3f2fd' },
  ]}
/>

// 드롭다운
<Field
  label="글꼴"
  model="fontFamily"
  dataType="select"
  options={[
    { label: 'Arial', value: 'arial' },
    { label: 'Helvetica', value: 'helvetica' },
  ]}
/>
```

---

### 날짜/시간이 필요하면

| 입력 종류 | dataType | 예시 |
|---------|----------|------|
| 날짜만 | `date` | 생일, 마감일 |
| 날짜+시간 | `datetime` | 약속 시각 |

**사용 예시:**
```tsx
<Field
  label="마감일"
  model="deadline"
  dataType="date"
  constraints={{ min: "$today" }}
/>
```

---

### 파일/색상이 필요하면

| 입력 종류 | dataType | 예시 |
|---------|----------|------|
| 이미지 | `image` | 프로필 사진 |
| 파일 | `file` | PDF, 문서 |
| 색상 | `color` | 배경색, 텍스트 색 |

**사용 예시:**
```tsx
// 색상 선택
<Field
  label="텍스트 색상"
  model="textColor"
  dataType="color"
/>

// 이미지 업로드
<Field
  label="배경 이미지"
  model="bgImage"
  dataType="image"
  constraints={{
    accept: "image/*",
    maxSize: 2097152  // 2MB
  }}
/>
```

---

## 🎨 PPT FormatSidebar 실전 예시

### Before (직접 HTML 사용) ❌
```tsx
<div>
  <label>글꼴</label>
  <select className="w-full rounded-lg bg-layer-1 border...">
    <option>Arial</option>
    <option>Helvetica</option>
  </select>
</div>

<div>
  <label>크기</label>
  <input type="number" min={8} max={72} className="..." />
</div>

<div>
  <label>색상</label>
  <input type="color" className="h-10 w-full..." />
</div>
```

### After (IDDL Field 사용) ✅
```tsx
<Field
  label="글꼴"
  model="fontFamily"
  dataType="select"
  options={[
    { label: 'Arial', value: 'arial' },
    { label: 'Helvetica', value: 'helvetica' },
  ]}
/>

<Field
  label="크기 (pt)"
  model="fontSize"
  dataType="number"
  constraints={{ min: 8, max: 72 }}
/>

<Field
  label="색상"
  model="textColor"
  dataType="color"
/>
```

**개선 효과:**
- 코드 라인: ~50줄 → ~30줄 (40% 감소)
- 일관성: 모든 입력이 IDDL 기반
- 유지보수: prominence/density로 통합 스타일 관리

---

## 🔍 빠른 의사결정 트리

```
입력이 필요하다
├─ 텍스트인가?
│  ├─ 한 줄? → text
│  ├─ 여러 줄? → textarea
│  ├─ HTML 필요? → richtext
│  ├─ 비밀번호? → password
│  ├─ 이메일? → email
│  ├─ URL? → url
│  └─ 전화번호? → phone
│
├─ 숫자인가?
│  ├─ 일반 숫자? → number
│  ├─ 금액? → currency
│  ├─ 별점? → rating
│  └─ 슬라이더? → range
│
├─ 선택인가?
│  ├─ 예/아니오? → boolean
│  ├─ 1개 선택 (많은 옵션)? → select
│  ├─ 1개 선택 (적은 옵션)? → radio
│  ├─ 여러 개 선택 (드롭다운)? → multiselect
│  └─ 여러 개 선택 (보이는 옵션)? → checkbox
│
├─ 날짜/시간인가?
│  ├─ 날짜만? → date
│  └─ 날짜+시간? → datetime
│
└─ 파일/색상인가?
   ├─ 이미지? → image
   ├─ 파일? → file
   └─ 색상? → color
```

---

## 💡 추가 팁

### 1. clearable 속성 (v1.0.2)
text, password, email, url, phone 타입에서 사용 가능:
```tsx
<Field
  label="검색"
  model="searchQuery"
  dataType="text"
  clearable={true}  // X 버튼 표시
/>
```

### 2. constraints로 검증
```tsx
<Field
  label="비밀번호"
  model="password"
  dataType="password"
  constraints={{
    minLength: 8,
    pattern: "^(?=.*[A-Za-z])(?=.*\\d).+$"
  }}
/>
```

### 3. prominence로 스타일 조절
```tsx
<Field
  label="제목"
  model="title"
  dataType="text"
  prominence="Primary"    // 강조
/>

<Field
  label="메모"
  model="memo"
  dataType="textarea"
  prominence="Secondary"  // 보통
/>
```

---

## 📚 더 알아보기

- **전체 스펙**: `/spec/iddl-spec-1.0.1.md`
- **Field 타입 상세**: `/apps/docs/03-data-interaction/01-field-types.md`
- **dataType 레퍼런스**: `/apps/docs/06-reference/datatype-reference.md`
- **검증 가이드**: `/apps/docs/03-data-interaction/02-validation.md`

---

## 🎯 체크리스트

새 위젯 개발 시 확인:
```
□ HTML input/select 태그를 직접 사용하지 않았는가?
□ 모든 입력 컨트롤이 Field 컴포넌트를 사용하는가?
□ dataType을 올바르게 선택했는가?
□ constraints로 검증 규칙을 추가했는가?
□ className 오버라이드 대신 prominence/density를 사용했는가?
```

---

**Remember**: IDDL은 "구현 지시"가 아니라 "의미 선언"입니다!
