# 프로젝트 폴더 구조 분석 및 개선 제안

## 핵심 문제 3가지

### 1. IDDL 컴포넌트 폴더명이 부적절

**현재:** `src/components/types/`
**문제:** TypeScript 타입 정의와 혼동됨

**폴더명 후보:**

| 후보 | 장점 | 단점 |
|------|------|------|
| `iddl` | 명확함, 간결함 | 소문자로 기술 용어 |
| `intent` | IDDL의 핵심 개념 반영 | 너무 추상적 |
| `ui` | 직관적, 보편적 | 너무 일반적 |
| `elements` | 의미 명확 | 길다 |
| `kit` | 간결함 | 의미 불명확 |

**권장:** `iddl` (프로젝트명과 일치, 명확함)

---

### 2. Context 위치 분산

**현재:**
- `components/context/` - IDDL Context
- `shared/contexts/` - App Context

**문제:** FSD 원칙 위반 (모든 Context는 `shared/contexts/`에 위치)

**해결:** 모두 `shared/contexts/`로 통합

---

### 3. Barrel Export 존재

**현재:** `components/headless/` 내부에 `index.ts` 파일 존재

**문제:** 프로젝트 원칙 "No barrel exports" 위반

**해결:** 모든 `index.ts` 제거 (keyboard 제외)

---

## 최종 구조 (개선안)

```
src/
├── apps/                          # 변경 없음
│   └── IDE/, JSON/, PPT/, ...
│
├── components/
│   ├── iddl/                      # ✅ types → iddl
│   │   ├── Page.tsx
│   │   ├── Section/
│   │   ├── Group/
│   │   ├── Overlay/
│   │   ├── Primitives/            # ✅ Item → Primitives
│   │   │   ├── Action/
│   │   │   ├── Field/
│   │   │   └── Text/
│   │   └── types.ts
│   │
│   └── headless/
│       ├── components/
│       │   ├── useMenu.ts
│       │   └── ...                # ✅ index.ts 제거
│       ├── primitives/
│       │   ├── useDisclosure.ts
│       │   └── ...                # ✅ index.ts 제거
│       └── utils/
│           └── ...                # ✅ index.ts 제거
│
└── shared/
    ├── lib/
    ├── config/
    └── contexts/                  # ✅ Context 통합
        ├── app-context.tsx
        ├── iddl-context.tsx       # ✅ 이동
        └── prominence-context.tsx # ✅ 이동
```

---

## 작업 가이드

### Step 1: 폴더명 변경

```bash
# types → iddl
git mv src/components/types src/components/iddl

# Item → Primitives
git mv src/components/iddl/Item src/components/iddl/Primitives
```

### Step 2: Context 통합

```bash
git mv src/components/context/IDDLContext.tsx src/shared/contexts/iddl-context.tsx
git mv src/components/context/ProminenceContext.tsx src/shared/contexts/prominence-context.tsx
rmdir src/components/context
```

### Step 3: Barrel Export 제거

```bash
rm src/components/headless/index.ts
rm src/components/headless/components/index.ts
rm src/components/headless/primitives/index.ts
rm src/components/headless/utils/index.ts
```

### Step 4: Import 경로 일괄 수정

**자동화 스크립트 사용 권장:**

```bash
# 1. types → iddl
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|@/components/types|@/components/iddl|g' {} +

# 2. Item → Primitives
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|/iddl/Item/|/iddl/Primitives/|g' {} +

# 3. Context 경로 수정
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|@/components/context/IDDLContext|@/shared/contexts/iddl-context|g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|@/components/context/ProminenceContext|@/shared/contexts/prominence-context|g' {} +
```

---

## 예상 영향

- **수정 파일 수:** 약 150개
- **작업 시간:** 1-2시간
- **리스크:** 낮음 (자동화 가능)
- **효과:** 높음 (명확성 + FSD 준수)

---

## 폴더명 최종 결정

### IDDL 컴포넌트 폴더명 비교

추가 후보들:

| 후보 | 장점 | 단점 | 평가 |
|------|------|------|------|
| `iddl` | 명확함, 간결함 | 기술 용어 | ⭐⭐⭐⭐ |
| `intent` | IDDL 핵심 개념 | 추상적 | ⭐⭐ |
| `ui` | 직관적, 보편적 | 너무 일반적 | ⭐⭐ |
| `elements` | 의미 명확 | 길다 | ⭐⭐⭐ |
| `declarative` | 선언적 특성 강조 | 너무 길다 | ⭐⭐ |
| `semantic` | 의미론적 접근 | 모호함 | ⭐⭐ |
| `intent-ui` | 명확한 조합 | 너무 길다 | ⭐⭐⭐ |

**최종 권장:** `iddl`
- 프로젝트 고유 개념
- 간결하고 명확함
- 문서와 일관성

---

## 요약

### 변경 사항 3가지

1. `types` → `iddl`
2. `Item` → `Primitives`
3. Context 통합 + Barrel export 제거

### 실행 명령어

```bash
# 1단계: 폴더 이동
git mv src/components/types src/components/iddl
git mv src/components/iddl/Item src/components/iddl/Primitives
git mv src/components/context/IDDLContext.tsx src/shared/contexts/iddl-context.tsx
git mv src/components/context/ProminenceContext.tsx src/shared/contexts/prominence-context.tsx

# 2단계: 정리
rmdir src/components/context
rm src/components/headless/index.ts
rm src/components/headless/components/index.ts
rm src/components/headless/primitives/index.ts
rm src/components/headless/utils/index.ts

# 3단계: Import 자동 수정
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|@/components/types|@/components/iddl|g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|/iddl/Item/|/iddl/Primitives/|g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|@/components/context/IDDLContext|@/shared/contexts/iddl-context|g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|@/components/context/ProminenceContext|@/shared/contexts/prominence-context|g' {} +
```

**예상 소요시간:** 1-2시간
**예상 수정 파일:** 약 150개
**자동화 가능:** ✅
