# 접근성: 모두를 위한 UI 만들기 ♿

**예상 소요 시간**: 18분
**난이도**: ⭐⭐⭐⭐⭐ 최고급
**사전 지식**: 전체 Level 0-4

---

## 이 문서를 읽고 나면

- WCAG 2.1 기준을 이해합니다
- 접근 가능한 IDDL UI를 구성할 수 있습니다
- 키보드 네비게이션과 스크린 리더를 지원할 수 있습니다

---

## 접근성이란?

> **"장애가 있는 사용자도 동등하게 이용할 수 있는 UI"**

**대상 사용자**:
```
• 시각 장애 (스크린 리더 사용)
• 운동 장애 (키보드만 사용)
• 청각 장애 (자막 필요)
• 인지 장애 (명확한 언어 필요)
```

**WCAG 2.1 4대 원칙**:
```
1. Perceivable (인지 가능)
2. Operable (조작 가능)
3. Understandable (이해 가능)
4. Robust (견고함)
```

---

## 1. 시맨틱 HTML

IDDL은 자동으로 올바른 HTML 태그를 사용합니다.

### Text Role → HTML Tag

```json
{
  "type": "Text",
  "role": "Title",
  "content": "Dashboard"
}
```

**렌더링**:
```html
<h1>Dashboard</h1>  ← 스크린 리더가 "제목" 인식
```

---

### Action → Button

```json
{
  "type": "Action",
  "label": "Save",
  "behavior": { "action": "submit" }
}
```

**렌더링**:
```html
<button type="submit">Save</button>
```

❌ **잘못된 구현**:
```html
<div onclick="...">Save</div>  ← 키보드 접근 불가
```

---

## 2. ARIA 속성

### label과 aria-label

```json
{
  "type": "Field",
  "label": "Email",  // ← <label> 자동 생성
  "model": "user.email",
  "dataType": "email"
}
```

**렌더링**:
```html
<label for="user-email">Email</label>
<input
  id="user-email"
  type="email"
  aria-label="Email"
  aria-required="true"
/>
```

---

### IconButton

```json
{
  "type": "Action",
  "icon": "trash",
  "title": "Delete",  // ← aria-label로 사용
  "prominence": "Tertiary",
  "intent": "Critical",
  "behavior": { "action": "command", "command": "delete" }
}
```

**렌더링**:
```html
<button aria-label="Delete">
  <svg>...</svg>  ← 아이콘만
</button>
```

✅ **스크린 리더**: "Delete 버튼"
❌ **title 없으면**: "버튼" (의미 없음)

---

### 상태 표시

```json
{
  "type": "Field",
  "label": "Username",
  "model": "user.username",
  "required": true,
  "errorMessages": {
    "required": "Username is required"
  }
}
```

**렌더링 (에러 시)**:
```html
<label for="username">Username *</label>
<input
  id="username"
  aria-required="true"
  aria-invalid="true"
  aria-describedby="username-error"
/>
<span id="username-error" role="alert">
  Username is required
</span>
```

---

## 3. 키보드 네비게이션

### Tab 순서

IDDL은 논리적 순서로 자동 tabindex 설정:

```json
{
  "type": "Group",
  "role": "Form",
  "children": [
    { "type": "Field", "label": "Name" },      // tabindex=1
    { "type": "Field", "label": "Email" },     // tabindex=2
    { "type": "Action", "label": "Submit" }    // tabindex=3
  ]
}
```

---

### 키보드 단축키

```json
{
  "type": "Action",
  "label": "Save",
  "shortcut": "Ctrl+S",  // ← 키보드 단축키
  "prominence": "Primary",
  "behavior": { "action": "submit" }
}
```

**렌더링**:
```html
<button
  accesskey="s"
  title="Save (Ctrl+S)"
  onKeyDown={(e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSubmit();
    }
  }}
>
  Save
</button>
```

---

### 모달 포커스 트랩

```json
{
  "type": "Overlay",
  "id": "confirm-dialog",
  "role": "Dialog",
  "focusTrap": true,  // ← 포커스 트랩
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "type": "Text", "content": "Are you sure?" },
        { "type": "Action", "label": "Cancel" },
        { "type": "Action", "label": "Confirm" }
      ]
    }
  ]
}
```

**동작**:
```
1. 모달 열림 → 첫 번째 버튼에 포커스
2. Tab → 다음 요소
3. 마지막 요소에서 Tab → 첫 번째 요소로 순환
4. Esc → 모달 닫기
```

---

## 4. 색상 대비

### 최소 대비율

WCAG 2.1 기준:
```
일반 텍스트: 4.5:1
큰 텍스트 (18pt+): 3:1
UI 요소: 3:1
```

### Intent 색상

```json
{
  "type": "Text",
  "role": "Body",
  "content": "Error message",
  "intent": "Critical"  // ← 충분한 대비율
}
```

**렌더링**:
```css
/* Critical intent */
color: #dc2626;         /* 밝은 배경 */
background: #ffffff;
/* 대비율: 6.53:1 ✅ */

/* Dark mode */
color: #ef4444;         /* 어두운 배경 */
background: #1f2937;
/* 대비율: 5.12:1 ✅ */
```

---

### 색상만으로 정보 전달 금지

```json
// ❌ Bad: 색상으로만 구분
{
  "type": "Text",
  "content": "Active",
  "intent": "Positive"  // ← 색맹은 구분 못함
}

// ✅ Good: 아이콘 + 색상
{
  "type": "Text",
  "content": "✓ Active",  // ← 아이콘으로도 구분 가능
  "intent": "Positive"
}
```

---

## 5. 포커스 표시

### 기본 포커스 링

모든 Interactive 요소는 포커스 시 아웃라인 표시:

```css
button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}
```

---

### Skip Link

```json
{
  "type": "Action",
  "label": "Skip to main content",
  "prominence": "Tertiary",
  "hidden": true,  // ← 기본 숨김
  "focusVisible": true,  // ← 포커스 시 표시
  "behavior": {
    "action": "command",
    "command": "scrollToMain"
  }
}
```

**렌더링**:
```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
}

.skip-link:focus {
  top: 0;  /* 포커스 시 표시 */
}
```

---

## 6. 스크린 리더 지원

### Live Region

```json
{
  "type": "Group",
  "role": "Container",
  "ariaLive": "polite",  // ← 변경 시 알림
  "children": [
    {
      "type": "Text",
      "content": "Saving...",
      "hidden": "!isSaving"
    },
    {
      "type": "Text",
      "content": "✓ Saved",
      "hidden": "!isSaved"
    }
  ]
}
```

**렌더링**:
```html
<div aria-live="polite" aria-atomic="true">
  <span>Saving...</span>
  <!-- 스크린 리더: "Saving" 읽음 -->

  <!-- 저장 완료 -->
  <span>✓ Saved</span>
  <!-- 스크린 리더: "Saved" 읽음 -->
</div>
```

---

### 진행 상태

```json
{
  "type": "Group",
  "role": "Container",
  "state": "loading",
  "ariaLabel": "Loading users..."
}
```

**렌더링**:
```html
<div
  role="progressbar"
  aria-label="Loading users..."
  aria-valuenow="50"
  aria-valuemin="0"
  aria-valuemax="100"
>
  <div class="spinner"></div>
</div>
```

---

## 7. 폼 접근성

### 필수 필드

```json
{
  "type": "Field",
  "label": "Email",
  "model": "user.email",
  "dataType": "email",
  "required": true  // ← aria-required="true"
}
```

---

### 에러 메시지 연결

```json
{
  "type": "Field",
  "label": "Password",
  "model": "user.password",
  "dataType": "password",
  "required": true,
  "constraints": {
    "minLength": 8
  },
  "errorMessages": {
    "required": "Password is required",
    "minLength": "Password must be at least 8 characters"
  }
}
```

**렌더링 (에러 시)**:
```html
<label for="password">Password *</label>
<input
  id="password"
  type="password"
  aria-required="true"
  aria-invalid="true"
  aria-describedby="password-error password-hint"
/>
<span id="password-hint">
  At least 8 characters
</span>
<span id="password-error" role="alert">
  Password must be at least 8 characters
</span>
```

---

### Fieldset과 Legend

```json
{
  "type": "Group",
  "role": "Fieldset",
  "legend": "Personal Information",
  "children": [
    { "type": "Field", "label": "Name" },
    { "type": "Field", "label": "Email" }
  ]
}
```

**렌더링**:
```html
<fieldset>
  <legend>Personal Information</legend>
  <label>Name</label>
  <input />
  <label>Email</label>
  <input />
</fieldset>
```

---

## 8. 테이블 접근성

### 테이블 헤더

```json
{
  "type": "Group",
  "role": "Table",
  "caption": "User List",  // ← <caption>
  "children": [
    { "type": "Field", "label": "Name", "model": "item.name" },
    { "type": "Field", "label": "Email", "model": "item.email" }
  ]
}
```

**렌더링**:
```html
<table>
  <caption>User List</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Teo</td>
      <td>teo@example.com</td>
    </tr>
  </tbody>
</table>
```

---

## 9. 이미지 접근성

### Alt Text

```json
{
  "type": "Field",
  "label": "Profile Picture",
  "model": "user.avatar",
  "dataType": "image",
  "alt": "user.name"  // ← alt 텍스트
}
```

**렌더링**:
```html
<img src="/avatar.jpg" alt="Teo" />
```

---

### 장식 이미지

```json
{
  "type": "Field",
  "model": "decoration",
  "dataType": "image",
  "decorative": true  // ← alt="" (스크린 리더 무시)
}
```

**렌더링**:
```html
<img src="/decoration.png" alt="" role="presentation" />
```

---

## 10. 접근성 체크리스트

### Level A (필수)

```
□ 모든 이미지에 alt 텍스트
□ 키보드로 모든 기능 접근 가능
□ 포커스 표시
□ 명확한 링크 텍스트
□ 페이지 제목
```

### Level AA (권장)

```
□ 색상 대비 4.5:1 이상
□ 텍스트 크기 조절 가능 (200%)
□ 에러 메시지 명확
□ 레이블과 입력 필드 연결
□ 포커스 순서 논리적
```

### Level AAA (이상적)

```
□ 색상 대비 7:1 이상
□ 복잡한 내용에 요약 제공
□ 읽기 수준 낮춤
```

---

## 핵심 정리

### 시맨틱 HTML

```
Text role → 적절한 HTML 태그
Action → <button>
Field → <input> + <label>
```

### ARIA

```
label → aria-label
required → aria-required
error → aria-invalid + aria-describedby
state → aria-live
```

### 키보드

```
Tab → 다음 요소
Shift+Tab → 이전 요소
Enter/Space → 클릭
Esc → 모달 닫기
```

### 색상

```
대비율 4.5:1 이상
색상 + 아이콘/텍스트
포커스 링 표시
```

### Best Practice

```
✓ 모든 Interactive 요소에 레이블
✓ 키보드로 모든 기능 사용 가능
✓ 충분한 색상 대비
✓ 명확한 에러 메시지
✓ 논리적 포커스 순서
✗ 아이콘만 있는 버튼 (title 필수)
✗ 색상으로만 정보 전달
✗ 자동 재생 (사용자 제어 필요)
```

---

## 테스트 도구

### 자동 테스트

```bash
# axe-core
npm install --save-dev @axe-core/react

# Lighthouse
npm install -g lighthouse
lighthouse https://example.com --view
```

### 수동 테스트

```
1. 키보드만으로 전체 탐색
2. 스크린 리더 (NVDA, VoiceOver)
3. 색상 대비 도구 (WebAIM Contrast Checker)
4. 확대 (200%)
```

---

## 다음 단계

접근성을 완벽히 이해했습니다!
마지막으로 **Best Practices**를 배워봅시다.

**다음**: [Best Practices →](./05-best-practices.md)

---

**이전**: [← 성능 최적화](./03-performance.md)
**다음**: [Best Practices →](./05-best-practices.md)
