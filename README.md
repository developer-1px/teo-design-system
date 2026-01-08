# IDE UI Kit

> 디자인 원칙 기반의 일관된 IDE 인터페이스 컴포넌트 라이브러리

## 📐 Design System

이 프로젝트는 **AI와 개발자가 일관된 디자인 판단**을 내릴 수 있도록 명확한 규칙 기반 디자인 시스템을 따릅니다.

### 핵심 문서

- **[DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md)** - 모든 디자인 결정의 기준이 되는 원칙 문서
- **[src/design-system/tokens.ts](./src/design-system/tokens.ts)** - 디자인 토큰 (색상, 간격, 타이포그래피 등)

### 핵심 원칙 3가지

1. **약한 수단부터 사용**: 배경색 차이 → 선 → 그림자 → accent 색상
2. **화면당 accent는 1-2개만**: 강조가 희소해야 의미가 있음
3. **예외는 문서화 필수**: 규칙을 어길 때는 반드시 이유 명시

## 🚀 Quick Start

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 린트 실행
pnpm lint

# 빌드
pnpm build
```

## 🏗️ Tech Stack

- **React 19** + **TypeScript** - UI 프레임워크
- **Vite 5** - 빌드 도구
- **TailwindCSS 4.x** - 스타일링
- **Lucide React** - 아이콘 세트
- **CodeMirror 6** - 코드 에디터

## 📁 Project Structure

```
ide-ui-kit/
├── src/
│   ├── components/
│   │   ├── ui/              # 기본 UI 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── icon-button.tsx
│   │   │   ├── layer.tsx    # Layer 시스템 컴포넌트
│   │   │   └── ...
│   │   ├── workspace/       # 워크스페이스 관련
│   │   ├── editor/          # 에디터 관련
│   │   ├── file-tree/       # 파일 트리
│   │   └── chat/            # AI 채팅
│   ├── design-system/
│   │   └── tokens.ts        # 디자인 토큰
│   ├── lib/
│   │   └── utils.ts         # 유틸리티
│   └── utils/
│       └── file-loader.ts   # 파일 로더
├── DESIGN_PRINCIPLES.md     # 디자인 원칙 문서
└── README.md
```

## 🎨 Design System 사용법

### 1. Layer System

깊이는 **배경색 차이**가 아닌 **그림자**로 표현합니다.

```tsx
import { Layer } from '@/components/ui/layer';

// ✅ 올바른 사용
<Layer level={2} className="p-4">
  <h2>Panel</h2>
  <Layer level={1} rounded className="p-2">
    <input />
  </Layer>
</Layer>

// ❌ 잘못된 사용 - level 역전
<Layer level={1}>
  <Layer level={2} /> {/* 어두운 안에 밝은 것 */}
</Layer>
```

| Level | 용도 | 배경색 | 그림자 |
|-------|------|--------|--------|
| 0 | 앱 베이스 | `#fafafa` | none |
| 1 | 인풋, 터미널 | `#f5f5f5` | inset |
| 2 | 사이드바, 패널 | `#ffffff` | none |
| 3 | 카드, 호버 | `#ffffff` | subtle |
| 4 | 드롭다운 | `#ffffff` | medium |
| 5 | 모달 | `#ffffff` | strong |

### 2. Button Component

```tsx
import { Button } from '@/components/ui/button';

// ✅ 올바른 사용
<div className="flex gap-2 justify-end">
  <Button variant="ghost">취소</Button>
  <Button variant="accent">저장</Button> {/* 화면당 1개만 */}
</div>

// ✅ 위험한 액션
<Button variant="outline">삭제</Button>

// ❌ 잘못된 사용
<Button variant="accent">저장</Button>
<Button variant="accent">발행</Button> {/* accent 중복 금지 */}
```

**Variants:**
- `accent` - Primary action (화면당 1개만)
- `ghost` - Secondary action
- `outline` - Dangerous action

**원칙:**
- 버튼에 그림자 사용 금지
- outline variant는 border만 사용 (배경색 없음)

### 3. IconButton Component

```tsx
import { IconButton } from '@/components/ui/icon-button';
import { Files, X } from 'lucide-react';

// ✅ 올바른 사용 - title 필수
<IconButton title="Close" size="sm">
  <X size={16} />
</IconButton>

// ✅ Active 상태
<IconButton active={isActive} title="Files">
  <Files size={20} />
</IconButton>
```

**아이콘 크기:**
- `16px` - 인라인, 인풋 내부
- `20px` - 버튼, 메뉴 아이템
- `24px` - 네비게이션

### 4. Design Tokens 사용

```tsx
import { spacing, fontSize, fontWeight } from '@/design-system/tokens';

// ✅ 토큰 사용
<div style={{ padding: spacing[4], fontSize: fontSize.base }}>

// ❌ 하드코딩된 값
<div style={{ padding: '15px', fontSize: '15px' }}> {/* 금지 */}
```

**허용된 spacing 값:** 4, 8, 12, 16, 24, 32, 48, 64, 96 (px)

**허용된 font-weight:** 400, 500, 600

## 🎯 Component Checklist

새 컴포넌트를 만들기 전에 확인하세요:

### 시각적 판단
- [ ] 영역 구분이 필요한가? → Layer level 차이로 먼저 시도
- [ ] 선이 필요한가? → [허용 케이스](./DESIGN_PRINCIPLES.md#32-선을-허용하는-경우-한정-목록) 확인
- [ ] 그림자가 필요한가? → 물리적 높이가 의미 있는가?
- [ ] Accent 색상을 쓰는가? → 화면에 이미 1개 있는지 확인

### 수치 검증
- [ ] 간격 값이 허용 목록에 있는가? (4,8,12,16,24,32,48,64,96)
- [ ] font-weight가 400/500/600인가?
- [ ] 아이콘 크기가 16/20/24px인가?

### 접근성
- [ ] 클릭 가능한가? → `tabIndex`, `onKeyDown`, `role` 확인
- [ ] 포커스 스타일이 있는가?
- [ ] 아이콘만 있으면 `aria-label`이 있는가?

## 🚫 Common Mistakes

### ❌ 잘못된 예제

```tsx
// border + background 동시 사용
<div className="bg-white border border-gray">

// 버튼에 그림자
<Button className="shadow-lg">Click</Button>

// accent 중복
<Button variant="accent">저장</Button>
<Button variant="accent">발행</Button>

// 비표준 간격
<div className="p-[15px]"> {/* 허용값: 4,8,12,16,24,32,48,64,96 */}

// 키보드 접근성 없음
<div onClick={handleClick} className="cursor-pointer">
  클릭하세요
</div>

// outline 제거 without 대체
<button className="outline-none">
  Click
</button>
```

### ✅ 올바른 예제

```tsx
// Layer로 구분
<Layer level={2} className="p-4 rounded-lg">
  <h3>Title</h3>
</Layer>

// Primary + Secondary 버튼
<div className="flex gap-2 justify-end">
  <Button variant="ghost">취소</Button>
  <Button variant="accent">저장</Button>
</div>

// 표준 간격
<div className="p-4 gap-2">

// 키보드 접근성
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  className="focus-visible:ring-2 focus-visible:ring-accent"
>
  클릭하세요
</button>
```

## 📚 추가 문서

- **[DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md)** - 전체 디자인 원칙
  - Part 1: 핵심 철학
  - Part 2: 선 vs 면 판단
  - Part 3: 그림자 판단
  - Part 4: 색상 판단
  - Part 5: 키보드 접근성
  - Part 6-11: 상세 규칙
  - Part 12: 예제 모음

## 🤝 Contributing

새로운 컴포넌트나 기능을 추가할 때:

1. [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md) 숙지
2. Part 11 체크리스트 완료
3. 예외사항이 있다면 코드에 주석으로 명시:
   ```tsx
   // EXCEPTION: 여기서는 X 대신 Y를 사용
   // 이유: [구체적 이유]
   // 참고: DESIGN_PRINCIPLES.md Part X.X
   ```

## 📄 License

MIT
