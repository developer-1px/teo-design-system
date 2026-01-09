# How-to Guides (가이드)

> **🛠️ 특정 문제를 해결하는 실용적인 레시피**

---

## 📋 개념

How-to Guides는 **문제 해결 중심**의 가이드입니다:

- ✅ **목표 지향**: "XXX를 어떻게 하나?"
- ✅ **레시피 형식**: 재료 → 단계 → 완성
- ✅ **실용적**: 실제 문제 해결
- ✅ **10-15분**: 빠르게 적용 가능
- ✅ **전제 조건**: 기본 지식 가정

---

## 📚 가이드 목록

### [Add New IDDL Role](./add-new-iddl-role.md) (10분)
**Custom IDDL Role 추가하는 방법**

**문제**: "기존 Role로는 표현이 안 돼"
**해결**: Custom Role 추가

**단계**:
1. `types.ts`에 role 추가
2. CVA variant 정의
3. 스타일 적용
4. 테스트

**전제 조건**: IDDL 기본 지식

---

### [Customize Design Tokens](./customize-design-tokens.md) (15분)
**디자인 토큰 커스터마이징하는 방법**

**문제**: "브랜드 색상을 바꾸고 싶어"
**해결**: 토큰 시스템 수정

**단계**:
1. `tokens.ts` 열기
2. accent 색상 변경
3. 테마 확인
4. 전체 앱에 적용

**전제 조건**: 토큰 시스템 이해

---

## 🎯 사용 시나리오

### "이미 IDDL을 알고, 특정 작업을 하고 싶어"

```
검색: "How-to + 키워드"
  ↓
해당 가이드 찾기
  ↓
단계 따라하기
  ↓
완료!
```

---

## 💡 Tutorial vs How-to

| 구분 | Tutorials | How-to Guides |
|------|-----------|---------------|
| **질문** | "어떻게 배우나?" | "어떻게 하나?" |
| **목적** | 학습 | 문제 해결 |
| **대상** | 초보자 | 경험자 |
| **설명** | 자세함 | 간결함 |
| **예시** | "IDDL 배우기" | "Role 추가하기" |

---

## 📝 가이드 추가 방법

새로운 How-to 가이드를 추가하려면:

1. **파일명**: `kebab-case.md` (번호 없음)
2. **템플릿 사용**:
   ```markdown
   # How to XXX (10분)

   **문제**: "..."
   **해결**: "..."

   ## 전제 조건
   - IDDL 기본 지식
   - XXX 이해

   ## 단계

   ### 1. ...
   ### 2. ...
   ### 3. ...

   ## 확인

   ## 문제 해결
   ```

3. **이 README 업데이트**: 목록에 추가

---

## 🔍 문제별 인덱스

### 컴포넌트
- [Add New IDDL Role](./add-new-iddl-role.md) - Custom Role 추가

### 스타일링
- [Customize Design Tokens](./customize-design-tokens.md) - 토큰 변경

### 통합
- (예정) Integrate with Existing App - 기존 앱에 IDDL 추가

### 배포
- (예정) Build for Production - 프로덕션 빌드

---

## 🔗 관련 문서

- [Tutorials](../1-tutorials/) - 처음 배우기
- [Reference](../3-reference/) - API 레퍼런스
- [Patterns](../../patterns/) - React 패턴
