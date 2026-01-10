# IDDL 1.0 Migration Guide (from Legacy v4.x)

본 문서는 기존의 IDDL v4.x (및 이전 버전) 기반 코드를 **IDDL 1.0 Part 1 (Core Freeze)** 스펙으로 마이그레이션하기 위한 실무 가이드입니다.

---

## 1. 핵심 변경 사항 요약 (Key Breaking Changes)

IDDL 1.0은 **"표현(Expression)의 완전한 배제"**를 목표로 합니다.
따라서 **레이아웃, 배치, 스타일 변형**을 직접 지시하던 속성들이 대거 삭제되거나 **Role**과 **Spec**으로 통합되었습니다.

| Legacy Prop (v4.x) | IDDL 1.0 Part 1 | 마이그레이션 전략 |
| :--- | :--- | :--- |
| `layout="..."` | **삭제됨 (Removed)** | **Role**이 레이아웃을 결정합니다. 단순 배치는 `role="Group"`(Stack) 또는 `role="Row"`(Inline) 사용. |
| `placement="..."` | **삭제됨 (Removed)** | **Section Role**(`Header`, `Sidebar`)이 위치를 결정합니다. 내부 배치는 렌더러 위임. |
| `variant="..."` | **삭제됨 (Removed)** | **Prominence**(`Standard`/`Hero`...)로 대체하거나, **Role**을 구체화(`PrimaryButton` 등)하거나, **Spec** 사용. |
| `tooltipText="..."` | **삭제됨 (Removed)** | **`description`**으로 통합. |
| `<Group>` Component | `<Block>`으로 통합 | `<Block role="...">` 사용. (단, 렌더러 구현상 `<Group>`을 Alias로 유지할 순 있음) |

---

## 2. 레이아웃 리팩토링 (Layout Refactoring)

### 2.1 가로 배치 (Inline Layout)

**Before (Legacy):**
```tsx
<Group layout="inline" gap="small">
  <Action icon="save" />
  <Action icon="close" />
</Group>
```

**After (IDDL 1.0):**
의도에 따라 알맞은 Role을 선택하세요.

**Case A: 툴바 (의미가 있는 모음)**
```tsx
// Renderer가 Toolbar를 "가로 배치, 아이콘 중심"으로 렌더링하도록 약속됨
<Block role="Toolbar" gap="small">
  <Action icon="save" />
  <Action icon="close" />
</Block>
```

**Case B: 단순 가로 나열 (의미 없음)**
```tsx
<Block role="Row" gap="small">
  <Action icon="save" />
  <Action icon="close" />
</Block>
```

### 2.2 그리드 (Grid Layout)

**Before (Legacy):**
```tsx
<Group layout="grid" columns={3}>
  ...
</Group>
```

**After (IDDL 1.0):**
`grid` 레이아웃은 사라졌으며, `Grid`라는 Role과 `spec`을 사용합니다.

```tsx
<Block role="Grid" spec={{ columns: 3 }}>
  ...
</Block>
```

---

## 3. Placement & Positioning

**Before (Legacy):**
```tsx
<Group placement="top-right">
  <Action label="Close" />
</Group>
```

**After (IDDL 1.0):**
위치는 부모 컨테이너(Section)의 Role이나, Block의 Role에 의해 결정되어야 합니다.

```tsx
<Section role="Header">
  {/* Header 내부의 Toolbar는 관례적으로 우측(또는 끝)에 배치될 수 있음 */}
  <Block role="Toolbar">
    <Action label="Close" />
  </Block>
</Section>
```
*만약 정밀한 배치가 꼭 필요하다면 Renderer가 `align` 같은 prop을 확장 지원할 순 있으나, Core Spec에서는 권장하지 않습니다.*

---

## 4. Variant vs Prominence/Spec

**Before (Legacy):**
```tsx
<Action variant="solid" colorScheme="blue" />
```

**After (IDDL 1.0):**
스타일(`solid`, `blue`) 대신 의도(`Intent`, `Prominence`)를 사용합니다.

```tsx
<Action intent="Brand" prominence="Hero" />
```
*   `Brand` + `Hero` -> (Renderer 해석) -> "Solid Blue Button"
*   `Neutral` + `Standard` -> (Renderer 해석) -> "Outline Gray Button"

---

## 5. Prop Pool 정리 (Canonical Keys)

`iddl-key-pool.md`에 정의된 **표준 키**로 속성명을 통일해야 합니다.

| Legacy | IDDL 1.0 Standard |
| :--- | :--- |
| `ariaLabel` | **`name`** |
| `helperText`, `hint`, `tooltip` | **`description`** |
| `onClick` | **`behavior`** (선언형 객체) |
| `title` (Text 노드) | **`content`** |

---

## 6. 마이그레이션 체크리스트

1.  [ ] **`layout` prop 제거**: 모든 `layout="stack"`은 제거(기본값), `layout="inline"`은 `role="Row"`나 `role="Toolbar"`로 변경.
2.  [ ] **`Group` -> `Block`**: 컴포넌트 이름을 `Block`으로 변경하거나, `Group` 컴포넌트가 내부적으로 `Block`을 렌더링하도록 수정.
3.  [ ] **`spec` 도입**: `columns`, `rows` 등 Role 전용 파라미터는 `spec={{ ... }}`으로 이동.
4.  [ ] **이벤트 핸들러 제거**: `onClick={() => ...}` 코드를 `behavior={{ type: 'command', ... }}` 형태로 변환 (실행기는 별도 구현).

---

## 7. 예시: IDE Toolbar 마이그레이션

**Legacy Code:**
```tsx
<Group layout="inline" placement="top" className="ide-toolbar">
  <Group layout="inline">
    <Action icon="menu" variant="ghost" />
    <Text variant="h3">My Project</Text>
  </Group>
  <Group layout="inline" align="right">
    <Action icon="play" variant="primary" />
  </Group>
</Group>
```

**IDDL 1.0 Code:**
```tsx
<Section role="Header" density="Compact">
  <Block role="Toolbar" gap="small">
    <Action icon="menu" prominence="Subtle" />
    <Text role="Heading" content="My Project" />
  </Block>
  
  {/* Spacer를 사용하여 우측 정렬 유도 */}
  <Block role="Spacer" /> 

  <Block role="Toolbar">
    <Action icon="play" intent="Positive" prominence="Hero" />
  </Block>
</Section>
```
