# MDK — Minimal Design Kit

## Philosophy

프론트엔드 디자인은 수렴진화하고 있다. 버튼은 버튼답게, 입력창은 입력창답게. 그 최종 형태는 불필요한 장식이 배제된 채 오직 기능과 의도만 남는 것이다.

MDK는 복잡한 설정 없이도 웹 애플리케이션의 본질을 완벽하게 구현할 수 있는, 가장 순수하고 효율적인 디자인 도구를 지향한다.

### Principles

1. **의미 없는 디자인은 없다** — 모든 디자인에는 이유가 있어야 한다.
2. **선택을 줄인다** — 디자인을 안 할수록 좋다.
3. **맥락이 결정한다** — 텍스트는 속성이 아니라 위치로 결정된다.
4. **의도만 선언한다** — 구현은 시스템이 처리한다.

---

## Architecture

```
MDK
├─ Text System      텍스트가 어떻게 보이는가
├─ Space System     공간이 어떻게 구성되는가
│   ├─ Overlay      페이지 위 레이어
│   ├─ Section      페이지 내 영역  
│   ├─ Frame        경계가 있는 컨테이너
│   ├─ Surface      면의 성격
│   ├─ Divider      내부 구분
│   └─ Rounded      모서리 처리
└─ (Color, Spacing) TBD
```

---

## Text System

텍스트는 속성으로 정의하지 않는다. 어디에 있고, 왜 존재하는지가 텍스트를 결정한다.

### Hierarchy

| Level | Name | Question | Role |
|-------|------|----------|------|
| 1 | Experience | 어떤 경험인가? | 톤, 밀도 |
| 2 | Context | 어디에 놓였는가? | 공간적 맥락 |
| 3 | Slot | 왜 존재하는가? | 용도 |
| 4 | Variant | 어떻게 보일까? | 크기 |

### Experience

| Experience | Description |
|------------|-------------|
| `application` | 제품 사용 중심 UI — 대시보드, 설정, IDE |
| `landing` | 설득·소개 중심 — 마케팅, 랜딩 페이지 |
| `document` | 읽기 중심 — 가이드, 문서, 도움말 |

### Context

| Context | Purpose | Definition |
|---------|---------|------------|
| `Prose` | 읽기 | 연속적으로 읽히는 텍스트 흐름 |
| `Card` | 요약 | 경계 안에 묶인 정보 덩어리 |
| `Field` | 입력 | 사용자가 값을 입력하는 단위 |
| `Table` | 비교 | 행·열 기반 데이터 정렬 |
| `Menu` | 조작 | 선택·클릭 가능한 항목 공간 |

### Slots

| Context | Slots |
|---------|-------|
| Prose | `Title`, `Body`, `Note` |
| Card | `Title`, `Desc`, `Note` |
| Field | `Label`, `Value`, `Note` |
| Table | `Head`, `Cell` |
| Menu | `Label` |

### Variant

크기만 조정한다. 구조는 바꾸지 않는다.

```
s / m / l / xl
```

### Usage

```jsx
<Experience value="application">
  <Prose.Title variant="l">페이지 제목</Prose.Title>
  <Prose.Body>본문 텍스트입니다.</Prose.Body>
  
  <Card>
    <Card.Title>카드 제목</Card.Title>
    <Card.Desc>카드 설명</Card.Desc>
    <Card.Note>메타 정보</Card.Note>
  </Card>
  
  <Field>
    <Field.Label>이메일</Field.Label>
    <Field.Value>user@example.com</Field.Value>
    <Field.Note>업무용 이메일을 입력하세요</Field.Note>
  </Field>
</Experience>
```

---

## Space System

공간은 레이어로 구성된다.

### Layer Hierarchy

```
Overlay          →  페이지 흐름 밖 (fixed, absolute)
 └─ Frame
 
Section          →  페이지 흐름 안 (static, sticky)
 └─ Frame
 
Frame            →  경계가 있는 컨테이너
 └─ Surface + Rounded + Divider
```

### Overlay

페이지 위에 떠있는 레이어. `fixed` 또는 `absolute` position.

| Type | Behavior |
|------|----------|
| `modal` | 중앙, backdrop 있음 |
| `drawer` | 사이드에서 슬라이드 |
| `dropdown` | trigger 기준 위치 |
| `toast` | 코너 고정 |
| `tooltip` | hover 시 표시 |

```jsx
<Overlay type="modal">
  <Frame surface="raised" rounded>
    ...
  </Frame>
</Overlay>
```

### Section

페이지 흐름 안의 영역. `static` 또는 `sticky` position.

```jsx
<Section>
  <Frame surface="raised" rounded>
    ...
  </Frame>
</Section>

<Section sticky>
  <Frame surface="base">
    // 헤더
  </Frame>
</Section>
```

### Frame

경계가 있는 컨테이너. Surface와 Rounded를 적용하는 대상.

```jsx
<Frame surface="raised" rounded>
  ...
</Frame>
```

### Surface

면·선·그림자를 하나의 의도로 묶는다.

| Surface | Intent | Use case |
|---------|--------|----------|
| `base` | 기준면 | 페이지 배경 |
| `sunken` | 안으로 | input 내부, well |
| `raised` | 위로 | 카드, 패널 |
| `overlay` | 최상위 | 모달 내부 |
| `primary` | 강조 | 버튼, CTA |

### Rounded

모서리. 있거나 없거나.

| Value | |
|-------|---|
| `rounded` | 둥근 모서리 |
| (없음) | 각진 모서리 |

### Divider

내부를 구분한다. 의도는 같고, 표현만 다르다.

| Style | Visual |
|-------|--------|
| `space` | 빈 공간 |
| `dot` | · · · |
| `line` | ─── |

```jsx
<Frame surface="raised" rounded>
  <Card.Title>제목</Card.Title>
  <Divider style="line" />
  <Card.Desc>설명</Card.Desc>
</Frame>
```

---

## Summary

**Text is chosen by where it lives, not by what it is.**

```
Experience → Context → Slot → Variant
Overlay/Section → Frame → Surface + Rounded + Divider
```

MDK는 "무엇을 설정할까"가 아니라 "이건 무엇인가"를 묻는다.