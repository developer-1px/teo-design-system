# IDDL에 오신 것을 환영합니다 👋

**예상 소요 시간**: 5분
**난이도**: ⭐ 입문

---

## 이 문서를 읽고 나면

- IDDL이 무엇인지 이해할 수 있습니다
- 왜 IDDL이 필요한지 알 수 있습니다
- 첫 번째 IDDL 예제를 볼 수 있습니다

---

## 문제: 의도의 손실

우리는 UI를 만들 때 이런 과정을 거칩니다:

```
[디자이너의 머릿속]
"이건 위험한 액션이야. 사용자가 신중하게 클릭해야 해."

       ↓ Figma에 전달

[Figma 파일]
🔴 빨간색 버튼 (bg: #E53E3E, padding: 12px 24px)

       ↓ 개발자에게 전달

[개발자의 코드]
<button style="background: #E53E3E; padding: 12px 24px">
  Delete
</button>
```

**문제**: 각 단계마다 **"왜"**는 사라지고 **"어떻게"**만 남습니다.

### 결과적으로 생기는 문제들

1. **일관성 부족**: 팀원마다 "위험한 액션"을 다르게 구현
2. **유지보수 어려움**: 6개월 후 "이 버튼은 왜 빨간색이지?" 아무도 모름
3. **AI 협업 불가능**: "삭제 버튼 만들어줘" → AI는 색상만 추측할 뿐
4. **확장성 제로**: 다크모드 추가하려면 모든 색상 다시 결정

---

## 해결책: 의도를 선언하기

IDDL은 **"이게 빨간 버튼이야"** 대신 **"이건 위험한 액션이야"**라고 선언합니다.

### Before: 구현 지시

```json
{
  "type": "button",
  "style": {
    "background": "#E53E3E",
    "color": "#FFFFFF",
    "padding": "12px 24px",
    "border": "none",
    "borderRadius": "6px"
  },
  "text": "Delete"
}
```

### After: 의도 선언

```json
{
  "type": "Action",
  "label": "Delete",
  "prominence": "Primary",
  "intent": "Critical",
  "behavior": {
    "action": "command",
    "command": "user.delete"
  }
}
```

---

## IDDL의 핵심 아이디어

IDDL은 4가지 질문에 답하는 것으로 UI를 정의합니다:

| 질문 | 속성 | 예시 값 |
|------|------|---------|
| **무엇**인가? | `role` | Action, Text, Field |
| 얼마나 **눈에 띄어야** 하는가? | `prominence` | Hero, Primary, Secondary |
| **무슨 맥락**(색상)인가? | `intent` | Neutral, Brand, Critical |
| 얼마나 **빽빽하게** 보여줄 것인가? | `density` | Comfortable, Standard, Compact |

이 4가지만 정의하면, 디자인 시스템이 알아서 적절하게 렌더링합니다.

---

## 실전 예제: 프로필 카드

아래는 5줄로 만드는 완전한 프로필 카드입니다:

```json
{
  "type": "Group",
  "role": "Card",
  "children": [
    {
      "type": "Text",
      "role": "Title",
      "content": "Teo",
      "prominence": "Primary"
    },
    {
      "type": "Text",
      "role": "Body",
      "content": "Senior Frontend Developer",
      "prominence": "Secondary"
    },
    {
      "type": "Text",
      "role": "Caption",
      "content": "Seoul, Korea",
      "prominence": "Tertiary",
      "intent": "Neutral"
    }
  ]
}
```

### 이 코드가 생성하는 결과

- 디자인 시스템 A: Material Design 스타일 카드
- 디자인 시스템 B: iOS 스타일 카드
- CLI 렌더러: 터미널에서 보기 좋은 텍스트
- 스크린 리더: 접근성 친화적 읽기

**동일한 IDDL, 다른 렌더링**. 이것이 핵심입니다.

---

## IDDL이 특별한 이유

### 1. LLM과 완벽 호환

```
User: "사용자 프로필 페이지 만들어줘"

GPT: [IDDL JSON 생성]
  → Page + Section + Group + Field들
  → prominence/intent 자동 추론
  → 즉시 렌더링 가능
```

### 2. 디자인 시스템 독립적

```
한 번 정의 → 여러 디자인 시스템에서 재사용
IDDL → Material UI
    → Chakra UI
    → Ant Design
    → shadcn/ui
```

### 3. 유지보수성

```
6개월 후에도 명확함:
"intent: Critical" → "아, 위험한 액션이구나"
```

### 4. 협업 친화적

디자이너, 개발자, PM이 **같은 언어**로 소통:
- 디자이너: "이 버튼은 prominence가 Hero여야 해"
- 개발자: "알았어, prominence: 'Hero' 설정할게"
- PM: "Critical intent면 confirm 메시지 필수로 해줘"

---

## 다음 단계

축하합니다! IDDL의 핵심 개념을 이해했습니다.

### 다음 학습 경로

1. **[첫 번째 UI 만들기](./01-your-first-ui.md)** ← 여기서 시작!
   - 실행 가능한 예제로 직접 만들어보기

2. **[IDDL의 핵심 아이디어](./02-core-idea.md)**
   - 4가지 속성 자세히 알아보기

3. **[4가지 핵심 속성](../01-fundamentals/)** (Level 1)
   - Prominence, Intent, Density, Role 완전 정복

---

## 자주 묻는 질문

### Q: CSS를 완전히 대체하나요?

아닙니다. IDDL은 **설계 의도를 표현**하고, 실제 CSS는 디자인 시스템이 생성합니다.

### Q: 기존 컴포넌트 라이브러리와 호환되나요?

네! IDDL은 React, Vue, Svelte 등 어떤 프레임워크든 렌더링할 수 있습니다.

### Q: 복잡한 UI도 표현 가능한가요?

네. Admin 대시보드, 데이터 테이블, 복잡한 폼 등 대부분의 CRUD UI를 커버합니다.
단, 차트나 맵 같은 고도로 인터랙티브한 시각화는 Custom 노드가 필요할 수 있습니다.

---

## 도움이 필요하신가요?

- 📖 [전체 스펙 문서](/docs/2-areas/spec/iddl-spec-1.0.1.md)
- 🎯 [실전 예제 모음](../04-patterns/)
- 📚 [API 레퍼런스](../06-reference/api-reference.md)

---

**다음**: [첫 번째 UI 만들기 →](./01-your-first-ui.md)
