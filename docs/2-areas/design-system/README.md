# Design System

> **프로젝트 철학과 디자인 원칙**

---

## 📋 개요

이 폴더는 IDE UI Kit 프로젝트의 **디자인 철학과 핵심 원칙**을 담고 있습니다.

---

## 📚 문서 목록

### [Project Philosophy](./project-philosophy.md) ⭐
**프로젝트의 "왜"를 설명하는 핵심 문서**

**주요 내용**:
1. AI 시대의 디자인 시스템 패러다임 전환
2. 접근성의 민주화
3. 규칙 기반 디자인의 힘
4. Component Role Mapping의 혁명
5. 8개 패턴 문서의 교육적 가치
6. Why-First Philosophy의 실현
7. 실제 프로젝트 구조의 완성도
8. 프로젝트의 핵심 의의 정리
9. 이 프로젝트가 해결하는 진짜 문제
10. 결론: 차세대 디자인 시스템의 참조 구현

### Design Principles (예정)
**핵심 디자인 원칙 요약**

- Use the Weakest Visual Means First
- Limit Accent Usage
- Document All Exceptions
- 7-Layer System
- 16-Token System

---

## 🎯 핵심 개념

### Why-First Design

```tsx
// ❌ How-based (어떻게)
<button className="bg-blue-500 px-4 py-2">
  Save
</button>

// ✅ Why-based (왜)
<Action role="Button" prominence="Primary" intent="Brand">
  Save
</Action>
```

### 16-Token System

| 카테고리 | 토큰 수 | 예시 |
|---------|---------|------|
| 색상 | 6개 | accent, surface-base, text-primary |
| 크기 | 4개 | sm, md, lg, xl |
| 굵기 | 2개 | 500, 600 |
| 간격 | 4개 | 8px, 16px, 24px, 32px |

### 7-Layer System

| Depth | 용도 | 배경 | 그림자 |
|-------|------|------|--------|
| 0 | App base | `#fafafa` | none |
| 1 | Sunken | `#f5f5f5` | inset |
| 2-6 | Elevated | `#ffffff` | 점점 강해짐 |

---

## 🔗 관련 문서

- [Core: Explanation](../core/4-explanation/) - IDDL 개념 설명
- [Patterns](../patterns/) - React 패턴 백과사전
- [Resources](../../3-resources/) - 외부 참고 자료
