아래는 요청하신 **“IDDL Prop Pool 사전(Glossary) 1장짜리”** 초안입니다.
목표는 “이름을 외우기 쉽게 통일”하면서도, 실무에서 반복적으로 충돌하는 의미(특히 label/name/description, state/value)를 **한 번에 합의**하도록 만드는 것입니다.

---

# IDDL Prop Pool Glossary (1-page)

## 목적

IDDL은 프로덕트 팀(기획/디자인/개발)이 동일한 의미를 동일한 단어로 호출할 수 있도록, prop 이름을 **소수의 표준 키(Canonical Keys)** 로 수렴한다.
이 Glossary는 스펙 확장 시에도 prop name 폭발을 방지하기 위한 “어휘 계약”이다.

---

## Canonical Keys (정의와 사용 규칙)

### 1) `role`

* **정의:** 노드의 기능적 정체성(랜드마크/패턴/엘리먼트 타입).
* **누가 합의?** 전원(PM/디자인/개발). “이건 무엇인가”를 결정하는 핵심.
* **규칙:** 표현(CSS/색/크기)을 담지 않는다. 구조/의미만.

---

### 2) `intent`

* **정의:** 의미론적 톤(Neutral/Brand/Positive/Caution/Critical/Info).
* **규칙:** “경고 문구를 빨갛게” 같은 표현이 아니라, **위험/긍정/정보**의 의미 레이어다.
* **금지:** `color`, `severity`, `variant`로 대체하지 않는다(표현과 결합됨).

---

### 3) `prominence`

* **정의:** 중요도/노출 위계(Hero/Standard/Subtle/Hidden).
* **규칙:** `Hidden`은 사용자에게 보이는 UI로 렌더되면 안 된다(렌더러 정책으로 DOM 제거/숨김 방식 선택).

---

### 4) `density`

* **정의:** 물리적 밀도(리듬/간격/타깃 사이즈)의 추상 수준.
* **규칙:** 픽셀/토큰값 직접 기술 금지. 디바이스/브랜드별 매핑은 렌더러 책임.

---

### 5) `spec`

* **정의:** role을 성립/구체화하기 위한 role-dependent 파라미터 집합(순수 데이터).
* **규칙:**

    * 직렬화 가능한 데이터만 허용
    * 표현(CSS/px/color/font) 직접 기술 금지
    * 상속/병합 금지(Part 1 코어)
* **사용:** “같은 role인데 구현이 갈리는 부분”을 spec로 흡수한다(예: Help 표시 방식, Drawer 의미 선택 등).

---

## Naming / Describing (접근성 + 팀 커뮤니케이션 핵심)

### 6) `name`

* **정의:** 해당 노드의 “이름(Accessible Name)”. 스크린리더/랜드마크/다이얼로그 식별에 사용된다.
* **언제 쓰나:**

    * Section/Block(랜드마크, Region), Modal/Dialog, Navigation 등 “label이 없는 노드”에 필수급
* **규칙:** `aria-label`, `aria-labelledby` 같은 구현 디테일 prop를 만들지 않는다. IDDL은 `name` 하나로 통일한다.

---

### 7) `description`

* **정의:** 해당 노드의 설명(Accessible Description). 도움말/힌트/툴팁/오류 설명 텍스트의 “통합 그릇”.
* **언제 쓰나:**

    * Field의 helperText, Action의 위험 경고, Tooltip 텍스트, Dialog 설명 등
* **규칙:** `tooltipText`, `helperText`, `hint`, `errorText`를 별도 prop로 만들지 않는다. 전부 `description`으로 수렴한다.
* **표현 방식:** tooltip/inline 등은 `spec.help.mode` 같은 role-dependent spec로 분기한다.

---

## Visible Labels (보이는 텍스트)

### 8) `label`

* **정의:** 화면에 보이는 라벨(Visible label).
* **범위:** Field/Action처럼 “텍스트 라벨이 UI에 표시되는 역할”에만 사용.
* **중요 규칙:** 접근성 이름은 `label`이 아니라 `name`이다.

    * Field는 `label`이 보통 접근성 이름까지 해결해주지만(네이티브 `<label>`),
    * Section/Block/Modal 같은 곳은 `label`이 없으므로 `name`이 필요하다.

---

## Content / Media

### 9) `content`

* **정의:** Text 노드의 실제 문자열.
* **규칙:** “title” 같은 다의적 키를 content로 대체하지 않는다.

### 10) `src`, `alt`

* **정의:** 미디어 소스와 대체 텍스트.
* **규칙:** `alt`는 Image에서 의미를 고정한다(접근성에 직접 영향).

---

## Interaction (행동)

### 11) `behavior`

* **정의:** Action이 수행하는 의미적 행동(Submit/Navigate/Command/Open 등).
* **규칙:** `onClick` 같은 이벤트 핸들러를 IDDL에 도입하지 않는다. IDDL은 “무슨 행동인지”만 선언한다.

---

## Reserved for Part 2 (확장 대비: 폭발을 막기 위한 예약 키)

### 12) `state`

* **정의:** open/loading/selected/expanded/invalid/disabled 등 UI 상태를 단일 키로 통합.
* **이유:** 상태를 개별 prop로 만들면(예: isLoading, open, expanded…) 곧바로 props 폭발이 발생한다.

### 13) `value`, `defaultValue`, `placeholder`

* **정의:** 입력/선택의 값과 초기값, 빈 값 안내.
* **이유:** Form/Select/Combobox/Tabs 등 복합 위젯에서 표준 패턴이므로 미리 예약한다.

### 14) `items`

* **정의:** 반복 구조(List/Menu/Select/Tabs 등)의 데이터 리스트.
* **이유:** ListItem/Option/Tab 같은 하위 단위가 늘어날 때 구조를 고정할 기준점이 된다.

### 15) `keys`

* **정의:** 키보드/단축키/roving tabindex 등 상호작용의 선언형 힌트.
* **이유:** `onKeyDown`, `hotkey`, `shortcut` 난립을 방지한다.

---

## 금지/비권장 동의어(표준 키로 치환)

* `ariaLabel`, `a11yName` → `name`
* `helperText`, `tooltipText`, `hint`, `errorText` → `description`
* `variant`, `colorScheme`, `size`(전역) → core 금지(필요시 role-dependent `spec`로 제한)
* `onClick`, `onKeyDown` → IDDL에 도입하지 않음(behavior/keys로 선언)

---

# Prop Pool 요약 표 (Canonical Mapping Table)

| Canonical Key  | 한 줄 정의                      | 주 사용 계층               | 흔한 업계 동의어/대체어                 | IDDL 배치      | 폭발 방지 규칙              |
| -------------- | --------------------------- | --------------------- | ----------------------------- | ------------ | --------------------- |
| `role`         | 이것은 무엇인가(기능/의미)             | Section/Block/Element | semantic tag, aria role       | Part 1       | 표현 속성 금지              |
| `intent`       | 의미 톤(위험/긍정/정보 등)            | 전 계층                  | severity, color, tone         | Part 1       | 색/스타일로 대체 금지          |
| `prominence`   | 중요도/노출 위계                   | 전 계층                  | emphasis, priority            | Part 1       | Hidden은 비가시 강제        |
| `density`      | 레이아웃 밀도(리듬/타깃)              | 전 계층                  | size, compact mode            | Part 1       | px/토큰 직접 금지           |
| `spec`         | role-dependent 파라미터(순수 데이터) | 전 계층                  | props bag, options            | Part 1       | 표현/상속/함수 금지           |
| `name`         | 접근성 이름(랜드마크/다이얼로그 포함)       | Section/Block/Element | aria-label, a11yName          | Part 1 확장 후보 | 구현 디테일 prop 금지        |
| `description`  | 접근성 설명(도움/툴팁/오류 텍스트 통합)     | 전 계층                  | helperText, tooltipText, hint | Part 1 확장 후보 | 텍스트 그릇 단일화            |
| `label`        | 보이는 라벨                      | Field/Action          | labelText, text               | Part 1(이미)   | name과 혼용 금지           |
| `content`      | 텍스트 본문                      | Text                  | text, title                   | Part 1(이미)   | title 다의성 회피          |
| `src`          | 미디어 소스                      | Image/Video           | url, source                   | Part 1(이미)   | -                     |
| `alt`          | 이미지 대체 텍스트                  | Image                 | aria-label(오용)                | Part 1(이미)   | 이미지 의미는 alt로          |
| `behavior`     | Action의 의미 행동               | Action                | onClick, href, to             | Part 1(이미)   | 핸들러 금지, 선언만           |
| `state`        | UI 상태 통합 키                  | 전 계층                  | open, isLoading, selected     | Part 2 예약    | 상태 prop 난립 금지         |
| `value`        | 현재 값                        | Field/위젯              | value                         | Part 2 예약    | 컨트롤 패턴 표준화            |
| `defaultValue` | 초기 값                        | Field/위젯              | defaultValue                  | Part 2 예약    | uncontrolled 표준화      |
| `placeholder`  | 빈 값 안내                      | Field/위젯              | placeholder                   | Part 2 예약    | -                     |
| `items`        | 반복 데이터                      | List/Menu/Select/Tabs | items, options                | Part 2 예약    | ListItem/Option 폭발 방지 |
| `keys`         | 키보드/단축키 선언 힌트               | 위젯                    | hotkey, shortcut              | Part 2 예약    | onKeyDown 난립 방지       |

---

원하시면, 이 Glossary를 바로 Part 1 문서에 들어갈 수 있게 **“Normative 용어 정의(Conformance Terminology)” 형식**으로 재작성하고, `name/description`을 BaseProps에 넣는 최소 패치(Part 1.0.1)까지 함께 제안하겠습니다.
