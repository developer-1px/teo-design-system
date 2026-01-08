# IDE UI Kit Design Principles

> **목적**: AI와 개발자가 일관된 디자인 판단을 내릴 수 있는 실행 가능한 규칙

> 💡 **새로운 접근법**: [PURPOSE_BASED_DESIGN.md](PURPOSE_BASED_DESIGN.md)에서 Why 기반 디자인 시스템을 확인하세요.

---

## 0. Purpose-Based Design (Why 기반)

### 철학

**기존 방식**: "이 버튼은 파란색이고, 16px이고, bold다" (How)
**새로운 방식**: "이건 사용자가 행동을 취하는 영역이고, 가장 중요하다" (Why)

### 개발자가 하는 일

1. **그룹화**: 이 영역의 역할은? → `purpose` (navigation, action, form, content, list, media, status, info)
2. **주목도**: 얼마나 중요한가? → `prominence` (1: Primary, 2: Secondary, 3: Tertiary)

### 시스템이 하는 일

- 적절한 UI 패턴 제안
- 토큰 자동 적용 (색상, 크기, 간격)
- 시멘틱 HTML 생성
- 키보드 접근성 설정

### 예시

```tsx
// ❌ How 기반 (기존)
<button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold">
  시작하기
</button>

// ✅ Why 기반 (새로운)
<Group purpose="action" prominence={1}>
  <Item>시작하기</Item>
</Group>
```

**결과**: 시스템이 purpose="action" + prominence={1}을 보고 자동으로:
- Primary Button 스타일 적용
- `<button>` 태그 생성
- focus 상태 설정
- Enter/Space 키보드 동작 설정

---

## 1. 핵심 철학

### 1.1 시각적 계층의 최소화
**"구분은 최소한의 수단으로, 강조는 희소하게"**

```
약함 ←――――――――――――――――――→ 강함
배경색 차이 < 선 < 그림자 < accent 색상
```

**원칙**: 목적을 달성하는 가장 약한 수단을 선택한다.

### 1.2 인지 부하 최소화
- 화면의 대부분은 조용해야 한다
- Accent 색상은 화면당 1-2개소만
- 모든 요소에 그림자가 있으면 어떤 것도 떠있지 않다

### 1.3 일관된 상태 표현
**"같은 의미에는 같은 표현, 예외 없이"**

---

## 2. Layer System (깊이 체계)

### 2.1 Layer 정의

| Level | 용도 | 배경색 | 그림자 | Z-Index |
|-------|------|--------|--------|---------|
| **0** | 앱 베이스 | `#fafafa` | none | 0 |
| **1** | 인풋, 터미널 | `#f5f5f5` | inset subtle | 10 |
| **2** | 사이드바, 패널 | `#ffffff` | none | 20 |
| **3** | 카드, 호버 상태 | `#ffffff` | subtle lift | 30 |
| **4** | 드롭다운, 툴팁 | `#ffffff` | medium | 40 |
| **5** | 모달, 다이얼로그 | `#ffffff` | strong | 50 |

### 2.2 Layer 사용 규칙

```tsx
// ✅ 올바른 사용
<Layer level={2} className="p-4">
  <Layer level={1} rounded className="p-2">
    <input />
  </Layer>
</Layer>

// ❌ 잘못된 사용 - level 역전
<Layer level={1}>
  <Layer level={2} /> {/* 어두운 안에 밝은 것 */}
</Layer>

// ❌ 잘못된 사용 - 과도한 중첩
<Layer level={2}>
  <Layer level={3}>
    <Layer level={4}>
      <Layer level={5} /> {/* 4단계 이상 중첩 금지 */}
    </Layer>
  </Layer>
</Layer>
```

### 2.3 금지사항
```
NEVER: 같은 레벨 내에서 다른 배경색 사용
NEVER: 4단계 이상 Layer 중첩
NEVER: Layer level 역전 (어두운 안에 밝은)
```

---

## 3. 선(Border) vs 면(Surface)

### 3.1 기본 원칙
**"면이 기본, 선은 예외"**

### 3.2 선을 허용하는 경우 (한정 목록)

| 상황 | 예시 | 스타일 |
|------|------|--------|
| 인풋 필드 focus | `<input />` | `border: 2px solid accent` |
| 위험한 액션 | 삭제 버튼 | `border: 1px, no fill` |
| 의미적 구분 | 섹션 분리선 | `border-bottom: 1px` |

### 3.3 선을 금지하는 경우

| 상황 | 대신 사용할 것 |
|------|----------------|
| 카드 컨테이너 | Layer level 차이 |
| 버튼 (일반) | 배경색 채우기 |
| 영역 구분 | 배경색 차이 |
| 리스트 아이템 | gap 또는 배경색 교차 |

### 3.4 절대 금지

```tsx
// ❌ border + background 동시 사용 (focus/error 제외)
<button className="bg-white border border-gray" />

// ❌ 중첩 컨테이너에 각각 border
<div className="border">
  <div className="border" /> {/* 금지 */}
</div>
```

---

## 4. 그림자(Shadow)

### 4.1 그림자의 의미
**그림자 = 물리적 높이 = 중요도/임시성**

### 4.2 Shadow Tokens

```css
--shadow-0: none;
--shadow-1: inset 0 1px 2px rgba(0,0,0,0.04);
--shadow-2: 0 2px 8px -2px rgba(0, 0, 0, 0.05);
--shadow-3: 0 4px 16px -4px rgba(0, 0, 0, 0.08);
--shadow-4: 0 8px 32px -8px rgba(0, 0, 0, 0.15);
```

### 4.3 사용 규칙

| 요소 | Shadow Level |
|------|--------------|
| 정적 카드 | 0-2 |
| 호버된 카드 | +1 (기존 레벨에서) |
| 드롭다운 | 3 |
| 모달 | 4 |

### 4.4 금지사항

```
NEVER: 버튼, 뱃지, 태그 등 인라인 요소에 그림자
NEVER: text-shadow
NEVER: border + shadow 동시 사용
```

---

## 5. 색상(Color)

### 5.1 색상 역할

| 역할 | 용도 | 제한 |
|------|------|------|
| **Neutral** | 배경, 텍스트, 보더 | 무제한 |
| **Accent** | CTA, 선택 상태, 포커스 | 화면당 1-2개 |
| **Semantic** | 성공/경고/에러/정보 | 해당 의미일 때만 |

### 5.2 Color Tokens

```typescript
// Accent (단일 green)
accent: {
  DEFAULT: '#10b981',
  hover: '#059669',
  active: '#047857',
  subtle: '#d1fae5',
}

// Text
text: {
  primary: '#171717',
  secondary: '#525252',
  tertiary: '#a3a3a3',
  inverse: '#ffffff',
}

// Semantic
semantic: {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
}
```

### 5.3 Accent 사용 규칙

**허용:**
- Primary CTA 버튼 (화면당 1개)
- 현재 선택된 상태
- 포커스 링
- 활성화된 탭/필터

**금지:**
```tsx
// ❌ 여러 accent 버튼
<div>
  <Button variant="accent">저장</Button>
  <Button variant="accent">발행</Button> {/* 금지 */}
</div>

// ❌ 장식용 accent
<h1 className="text-accent">Title</h1> {/* 금지 */}
```

---

## 6. 컴포넌트 디자인 규칙

### 6.1 Button

```tsx
// ✅ 올바른 variant 선택
<Button variant="accent">저장</Button>    // Primary action
<Button variant="ghost">취소</Button>      // Secondary action
<Button variant="outline">삭제</Button>    // Dangerous action

// ❌ 잘못된 사용
<Button variant="accent" className="shadow-lg" /> {/* 버튼에 그림자 금지 */}
<Button variant="outline" className="bg-white" /> {/* border + bg 금지 */}
```

**Button 규칙:**
```
MUST: variant는 primary/ghost/outline 중 하나
MUST: 화면당 accent variant는 1개만
NEVER: 버튼에 그림자 추가
NEVER: outline variant에 배경색 추가
```

### 6.2 IconButton

```tsx
// ✅ 아이콘만 허용되는 경우
<IconButton title="Close">
  <X size={16} />
</IconButton>

// ✅ Active 상태 표시
<IconButton active={isActive}>
  <Files size={20} />
</IconButton>
```

**IconButton 규칙:**
```
MUST: title 또는 aria-label 필수
MUST: 아이콘 크기는 16/20/24px만
NEVER: 텍스트와 함께 사용 (Button 사용)
```

### 6.3 Layer

```tsx
// ✅ 올바른 Layer 사용
<Layer level={2} className="p-4">
  <h2>Sidebar</h2>
  <Layer level={1} rounded className="p-2">
    <input />
  </Layer>
</Layer>
```

**Layer 규칙:**
```
MUST: level은 0-5 중 하나
MUST: 자식 Layer는 부모보다 낮은 level
SHOULD: 3단계 이상 중첩 지양
```

---

## 7. 아이콘(Icon)

### 7.1 아이콘 사용 조건

**아이콘만 허용 (텍스트 없이):**
- 닫기 버튼 (✕)
- 더보기 메뉴 (⋯)
- 화살표 네비게이션
- 검색 아이콘 (인풋 내부)

**위 목록 외에는 반드시 텍스트와 함께 사용**

### 7.2 아이콘 스타일

```tsx
// ✅ 표준 크기와 색상
<Files size={16} />  // 인라인, 인풋 내부
<Files size={20} />  // 버튼, 메뉴
<Files size={24} />  // 네비게이션

// ✅ 기본 색상
<Files className="text-text-secondary" />

// ❌ 잘못된 사용
<Files size={18} />  {/* 비표준 크기 */}
<Files className="text-accent" />  {/* accent 색상 남용 */}
```

**아이콘 규칙:**
```
MUST: Lucide 아이콘 세트만 사용
MUST: 크기는 16/20/24px만
MUST: 색상은 text-secondary/tertiary 기본
NEVER: 아이콘마다 다른 색상
NEVER: 아이콘에 그림자나 효과
```

---

## 8. 간격(Spacing)

### 8.1 허용된 값

```
4, 8, 12, 16, 24, 32, 48, 64, 96 (px)
```

### 8.2 용도별 간격

| 값 | Tailwind | 용도 |
|----|----------|------|
| 4px | `gap-1` | 아이콘-텍스트, 인라인 |
| 8px | `gap-2` | 관련 요소 그룹 |
| 12px | `gap-3` | 폼 요소 |
| 16px | `gap-4` | 카드 내부 패딩 |
| 24px | `gap-6` | 섹션 내 간격 |
| 32px | `gap-8` | 섹션 간 간격 |

---

## 9. 타이포그래피

### 9.1 Font Weight

```
허용: 400 (regular), 500 (medium), 600 (semibold)
금지: 300 이하, 700 이상
```

### 9.2 Font Size

```typescript
12px → text-xs    // 라벨, 캡션
13px → text-[13px] // 코드
14px → text-sm    // 본문
16px → text-base  // 강조 본문, 소제목
20px → text-xl    // 제목
24px → text-2xl   // 페이지 제목
```

### 9.3 제한

```
NEVER: 한 화면에 4가지 이상 font-size
NEVER: 같은 위계에서 다른 weight
NEVER: 장식용 폰트
```

---

## 10. 키보드 접근성

### 10.1 필수 조건

| 요소 | 필수 속성 |
|------|-----------|
| 클릭 가능한 div | `tabIndex={0}` + `onKeyDown` + `role` |
| 버튼 | `<button>` 권장 |
| 모달 | Escape로 닫기 |

### 10.2 포커스 스타일

```tsx
// ✅ 올바른 포커스 스타일
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
  Click me
</button>

// ❌ 잘못된 사용
<button className="outline-none"> {/* 대체 스타일 없음 */}
  Click me
</button>
```

**포커스 규칙:**
```
MUST: 포커스된 요소는 시각적으로 구분 가능
MUST: outline 제거 시 대체 스타일 필수
SHOULD: 포커스 링은 accent 색상, 2px 이상
```

---

## 11. 컴포넌트 체크리스트

### A. 새 컴포넌트를 만들기 전에

**시각적 판단:**
- [ ] 영역 구분이 필요한가? → Layer level 차이로 먼저 시도
- [ ] 선이 필요한가? → Part 3.2 허용 케이스 확인
- [ ] 그림자가 필요한가? → 물리적 높이가 의미 있는가?
- [ ] Accent 색상을 쓰는가? → 화면에 이미 1개 있는지 확인

**수치 검증:**
- [ ] 간격 값이 허용 목록에 있는가? (4,8,12,16,24,32,48,64,96)
- [ ] font-weight가 400/500/600인가?
- [ ] font-size가 허용 목록에 있는가?

**접근성:**
- [ ] 클릭 가능한가? → `tabIndex`, `onKeyDown`, `role` 확인
- [ ] 포커스 스타일이 있는가?
- [ ] 아이콘만 있으면 `aria-label`이 있는가?

### B. 아이콘 추가 전에

- [ ] 아이콘만 사용 가능한 케이스인가? → Part 7.1 확인
- [ ] 크기가 16/20/24px인가?
- [ ] 색상이 text-secondary/tertiary인가?
- [ ] 같은 화면의 다른 아이콘과 스타일이 통일되는가?

### C. 최종 검토

- [ ] 이 화면에 accent가 2개 이하인가?
- [ ] 이 화면에 font-size가 3종 이하인가?
- [ ] Layer 중첩이 3단계 이하인가?
- [ ] border + background 동시 사용이 없는가?
- [ ] shadow + border 동시 사용이 없는가?
- [ ] 버튼/인라인 요소에 그림자가 없는가?

---

## 12. 예제

### ✅ 좋은 예제

```tsx
// 카드 - 면으로 구분
<Layer level={2} className="p-4 rounded-lg">
  <h3 className="text-base font-semibold">제목</h3>
  <p className="text-sm mt-2">내용</p>
</Layer>

// 선택된 아이템 - accent 배경
<button
  className={cn(
    "px-3 py-2 rounded-md",
    selected ? "bg-accent-subtle text-accent" : "hover:bg-layer-1"
  )}
>
  {item.name}
</button>

// 인풋 - idle은 면, focus는 선
<input
  className="bg-layer-1 border-2 border-transparent focus:border-accent rounded-md px-3 py-2"
/>

// Primary + Secondary 버튼
<div className="flex gap-2 justify-end">
  <Button variant="ghost">취소</Button>
  <Button variant="accent">저장</Button>
</div>
```

### ❌ 나쁜 예제

```tsx
// ❌ border + background
<div className="bg-white border border-gray-200 shadow-sm">

// ❌ 여러 accent 버튼
<div>
  <Button variant="accent">저장</Button>
  <Button variant="accent">발행</Button>
  <Button variant="accent">공유</Button>
</div>

// ❌ 버튼에 그림자
<Button className="shadow-lg">Click</Button>

// ❌ 키보드 접근성 없음
<div onClick={handleClick} className="cursor-pointer">
  클릭하세요
</div>

// ❌ outline 제거 without 대체
<button className="outline-none">
  Click
</button>
```

---

## 13. 위반 시 린트 메시지

### ERROR (빌드 실패)

```
❌ border와 background-color가 동시에 있습니다. 하나만 선택하세요.
❌ onClick이 있지만 onKeyDown이 없습니다.
❌ outline: none이지만 대체 포커스 스타일이 없습니다.
❌ margin/padding 값이 허용되지 않습니다. 허용값: 4,8,12,16,24,32,48,64,96
❌ font-weight는 400, 500, 600만 허용됩니다.
❌ shadow와 border가 동시에 사용되었습니다.
```

### WARNING (검토 필요)

```
⚠️ 이 화면에 accent 색상이 3군데 사용되었습니다. 2개 이하를 권장합니다.
⚠️ 인라인 요소에 shadow가 적용되었습니다.
⚠️ Layer가 4단계 이상 중첩되었습니다.
⚠️ 이 화면에 font-size가 4가지 사용되었습니다. 3가지 이하를 권장합니다.
```

---

## 14. Quick Reference

### 판단 플로우

```
영역 구분이 필요할 때:
└─ 의미적으로 완전히 다른 섹션?
   ├─ Yes → 분리선 (border-bottom)
   └─ No → Layer level 차이

요소를 강조해야 할 때:
└─ 화면에서 가장 중요한 액션?
   ├─ Yes → accent (단, 화면당 1개)
   └─ No → font-weight 또는 Layer 변화

인터랙티브 요소를 만들 때:
1. 네이티브 요소 가능? → button, a, input 사용
2. 불가능하면: tabIndex + role + onKeyDown + 포커스 스타일
```

### 기억할 3가지

1. **면 > 선 > 그림자 > accent** (약한 수단부터)
2. **화면당 accent는 1-2개만**
3. **예외가 필요하면 문서화 필수**

---

## 15. 팀 규칙

### 예외 처리

```tsx
// EXCEPTION: 여기서는 X 대신 Y를 사용
// 이유: [구체적 이유]
// 참고: DESIGN_PRINCIPLES.md Part X.X
```

### 리뷰 체크리스트

- [ ] Part 11의 체크리스트 완료
- [ ] 예외사항 문서화
- [ ] 린트 경고 해결 또는 정당화
