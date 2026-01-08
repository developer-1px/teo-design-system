# Role Taxonomy: 역할 분류 체계 🏷️

**IDDL Specification v1.0.1**

IDDL의 모든 role을 체계적으로 분류한 완전한 참조 문서입니다.

---

## 목차

1. [Text Role](#text-role)
2. [Group Role](#group-role)
3. [Section Role](#section-role)
4. [Overlay Role](#overlay-role)
5. [Role 선택 가이드](#role-선택-가이드)

---

## Text Role

### 5가지 Text Role

| Role | 용도 | 기본 prominence | HTML 태그 | 예시 |
|------|------|-----------------|-----------|------|
| **Title** | 제목, 헤딩 | Hero | `<h1>` | 페이지 제목, 섹션 제목 |
| **Body** | 본문, 설명 | Primary | `<p>` | 단락, 설명 텍스트 |
| **Label** | 레이블, 필드명 | Secondary | `<span>` | 폼 레이블, 항목명 |
| **Caption** | 부가 정보, 메타 | Tertiary | `<small>` | 날짜, 작성자, 추가 설명 |
| **Code** | 코드, 고정폭 | Primary | `<code>` | 코드 스니펫, 기술 값 |

---

### Title: 제목

**용도**: 페이지, 섹션, 카드의 제목

```json
{
  "type": "Text",
  "role": "Title",
  "content": "Dashboard",
  "prominence": "Hero"
}
```

**렌더링**:
```html
<h1 class="text-5xl font-bold">Dashboard</h1>
```

**사용 케이스**:
- 페이지 제목
- Section 제목
- Card 제목
- Dialog 제목

---

### Body: 본문

**용도**: 일반 본문 텍스트

```json
{
  "type": "Text",
  "role": "Body",
  "content": "This is a description of the feature.",
  "prominence": "Primary"
}
```

**렌더링**:
```html
<p class="text-base">This is a description of the feature.</p>
```

**사용 케이스**:
- 단락
- 설명 텍스트
- 안내 문구

---

### Label: 레이블

**용도**: 필드 레이블, 항목명

```json
{
  "type": "Text",
  "role": "Label",
  "content": "Status",
  "prominence": "Secondary"
}
```

**렌더링**:
```html
<span class="text-sm text-gray-600">Status</span>
```

**사용 케이스**:
- 폼 필드 레이블
- 테이블 컬럼 헤더
- 항목명

---

### Caption: 부가 정보

**용도**: 메타 정보, 작은 텍스트

```json
{
  "type": "Text",
  "role": "Caption",
  "content": "Last updated 2 hours ago",
  "prominence": "Tertiary"
}
```

**렌더링**:
```html
<small class="text-xs text-gray-400">Last updated 2 hours ago</small>
```

**사용 케이스**:
- 날짜, 시간
- 작성자
- 메타 정보
- 힌트

---

### Code: 코드

**용도**: 코드, 기술 값

```json
{
  "type": "Text",
  "role": "Code",
  "content": "npm install iddl",
  "prominence": "Primary"
}
```

**렌더링**:
```html
<code class="font-mono bg-gray-100 px-2 py-1">npm install iddl</code>
```

**사용 케이스**:
- 코드 스니펫
- API 키
- 기술 값 (ID, 해시 등)

---

## Group Role

### 12가지 Group Role

| Role | 용도 | 자식 배치 | 예시 |
|------|------|-----------|------|
| **Container** | 일반 컨테이너 | 수직 스택 | 일반 그룹 |
| **Form** | 폼 | 수직 스택 | 회원가입 폼 |
| **Fieldset** | 필드 그룹 | 수직 스택 | 개인정보 그룹 |
| **Toolbar** | 도구 모음 | 수평 정렬 | 버튼 그룹 |
| **List** | 목록 | 수직 스택 | 사용자 목록 |
| **Grid** | 그리드 | 그리드 (2-4열) | 카드 그리드 |
| **Table** | 테이블 | 테이블 레이아웃 | 데이터 테이블 |
| **Card** | 카드 | 수직 스택 | 프로필 카드 |
| **Tabs** | 탭 | 탭 레이아웃 | 설정 탭 |
| **Steps** | 단계 표시 | 진행 표시 | 가입 단계 |
| **Split** | 분할 | 수평 분할 | 좌우 분할 |
| **Inline** | 인라인 | 수평 정렬 | 태그 그룹 |

---

### Container: 일반 컨테이너

**용도**: 논리적 그룹, 일반 컨테이너

```json
{
  "type": "Group",
  "role": "Container",
  "children": [
    { "type": "Text", "role": "Title", "content": "Section Title" },
    { "type": "Text", "role": "Body", "content": "Description" }
  ]
}
```

**레이아웃**: 수직 스택 (gap-4)

**사용 케이스**:
- 일반 그룹
- 논리적 묶음

---

### Form: 폼

**용도**: 데이터 입력 폼

```json
{
  "type": "Group",
  "role": "Form",
  "mode": "edit",
  "children": [
    { "type": "Field", "label": "Name", "model": "user.name", "dataType": "text" },
    { "type": "Field", "label": "Email", "model": "user.email", "dataType": "email" },
    { "type": "Action", "label": "Submit", "behavior": { "action": "submit" } }
  ]
}
```

**레이아웃**: 수직 스택 (gap-4)

**특징**:
- mode 전파 (edit)
- 자동 검증
- submit 처리

**사용 케이스**:
- 회원가입 폼
- 로그인 폼
- 프로필 편집

---

### Fieldset: 필드 그룹

**용도**: 관련 필드 묶음

```json
{
  "type": "Group",
  "role": "Fieldset",
  "legend": "Personal Information",
  "children": [
    { "type": "Field", "label": "First Name", "model": "user.firstName", "dataType": "text" },
    { "type": "Field", "label": "Last Name", "model": "user.lastName", "dataType": "text" }
  ]
}
```

**레이아웃**: 수직 스택 (gap-4) + 테두리

**렌더링**: `<fieldset>` + `<legend>`

**사용 케이스**:
- 개인정보 그룹
- 주소 입력 그룹
- 결제 정보 그룹

---

### Toolbar: 도구 모음

**용도**: 액션 버튼 그룹

```json
{
  "type": "Group",
  "role": "Toolbar",
  "children": [
    { "type": "Action", "label": "Save", "prominence": "Primary", "intent": "Positive" },
    { "type": "Action", "label": "Cancel", "prominence": "Tertiary" },
    { "type": "Action", "label": "Delete", "prominence": "Tertiary", "intent": "Critical" }
  ]
}
```

**레이아웃**: 수평 정렬 (gap-2, justify-end)

**사용 케이스**:
- 폼 버튼 그룹
- 테이블 액션
- 모달 푸터

---

### List: 목록

**용도**: 항목 나열

```json
{
  "type": "Group",
  "role": "List",
  "children": [
    {
      "type": "Group",
      "role": "Card",
      "children": [
        { "type": "Text", "role": "Title", "content": "Item 1" }
      ]
    },
    {
      "type": "Group",
      "role": "Card",
      "children": [
        { "type": "Text", "role": "Title", "content": "Item 2" }
      ]
    }
  ]
}
```

**레이아웃**: 수직 스택 (gap-2)

**최적화**: virtualized=true (1000+ 항목)

**사용 케이스**:
- 사용자 목록
- 제품 목록
- 알림 목록

---

### Grid: 그리드

**용도**: 카드 그리드

```json
{
  "type": "Group",
  "role": "Grid",
  "children": [
    { "type": "Group", "role": "Card", "children": [...] },
    { "type": "Group", "role": "Card", "children": [...] },
    { "type": "Group", "role": "Card", "children": [...] }
  ]
}
```

**레이아웃**: 그리드 (2-4열, 반응형)

**사용 케이스**:
- 제품 카드 그리드
- 대시보드 위젯
- 갤러리

---

### Table: 테이블

**용도**: 데이터 테이블

```json
{
  "type": "Group",
  "role": "Table",
  "children": [
    { "type": "Field", "label": "Name", "model": "item.name", "dataType": "text", "mode": "view" },
    { "type": "Field", "label": "Email", "model": "item.email", "dataType": "email", "mode": "view" },
    { "type": "Field", "label": "Status", "model": "item.status", "dataType": "select", "mode": "view" }
  ]
}
```

**레이아웃**: `<table>` + `<thead>` + `<tbody>`

**최적화**: virtualized=true (1000+ 행)

**사용 케이스**:
- 사용자 테이블
- 주문 내역
- 로그 테이블

---

### Card: 카드

**용도**: 독립적 정보 단위

```json
{
  "type": "Group",
  "role": "Card",
  "intent": "Neutral",
  "children": [
    { "type": "Text", "role": "Title", "content": "Card Title" },
    { "type": "Text", "role": "Body", "content": "Card description" },
    { "type": "Action", "label": "View", "prominence": "Primary" }
  ]
}
```

**레이아웃**: 수직 스택 (gap-3) + 패딩 + 테두리/그림자

**사용 케이스**:
- 프로필 카드
- 제품 카드
- 통계 카드

---

### Tabs: 탭

**용도**: 탭 전환

```json
{
  "type": "Group",
  "role": "Tabs",
  "lazyLoad": true,
  "children": [
    {
      "type": "Group",
      "id": "tab-1",
      "label": "Profile",
      "children": [...]
    },
    {
      "type": "Group",
      "id": "tab-2",
      "label": "Settings",
      "children": [...]
    }
  ]
}
```

**레이아웃**: 탭 헤더 + 탭 패널

**최적화**: lazyLoad=true

**사용 케이스**:
- 프로필 탭
- 설정 탭
- 상세 정보 탭

---

### Steps: 단계 표시

**용도**: 진행 단계

```json
{
  "type": "Group",
  "role": "Steps",
  "currentStep": 2,
  "children": [
    {
      "type": "Group",
      "id": "step-1",
      "label": "Account",
      "status": "completed",
      "children": [...]
    },
    {
      "type": "Group",
      "id": "step-2",
      "label": "Profile",
      "status": "active",
      "children": [...]
    },
    {
      "type": "Group",
      "id": "step-3",
      "label": "Complete",
      "status": "pending",
      "children": [...]
    }
  ]
}
```

**레이아웃**: 진행 표시줄 + 단계 패널

**사용 케이스**:
- 회원가입 단계
- 결제 프로세스
- 온보딩

---

### Split: 분할

**용도**: 좌우 분할

```json
{
  "type": "Group",
  "role": "Split",
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "type": "Text", "role": "Title", "content": "Left Panel" }
      ]
    },
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "type": "Text", "role": "Title", "content": "Right Panel" }
      ]
    }
  ]
}
```

**레이아웃**: 50:50 또는 60:40 분할

**사용 케이스**:
- 마스터-디테일
- 코드 에디터 + 미리보기
- 비교 뷰

---

### Inline: 인라인

**용도**: 수평 인라인 배치

```json
{
  "type": "Group",
  "role": "Inline",
  "children": [
    { "type": "Text", "role": "Label", "content": "Tags:" },
    { "type": "Text", "role": "Body", "content": "React" },
    { "type": "Text", "role": "Body", "content": "TypeScript" },
    { "type": "Text", "role": "Body", "content": "Vite" }
  ]
}
```

**레이아웃**: 수평 정렬 (gap-2, wrap)

**사용 케이스**:
- 태그 그룹
- 배지 그룹
- 인라인 액션

---

## Section Role

### 5가지 Section Role

| Role | 용도 | 위치 | 예시 |
|------|------|------|------|
| **Container** | 일반 섹션 | 중앙 | 메인 콘텐츠 |
| **Header** | 헤더 | 상단 | 네비게이션 바 |
| **Footer** | 푸터 | 하단 | 저작권, 링크 |
| **Navigator** | 네비게이션 | 좌측/상단 | 사이드바, 메뉴 |
| **Aside** | 보조 정보 | 우측 | 관련 정보, 광고 |

---

### Container: 일반 섹션

**용도**: 메인 콘텐츠 영역

```json
{
  "type": "Section",
  "role": "Container",
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [...]
    }
  ]
}
```

**위치**: 페이지 중앙

**사용 케이스**:
- 메인 콘텐츠
- 폼 영역
- 리스트 영역

---

### Header: 헤더

**용도**: 페이지 헤더

```json
{
  "type": "Section",
  "role": "Header",
  "children": [
    {
      "type": "Group",
      "role": "Toolbar",
      "children": [
        { "type": "Text", "role": "Title", "content": "App Name" },
        { "type": "Action", "icon": "user", "title": "Profile" }
      ]
    }
  ]
}
```

**위치**: 페이지 상단

**사용 케이스**:
- 네비게이션 바
- 앱 헤더
- 페이지 제목

---

### Footer: 푸터

**용도**: 페이지 푸터

```json
{
  "type": "Section",
  "role": "Footer",
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "type": "Text", "role": "Caption", "content": "© 2025 Company" }
      ]
    }
  ]
}
```

**위치**: 페이지 하단

**사용 케이스**:
- 저작권
- 푸터 링크
- 연락처

---

### Navigator: 네비게이션

**용도**: 사이드바, 메뉴

```json
{
  "type": "Section",
  "role": "Navigator",
  "children": [
    {
      "type": "Group",
      "role": "List",
      "children": [
        { "type": "Action", "label": "Dashboard", "behavior": { "action": "navigate", "to": "/" } },
        { "type": "Action", "label": "Users", "behavior": { "action": "navigate", "to": "/users" } }
      ]
    }
  ]
}
```

**위치**: 좌측 사이드바 또는 상단 메뉴

**사용 케이스**:
- 사이드바 메뉴
- 네비게이션 링크

---

### Aside: 보조 정보

**용도**: 관련 정보, 광고

```json
{
  "type": "Section",
  "role": "Aside",
  "children": [
    {
      "type": "Group",
      "role": "Card",
      "children": [
        { "type": "Text", "role": "Title", "content": "Related Articles" },
        { "type": "Text", "role": "Body", "content": "..." }
      ]
    }
  ]
}
```

**위치**: 우측 사이드바

**사용 케이스**:
- 관련 정보
- 광고
- 추천 콘텐츠

---

## Overlay Role

### 7가지 Overlay Role

| Role | 용도 | 크기 | 위치 | 사용 케이스 |
|------|------|------|------|-------------|
| **Dialog** | 모달 대화상자 | 중간 | 중앙 | 확인, 삭제 확인 |
| **Drawer** | 슬라이드 패널 | 큼 | 좌/우 | 필터, 설정 |
| **Toast** | 알림 메시지 | 작음 | 상단/하단 | 성공, 에러 알림 |
| **Popover** | 팝오버 | 작음 | 버튼 근처 | 추가 정보, 메뉴 |
| **Tooltip** | 툴팁 | 매우 작음 | 요소 근처 | 힌트 |
| **Sheet** | 바텀 시트 | 중간 | 하단 | 모바일 메뉴 |
| **Lightbox** | 라이트박스 | 전체 | 중앙 | 이미지 확대 |

---

### Dialog: 모달 대화상자

**용도**: 확인, 경고, 폼

```json
{
  "type": "Overlay",
  "id": "confirm-delete",
  "role": "Dialog",
  "placement": "center",
  "isOpen": false,
  "children": [
    {
      "type": "Group",
      "role": "Card",
      "children": [
        { "type": "Text", "role": "Title", "content": "Confirm Delete" },
        { "type": "Text", "role": "Body", "content": "Are you sure?" },
        {
          "type": "Group",
          "role": "Toolbar",
          "children": [
            { "type": "Action", "label": "Cancel", "behavior": { "action": "close" } },
            { "type": "Action", "label": "Delete", "intent": "Critical", "behavior": { "action": "command" } }
          ]
        }
      ]
    }
  ]
}
```

**특징**:
- 중앙 배치
- Backdrop (dim)
- 포커스 트랩
- ESC로 닫기

---

### Drawer: 슬라이드 패널

**용도**: 필터, 설정, 상세 정보

```json
{
  "type": "Overlay",
  "id": "filter-drawer",
  "role": "Drawer",
  "placement": "right",
  "isOpen": false,
  "children": [
    {
      "type": "Group",
      "role": "Form",
      "children": [
        { "type": "Text", "role": "Title", "content": "Filters" },
        { "type": "Field", "label": "Status", "model": "filters.status", "dataType": "select" },
        { "type": "Action", "label": "Apply", "behavior": { "action": "submit" } }
      ]
    }
  ]
}
```

**특징**:
- 좌/우 슬라이드
- 전체 높이
- Backdrop

---

### Toast: 알림 메시지

**용도**: 성공, 에러, 정보 알림

```json
{
  "type": "Overlay",
  "id": "success-toast",
  "role": "Toast",
  "placement": "top-right",
  "isOpen": false,
  "dismissable": true,
  "children": [
    {
      "type": "Group",
      "role": "Card",
      "intent": "Positive",
      "children": [
        { "type": "Text", "role": "Body", "content": "✓ Saved successfully" }
      ]
    }
  ]
}
```

**특징**:
- 작은 크기
- 자동 닫기 (3-5초)
- 여러 개 스택 가능

---

### Popover: 팝오버

**용도**: 메뉴, 추가 정보

```json
{
  "type": "Overlay",
  "id": "user-menu",
  "role": "Popover",
  "placement": "bottom-right",
  "isOpen": false,
  "children": [
    {
      "type": "Group",
      "role": "List",
      "children": [
        { "type": "Action", "label": "Profile", "behavior": { "action": "navigate", "to": "/profile" } },
        { "type": "Action", "label": "Settings", "behavior": { "action": "navigate", "to": "/settings" } },
        { "type": "Action", "label": "Logout", "behavior": { "action": "command" } }
      ]
    }
  ]
}
```

**특징**:
- 버튼 근처 배치
- 작은 크기
- 외부 클릭으로 닫기

---

### Tooltip: 툴팁

**용도**: 힌트, 설명

```json
{
  "type": "Overlay",
  "id": "username-tooltip",
  "role": "Tooltip",
  "placement": "top",
  "isOpen": false,
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "type": "Text", "role": "Caption", "content": "Enter your username" }
      ]
    }
  ]
}
```

**특징**:
- 매우 작음
- 요소 hover 시 표시
- 짧은 텍스트만

---

### Sheet: 바텀 시트

**용도**: 모바일 메뉴, 필터

```json
{
  "type": "Overlay",
  "id": "mobile-menu",
  "role": "Sheet",
  "placement": "bottom",
  "isOpen": false,
  "children": [
    {
      "type": "Group",
      "role": "List",
      "children": [
        { "type": "Action", "label": "Share", "icon": "share" },
        { "type": "Action", "label": "Edit", "icon": "edit" },
        { "type": "Action", "label": "Delete", "icon": "trash", "intent": "Critical" }
      ]
    }
  ]
}
```

**특징**:
- 화면 하단에서 올라옴
- 모바일 친화적
- 스와이프로 닫기

---

### Lightbox: 라이트박스

**용도**: 이미지 확대

```json
{
  "type": "Overlay",
  "id": "image-lightbox",
  "role": "Lightbox",
  "placement": "center",
  "isOpen": false,
  "children": [
    {
      "type": "Group",
      "role": "Container",
      "children": [
        { "type": "Field", "model": "image.url", "dataType": "image" }
      ]
    }
  ]
}
```

**특징**:
- 전체 화면
- 검은 Backdrop
- 좌우 화살표 (갤러리)

---

## Role 선택 가이드

### Text Role 선택 플로우

```
1. 제목인가?
   ✅ → Title

2. 본문인가?
   ✅ → Body

3. 레이블/필드명인가?
   ✅ → Label

4. 부가 정보/메타인가?
   ✅ → Caption

5. 코드/기술 값인가?
   ✅ → Code
```

---

### Group Role 선택 플로우

```
1. 폼인가?
   ✅ → Form

2. 테이블인가?
   ✅ → Table

3. 그리드 카드인가?
   ✅ → Grid

4. 리스트인가?
   ✅ → List

5. 버튼 그룹인가?
   ✅ → Toolbar

6. 탭인가?
   ✅ → Tabs

7. 단계 표시인가?
   ✅ → Steps

8. 카드인가?
   ✅ → Card

9. 관련 필드 그룹인가?
   ✅ → Fieldset

10. 좌우 분할인가?
   ✅ → Split

11. 인라인 배치인가?
   ✅ → Inline

12. 기타
   ✅ → Container
```

---

### Section Role 선택 플로우

```
1. 헤더인가?
   ✅ → Header

2. 푸터인가?
   ✅ → Footer

3. 사이드바 메뉴인가?
   ✅ → Navigator

4. 보조 정보인가?
   ✅ → Aside

5. 기타 메인 콘텐츠
   ✅ → Container
```

---

### Overlay Role 선택 플로우

```
1. 확인/경고 메시지인가?
   ✅ → Dialog

2. 필터/설정 패널인가?
   ✅ → Drawer

3. 짧은 알림인가?
   ✅ → Toast

4. 메뉴/추가 정보인가?
   ✅ → Popover

5. 힌트인가?
   ✅ → Tooltip

6. 모바일 메뉴인가?
   ✅ → Sheet

7. 이미지 확대인가?
   ✅ → Lightbox
```

---

## 핵심 정리

### Text Role (5개)

```
Title: 제목
Body: 본문
Label: 레이블
Caption: 부가 정보
Code: 코드
```

### Group Role (12개)

```
Container: 일반 컨테이너
Form: 폼
Fieldset: 필드 그룹
Toolbar: 도구 모음
List: 목록
Grid: 그리드
Table: 테이블
Card: 카드
Tabs: 탭
Steps: 단계 표시
Split: 분할
Inline: 인라인
```

### Section Role (5개)

```
Container: 일반 섹션
Header: 헤더
Footer: 푸터
Navigator: 네비게이션
Aside: 보조 정보
```

### Overlay Role (7개)

```
Dialog: 모달 대화상자
Drawer: 슬라이드 패널
Toast: 알림 메시지
Popover: 팝오버
Tooltip: 툴팁
Sheet: 바텀 시트
Lightbox: 라이트박스
```

---

## 참고

- **전체 스펙**: [IDDL Specification v1.0.1](/spec/iddl-spec-1.0.1.md)
- **API 레퍼런스**: [API Reference](./api-reference.md)
- **속성 매트릭스**: [Property Matrix](./property-matrix.md)

---

**이전**: [← Property Matrix](./property-matrix.md)
**다음**: [DataType Reference →](./datatype-reference.md)
