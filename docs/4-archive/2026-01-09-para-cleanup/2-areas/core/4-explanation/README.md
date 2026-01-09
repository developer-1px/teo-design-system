# Explanation (개념 설명)

> **💡 IDDL의 개념, 철학, 배경을 깊이 이해하기**

---

## 📋 개념

Explanation은 **이해를 돕는** 문서입니다:

- ✅ **이해 지향**: "왜?"에 대한 답
- ✅ **에세이 형식**: 깊이 있는 설명
- ✅ **개념적**: 큰 그림, 철학
- ✅ **맥락 제공**: 역사적 배경, 대안 비교
- ✅ **대상**: 깊이 이해하려는 사람

---

## 📚 설명 문서

### [Why IDDL?](./why-iddl.md) ⭐
**IDDL이 필요한 이유**

**내용**:
- 기존 UI 개발의 문제점
- IDDL이 해결하는 것
- Why-First Design의 철학
- AI 시대에 IDDL이 중요한 이유

**읽을 사람**: IDDL을 처음 접한 사람, 의사결정자

---

### [IDDL vs Traditional](./iddl-vs-traditional.md)
**전통적 방식과 IDDL 비교**

**내용**:
- How-based vs Why-based
- TailwindCSS vs IDDL
- MUI/Ant Design vs IDDL
- 언제 IDDL을 사용해야 하나?

**읽을 사람**: 기술 선택을 고민하는 사람

---

## 🎯 Explanation이 답하는 질문들

### "왜 이렇게 설계됐나?"

```
질문: "왜 prominence가 4단계인가?"
답변: Why IDDL? 문서의 "규칙 기반 디자인" 섹션 참조
  → 더 많으면 혼란, 더 적으면 표현력 부족
  → 4단계가 최적의 균형
```

### "왜 이 기술을 선택했나?"

```
질문: "왜 CVA를 사용하나?"
답변: IDDL vs Traditional 문서의 "기술 선택" 섹션 참조
  → Variant 기반 스타일링이 IDDL 철학과 일치
  → TypeScript 타입 안전성
```

### "무엇이 다른가?"

```
질문: "MUI와 뭐가 다른가?"
답변: IDDL vs Traditional 문서 참조
  → MUI: 컴포넌트 라이브러리 (How)
  → IDDL: 의도 선언 언어 (Why)
```

---

## 💡 Explanation vs 다른 문서들

| 구분 | Explanation | Tutorial | How-to | Reference |
|------|-------------|----------|--------|-----------|
| **질문** | "왜?" | "어떻게 배우나?" | "어떻게 하나?" | "이게 뭐야?" |
| **목적** | 이해 | 학습 | 문제 해결 | 정보 |
| **형식** | 에세이 | 단계별 | 레시피 | 목록 |
| **깊이** | 깊음 | 중간 | 얕음 | 완전함 |
| **예시** | "Why IDDL?" | "IDDL 배우기" | "Role 추가" | "Field Props" |

---

## 📖 Explanation 읽는 법

### 1. 순서 없음

Explanation은 순서 없이 읽을 수 있습니다:

```
관심 있는 주제
  ↓
해당 문서 읽기
  ↓
다른 문서로 넘어가기 (링크 따라)
```

### 2. 깊이 이해

시간을 들여 깊이 읽으세요:

- ✅ 배경 이해
- ✅ 대안 비교
- ✅ 트레이드오프 파악

### 3. 의사결정에 활용

팀 의사결정 시 참조:

```
"우리 프로젝트에 IDDL을 도입할까?"
  ↓
Why IDDL? 문서 읽기
  ↓
IDDL vs Traditional 비교
  ↓
의사결정
```

---

## 📝 Explanation 추가 방법

새로운 Explanation을 추가하려면:

1. **파일명**: `topic-name.md` (간결하게)
2. **템플릿 사용**:
   ```markdown
   # Topic Title

   > 한 줄 요약

   ## 문제 (Problem)

   ## 배경 (Background)

   ## IDDL의 접근 (Approach)

   ## 대안 비교 (Alternatives)

   ## 트레이드오프 (Trade-offs)

   ## 결론

   ## 참고 자료
   ```

3. **이 README 업데이트**: 목록에 추가

---

## 🔗 주제별 인덱스

### 철학
- [Why IDDL?](./why-iddl.md) - IDDL이 필요한 이유

### 비교
- [IDDL vs Traditional](./iddl-vs-traditional.md) - 전통적 방식과 비교

### 개념
- (예정) Prominence System - 주목도 시스템의 철학
- (예정) Intent vs Prominence - 두 개념의 차이
- (예정) Rule-based Design - 규칙 기반 디자인

### 역사
- (예정) IDDL History - IDDL 개발 과정
- (예정) Design Decisions - 주요 디자인 결정 (ADR)

---

## 🔗 관련 문서

- [Design System: Philosophy](../../design-system/project-philosophy.md) - 프로젝트 철학
- [Tutorials](../1-tutorials/) - 처음 배우기
- [How-to](../2-how-to/) - 문제 해결
- [Reference](../3-reference/) - API 레퍼런스
