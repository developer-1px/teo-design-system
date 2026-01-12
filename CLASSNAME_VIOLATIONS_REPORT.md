# className Violations Report

**Generated**: 2026-01-12
**Total Files Scanned**: 109
**Files with Violations**: 54 (49.5%)

## 🚨 Executive Summary

약 절반의 앱 파일에서 IDDL 원칙을 위반하고 className으로 디자인을 하드코딩하고 있습니다.

**IDDL 원칙**: Developers declare **WHY** (role, prominence, intent), not **HOW** (className, inline styles)

---

## 📊 Violation Categories

### 1️⃣ **Layout/Positioning** (가장 많음)
- `flex`, `grid`, `flex-1`, `items-center`, `justify-between`
- `gap-2`, `gap-4`, `space-y-2`
- `w-full`, `h-full`, `max-w-4xl`

**문제**: Layout은 Block의 `role` prop으로 해결해야 함
```tsx
// ❌ WRONG
<div className="flex items-center gap-2">

// ✅ CORRECT
<Block role="Stack" density="Compact">
```

### 2️⃣ **Typography/Text Styles**
- `text-xl`, `text-sm`, `text-xs`
- `font-bold`, `font-semibold`
- `text-text-subtle`, `text-text-tertiary`

**문제**: Typography는 Text의 `role` + `prominence`로 해결
```tsx
// ❌ WRONG
<h2 className="text-xl font-bold">Title</h2>

// ✅ CORRECT
<Text role="Title" prominence="Strong" content="Title" />
```

### 3️⃣ **Spacing** (padding, margin)
- `p-2`, `p-4`, `px-3`, `py-2`
- `m-2`, `mb-6`, `mt-8`

**문제**: Spacing은 `density` prop으로 자동 처리
```tsx
// ❌ WRONG
<div className="p-4">

// ✅ CORRECT
<Block role="Container" density="Standard">
```

### 4️⃣ **Colors/Backgrounds**
- `bg-layer-1`, `bg-layer-2`, `bg-surface-base`
- `text-accent`, `text-text`
- `border-border-default`

**문제**: Colors는 `prominence` + `intent`로 자동 생성
```tsx
// ❌ WRONG
<div className="bg-layer-1 border-border-default">

// ✅ CORRECT
<Block role="Card" prominence="Standard">
```

### 5️⃣ **Borders/Shadows**
- `border`, `border-b`, `border-t`
- `rounded`, `rounded-lg`
- `shadow-sm`, `shadow-lg`

**문제**: Visual hierarchy는 token engine이 처리

---

## 🔥 Top Offenders

### 심각한 위반 파일들 (30+ violations)

1. **`src/apps/IDE/widgets/editor/MarkdownViewer.tsx`**
   - 50+ className violations
   - Markdown 렌더링에 수동 스타일링
   - **해결책**: Text role variants 활용

2. **`src/apps/IDE/widgets/chat/AIAgentChat.tsx`**
   - 40+ className violations
   - 채팅 UI를 완전히 수동 작성
   - **해결책**: MessageBubble role 사용

3. **`src/apps/IDE/widgets/file-tree/FileTree.tsx`**
   - 35+ className violations
   - Tree 구조를 직접 스타일링
   - **해결책**: TreeView Block role 활용

4. **`src/apps/SECTION/pages/section/SectionShowcasePage.tsx`**
   - Layout demo container에 하드코딩
   - **해결책**: Section role만으로 표현

---

## 📋 Complete Violation List

### Apps with Violations:

**BLOCK (15 files)**
- `BlockShowcasePage.tsx` - showcase header/layout
- `BlockStructureDemo.tsx`
- `BlockFormsDemo.tsx`
- `BlockToolbarsDemo.tsx`
- `BlockCardsDemo.tsx`
- `SectionSpecDemo.tsx`
- `BlockNavigationDemo.tsx`
- `BlockListsDemo.tsx`
- `BlockSectionContextDemo.tsx`

**PAGE (6 files)**
- `OverlayExample.tsx`
- `FocusExample.tsx`
- `ApplicationExample.tsx`
- `PaperExample.tsx`
- `DocumentExample.tsx`
- `ImmersiveExample.tsx`

**IDE (13 files)**
- `CodeEditor.tsx`
- `EditorTabs.tsx`
- `MarkdownViewer.tsx` ⚠️ Critical
- `ComponentPreview.tsx`
- `FileTree.tsx` ⚠️ Critical
- `AIAgentChat.tsx` ⚠️ Critical
- `TokensView.tsx`
- `DebugView.tsx`
- `PresentationView.tsx`
- `JsonView.tsx`
- `RunView.tsx`
- `SearchView.tsx`
- `ExtensionsView.tsx`
- `SettingsView.tsx`
- `SourceControlView.tsx`
- `Sidebar.tsx`

**JSON (7 files)**
- `JsonSchemaSidebar.tsx`
- `JsonSchemaSidebarDSL.tsx`
- `FormView.tsx`
- `TableView.tsx`
- `ServerProductsViewDSL.tsx`
- `JSONPage.tsx`

**DOCS (7 files)**
- `TokenTable.tsx`
- `ProminenceDemo.tsx`
- `ShadowVsBorderGuide.tsx`
- `ColorSwatch.tsx`
- `AtomsShowcasePage.tsx`
- `ComponentsShowcase.tsx`
- `MarkdownRenderer.tsx`

**Others**
- `EMOJI/` - 3 files
- `FIELD/` - 1 file
- `SECTION/` - 1 file
- `SHOWCASE/` - 2 files
- `ADAPTIVE/` - 1 file
- `BEHAVIOR/` - 1 file
- `PPT/` - 1 file

---

## 🎯 Recommended Actions

### Priority 1: Critical Files (Week 1)
1. **IDE/widgets/chat/AIAgentChat.tsx**
   - 완전히 IDDL로 재작성
   - MessageBubble + CommentThread role 활용

2. **IDE/widgets/editor/MarkdownViewer.tsx**
   - Text role variants로 모든 heading 처리
   - Block role로 layout 구성

3. **IDE/widgets/file-tree/FileTree.tsx**
   - TreeView Block role 사용
   - TreeItem Action role 사용

### Priority 2: Showcase Files (Week 2)
4. **BLOCK/PAGE/SECTION ShowcasePages**
   - Demo container들 IDDL로 변환
   - 예제가 되어야 하는 파일이 위반하면 안 됨

### Priority 3: Documentation Files (Week 3)
5. **DOCS/ widgets**
   - Design system 문서가 원칙 위반하면 아이러니
   - TokenTable, ColorSwatch 등 IDDL로 재작성

### Priority 4: Production Apps (Week 4)
6. **JSON/PPT/EMOJI apps**
   - 실제 앱들도 IDDL 준수하도록 리팩토링

---

## 📖 Migration Guide

### Pattern 1: Layout Container
```tsx
// BEFORE
<div className="flex items-center gap-2">
  <span>Icon</span>
  <span>Text</span>
</div>

// AFTER
<Block role="Stack" density="Compact">
  <Text role="Body" content="Icon" />
  <Text role="Body" content="Text" />
</Block>
```

### Pattern 2: Typography
```tsx
// BEFORE
<h2 className="text-xl font-bold text-text">Title</h2>
<p className="text-sm text-text-subtle">Subtitle</p>

// AFTER
<Text role="Title" prominence="Strong" content="Title" />
<Text role="Caption" prominence="Subtle" content="Subtitle" />
```

### Pattern 3: Card/Container
```tsx
// BEFORE
<div className="bg-layer-2 border border-border rounded-lg p-4">
  Content
</div>

// AFTER
<Block role="Card" prominence="Standard" density="Standard">
  <Text role="Body" content="Content" />
</Block>
```

### Pattern 4: Interactive List
```tsx
// BEFORE
<div className="flex flex-col gap-1">
  <button className="px-3 py-2 hover:bg-layer-hover">Item 1</button>
  <button className="px-3 py-2 hover:bg-layer-hover">Item 2</button>
</div>

// AFTER
<Block role="List" density="Compact">
  <Action role="ListItem" label="Item 1" />
  <Action role="ListItem" label="Item 2" />
</Block>
```

---

## ✅ Success Criteria

**리팩토링 완료 기준:**
- [ ] Files with violations < 10% (현재 50%)
- [ ] All Showcase files 100% IDDL-compliant
- [ ] All Documentation files 100% IDDL-compliant
- [ ] Critical IDE widgets converted

**Tracking:**
```bash
# Run this to check progress
grep -r "className=" src/apps --include="*.tsx" | wc -l
```

---

## 🔍 Exceptions

**허용되는 className 사용 케이스:**

1. **Data Visualization**
   - Chart colors, dynamic data-driven styles
   - Example: `className="bg-[${dataColor}]"`

2. **Third-party Integration**
   - CodeMirror, external libraries
   - Wrapper에만 사용, 내부 UI는 IDDL

3. **Animation/Transition**
   - CSS animations not covered by IDDL yet
   - 명시적으로 문서화 필요

---

## 📌 Next Steps

1. ✅ **이 보고서를 기반으로 cleanup 티켓 생성**
2. 🔄 **Priority 1 파일부터 순차적으로 리팩토링**
3. 📝 **Migration 진행상황을 tracking**
4. 🎓 **Best practices 문서 작성**

**Goal**: IDDL-first codebase by end of Q1 2026
