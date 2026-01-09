# Tutorials (튜토리얼)

> **🎓 IDDL을 처음 배우는 사람을 위한 단계별 가이드**

---

## 📋 개념

Tutorials는 **따라하기 형식**의 학습 자료입니다:

- ✅ **학습 지향**: 처음 배우는 사람을 위해
- ✅ **단계별**: 1단계, 2단계, 3단계...
- ✅ **실습 중심**: 직접 코드 작성
- ✅ **20-30분**: 집중력 유지 가능한 시간
- ✅ **완성 가능**: 튜토리얼 끝에 무언가 완성

---

## 📚 튜토리얼 목록

### [01. Getting Started](./01-getting-started.md) (20분)
**IDDL 설치 및 기본 사용법**

**배울 내용**:
- IDDL 프로젝트 설정
- 첫 페이지 만들기
- 기본 컴포넌트 (Page, Section, Group)
- 개발 서버 실행

**사전 지식**: React 기본

---

### [02. Your First Component](./02-your-first-component.md) (30분)
**로그인 폼 만들기**

**배울 내용**:
- Field 컴포넌트 사용법
- Action 버튼 추가
- prominence와 intent
- 유효성 검사

**사전 지식**: Tutorial 01 완료

---

## 🎯 학습 순서

```
01-getting-started.md
  ↓
02-your-first-component.md
  ↓
../2-how-to/ (실전 가이드)
```

---

## 💡 튜토리얼 vs How-to

| 구분 | Tutorials | How-to |
|------|-----------|--------|
| **목적** | 배우기 | 문제 해결 |
| **대상** | 초보자 | 중급자 |
| **형식** | 단계별 따라하기 | 레시피 |
| **시간** | 20-30분 | 10-15분 |
| **예시** | "첫 컴포넌트 만들기" | "Custom Role 추가하기" |

---

## 📝 튜토리얼 추가 방법

새로운 튜토리얼을 추가하려면:

1. **번호 부여**: `03-tutorial-name.md`
2. **템플릿 사용**:
   ```markdown
   # Tutorial Title (20분)

   > 이 튜토리얼에서는 XXX를 만듭니다.

   ## 사전 지식
   - React 기본
   - Tutorial 01 완료

   ## 배울 내용
   - 주제 1
   - 주제 2

   ## Step 1: ...
   ## Step 2: ...
   ## 완성!
   ```

3. **이 README 업데이트**: 목록에 추가

---

## 🔗 관련 문서

- [How-to Guides](../2-how-to/) - 문제 해결 가이드
- [Reference](../3-reference/) - API 레퍼런스
- [Explanation](../4-explanation/) - 개념 설명
