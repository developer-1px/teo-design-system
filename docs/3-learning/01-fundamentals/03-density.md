# Density (간격과 크기)

**난이도**: ⭐⭐☆☆☆
**소요 시간**: 15분
**선행 학습**: [Prominence](./01-prominence.md), [Intent](./02-intent.md)

---

## 📌 이 문서에서 배울 내용

- Density가 무엇이고 왜 중요한가?
- 3가지 Density 레벨 완전 이해
- 플랫폼별 권장 Density
- Density × Prominence 조합
- 자주 하는 실수와 해결법

---

## 🎯 Density란?

**Density**는 "간격과 크기"를 나타내는 IDDL의 핵심 축입니다.

```tsx
// "이 UI가 얼마나 촘촘한가?"를 선언
<Block role="Form" density="Comfortable">  // 여유롭게
<Block role="Form" density="Standard">      // 기본
<Block role="Form" density="Compact">       // 촘촘하게
```

**개발자가 선언하는 것**: UI의 간격 스타일
**시스템이 처리하는 것**: gap, padding, 폰트 크기, 아이콘 크기

---

## 📊 3가지 Density 레벨

### Comfortable (여유로운)

**용도**: 데스크톱, 터치 인터페이스, 여유로운 UI

**자동 적용 스타일**:
- Gap: `24px` (gap-6)
- Padding: `24px` (p-6)
- Font size: 기본값보다 크게
- Icon size: `24px`
- Touch target: `48px × 48px`

**사용 예시**:
```tsx
// ✅ 터치 기반 태블릿 UI
<Block role="Form" density="Comfortable">
  <Field label="Name" dataType="text" />
  <Field label="Email" dataType="email" />
  <Action prominence="Strong" intent="Positive">
    Submit
  </Action>
</Block>

// ✅ 고령자용 UI
<Block role="List" density="Comfortable">
  {items.map(item => (
    <Action key={item.id} prominence="Standard">
      {item.name}
    </Action>
  ))}
</Block>
```

**플랫폼**: 태블릿, 키오스크, 접근성 중요 UI

---

### Standard (표준)

**용도**: 기본값, 대부분의 데스크톱 앱

**자동 적용 스타일**:
- Gap: `16px` (gap-4)
- Padding: `16px` (p-4)
- Font size: 기본값
- Icon size: `20px`
- Touch target: `40px × 40px`

**사용 예시**:
```tsx
// ✅ 일반 데스크톱 앱
<Block role="Form" density="Standard">
  <Field label="Name" dataType="text" />
  <Field label="Email" dataType="email" />
  <Action prominence="Strong" intent="Positive">
    Submit
  </Action>
</Block>

// ✅ 일반 카드 그리드
<Block role="Grid" density="Standard">
  {cards.map(card => (
    <Block key={card.id} role="Card" prominence="Strong">
      <Text role="Title">{card.title}</Text>
    </Block>
  ))}
</Block>
```

**플랫폼**: 데스크톱, 웹 앱 (기본값)

---

### Compact (촘촘한)

**용도**: 정보 밀도 높은 UI, 대시보드, 테이블

**자동 적용 스타일**:
- Gap: `8px` (gap-2)
- Padding: `8px` (p-2)
- Font size: 기본값보다 작게
- Icon size: `16px`
- Touch target: `32px × 32px`

**사용 예시**:
```tsx
// ✅ 파일 트리 (많은 항목)
<Block role="List" density="Compact">
  {files.map(file => (
    <Text key={file.id} role="Body" prominence="Standard">
      {file.name}
    </Text>
  ))}
</Block>

// ✅ 데이터 테이블
<Block role="Table" density="Compact">
  {rows.map(row => (
    <div key={row.id} className="grid grid-cols-4">
      <Text role="Body">{row.col1}</Text>
      <Text role="Body">{row.col2}</Text>
      <Text role="Body">{row.col3}</Text>
      <Text role="Body">{row.col4}</Text>
    </div>
  ))}
</Block>

// ✅ IDE Sidebar
<Section role="PrimarySidebar" density="Compact">
  <Block role="List">
    {/* 많은 파일 목록 */}
  </Block>
</Section>
```

**플랫폼**: IDE, 대시보드, 정보 밀도 중요 UI

---

## 🎨 Density × Prominence 조합

### Form 예시

```tsx
function FormDensityExample() {
  return (
    <div className="grid grid-cols-3 gap-8 p-8">
      {/* Comfortable - 터치 UI */}
      <Block role="Form" density="Comfortable" prominence="Strong">
        <Text role="Title" prominence="Strong">
          Comfortable
        </Text>
        <Field label="Name" dataType="text" />
        <Field label="Email" dataType="email" />
        <Action prominence="Strong" intent="Positive">
          Submit
        </Action>
      </Block>

      {/* Standard - 데스크톱 기본 */}
      <Block role="Form" density="Standard" prominence="Strong">
        <Text role="Title" prominence="Strong">
          Standard
        </Text>
        <Field label="Name" dataType="text" />
        <Field label="Email" dataType="email" />
        <Action prominence="Strong" intent="Positive">
          Submit
        </Action>
      </Block>

      {/* Compact - 정보 밀도 */}
      <Block role="Form" density="Compact" prominence="Strong">
        <Text role="Title" prominence="Strong">
          Compact
        </Text>
        <Field label="Name" dataType="text" />
        <Field label="Email" dataType="email" />
        <Action prominence="Strong" intent="Positive">
          Submit
        </Action>
      </Block>
    </div>
  );
}
```

**결과 비교**:
| Density | Gap | Padding | 높이 | 사용감 |
|---------|-----|---------|------|--------|
| Comfortable | 24px | 24px | ~600px | 여유로움, 터치 쉬움 |
| Standard | 16px | 16px | ~450px | 균형 잡힘 |
| Compact | 8px | 8px | ~350px | 촘촘함, 정보 많음 |

---

### List 예시

```tsx
function ListDensityExample() {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  return (
    <div className="grid grid-cols-3 gap-8 p-8">
      {/* Comfortable */}
      <Block role="List" density="Comfortable">
        {items.map(item => (
          <Text key={item} role="Body" prominence="Standard">
            {item}
          </Text>
        ))}
      </Block>

      {/* Standard */}
      <Block role="List" density="Standard">
        {items.map(item => (
          <Text key={item} role="Body" prominence="Standard">
            {item}
          </Text>
        ))}
      </Block>

      {/* Compact */}
      <Block role="List" density="Compact">
        {items.map(item => (
          <Text key={item} role="Body" prominence="Standard">
            {item}
          </Text>
        ))}
      </Block>
    </div>
  );
}
```

---

## 🌍 플랫폼별 권장 Density

### 데스크톱 앱

```tsx
// ✅ Standard가 기본
<Page role="Application" density="Standard">
  <Section role="PrimarySidebar" density="Compact">
    {/* Sidebar는 Compact (많은 항목) */}
  </Section>

  <Section role="Editor" density="Standard">
    {/* Editor는 Standard (기본) */}
  </Section>

  <Section role="Panel" density="Standard">
    {/* Panel은 Standard */}
  </Section>
</Page>
```

---

### 태블릿/터치 UI

```tsx
// ✅ Comfortable이 기본
<Page role="Document" density="Comfortable">
  <Section role="Container">
    <Block role="Form" density="Comfortable">
      {/* 모든 요소가 터치하기 쉽게 */}
    </Block>
  </Section>
</Page>
```

---

### 대시보드/정보 밀집

```tsx
// ✅ Compact이 기본
<Page role="Application" density="Compact">
  <Section role="Container">
    <Block role="Grid" density="Compact">
      {/* 많은 카드를 한 화면에 */}
    </Block>
  </Section>
</Page>
```

---

## ⚖️ Density 선택 가이드

### 언제 Comfortable을 사용하나?

- ✅ 터치 인터페이스 (태블릿, 키오스크)
- ✅ 접근성 중요 UI (고령자, 저시력)
- ✅ 주요 CTA가 있는 폼
- ❌ 정보 밀도가 중요한 UI
- ❌ 많은 항목을 보여야 하는 리스트

---

### 언제 Standard를 사용하나?

- ✅ 데스크톱 웹 앱 (기본값)
- ✅ 일반적인 폼
- ✅ 균형 잡힌 UI
- ✅ 특별한 이유가 없으면 Standard

---

### 언제 Compact를 사용하나?

- ✅ IDE (VS Code, IntelliJ)
- ✅ 파일 트리, 네비게이션
- ✅ 데이터 테이블
- ✅ 대시보드 (많은 카드)
- ❌ 터치 인터페이스
- ❌ 접근성 중요 UI

---

## 🚫 자주 하는 실수

### 실수 1: 터치 UI에 Compact 사용

```tsx
// ❌ BAD - 태블릿인데 Compact
<Page role="Document" density="Compact">
  <Block role="Form">
    {/* 터치하기 너무 어려움 */}
  </Block>
</Page>

// ✅ GOOD
<Page role="Document" density="Comfortable">
  <Block role="Form">
    {/* 터치하기 쉬움 (48px target) */}
  </Block>
</Page>
```

**이유**: Compact는 터치 타겟이 32px로 작아서 터치하기 어렵습니다.

---

### 실수 2: 정보 밀집 UI에 Comfortable 사용

```tsx
// ❌ BAD - 파일 트리인데 Comfortable
<Section role="PrimarySidebar" density="Comfortable">
  <Block role="List">
    {/* 100개 파일 → 스크롤 너무 길어짐 */}
  </Block>
</Section>

// ✅ GOOD
<Section role="PrimarySidebar" density="Compact">
  <Block role="List">
    {/* 100개 파일 → 적절한 길이 */}
  </Block>
</Section>
```

**이유**: 많은 항목을 보여야 하면 Compact가 적합합니다.

---

### 실수 3: 혼재 사용

```tsx
// ❌ BAD - 부모와 자식 density가 다름
<Block role="Form" density="Comfortable">
  <Field label="Name" density="Compact" />  {/* density prop 없음! */}
  <Field label="Email" />
</Block>

// ✅ GOOD - 부모에만 density 선언
<Block role="Form" density="Comfortable">
  <Field label="Name" />  {/* 자동으로 Comfortable 상속 */}
  <Field label="Email" />
</Block>
```

**이유**: Density는 부모에 선언하면 자식이 자동 상속합니다.

---

## 📝 실습: IDE 레이아웃

### 요구사항

IDE 레이아웃을 만들 때 각 영역에 적절한 Density를 적용하세요:

1. ActivityBar (좌측 아이콘 바)
2. Sidebar (파일 트리)
3. Editor (코드 편집기)
4. Panel (터미널)

### 정답 예시

```tsx
function IDELayout() {
  return (
    <Page role="Application" layout="Studio" density="Standard">
      {/* ActivityBar: Compact (아이콘만) */}
      <Section role="ActivityBar" density="Compact">
        <Block role="List">
          <IconButton title="Files">
            <Files size={20} />
          </IconButton>
          <IconButton title="Search">
            <Search size={20} />
          </IconButton>
        </Block>
      </Section>

      {/* Sidebar: Compact (많은 파일) */}
      <Section role="PrimarySidebar" density="Compact">
        <Block role="List">
          {files.map(file => (
            <Text key={file.id} role="Body">
              {file.name}
            </Text>
          ))}
        </Block>
      </Section>

      {/* Editor: Standard (기본) */}
      <Section role="Editor" density="Standard">
        <CodeEditor />
      </Section>

      {/* Panel: Compact (많은 로그) */}
      <Section role="Panel" density="Compact">
        <Block role="List">
          {logs.map(log => (
            <Text key={log.id} role="Code">
              {log.message}
            </Text>
          ))}
        </Block>
      </Section>
    </Page>
  );
}
```

**체크리스트**:
- [ ] ActivityBar가 Compact인가?
- [ ] Sidebar가 Compact인가?
- [ ] Editor가 Standard인가?
- [ ] Panel이 Compact인가?
- [ ] Page 기본값은 Standard인가?

---

## 🎯 자주 쓰는 패턴

### 1. IDE 레이아웃

```tsx
<Page role="Application" density="Standard">
  <Section role="ActivityBar" density="Compact" />
  <Section role="PrimarySidebar" density="Compact" />
  <Section role="Editor" density="Standard" />
  <Section role="Panel" density="Compact" />
</Page>
```

---

### 2. 대시보드

```tsx
<Page role="Application" density="Compact">
  <Section role="Container">
    <Block role="Grid" density="Compact">
      {/* 많은 카드 */}
    </Block>
  </Section>
</Page>
```

---

### 3. 설정 페이지

```tsx
<Page role="Document" density="Standard">
  <Section role="Container">
    <Block role="Form" density="Standard">
      {/* 일반 폼 */}
    </Block>
  </Section>
</Page>
```

---

### 4. 터치 UI

```tsx
<Page role="Focus" density="Comfortable">
  <Section role="Container">
    <Block role="Form" density="Comfortable">
      {/* 터치하기 쉬운 폼 */}
    </Block>
  </Section>
</Page>
```

---

## 💡 Density 자동 상속

Density는 부모에서 자식으로 자동 상속됩니다:

```tsx
<Page density="Comfortable">  {/* 여기서 선언 */}
  <Section role="Container">
    <Block role="Form">  {/* 자동으로 Comfortable */}
      <Field label="Name" />  {/* 자동으로 Comfortable */}
      <Action prominence="Strong">Save</Action>  {/* 자동으로 Comfortable */}
    </Block>
  </Section>
</Page>
```

**원칙**: 최상위(Page)에 선언하면 모든 자식이 상속합니다.

---

## ✅ 이 문서를 읽고 나면

- [x] Density의 개념을 이해했다
- [x] 3가지 레벨의 차이를 알았다
- [x] 플랫폼별 권장 Density를 파악했다
- [x] Density 자동 상속을 이해했다
- [x] 자주 하는 실수를 피할 수 있다

---

## 🔗 다음 단계

[Role](./04-role.md) - 역할 기반 설계를 배웁니다.

---

**최종 업데이트**: 2026-01-11
**난이도**: 기초
**예상 소요 시간**: 15분
