# Troubleshooting: 문제 해결 가이드 🔧

**IDDL Specification v1.0.1**

IDDL 사용 시 자주 발생하는 문제와 해결 방법을 정리한 문서입니다.

---

## 목차

1. [구조 문제](#구조-문제)
2. [속성 문제](#속성-문제)
3. [데이터 바인딩 문제](#데이터-바인딩-문제)
4. [검증 문제](#검증-문제)
5. [렌더링 문제](#렌더링-문제)
6. [성능 문제](#성능-문제)
7. [FAQ](#faq)

---

## 구조 문제

### ❌ 문제: "Invalid child type for Page"

**증상**: Page의 자식으로 Group을 넣었더니 에러 발생

```json
{
  "type": "Page",
  "title": "Dashboard",
  "children": [
    {
      "type": "Group",  // ❌ Page는 Group을 직접 자식으로 가질 수 없음
      "role": "Container"
    }
  ]
}
```

**원인**: Page는 Section 또는 Overlay만 자식으로 가질 수 있음

**해결**:
```json
{
  "type": "Page",
  "title": "Dashboard",
  "children": [
    {
      "type": "Section",  // ✅ Section으로 감싸기
      "role": "Container",
      "children": [
        {
          "type": "Group",
          "role": "Container",
          "children": [...]
        }
      ]
    }
  ]
}
```

**참고**: [Level 2-1: Page와 계층 구조](../02-structure/01-page.md)

---

### ❌ 문제: "Section cannot contain Text directly"

**증상**: Section의 자식으로 Text를 넣었더니 에러 발생

```json
{
  "type": "Section",
  "role": "Container",
  "children": [
    {
      "type": "Text",  // ❌ Section은 Text를 직접 자식으로 가질 수 없음
      "role": "Title",
      "content": "Hello"
    }
  ]
}
```

**원인**: Section은 Group만 자식으로 가질 수 있음

**해결**:
```json
{
  "type": "Section",
  "role": "Container",
  "children": [
    {
      "type": "Group",  // ✅ Group으로 감싸기
      "role": "Container",
      "children": [
        {
          "type": "Text",
          "role": "Title",
          "content": "Hello"
        }
      ]
    }
  ]
}
```

---

### ❌ 문제: "Text cannot have children"

**증상**: Text에 자식을 넣었더니 에러 발생

```json
{
  "type": "Text",
  "role": "Title",
  "content": "Hello",
  "children": [...]  // ❌ Text는 자식을 가질 수 없음
}
```

**원인**: Text, Field, Action은 Leaf 노드 (자식 없음)

**해결**: 자식이 필요하면 Group으로 감싸기

```json
{
  "type": "Group",
  "role": "Container",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Hello"
    },
    {
      "type": "Text",
      "role": "Body",
      "content": "World"
    }
  ]
}
```

---

## 속성 문제

### ❌ 문제: "prominence is not supported for Group"

**증상**: Group에 prominence를 넣었더니 적용되지 않음

```json
{
  "type": "Group",
  "role": "Container",
  "prominence": "Hero"  // ❌ Group은 prominence 없음
}
```

**원인**: prominence는 Text, Action에만 적용됨

**해결**: 자식 Text/Action에 prominence 적용

```json
{
  "type": "Group",
  "role": "Container",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Hello",
      "prominence": "Hero"  // ✅ Text에 적용
    }
  ]
}
```

**참고**: [Property Matrix](./property-matrix.md)

---

### ❌ 문제: "mode is not propagating to Field"

**증상**: Section의 mode를 edit으로 했는데 Field가 view 모드로 렌더링됨

```json
{
  "type": "Section",
  "role": "Container",
  "mode": "edit",
  "children": [
    {
      "type": "Group",
      "role": "Container",  // ❌ Container는 mode 전파 안 함
      "children": [
        {
          "type": "Field",
          "label": "Name",
          "model": "user.name",
          "dataType": "text"
        }
      ]
    }
  ]
}
```

**원인**: mode는 Form, Fieldset만 전파

**해결**: Group role을 Form 또는 Fieldset으로 변경

```json
{
  "type": "Section",
  "role": "Container",
  "mode": "edit",
  "children": [
    {
      "type": "Group",
      "role": "Form",  // ✅ Form은 mode 전파
      "children": [
        {
          "type": "Field",
          "label": "Name",
          "model": "user.name",
          "dataType": "text"
        }
      ]
    }
  ]
}
```

**참고**: [Level 2-4: Group과 role](../02-structure/04-group.md)

---

### ❌ 문제: "IconButton without title"

**증상**: icon만 있는 Action이 렌더링되지 않음

```json
{
  "type": "Action",
  "icon": "trash",  // ❌ title 없음
  "behavior": { "action": "command" }
}
```

**원인**: IconButton은 title 필수 (접근성)

**해결**: title 추가

```json
{
  "type": "Action",
  "icon": "trash",
  "title": "Delete",  // ✅ title 추가
  "behavior": { "action": "command" }
}
```

**참고**: [Level 0-2: Action](../00-getting-started/02-action.md)

---

## 데이터 바인딩 문제

### ❌ 문제: "Model path not found: user.name"

**증상**: model 경로에 데이터가 없어서 빈 값 표시됨

```json
{
  "type": "Text",
  "model": "user.name"  // ❌ user.name이 undefined
}
```

**원인**: 데이터 객체에 해당 경로가 없음

**해결 1**: 데이터 객체 확인

```typescript
// ❌ 잘못된 데이터
const data = {
  username: "Teo"  // user.name이 아님
};

// ✅ 올바른 데이터
const data = {
  user: {
    name: "Teo"
  }
};
```

**해결 2**: 기본값 제공

```json
{
  "type": "Text",
  "model": "user.name",
  "content": "Guest"  // ✅ 기본값
}
```

---

### ❌ 문제: "Cannot update nested model"

**증상**: 중첩된 model이 업데이트되지 않음

```json
{
  "type": "Field",
  "label": "Email",
  "model": "user.profile.email",  // 3단계 중첩
  "dataType": "email"
}
```

**원인**: 중첩 객체가 immutable하게 업데이트되지 않음

**해결**: 렌더러에서 올바른 불변 업데이트 구현

```typescript
// ❌ 잘못된 업데이트
data.user.profile.email = newValue;  // 직접 변경

// ✅ 올바른 업데이트
setData({
  ...data,
  user: {
    ...data.user,
    profile: {
      ...data.user.profile,
      email: newValue
    }
  }
});
```

---

### ❌ 문제: "Text model and content both provided"

**증상**: model과 content를 동시에 제공했더니 혼란

```json
{
  "type": "Text",
  "role": "Title",
  "model": "user.name",
  "content": "Default Name"  // ❌ model과 content 동시 사용
}
```

**원인**: model 또는 content 중 하나만 사용해야 함

**해결**: 조건부 렌더링 사용

```json
{
  "type": "Text",
  "role": "Title",
  "content": "$user.name || 'Guest'"  // ✅ 조건부 표현식
}
```

---

## 검증 문제

### ❌ 문제: "Validation not working"

**증상**: constraints를 넣었는데 검증이 안 됨

```json
{
  "type": "Field",
  "label": "Email",
  "model": "user.email",
  "dataType": "email",
  "constraints": {
    "required": true,  // ❌ constraints.required가 아님
    "pattern": "^[^@]+@[^@]+$"
  }
}
```

**원인**: required는 최상위 속성

**해결**:
```json
{
  "type": "Field",
  "label": "Email",
  "model": "user.email",
  "dataType": "email",
  "required": true,  // ✅ 최상위로 이동
  "constraints": {
    "pattern": "^[^@]+@[^@]+$"
  }
}
```

**참고**: [Level 3-2: 검증과 에러 처리](../03-data-interaction/02-validation.md)

---

### ❌ 문제: "Custom error message not showing"

**증상**: errorMessages를 넣었는데 표시되지 않음

```json
{
  "type": "Field",
  "label": "Username",
  "model": "user.username",
  "dataType": "text",
  "required": true,
  "errorMessages": {
    "require": "Username is required"  // ❌ 오타: require → required
  }
}
```

**원인**: 키 이름이 constraint 이름과 일치해야 함

**해결**:
```json
{
  "type": "Field",
  "label": "Username",
  "model": "user.username",
  "dataType": "text",
  "required": true,
  "errorMessages": {
    "required": "Username is required"  // ✅ required로 수정
  }
}
```

---

### ❌ 문제: "Pattern validation not working"

**증상**: pattern 검증이 항상 통과됨

```json
{
  "type": "Field",
  "label": "Username",
  "model": "user.username",
  "dataType": "text",
  "constraints": {
    "pattern": "^[a-zA-Z0-9]+$"  // ❌ 이스케이프 안 됨
  }
}
```

**원인**: JSON에서 백슬래시 이스케이프 필요

**해결**:
```json
{
  "type": "Field",
  "label": "Username",
  "model": "user.username",
  "dataType": "text",
  "constraints": {
    "pattern": "^[a-zA-Z0-9]+$"  // ✅ 이스케이프 (\\d → \\\\d)
  }
}
```

---

## 렌더링 문제

### ❌ 문제: "Condition not updating"

**증상**: 데이터가 변경되었는데 condition이 업데이트되지 않음

```json
{
  "type": "Action",
  "label": "Follow",
  "condition": {
    "if": "user.isFollowing",
    "then": { "label": "Unfollow" },
    "else": { "label": "Follow" }
  }
}
```

**원인**: 렌더러가 조건식을 reactive하게 평가하지 않음

**해결**: 렌더러에서 데이터 변경 감지 구현

```typescript
// React 예시
useEffect(() => {
  const result = evaluateCondition(node.condition, data);
  setResolvedNode({ ...node, ...result });
}, [data, node.condition]);
```

---

### ❌ 문제: "Hidden element still taking space"

**증상**: hidden=true인데 공간을 차지함

```json
{
  "type": "Group",
  "role": "Container",
  "hidden": true  // ❌ display: none이 아님
}
```

**원인**: 렌더러가 visibility: hidden 사용

**해결**: 렌더러에서 display: none 사용

```typescript
// ❌ 잘못된 렌더링
<div style={{ visibility: 'hidden' }}>

// ✅ 올바른 렌더링
{!node.hidden && <div>...</div>}
```

---

### ❌ 문제: "Table not rendering correctly"

**증상**: Table role의 Field가 테이블로 렌더링되지 않음

```json
{
  "type": "Group",
  "role": "Table",
  "children": [
    {
      "type": "Text",  // ❌ Text는 테이블 컬럼이 아님
      "role": "Title",
      "content": "Name"
    }
  ]
}
```

**원인**: Table은 Field를 자식으로 가져야 함

**해결**:
```json
{
  "type": "Group",
  "role": "Table",
  "children": [
    {
      "type": "Field",  // ✅ Field 사용
      "label": "Name",
      "model": "item.name",
      "dataType": "text",
      "mode": "view"
    }
  ]
}
```

**참고**: [Level 4-1: CRUD 리스트](../04-patterns/01-crud-list.md)

---

## 성능 문제

### ❌ 문제: "Slow rendering with 1000+ rows"

**증상**: 1000개 행 테이블이 느림

```json
{
  "type": "Group",
  "role": "Table",
  "children": [...]  // 1000개 항목
}
```

**원인**: 모든 행을 한 번에 렌더링

**해결**: 가상 스크롤링 사용

```json
{
  "type": "Group",
  "role": "Table",
  "virtualized": true,  // ✅ 가상 스크롤링
  "rowHeight": 48,
  "overscan": 5,
  "children": [...]
}
```

**참고**: [Level 5-3: 성능 최적화](../05-advanced/03-performance.md)

---

### ❌ 문제: "Tabs loading all at once"

**증상**: 모든 탭 내용이 동시에 로드됨

```json
{
  "type": "Group",
  "role": "Tabs",
  "children": [
    { "id": "tab-1", "label": "Tab 1", "children": [...] },
    { "id": "tab-2", "label": "Tab 2", "children": [...] },
    { "id": "tab-3", "label": "Tab 3", "children": [...] }
  ]
}
```

**원인**: 지연 로딩이 활성화되지 않음

**해결**: lazyLoad 사용

```json
{
  "type": "Group",
  "role": "Tabs",
  "lazyLoad": true,  // ✅ 지연 로딩
  "children": [...]
}
```

---

### ❌ 문제: "Search input too slow"

**증상**: 검색 입력할 때마다 API 호출되어 느림

```json
{
  "type": "Field",
  "label": "Search",
  "model": "filters.search",
  "dataType": "text",
  "onChange": {
    "action": "command",
    "endpoint": "/api/search?q={value}"
  }
}
```

**원인**: debounce가 없어서 모든 키 입력마다 호출

**해결**: debounce 추가

```json
{
  "type": "Field",
  "label": "Search",
  "model": "filters.search",
  "dataType": "text",
  "debounce": 500,  // ✅ 500ms debounce
  "onChange": {
    "action": "command",
    "endpoint": "/api/search?q={value}"
  }
}
```

---

## FAQ

### Q1: IDDL JSON을 어디에 저장하나요?

**A**: 3가지 방법:

1. **정적 파일**: `/specs/dashboard.json`
2. **API 응답**: `GET /api/specs/dashboard`
3. **데이터베이스**: UI 스펙을 DB에 저장

**권장**: API 응답 (동적 생성 가능)

---

### Q2: IDDL JSON을 어떻게 검증하나요?

**A**: JSON Schema 사용

```typescript
import Ajv from 'ajv';
import iddlSchema from './iddl-schema.json';

const ajv = new Ajv();
const validate = ajv.compile(iddlSchema);

const valid = validate(iddlJson);
if (!valid) {
  console.error(validate.errors);
}
```

**참고**: [Best Practices - 테스트](../05-advanced/05-best-practices.md#7-테스트)

---

### Q3: 커스텀 컴포넌트를 어떻게 만드나요?

**A**: 네임스페이스 사용

```json
{
  "type": "myapp:Chart",
  "chartType": "line",
  "data": [...]
}
```

```typescript
const customRenderers = {
  'myapp:Chart': CustomChart
};
```

**참고**: [Level 5-1: 커스텀 확장](../05-advanced/01-custom-extensions.md)

---

### Q4: 다국어 지원은 어떻게 하나요?

**A**: i18n 표현식 사용

```json
{
  "type": "Text",
  "role": "Title",
  "content": "$t('dashboard.title')"
}
```

```typescript
// 렌더러
const content = node.content.startsWith('$t(')
  ? i18n.t(extractKey(node.content))
  : node.content;
```

---

### Q5: 동적으로 필드를 추가/제거할 수 있나요?

**A**: 네, 조건부 렌더링 또는 children 배열 조작

```json
{
  "type": "Group",
  "role": "Form",
  "children": "$showAdvanced ? [...basicFields, ...advancedFields] : basicFields"
}
```

---

### Q6: 파일 업로드는 어떻게 처리하나요?

**A**: Field dataType="file" 또는 "image" 사용

```json
{
  "type": "Field",
  "label": "Avatar",
  "model": "user.avatar",
  "dataType": "image",
  "constraints": {
    "accept": "image/jpeg,image/png",
    "maxSize": 2097152
  }
}
```

렌더러에서 multipart/form-data로 전송

---

### Q7: 실시간 데이터 업데이트는 어떻게 하나요?

**A**: WebSocket 또는 Server-Sent Events 사용

```json
{
  "type": "Group",
  "role": "Table",
  "realtime": true,
  "realtimeEndpoint": "ws://localhost:3000/users"
}
```

렌더러에서 WebSocket 연결 및 데이터 병합

---

### Q8: 중첩이 너무 깊으면 어떻게 하나요?

**A**: 4단계 이상 중첩 피하기

```json
// ❌ 나쁜 예: 5단계 중첩
Page → Section → Group → Group → Group → Text

// ✅ 좋은 예: 3단계 중첩
Page → Section → Group → Text
```

**참고**: [Best Practices - 안티 패턴](../05-advanced/05-best-practices.md#10-흔한-안티-패턴)

---

### Q9: IDDL로 복잡한 레이아웃을 만들 수 있나요?

**A**: 네, Split, Grid, Tabs 조합 사용

```json
{
  "type": "Group",
  "role": "Split",
  "children": [
    {
      "type": "Group",
      "role": "Grid",
      "children": [...]
    },
    {
      "type": "Group",
      "role": "Tabs",
      "children": [...]
    }
  ]
}
```

---

### Q10: 서버 사이드 렌더링(SSR)을 지원하나요?

**A**: 네, IDDL은 선언적이므로 SSR 가능

```typescript
// Next.js 예시
export async function getServerSideProps() {
  const spec = await fetchIDDLSpec('/api/specs/dashboard');
  return { props: { spec } };
}

export default function Page({ spec }) {
  return <IDDLRenderer spec={spec} />;
}
```

---

## 추가 도움말

### 디버깅 팁

**1. JSON 검증**
```bash
# jq로 JSON 문법 확인
cat spec.json | jq .
```

**2. 브라우저 개발자 도구**
- React DevTools로 컴포넌트 트리 확인
- Network 탭에서 API 응답 확인

**3. 렌더러 로그**
```typescript
console.log('Rendering node:', node);
console.log('Data:', data);
```

---

### 커뮤니티

- **GitHub Issues**: 버그 리포트 및 기능 요청
- **Discord**: 실시간 질문 및 토론
- **Stack Overflow**: `iddl` 태그

---

## 핵심 정리

### 자주 발생하는 문제

```
1. 잘못된 계층 구조 (Page → Group 직접 연결)
2. prominence를 Group에 적용
3. mode 전파 안 됨 (Container 사용)
4. IconButton에 title 없음
5. model 경로 오타
6. required를 constraints에 넣음
7. pattern 이스케이프 안 함
8. 가상 스크롤링 없이 대용량 데이터
9. debounce 없이 검색
10. 4단계 이상 중첩
```

### 문제 해결 순서

```
1. JSON 문법 확인
2. 노드 타입 및 계층 확인
3. 속성 호환성 확인 (Property Matrix)
4. 데이터 경로 확인
5. 렌더러 로그 확인
6. 브라우저 개발자 도구 확인
```

---

## 참고

- **전체 스펙**: [IDDL Specification v1.0.1](/spec/iddl-spec-1.0.1.md)
- **API 레퍼런스**: [API Reference](./api-reference.md)
- **Best Practices**: [Best Practices](../05-advanced/05-best-practices.md)

---

**이전**: [← DataType Reference](./datatype-reference.md)
**홈**: [README →](../../../README.md)
