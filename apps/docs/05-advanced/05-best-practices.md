# Best Practices: IDDL 마스터 가이드 🏆

**예상 소요 시간**: 22분
**난이도**: ⭐⭐⭐⭐⭐ 최고급
**사전 지식**: 전체 Level 0-5

---

## 이 문서를 읽고 나면

- IDDL의 모든 모범 사례를 이해합니다
- 흔한 안티 패턴을 피할 수 있습니다
- 프로덕션 수준의 UI를 구성할 수 있습니다

---

## 1. 명명 규칙

### model 경로

```json
// ✅ Good: 명확한 계층 구조
{
  "model": "user.profile.email"
}

// ❌ Bad: 평면 구조
{
  "model": "userProfileEmail"
}
```

---

### ID 네이밍

```json
// ✅ Good: 의미 있는 이름
{
  "id": "user-profile-edit-modal"
}

// ❌ Bad: 의미 없는 이름
{
  "id": "modal1"
}
```

---

### 컴포넌트 네이밍

```json
// ✅ Good: 목적이 명확
{
  "type": "myapp:UserAvatar"
}

// ❌ Bad: 구현 노출
{
  "type": "myapp:CircularImage"
}
```

---

## 2. 속성 조합

### prominence + intent

```json
// ✅ Good: 명확한 계층
{
  "type": "Group",
  "role": "Toolbar",
  "children": [
    {
      "type": "Action",
      "label": "Cancel",
      "prominence": "Tertiary",  // 덜 중요
      "intent": "Neutral"
    },
    {
      "type": "Action",
      "label": "Save",
      "prominence": "Primary",   // 가장 중요
      "intent": "Positive"
    }
  ]
}

// ❌ Bad: 계층 없음
{
  "children": [
    { "prominence": "Primary", "intent": "Neutral" },
    { "prominence": "Primary", "intent": "Positive" }
  ]
}
```

---

### role + density

```json
// ✅ Good: 적절한 density
{
  "type": "Group",
  "role": "Table",
  "density": "Compact"  // 테이블은 Compact
}

// ❌ Bad: 부적절한 density
{
  "type": "Group",
  "role": "Table",
  "density": "Comfortable"  // 너무 넓음
}
```

---

## 3. 데이터 구조

### 모델 설계

```json
// ✅ Good: 정규화된 구조
{
  "users": [
    { "id": 1, "name": "Teo", "roleId": 1 }
  ],
  "roles": [
    { "id": 1, "name": "Admin" }
  ]
}

// ❌ Bad: 비정규화
{
  "users": [
    { "id": 1, "name": "Teo", "role": { "id": 1, "name": "Admin" } }
  ]
}
```

---

### 페이지네이션 응답

```json
// ✅ Good: 표준 구조
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}

// ❌ Bad: 불명확한 구조
{
  "items": [...],
  "p": 1,
  "count": 100
}
```

---

## 4. 에러 처리

### 클라이언트 검증

```json
{
  "type": "Field",
  "label": "Email",
  "model": "user.email",
  "dataType": "email",
  "required": true,
  "constraints": {
    "pattern": "^[^@]+@[^@]+\\.[^@]+$"
  },
  "errorMessages": {
    "required": "이메일을 입력해주세요",
    "pattern": "올바른 이메일 형식이 아닙니다"
  }
}
```

✅ **명확하고 친절한 메시지**

---

### 서버 에러 표시

```json
{
  "type": "Action",
  "label": "Submit",
  "behavior": {
    "action": "submit",
    "endpoint": "/api/users",
    "method": "POST",
    "onError": {
      "action": "open",
      "overlay": "error-toast"
    }
  }
}

{
  "type": "Overlay",
  "id": "error-toast",
  "role": "Toast",
  "children": [
    {
      "type": "Group",
      "role": "Card",
      "intent": "Critical",
      "children": [
        {
          "type": "Text",
          "model": "error.message",  // ← 서버 메시지 표시
          "prominence": "Secondary"
        }
      ]
    }
  ]
}
```

---

## 5. 성능 최적화

### 가상 스크롤링

```json
// ✅ Good: 대용량 리스트
{
  "type": "Group",
  "role": "Table",
  "virtualized": true,  // 1000+ 행
  "rowHeight": 48,
  "children": [...]
}

// ❌ Bad: 모든 행 렌더링
{
  "type": "Group",
  "role": "Table",
  "children": [...]  // 10,000개 행 → 느림
}
```

---

### 지연 로딩

```json
// ✅ Good: 탭 지연 로딩
{
  "type": "Group",
  "role": "Tabs",
  "lazyLoad": true,
  "children": [...]
}

// ❌ Bad: 모든 탭 로드
{
  "type": "Group",
  "role": "Tabs",
  "children": [...]  // 무거운 컴포넌트들
}
```

---

## 6. 보안

### XSS 방지

```json
// ✅ Good: 이스케이프된 텍스트
{
  "type": "Text",
  "model": "user.comment"  // 자동 이스케이프
}

// ❌ Bad: HTML 직접 삽입
{
  "type": "Text",
  "dangerouslySetInnerHTML": "user.comment"  // XSS 위험
}
```

---

### CSRF 토큰

```json
{
  "type": "Action",
  "label": "Delete",
  "behavior": {
    "action": "command",
    "endpoint": "/api/users/{id}",
    "method": "DELETE",
    "headers": {
      "X-CSRF-Token": "$csrfToken"  // ← CSRF 토큰
    }
  }
}
```

---

## 7. 테스트

### IDDL JSON 검증

```typescript
// schema validation
import Ajv from 'ajv';
import iddlSchema from './iddl-schema.json';

const ajv = new Ajv();
const validate = ajv.compile(iddlSchema);

const valid = validate(iddlJson);
if (!valid) {
  console.error(validate.errors);
}
```

---

### 단위 테스트

```typescript
// 렌더러 테스트
import { render } from '@testing-library/react';
import { renderIDDL } from './renderer';

test('renders Text node', () => {
  const spec = {
    type: 'Text',
    role: 'Title',
    content: 'Hello'
  };

  const { getByText } = render(renderIDDL(spec));
  expect(getByText('Hello')).toBeInTheDocument();
});
```

---

### E2E 테스트

```typescript
// Playwright
import { test, expect } from '@playwright/test';

test('user can sign up', async ({ page }) => {
  await page.goto('/signup');

  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button:has-text("Sign Up")');

  await expect(page).toHaveURL('/welcome');
});
```

---

## 8. 문서화

### 컴포넌트 문서

```typescript
/**
 * CustomChart Component
 *
 * @example
 * {
 *   "type": "myapp:Chart",
 *   "chartType": "line",
 *   "data": [...]
 * }
 *
 * @param {string} chartType - 'line' | 'bar' | 'pie'
 * @param {Array} data - Chart data
 * @param {Object} config - Chart configuration
 */
export function CustomChart(props: ChartProps) {
  // ...
}
```

---

### API 문서

```markdown
## POST /api/users

회원가입

### Request
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

### Response
\`\`\`json
{
  "id": 1,
  "email": "user@example.com"
}
\`\`\`

### Errors
- 400: Invalid email format
- 409: Email already exists
```

---

## 9. 버전 관리

### IDDL 버전

```json
{
  "version": "1.0.1",
  "type": "Page",
  "children": [...]
}
```

---

### 하위 호환성

```typescript
// 렌더러
function migrateSpec(spec: any): IDDLSpec {
  if (spec.version === '1.0.0') {
    // 1.0.0 → 1.0.1 마이그레이션
    spec = migrate_1_0_0_to_1_0_1(spec);
  }

  return spec;
}
```

---

## 10. 흔한 안티 패턴

### 안티 패턴 1: God Component

```json
// ❌ Bad: 하나의 컴포넌트에 모든 로직
{
  "type": "Group",
  "role": "Container",
  "entityType": "user",  // user/post/comment 모두 처리
  "children": [...]
}

// ✅ Good: 분리된 컴포넌트
{
  "type": "Group",
  "role": "Container",
  "children": [...]  // 사용자 관리만
}
```

---

### 안티 패턴 2: Magic Number

```json
// ❌ Bad: 하드코딩된 값
{
  "type": "Field",
  "constraints": {
    "maxLength": 50  // 왜 50?
  }
}

// ✅ Good: 의미 있는 상수
{
  "type": "Field",
  "constraints": {
    "maxLength": "$constraints.username.maxLength"
  }
}
```

---

### 안티 패턴 3: 깊은 중첩

```json
// ❌ Bad: 5단계 중첩
{
  "type": "Group",
  "children": [
    {
      "type": "Group",
      "children": [
        {
          "type": "Group",
          "children": [
            {
              "type": "Group",
              "children": [
                { "type": "Text" }
              ]
            }
          ]
        }
      ]
    }
  ]
}

// ✅ Good: 평면 구조
{
  "type": "Group",
  "children": [
    { "type": "Text" }
  ]
}
```

---

### 안티 패턴 4: 하드코딩된 문자열

```json
// ❌ Bad: 하드코딩
{
  "type": "Text",
  "content": "Hello, Teo!"
}

// ✅ Good: i18n
{
  "type": "Text",
  "content": "$t('greeting', { name: user.name })"
}
```

---

### 안티 패턴 5: 불필요한 wrapper

```json
// ❌ Bad: 불필요한 Group
{
  "type": "Group",
  "role": "Container",
  "children": [
    {
      "type": "Group",
      "role": "Container",  // 불필요
      "children": [
        { "type": "Text", "content": "Hello" }
      ]
    }
  ]
}

// ✅ Good: 직접 배치
{
  "type": "Group",
  "role": "Container",
  "children": [
    { "type": "Text", "content": "Hello" }
  ]
}
```

---

## 11. 체크리스트

### 구조

```
□ Page → Section → Group → Primitives 계층
□ Group은 Group만 자식으로
□ 4단계 이상 중첩 없음
□ 명확한 role 선택
```

### 데이터

```
□ 명확한 model 경로
□ 타입 일관성 (dataType)
□ 검증 규칙 (constraints)
□ 친절한 에러 메시지
```

### UI

```
□ 명확한 prominence 계층
□ 일관된 intent 사용
□ 적절한 density
□ 반응형 지원
```

### 성능

```
□ 가상 스크롤링 (1000+ 행)
□ 지연 로딩 (탭, 이미지)
□ 캐싱
□ 번들 크기 < 200KB
```

### 접근성

```
□ 키보드 네비게이션
□ 스크린 리더 지원
□ 색상 대비 4.5:1+
□ 명확한 레이블
```

### 보안

```
□ XSS 방지
□ CSRF 토큰
□ 입력 검증
□ 인증/인가
```

---

## 12. 리뷰 가이드

### 코드 리뷰 항목

```
구조:
□ 올바른 노드 타입 선택
□ 적절한 role 사용
□ 중첩 깊이 확인

데이터:
□ model 경로 명확성
□ 검증 규칙 완전성
□ 에러 메시지 명확성

UI:
□ prominence 계층
□ intent 일관성
□ density 적절성

성능:
□ 가상 스크롤링 필요 여부
□ 지연 로딩 필요 여부
□ 불필요한 리렌더링 없음
```

---

## 핵심 정리

### Golden Rules

```
1. 의도를 선언하라 (구현 X)
2. 계층을 명확히 하라 (prominence)
3. 표준을 따르라 (role, dataType)
4. 검증하라 (constraints)
5. 접근성을 고려하라 (label, aria)
6. 성능을 최적화하라 (virtualized)
7. 테스트하라 (validation, E2E)
```

### Best Practices 요약

```
✓ 명확한 네이밍
✓ 올바른 속성 조합
✓ 정규화된 데이터 구조
✓ 명확한 에러 메시지
✓ 가상 스크롤링
✓ 지연 로딩
✓ 키보드 네비게이션
✓ 색상 대비
✓ XSS 방지
✓ 단위/E2E 테스트
✗ God Component
✗ Magic Number
✗ 깊은 중첩
✗ 하드코딩
✗ 불필요한 wrapper
```

---

## 축하합니다! 🎉🎉🎉

**Level 5 (고급 주제)** 완료!

IDDL 마스터 수준에 도달했습니다:
- ✅ 커스텀 확장
- ✅ 반응형 디자인
- ✅ 성능 최적화
- ✅ 접근성
- ✅ Best Practices

---

## 다음 단계

모든 레벨을 완료했습니다!
이제 **참조 문서**를 활용하여 실전에서 사용하세요.

**다음**: [Appendix: API 레퍼런스 →](../06-reference/api-reference.md)

**관련 문서**:
- [실전 패턴](../04-patterns/) - 자주 쓰는 패턴 모음
- [API 레퍼런스](../06-reference/api-reference.md) - 전체 스펙

---

**이전**: [← 접근성](./04-accessibility.md)
**다음**: [API 레퍼런스 →](../06-reference/api-reference.md)
