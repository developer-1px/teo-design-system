MDK 디자인 시스템의 공식 문서(Documentation) 서문(Introduction) 초안입니다.
지금까지 우리가 쌓아올린 **건축적 철학**과 **논리적 구조**를 개발자와 디자이너가 단번에 이해할 수 있도록, 선언적이고 명료한 어조로 작성했습니다.

---

# Introduction to MDK

## Design is Logic, Not Preference.

**디자인은 취향의 선택이 아니라, 논리의 결정입니다.**

MDK(Modern Design Kit)는 단순한 UI 컴포넌트 라이브러리가 아닙니다.
디지털 인터페이스를 구성하는 **가장 논리적이고 결정적인 문법(Grammar)**입니다.

우리는 "이 버튼을 14px로 할까, 16px로 할까?"를 고민하지 않습니다.
대신 **"이것은 어떤 세계(Experience)에 놓인, 어떤 공간(Context)인가?"**를 정의합니다.
그 정의가 끝나는 순간, 디자인은 시스템에 의해 **자동으로 결정(Deterministic)**됩니다.

---

## The MDK Architecture

MDK는 6단계의 엄격한 **수직적 위계(Vertical Hierarchy)**를 따릅니다.
상위 개념은 하위 개념의 물리 법칙과 렌더링 방식을 통제합니다.

### **1. Experience (The World)**

> *"이 화면은 어떤 목적을 가진 세계인가?"*

시스템의 최상위 물리 법칙입니다. Experience가 결정되면 폰트의 크기, 여백의 밀도, 모서리의 둥글기가 전역적으로 재설정됩니다.

* **Application:** 고밀도, 기능 중심, 단단한 물성. (Admin, Tools)
* **Landing:** 저밀도, 설득 중심, 부드러운 물성. (Marketing, Hero)
* **Document:** 가독성 중심, 흐름 위주. (Docs, Blog)

### **2. Overlay (The Meta-Container)**

> *"이 콘텐츠는 흐름 위에 떠 있는가?"*

콘텐츠의 위치(Position)와 등장 방식(Behavior)을 제어하는 최상위 컨테이너입니다.

* **Types:** `Dialog` (Modal), `Drawer` (Panel), `Sheet` (Bottom), `Popover` (Float)

### **3. Frame & Section (The Structure)**

> *"이 콘텐츠는 덩어리인가, 구획인가?"*

화면을 건축하는 물리적 단위입니다.

* **Frame (면):** **Surface** 기반의 물리적 덩어리. 높이(Elevation)와 배경을 가집니다. (Card, Box)
* **Section (선):** **Border** 기반의 논리적 구획. 배경 없이 영역만 나눕니다. (Group, Partition)

### **4. Context (The Content)**

> *"이 텍스트의 역할은 무엇인가?"*

MDK의 모든 텍스트와 정보는 반드시 아래 5가지 공간 중 하나에 속합니다.

* **📖 Prose:** 읽기 위한 글 (Read)
* **📦 Card:** 요약된 정보 객체 (Scan)
* **⌨️ Field:** 사용자의 입력 (Input)
* **📊 Table:** 데이터 비교 (Compare)
* **👆 Menu:** 조작과 선택 (Interact)

---

## The Core Principles

### 1. Physics over Art (예술보다 물리)

우리는 색상을 칠하는 것이 아니라 **높이(Surface)**를 결정합니다.
우리는 선을 긋는 것이 아니라 **구획(Section)**을 나눕니다.
모든 시각적 표현은 `Raised`, `Sunken`, `Overlay`와 같은 물리적 상태의 결과값입니다.

### 2. Semantic Slots (의미론적 슬롯)

`<Title>`은 없습니다. `<Card.Title>`과 `<Prose.Title>`이 있을 뿐입니다.
공간(Context)이 다르면, 같은 '제목'이라도 전혀 다른 타이포그래피와 배치를 가져야 합니다. MDK는 이를 엄격히 구분합니다.

### 3. Separation of Concerns (역할의 분리)

* **Overlay**는 '위치'를 잡습니다.
* **Frame**은 '모양'을 만듭니다.
* **Context**는 '내용'을 채웁니다.
  이 역할 분리를 통해, 우리는 재사용 가능하고 견고한 UI를 조립할 수 있습니다.

---

## Getting Started

MDK는 질문을 바꾸는 것에서 시작합니다.

* ❌ *"이 폰트 좀 키워줄래?"*
* ⭕ *"이 공간을 **Application**에서 **Landing** Experience로 변경하자."*
* ❌ *"여기에 회색 박스 좀 그려줘."*
* ⭕ *"여기에 **Sunken Frame**을 배치해서 입력 구역임을 암시하자."*

이제, 픽셀을 미는 것을 멈추고 **구조를 설계**하십시오.
**Welcome to MDK.**