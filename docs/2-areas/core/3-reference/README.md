# Reference (레퍼런스)

> **📖 IDDL API와 스펙의 완전한 목록**

---

## 📋 개념

Reference는 **정보 검색**을 위한 문서입니다:

- ✅ **정보 지향**: 완전하고 정확한 정보
- ✅ **사전 형식**: 빠른 검색, 목록
- ✅ **예제 포함**: 모든 옵션에 예제
- ✅ **기술적**: 정확한 타입, API
- ✅ **대상 모두**: 초보자부터 전문가까지

---

## 📚 레퍼런스 문서

### [Field Reference](./field-reference.md) ⭐
**Field 컴포넌트 완전 가이드**

**내용**:
- 21가지 dataType 전체 목록
- 각 dataType의 Props
- 예제 코드
- 유효성 검사
- 접근성 속성

**사용 시기**: Field 사용할 때 빠른 참조

---

### [Page v2.0 Spec](./page-v2-spec.md)
**Page 컴포넌트 v2.0 스펙**

**내용**:
- Page Props 전체 목록
- Layout 옵션
- Navigation 설정
- 예제

**사용 시기**: Page 컴포넌트 사용 시

---

### [Component Role Mapping](./component-role-mapping.md)
**일반 컴포넌트 → IDDL 매핑**

**내용**:
- 100개 컴포넌트 분류
- IDDL Role 매핑
- ARIA Role 매핑
- 구현 우선순위

**사용 시기**: "이 컴포넌트를 IDDL로 어떻게?"

---

## 🔍 빠른 검색 인덱스

### 컴포넌트별

| 컴포넌트 | 문서 |
|---------|------|
| **Page** | [Page v2.0 Spec](./page-v2-spec.md) |
| **Section** | (예정) Section Reference |
| **Group** | (예정) Group Reference |
| **Field** | [Field Reference](./field-reference.md) |
| **Action** | (예정) Action Reference |
| **Text** | (예정) Text Reference |
| **Overlay** | (예정) Overlay Reference |

### 속성별

| 속성 | 설명 | 문서 |
|------|------|------|
| **prominence** | 주목도 (Hero/Primary/Secondary/Tertiary) | [Field Reference](./field-reference.md) |
| **intent** | 의도 (Neutral/Brand/Positive/Critical...) | [Field Reference](./field-reference.md) |
| **dataType** | 필드 타입 (21가지) | [Field Reference](./field-reference.md) |
| **role** | 역할 (다양한 Role) | [Component Role Mapping](./component-role-mapping.md) |

### Role별

| Role | 컴포넌트 | 문서 |
|------|---------|------|
| **Button** | Action | (예정) |
| **List** | Group | (예정) |
| **Table** | Group | [Component Role Mapping](./component-role-mapping.md) |
| **Modal** | Overlay | (예정) |

---

## 💡 Reference vs Tutorial/How-to

| 구분 | Reference | Tutorial | How-to |
|------|-----------|----------|--------|
| **질문** | "이게 뭐야?" | "어떻게 배우나?" | "어떻게 하나?" |
| **목적** | 정보 | 학습 | 문제 해결 |
| **형식** | 목록 | 단계별 | 레시피 |
| **설명** | 완전함 | 자세함 | 간결함 |
| **예시** | "Field Props" | "Field 배우기" | "Validation 추가" |

---

## 📖 레퍼런스 읽는 법

### 1. Props Table

모든 레퍼런스에는 Props 표가 있습니다:

```markdown
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| label | string | - | ✅ | 필드 레이블 |
| dataType | DataType | 'text' | - | 필드 타입 (21가지) |
```

### 2. Type Definitions

TypeScript 타입 정의가 포함됩니다:

```typescript
type Prominence = 'Hero' | 'Primary' | 'Secondary' | 'Tertiary';
type Intent = 'Neutral' | 'Brand' | 'Positive' | 'Critical' | ...;
```

### 3. Examples

모든 옵션에 예제가 있습니다:

```tsx
// Example: Field with validation
<Field
  label="Email"
  dataType="email"
  required
  validation={(value) => value.includes('@')}
/>
```

---

## 📝 레퍼런스 추가 방법

새로운 레퍼런스를 추가하려면:

1. **파일명**: `component-name-reference.md`
2. **템플릿 사용**:
   ```markdown
   # Component Name Reference

   > 완전한 API 레퍼런스

   ## Props

   | Prop | Type | Default | Required | Description |
   |------|------|---------|----------|-------------|

   ## Type Definitions

   ## Examples

   ## Accessibility

   ## Related
   ```

3. **이 README 업데이트**: 인덱스에 추가

---

## 🔗 관련 문서

- [Tutorials](../1-tutorials/) - 처음 배우기
- [How-to](../2-how-to/) - 문제 해결
- [Explanation](../4-explanation/) - 개념 이해
- [Patterns](../../patterns/) - React 패턴
