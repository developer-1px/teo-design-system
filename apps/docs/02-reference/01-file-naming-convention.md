# File Naming Convention

> **원칙: 같은 것을 다른 이름으로 만들지 않는다**

## 핵심 규칙

### 1. 파일명 = 핵심 export의 이름 (PascalCase)

### 2. Lucide 아이콘 import 시 명확한 네이밍

```
✅ 올바른 예:
Button.tsx → export const Button
IconButton.tsx → export const IconButton
Layer.tsx → export const Layer
WorkspaceNav.tsx → export const WorkspaceNav
FileTree.tsx → export const FileTree

❌ 잘못된 예:
button.tsx → export const Button  (파일명과 export명 불일치)
icon-button.tsx → export const IconButton  (케밥 케이스 사용)
workspace-nav.tsx → export const WorkspaceNav  (케밥 케이스 사용)
```

## 구조

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx           # export const Button
│   │   ├── IconButton.tsx       # export const IconButton
│   │   ├── Layer.tsx            # export const Layer
│   │   └── ...
│   ├── editor/
│   │   ├── CodeEditor.tsx       # export const CodeEditor
│   │   ├── EditorTabs.tsx       # export const EditorTabs
│   │   └── ...
│   └── ...
├── utils/
│   └── file-loader.ts           # export function buildFileTree
└── lib/
    └── utils.ts                 # export function cn
```

## Import 예시

### 컴포넌트 Import

```tsx
// ✅ 올바른 import
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Layer } from '@/components/ui/Layer';
import { WorkspaceNav } from '@/components/workspace/WorkspaceNav';
import { FileTree } from '@/components/file-tree/FileTree';

// ❌ 잘못된 import
import { Button } from '@/components/ui/button';  // 소문자
import { IconButton } from '@/components/ui/icon-button';  // 케밥 케이스
```

### Lucide 아이콘 Import

**원칙: Icon임을 명확히 하기 위해 `XXXIcon` 또는 `LucideXXX` 패턴 사용**

```tsx
// ✅ 방법 1: XXXIcon 패턴 (권장)
import { X as XIcon, ChevronDown as ChevronDownIcon } from 'lucide-react';

// ✅ 방법 2: LucideXXX 패턴
import { X as LucideX, ChevronDown as LucideChevronDown } from 'lucide-react';

// ✅ 사용 예시
<IconButton>
  <XIcon size={16} />
</IconButton>

// ❌ 잘못된 사용 - Icon임이 불분명
import { X, ChevronDown, Terminal } from 'lucide-react';

// ❌ 컴포넌트 이름과 충돌 가능성
import { Button } from 'lucide-react';  // 우리의 Button 컴포넌트와 충돌
import { Terminal } from 'lucide-react';  // Terminal 컴포넌트가 있다면 충돌
```

### 일관성 유지

```tsx
// ✅ 한 파일 내에서 일관된 패턴 사용
import {
  Files as FilesIcon,
  Search as SearchIcon,
  GitBranch as GitBranchIcon,
  Settings as SettingsIcon,
} from 'lucide-react';

// ❌ 패턴 혼용 금지
import {
  Files as FilesIcon,  // XXXIcon 패턴
  Search as LucideSearch,  // LucideXXX 패턴 (혼용)
  GitBranch,  // 원본 그대로 (혼용)
} from 'lucide-react';
```

## 예외

### 1. index 파일
```
components/ui/index.ts  # 배럴 export용 (선택적)
```

### 2. 유틸리티 파일
```
utils/file-loader.ts  # 함수 모음, PascalCase 아님
lib/utils.ts  # 함수 모음
```

### 3. 설정 파일
```
vite.config.ts
tailwind.config.js
tsconfig.json
```

## 마이그레이션 체크리스트

새 파일을 만들 때:
- [ ] 파일명이 PascalCase인가?
- [ ] 파일명이 주요 export와 정확히 일치하는가?
- [ ] Import 경로가 PascalCase를 사용하는가?

기존 파일을 수정할 때:
- [ ] 파일명 변경 시 모든 import 업데이트
- [ ] Git에서 대소문자 변경 반영 확인

## 이유

### 1. 인지 부하 감소
파일명과 export명이 다르면 개발자가 두 가지를 기억해야 함

### 2. 검색 용이성
파일명으로 검색 = export명으로 검색

### 3. IDE 자동완성
import 시 파일명을 타이핑하면 자동으로 매칭

### 4. 일관성
모든 컴포넌트가 같은 패턴을 따름

## Git 주의사항

macOS/Windows는 기본적으로 대소문자를 구분하지 않으므로:

```bash
# ❌ 직접 mv로는 Git이 인식 못함
mv button.tsx Button.tsx

# ✅ Git rename 사용
git mv button.tsx Button.tsx

# 또는 임시 이름 사용
mv button.tsx temp.tsx
mv temp.tsx Button.tsx
git add .
```

## 요약

**1줄 규칙: 파일명 = export명 (PascalCase)**

이 규칙을 따르면:
- ✅ 일관성 보장
- ✅ 검색 용이
- ✅ 인지 부하 감소
- ✅ 팀 협업 개선
