# TypeScript 리팩토링 CLI 도구 비교

**Date**: 2026-01-19
**Tags**: `#typescript` `#refactoring` `#cli-tools` `#automation`
**Status**: Research & Recommendation

---

## 목차

1. [문제 인식](#문제-인식)
2. [주요 도구 비교](#주요-도구-비교)
3. [도구별 상세 분석](#도구별-상세-분석)
4. [Hooks 리팩토링 적용 방안](#hooks-리팩토링-적용-방안)
5. [권장 사항](#권장-사항)
6. [참고 자료](#참고-자료)

---

## 문제 인식

### 수동 리팩토링의 위험성

**시나리오**: 17개의 hooks를 7개 카테고리 폴더로 이동

```bash
# ❌ 위험한 방법
mv useAccordion.ts components/
mv useDropdown.ts components/
mv useModal.ts components/
...

# 모든 import 경로를 수동으로 수정해야 함
# Before: import { useAccordion } from "./useAccordion"
# After:  import { useAccordion } from "./components/useAccordion"
```

**문제점**:
1. 🐛 **누락 가능성**: 100개 이상의 import 문을 일일이 찾아 수정
2. 🔥 **타이핑 실수**: 경로 오타로 인한 런타임 에러
3. ⏰ **시간 소모**: 수작업으로 수 시간 소요
4. 🧪 **테스트 부재**: 수정 후 모든 파일을 다시 검증해야 함
5. 📦 **Re-export 깨짐**: index.ts의 export 경로도 모두 수정 필요

---

## 주요 도구 비교

| 도구 | 타입 | 자동 Import 업데이트 | 파일 이동 | 학습 곡선 | 사용 사례 |
|------|------|---------------------|----------|-----------|-----------|
| **ts-morph** | Library | ✅ 자동 | ✅ `moveImmediately()` | 중간 | 파일 이동 + AST 변환 |
| **tsmod** | CLI + Library | ✅ 자동 (ts-morph 기반) | ✅ | 중간 | Codemod 스크립트 실행 |
| **refactor-imports** | CLI | ✅ Import만 | ❌ | 낮음 | Import 경로 변경 전용 |
| **jscodeshift** | CLI | ⚠️ 수동 구현 필요 | ❌ | 높음 | 복잡한 코드 변환 |
| **VS Code** | IDE | ✅ 자동 | ✅ (GUI) | 매우 낮음 | 소규모 수동 작업 |

---

## 도구별 상세 분석

### 1. ts-morph ⭐ (가장 추천)

**개요**: TypeScript Compiler API를 쉽게 사용할 수 있게 래핑한 라이브러리

**장점**:
- ✅ **완전 자동화**: 파일 이동 시 모든 import/export 자동 업데이트
- ✅ **타입 안정성**: TypeScript AST 기반, 컴파일러 수준의 정확성
- ✅ **배치 작업**: 여러 파일을 한 번에 이동 가능
- ✅ **취소 가능**: 메모리에서 먼저 변경 후 `save()` 호출 전까지 롤백 가능
- ✅ **풍부한 API**: AST 조작, 리팩토링, 분석 등 다양한 기능

**단점**:
- ⚠️ Node.js 스크립트 작성 필요 (CLI가 아님)
- ⚠️ 학습 곡선 존재 (API 이해 필요)

**설치**:
```bash
npm install ts-morph --save-dev
```

**기본 사용법**:
```typescript
import { Project } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
});

// 파일 가져오기
const sourceFile = project.getSourceFileOrThrow("./src/hooks/useAccordion.ts");

// 파일 이동 (import 자동 업데이트)
await sourceFile.moveImmediately("./src/hooks/components/useAccordion.ts");

// 또는 여러 파일 이동 후 한 번에 저장
const files = [
  "useAccordion.ts",
  "useDropdown.ts",
  "useModal.ts"
];

files.forEach(fileName => {
  const file = project.getSourceFile(`./src/hooks/${fileName}`);
  file?.move(`./src/hooks/components/${fileName}`);
});

await project.save(); // 한 번에 저장
```

**고급 기능**:
```typescript
// Import 문 찾기
const imports = sourceFile.getImportDeclarations();

// Export 문 수정
const exports = sourceFile.getExportDeclarations();

// AST 노드 탐색
const classDeclarations = sourceFile.getClasses();
const functionDeclarations = sourceFile.getFunctions();
```

**Hooks 리팩토링 적용**:
```typescript
// migrate-hooks.ts
import { Project } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
});

const moveMap = {
  components: [
    "useAccordion.ts",
    "useDropdown.ts",
    "useModal.ts",
    "useTabs.ts",
    "useTooltip.ts"
  ],
  data: [
    "useHeadlessTable.ts",
    "useGridSelection.ts",
    "useVirtualScroll.ts"
  ],
  interaction: [
    "useHotKeys.ts",
    "useKeyboardCommand.ts",
    "useCommandSystem.ts",
    "useNavigation.ts"
  ],
  // ... 나머지 카테고리
};

const hooksDir = "./src/design-system/hooks";

// 1. 폴더 생성
Object.keys(moveMap).forEach(category => {
  project.createDirectory(`${hooksDir}/${category}`);
});

// 2. 파일 이동
Object.entries(moveMap).forEach(([category, files]) => {
  files.forEach(fileName => {
    const sourceFile = project.getSourceFile(`${hooksDir}/${fileName}`);
    if (sourceFile) {
      sourceFile.move(`${hooksDir}/${category}/${fileName}`);
      console.log(`✅ Moved ${fileName} → ${category}/`);
    }
  });
});

// 3. 모든 변경사항 저장 (import 자동 업데이트 포함)
await project.save();

console.log("🎉 Migration completed!");
```

**실행**:
```bash
npx tsx scripts/migrate-hooks.ts
```

---

### 2. tsmod

**개요**: ts-morph 기반의 codemod CLI 도구

**장점**:
- ✅ **CLI 인터페이스**: 명령어로 바로 실행 가능
- ✅ **재사용 가능**: 변환 스크립트를 저장하여 반복 실행
- ✅ **ts-morph 기반**: ts-morph의 모든 기능 사용 가능

**단점**:
- ⚠️ 변환 스크립트 작성 필요
- ⚠️ 유지보수 상태 불명확 (2019년 이후 업데이트 적음)

**설치**:
```bash
npm install -g tsmod
```

**사용법**:
```typescript
// transforms/move-hooks.ts
import { SourceFile } from "ts-morph";

export default function transformer(file: SourceFile) {
  const fileName = file.getBaseName();

  // useAccordion.ts → components/
  if (["useAccordion.ts", "useDropdown.ts"].includes(fileName)) {
    file.move(`./components/${fileName}`);
  }

  // useHeadlessTable.ts → data/
  if (["useHeadlessTable.ts"].includes(fileName)) {
    file.move(`./data/${fileName}`);
  }

  // ... 나머지 로직
}
```

**실행**:
```bash
tsmod -t ./transforms/move-hooks.ts ./src/hooks/**/*.ts
```

**평가**: ts-morph를 직접 사용하는 것과 큰 차이 없음. 유지보수가 활발하지 않아 **비추천**.

---

### 3. refactor-imports

**개요**: Import 경로 변경 전용 CLI 도구

**장점**:
- ✅ **간단한 사용법**: 명령어 하나로 실행
- ✅ **정규식 지원**: 패턴 매칭으로 여러 import 한 번에 변경
- ✅ **경로 별칭 해결**: tsconfig path alias → relative path 변환

**단점**:
- ❌ **파일 이동 불가**: import만 변경, 파일은 수동으로 이동해야 함
- ❌ **제한적 기능**: 복잡한 리팩토링에는 부적합

**설치**:
```bash
npm install -g refactor-imports
```

**사용법**:
```bash
# 파일 이동 후 import 경로 수정
mv useAccordion.ts components/

# Before: import { useAccordion } from "./useAccordion"
# After:  import { useAccordion } from "./components/useAccordion"
refactor-imports -p ./src -s "./useAccordion" -t "./components/useAccordion"

# 또는 정규식 사용
refactor-imports -p ./src -s "./use.*" -t "./components/use.*" -f
```

**평가**: **파일 이동은 따로 해야 하므로** hooks 리팩토링에는 부적합. import 경로만 변경할 때 유용.

---

### 4. jscodeshift

**개요**: Facebook의 JavaScript/TypeScript codemod 프레임워크

**장점**:
- ✅ **강력한 변환**: AST 기반 복잡한 코드 변환 가능
- ✅ **업계 표준**: React, Next.js 등 많은 프로젝트에서 사용
- ✅ **풍부한 예제**: codemod 레시피 많음

**단점**:
- ❌ **파일 이동 미지원**: import 업데이트만 가능
- ❌ **높은 학습 곡선**: AST 개념 이해 필요
- ⚠️ **TypeScript 지원 제한적**: ts-morph보다 TypeScript 지원 약함

**설치**:
```bash
npm install -g jscodeshift
```

**사용법**:
```typescript
// transforms/update-imports.js
module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // import 경로 변경
  root
    .find(j.ImportDeclaration)
    .filter(path => path.node.source.value === "./useAccordion")
    .forEach(path => {
      path.node.source.value = "./components/useAccordion";
    });

  return root.toSource();
};
```

**실행**:
```bash
jscodeshift -t transforms/update-imports.js src/**/*.ts
```

**평가**: 파일 이동 기능이 없어 **hooks 리팩토링에는 부적합**. 복잡한 코드 변환에는 유용.

---

### 5. VS Code (IDE 내장 기능)

**개요**: VS Code의 내장 리팩토링 기능

**장점**:
- ✅ **제로 설정**: 별도 설치 불필요
- ✅ **GUI**: 드래그 앤 드롭으로 파일 이동
- ✅ **자동 업데이트**: `typescript.updateImportsOnFileMove.enabled` 설정 시 자동

**단점**:
- ❌ **배치 작업 불가**: 한 번에 한 파일씩만 이동 가능
- ❌ **스크립트 불가**: 자동화 불가능
- ⚠️ **신뢰성**: 복잡한 프로젝트에서 가끔 실패

**사용법**:
```json
// .vscode/settings.json
{
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

파일 탐색기에서 파일을 드래그하여 폴더로 이동하면 자동으로 import 업데이트.

**평가**: **17개 파일을 수동으로 이동해야 하므로** 비효율적. 소규모 작업에만 적합.

---

## Hooks 리팩토링 적용 방안

### 방안 1: ts-morph 스크립트 (가장 추천 ⭐)

**장점**:
- ✅ 완전 자동화
- ✅ 배치 작업 가능
- ✅ 롤백 가능
- ✅ 검증 가능 (dry-run)

**구현**:
```typescript
// scripts/migrate-hooks.ts
import { Project } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
});

const hooksDir = "./src/design-system/hooks";

// 카테고리별 파일 매핑
const categoryMap = {
  components: [
    "useAccordion.ts",
    "useDropdown.ts",
    "useModal.ts",
    "useTabs.ts",
    "useTooltip.ts",
  ],
  data: [
    "useHeadlessTable.ts",
    "useGridSelection.ts",
    "useVirtualScroll.ts",
  ],
  interaction: [
    "useHotKeys.ts",
    "useKeyboardCommand.ts",
    "useCommandSystem.ts",
    "useNavigation.ts",
  ],
  state: [
    "useHistory.ts",
    "useSelection.ts",
  ],
  search: [
    "useClipboard.ts",
    "useFuzzySearch.ts",
  ],
  primitives: [
    "useClickOutside.ts",
    "useControlledState.ts",
    "useFocusTrap.ts",
    "useId.ts",
    "useScrollLock.ts",
  ],
  lib: [
    "CommandManager.ts",
    "keyUtils.ts",
  ],
};

async function migrateHooks(dryRun = false) {
  console.log(dryRun ? "🔍 Dry run mode" : "🚀 Migration mode");
  console.log("");

  // 1. 폴더 생성
  Object.keys(categoryMap).forEach(category => {
    const categoryPath = path.join(hooksDir, category);
    if (!fs.existsSync(categoryPath)) {
      if (!dryRun) {
        fs.mkdirSync(categoryPath, { recursive: true });
      }
      console.log(`📁 Created directory: ${category}/`);
    }
  });

  console.log("");

  // 2. 파일 이동
  let movedCount = 0;
  Object.entries(categoryMap).forEach(([category, files]) => {
    files.forEach(fileName => {
      // utils/ 폴더에서 파일 찾기
      let sourceFile = project.getSourceFile(`${hooksDir}/${fileName}`);
      if (!sourceFile) {
        sourceFile = project.getSourceFile(`${hooksDir}/utils/${fileName}`);
      }
      if (!sourceFile) {
        sourceFile = project.getSourceFile(`${hooksDir}/logic/${fileName}`);
      }

      if (sourceFile) {
        const newPath = `${hooksDir}/${category}/${fileName}`;

        if (!dryRun) {
          sourceFile.move(newPath);
        }

        console.log(`✅ ${fileName} → ${category}/`);
        movedCount++;
      } else {
        console.log(`⚠️  File not found: ${fileName}`);
      }
    });
  });

  console.log("");
  console.log(`📊 Total files moved: ${movedCount}`);
  console.log("");

  // 3. index.ts 업데이트
  const indexFile = project.getSourceFile(`${hooksDir}/index.ts`);
  if (indexFile && !dryRun) {
    // index.ts 내용을 새로운 경로로 업데이트
    const content = indexFile.getFullText();

    let newContent = content;

    // Components
    newContent = newContent.replace(
      /export \{ useAccordion \} from "\.\/useAccordion"/g,
      'export { useAccordion } from "./components/useAccordion"'
    );
    newContent = newContent.replace(
      /export type \{[^}]+\} from "\.\/useAccordion"/g,
      (match) => match.replace('"./useAccordion"', '"./components/useAccordion"')
    );

    // Data
    newContent = newContent.replace(
      /export \{ useHeadlessTable \} from "\.\/useHeadlessTable"/g,
      'export { useHeadlessTable } from "./data/useHeadlessTable"'
    );

    // ... 나머지 카테고리들도 동일하게 처리

    // Primitives (from utils/)
    newContent = newContent.replace(
      /from "\.\/utils\//g,
      'from "./primitives/'
    );

    // Lib (from logic/)
    newContent = newContent.replace(
      /from "\.\/logic\//g,
      'from "./lib/'
    );

    indexFile.replaceWithText(newContent);
    console.log("✅ Updated index.ts");
  }

  // 4. 저장
  if (!dryRun) {
    await project.save();
    console.log("");
    console.log("💾 All changes saved!");
    console.log("");
    console.log("🎉 Migration completed successfully!");
  } else {
    console.log("");
    console.log("✨ Dry run completed. Run without --dry-run to apply changes.");
  }

  // 5. 오래된 폴더 삭제
  if (!dryRun) {
    const oldDirs = ["utils", "logic"];
    oldDirs.forEach(dir => {
      const dirPath = path.join(hooksDir, dir);
      if (fs.existsSync(dirPath)) {
        const remaining = fs.readdirSync(dirPath);
        if (remaining.length === 0) {
          fs.rmdirSync(dirPath);
          console.log(`🗑️  Removed empty directory: ${dir}/`);
        } else {
          console.log(`⚠️  Directory not empty, skipped: ${dir}/`);
        }
      }
    });
  }
}

// CLI 인터페이스
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

migrateHooks(dryRun).catch(console.error);
```

**실행**:
```bash
# Dry run (변경 사항 미리보기)
npx tsx scripts/migrate-hooks.ts --dry-run

# 실제 마이그레이션
npx tsx scripts/migrate-hooks.ts

# 검증
npm run typecheck
npm run build
```

---

### 방안 2: VS Code + 수동 작업 (소규모만 가능)

**절차**:
1. `.vscode/settings.json`에 `typescript.updateImportsOnFileMove.enabled: "always"` 추가
2. VS Code에서 파일 하나씩 드래그하여 이동
3. 17개 파일 × 수동 이동 = 시간 소모

**평가**: ❌ 비효율적, 실수 가능성 높음

---

### 방안 3: 하이브리드 (파일 이동 + refactor-imports)

**절차**:
```bash
# 1. 폴더 생성
mkdir -p src/design-system/hooks/{components,data,interaction,state,search,primitives,lib}

# 2. 파일 이동 (git mv로 히스토리 보존)
git mv src/design-system/hooks/useAccordion.ts src/design-system/hooks/components/
git mv src/design-system/hooks/useDropdown.ts src/design-system/hooks/components/
# ... 17번 반복

# 3. Import 경로 수정 (각 파일마다)
refactor-imports -p ./src -s "./useAccordion" -t "./components/useAccordion"
refactor-imports -p ./src -s "./useDropdown" -t "./components/useDropdown"
# ... 17번 반복

# 4. index.ts 수동 수정
```

**평가**: ⚠️ 여전히 반복 작업이 많음. **ts-morph보다 복잡함**.

---

## 권장 사항

### ✅ 최종 권장: ts-morph 스크립트

**이유**:
1. **완전 자동화**: 파일 이동 + import 업데이트 + index.ts 업데이트 한 번에
2. **안정성**: TypeScript Compiler API 기반, 타입 안정성 보장
3. **Dry-run 지원**: 변경 사항 미리 확인 가능
4. **롤백 가능**: `project.save()` 전까지 메모리에서만 작업
5. **재사용 가능**: 향후 리팩토링 시 스크립트 재사용

### 구현 단계

**Phase 1: 준비**
```bash
npm install ts-morph --save-dev
```

**Phase 2: 스크립트 작성**
```bash
# 위의 migrate-hooks.ts 스크립트 작성
touch scripts/migrate-hooks.ts
```

**Phase 3: Dry-run 테스트**
```bash
npx tsx scripts/migrate-hooks.ts --dry-run
```

**Phase 4: 실행**
```bash
# Git commit 먼저 (롤백용)
git add .
git commit -m "chore: prepare for hooks refactoring"

# 마이그레이션 실행
npx tsx scripts/migrate-hooks.ts

# 검증
npm run typecheck
npm run build
npm run lint

# 성공 시 커밋
git add .
git commit -m "refactor(hooks): categorize hooks into purpose-based folders"
```

**Phase 5: 정리**
```bash
# 오래된 utils/, logic/ 폴더 삭제 (비어있으면)
# 스크립트가 자동으로 처리
```

---

## 추가 고려사항

### 1. Git History 보존

**문제**: `sourceFile.move()`는 파일 시스템에서 이동만 하므로 git history가 끊길 수 있음

**해결책**:
```bash
# ts-morph 대신 git mv 사용 후 import만 업데이트
git mv src/hooks/useAccordion.ts src/hooks/components/

# 그 다음 ts-morph로 import 경로만 업데이트
```

**또는** ts-morph 실행 후:
```bash
# Git에게 rename 감지하도록 알림
git add -A
git commit -m "refactor: move hooks to categorized folders"
```

Git은 파일 내용이 유사하면 자동으로 rename을 감지합니다.

---

### 2. 점진적 마이그레이션

대규모 프로젝트라면 카테고리별로 나눠서 이동:

```typescript
// 한 번에 하나의 카테고리만
const categoryMap = {
  components: [...],  // Phase 1
  // data: [...],     // Phase 2
  // interaction: [...], // Phase 3
};
```

각 Phase마다 커밋하여 문제 발생 시 롤백 용이.

---

### 3. 테스트 자동화

```bash
# 마이그레이션 후 자동 검증
npx tsx scripts/migrate-hooks.ts && \
  npm run typecheck && \
  npm run build && \
  npm run lint && \
  echo "✅ All checks passed!"
```

---

## 참고 자료

### 공식 문서
- [ts-morph 공식 문서](https://ts-morph.com/)
- [ts-morph - File Manipulation](https://ts-morph.com/manipulation/)
- [ts-morph - Source Files](https://ts-morph.com/details/source-files)

### GitHub 리포지토리
- [dsherret/ts-morph](https://github.com/dsherret/ts-morph)
- [WolkSoftware/tsmod](https://github.com/WolkSoftware/tsmod)
- [luchsamapparat/refactor-imports](https://github.com/luchsamapparat/refactor-imports)
- [facebook/jscodeshift](https://github.com/facebook/jscodeshift)

### 블로그 & 튜토리얼
- [AST-based refactoring with ts-morph](https://kimmo.blog/posts/8-ast-based-refactoring-with-ts-morph/)
- [Refactoring TypeScript Code with ts-morph (Kaleidos Blog)](https://blog.kaleidos.net/Refactoring-Typescript-code-with-ts-morph/)
- [Automated refactoring for TypeScript apps with Tsmod](https://dev.to/wolksoftware/automated-refactoring-for-typescript-apps-with-tsmod-4kko)

### MDK 내부 문서
- `docs/claude/2026-01-19/01-[hooks]categorization-proposal.md` - Hooks 범주화 제안서

---

## 결론

**Hooks 리팩토링을 위한 최적 솔루션**: **ts-morph 스크립트**

**핵심 이유**:
- ✅ 파일 이동 + Import 업데이트 완전 자동화
- ✅ TypeScript Compiler 수준의 정확성
- ✅ Dry-run으로 안전성 확보
- ✅ 재사용 가능한 스크립트

**다음 단계**:
1. `npm install ts-morph --save-dev`
2. `scripts/migrate-hooks.ts` 작성
3. `npx tsx scripts/migrate-hooks.ts --dry-run` 실행
4. 검증 후 실제 마이그레이션 실행

**예상 시간**:
- 스크립트 작성: 30분
- Dry-run 테스트: 5분
- 실제 마이그레이션: 5초 ⚡
- 검증 (typecheck + build): 1분

**총 소요 시간**: ~40분 (수동 작업 대비 **10배 이상 빠름** + **실수 제로**)

이제 안전하고 빠르게 hooks 리팩토링을 진행할 수 있습니다! 🚀
