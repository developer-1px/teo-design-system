# IDDL Core 문서

> **Intent-Driven Design Language 스펙과 사용 가이드**

---

## 📚 Diátaxis Framework 적용

이 문서는 **사용자의 목적**에 따라 4가지로 분류되어 있습니다:

```
          Learning ←---------------→ Working
            ↑                         ↑
Tutorials   |                         | How-to Guides
(배우기)    |                         | (만들기)
            |                         |
            ↓                         ↓
Explanation |                         | Reference
(이해하기)  |                         | (찾기)
            ↓                         ↓
          Understanding ←-----------→ Information
```

---

## 🎓 [1. Tutorials](./1-tutorials/) (배우기)

**목적**: IDDL을 처음 배우는 사람을 위한 단계별 가이드

- **형식**: 강의 (따라하기)
- **대상**: 초보자
- **특징**: 실습 중심, 20-30분 분량

**추천 순서**:
1. [Getting Started](./1-tutorials/01-getting-started.md) - IDDL 설치 및 기본 사용법 (20분)
2. [Your First Component](./1-tutorials/02-your-first-component.md) - 첫 IDDL 컴포넌트 만들기 (30분)

---

## 🛠️ [2. How-to Guides](./2-how-to/) (만들기)

**목적**: 특정 문제를 해결하는 실용적인 가이드

- **형식**: 레시피 (문제 해결)
- **대상**: 중급자
- **특징**: 단계별, 10-15분 분량

**가이드 목록**:
- [Add New IDDL Role](./2-how-to/add-new-iddl-role.md) - Custom Role 추가 방법
- [Customize Design Tokens](./2-how-to/customize-design-tokens.md) - 토큰 커스터마이징

---

## 📖 [3. Reference](./3-reference/) (찾기)

**목적**: IDDL API와 스펙의 완전한 목록

- **형식**: 사전 (빠른 검색)
- **대상**: 모두
- **특징**: 완전한 정보, 예제 포함

**레퍼런스 문서**:
- [Field Reference](./3-reference/field-reference.md) - Field 컴포넌트 완전 가이드 (21가지 dataType)
- [Page v2.0 Spec](./3-reference/page-v2-spec.md) - Page 컴포넌트 스펙
- [Component Role Mapping](./3-reference/component-role-mapping.md) - 일반 컴포넌트 → IDDL 매핑

---

## 💡 [4. Explanation](./4-explanation/) (이해하기)

**목적**: IDDL의 개념, 철학, 배경 이해

- **형식**: 에세이 (깊이 이해)
- **대상**: 깊이 이해하려는 사람
- **특징**: "왜?"에 대한 답

**개념 문서**:
- [Why IDDL?](./4-explanation/why-iddl.md) - IDDL이 필요한 이유
- [IDDL vs Traditional](./4-explanation/iddl-vs-traditional.md) - 전통적 방식과 비교

---

## 🚀 학습 경로

### 신규 사용자
```
1-tutorials/01-getting-started.md
  ↓
1-tutorials/02-your-first-component.md
  ↓
2-how-to/ (실전)
  ↓
3-reference/ (필요 시 검색)
```

### 기존 사용자
```
3-reference/ (빠른 검색)
  ↓
2-how-to/ (고급 기법)
```

### 기여자
```
4-explanation/ (개념 이해)
  ↓
2-how-to/add-new-iddl-role.md
  ↓
2-areas/patterns/ (패턴 참조)
```

---

## 🔗 관련 문서

- [Design System](../design-system/) - 디자인 시스템 철학
- [Patterns](../patterns/) - React 패턴 백과사전
- [Projects](../../1-projects/) - 현재 진행 중인 작업
