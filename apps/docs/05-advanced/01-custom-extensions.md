# 커스텀 확장: IDDL 확장하기 🔧

**예상 소요 시간**: 20분
**난이도**: ⭐⭐⭐⭐⭐ 최고급
**사전 지식**: 전체 Level 0-4

---

## 이 문서를 읽고 나면

- IDDL의 확장 메커니즘을 이해합니다
- 커스텀 컴포넌트를 만들 수 있습니다
- 커스텀 dataType과 behavior를 추가할 수 있습니다

---

## IDDL 확장이란?

> **"표준 IDDL로 표현할 수 없는 도메인 특화 UI를 추가"**

IDDL은 범용 UI DSL이지만, 특정 도메인에서는 커스텀 요소가 필요할 수 있습니다.

**확장 가능 영역**:
```
1. 커스텀 Primitive (새로운 노드 타입)
2. 커스텀 dataType (새로운 데이터 타입)
3. 커스텀 behavior (새로운 액션)
4. 커스텀 validator (새로운 검증 규칙)
```

---

## 확장 원칙

### ❌ 하지 말아야 할 것

```json
// Wrong: 기존 노드 타입 수정
{
  "type": "Text",
  "newProperty": "value"  // ← 표준 위반
}

// Wrong: 네이밍 충돌
{
  "type": "CustomField",
  "dataType": "text"  // ← 표준 dataType과 충돌
}
```

### ✅ 올바른 확장

```json
// Correct: 네임스페이스 사용
{
  "type": "myapp:Chart",  // ← 네임스페이스
  "config": { ... }
}

// Correct: extensions 필드 사용
{
  "type": "Field",
  "dataType": "text",
  "extensions": {
    "myapp": {
      "customProp": "value"
    }
  }
}
```

---

## 1. 커스텀 Primitive

### 정의

```typescript
// CustomChart.tsx
interface ChartProps {
  type: 'myapp:Chart';
  chartType: 'line' | 'bar' | 'pie';
  data: any[];
  config?: {
    xAxis?: string;
    yAxis?: string;
    colors?: string[];
  };
}

export function CustomChart(props: ChartProps) {
  const { chartType, data, config } = props;

  return (
    <div className="custom-chart">
      {/* Chart.js or Recharts */}
      <ResponsiveChart
        type={chartType}
        data={data}
        {...config}
      />
    </div>
  );
}
```

### 사용

```json
{
  "type": "myapp:Chart",
  "chartType": "line",
  "data": [
    { "month": "Jan", "sales": 1200 },
    { "month": "Feb", "sales": 1800 }
  ],
  "config": {
    "xAxis": "month",
    "yAxis": "sales",
    "colors": ["#3b82f6"]
  }
}
```

### 렌더러 등록

```typescript
// renderer.ts
import { CustomChart } from './CustomChart';

const customRenderers = {
  'myapp:Chart': CustomChart
};

export function renderNode(node: IDDLNode) {
  const Renderer = customRenderers[node.type] || standardRenderers[node.type];
  return <Renderer {...node} />;
}
```

---

## 2. 커스텀 dataType

### 정의

```typescript
// customDataTypes.ts
interface ColorPickerProps {
  label: string;
  model: string;
  dataType: 'myapp:color';
  format?: 'hex' | 'rgb' | 'hsl';
}

export function ColorPicker(props: ColorPickerProps) {
  const [value, setValue] = useState(props.value || '#000000');

  return (
    <div className="color-picker">
      <label>{props.label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <span>{value}</span>
    </div>
  );
}
```

### 사용

```json
{
  "type": "Field",
  "label": "Brand Color",
  "model": "settings.brandColor",
  "dataType": "myapp:color",
  "format": "hex"
}
```

### 렌더러 등록

```typescript
// fieldRenderer.ts
const customDataTypes = {
  'myapp:color': ColorPicker
};

export function renderField(field: FieldNode) {
  if (field.dataType.includes(':')) {
    const Renderer = customDataTypes[field.dataType];
    return <Renderer {...field} />;
  }

  // 표준 dataType
  return <StandardField {...field} />;
}
```

---

## 3. 커스텀 behavior

### 정의

```typescript
// customBehaviors.ts
interface ExportBehavior {
  action: 'myapp:export';
  format: 'csv' | 'xlsx' | 'pdf';
  data: string;  // model path
}

export async function handleExport(behavior: ExportBehavior) {
  const data = getModelData(behavior.data);

  switch (behavior.format) {
    case 'csv':
      return exportToCSV(data);
    case 'xlsx':
      return exportToExcel(data);
    case 'pdf':
      return exportToPDF(data);
  }
}
```

### 사용

```json
{
  "type": "Action",
  "label": "Export to Excel",
  "prominence": "Secondary",
  "intent": "Info",
  "behavior": {
    "action": "myapp:export",
    "format": "xlsx",
    "data": "users"
  }
}
```

### 핸들러 등록

```typescript
// behaviorHandler.ts
const customBehaviors = {
  'myapp:export': handleExport
};

export async function executeBehavior(behavior: Behavior) {
  if (behavior.action.includes(':')) {
    const handler = customBehaviors[behavior.action];
    return await handler(behavior);
  }

  // 표준 behavior
  return await standardBehaviorHandler(behavior);
}
```

---

## 4. 커스텀 validator

### 정의

```typescript
// customValidators.ts
interface UniqueValidator {
  type: 'myapp:unique';
  endpoint: string;
  field: string;
}

export async function validateUnique(
  value: any,
  validator: UniqueValidator
): Promise<boolean> {
  const response = await fetch(
    `${validator.endpoint}?${validator.field}=${value}`
  );
  const data = await response.json();
  return !data.exists;
}
```

### 사용

```json
{
  "type": "Field",
  "label": "Username",
  "model": "user.username",
  "dataType": "text",
  "required": true,
  "constraints": {
    "myapp:unique": {
      "endpoint": "/api/check-username",
      "field": "username"
    }
  },
  "errorMessages": {
    "myapp:unique": "This username is already taken"
  }
}
```

### Validator 등록

```typescript
// validatorRegistry.ts
const customValidators = {
  'myapp:unique': validateUnique
};

export async function validate(field: FieldNode, value: any) {
  // 표준 검증
  const standardErrors = validateStandard(field, value);

  // 커스텀 검증
  for (const [key, config] of Object.entries(field.constraints)) {
    if (key.includes(':')) {
      const validator = customValidators[key];
      const isValid = await validator(value, config);
      if (!isValid) {
        return field.errorMessages[key];
      }
    }
  }

  return standardErrors;
}
```

---

## 실전 예시: 리치 텍스트 에디터

### 커스텀 dataType 구현

```typescript
// RichTextEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextEditorProps {
  label: string;
  model: string;
  dataType: 'myapp:richtext';
  value: string;
  onChange: (value: string) => void;
  mode: 'view' | 'edit';
}

export function RichTextEditor(props: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: props.value,
    editable: props.mode === 'edit',
    onUpdate: ({ editor }) => {
      props.onChange(editor.getHTML());
    }
  });

  if (props.mode === 'view') {
    return (
      <div className="rich-text-view">
        <label>{props.label}</label>
        <div dangerouslySetInnerHTML={{ __html: props.value }} />
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <label>{props.label}</label>
      <div className="editor-toolbar">
        <button onClick={() => editor?.chain().focus().toggleBold().run()}>
          Bold
        </button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()}>
          Italic
        </button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
```

### IDDL 사용

```json
{
  "type": "Field",
  "label": "Description",
  "model": "product.description",
  "dataType": "myapp:richtext"
}
```

---

## 실전 예시: 지도 컴포넌트

### 커스텀 Primitive 구현

```typescript
// MapComponent.tsx
import { GoogleMap, Marker } from '@react-google-maps/api';

interface MapComponentProps {
  type: 'myapp:Map';
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    label?: string;
  }>;
}

export function MapComponent(props: MapComponentProps) {
  return (
    <GoogleMap
      center={props.center}
      zoom={props.zoom || 10}
      mapContainerStyle={{ width: '100%', height: '400px' }}
    >
      {props.markers?.map((marker, i) => (
        <Marker key={i} position={marker.position} label={marker.label} />
      ))}
    </GoogleMap>
  );
}
```

### IDDL 사용

```json
{
  "type": "myapp:Map",
  "center": {
    "lat": 37.5665,
    "lng": 126.9780
  },
  "zoom": 12,
  "markers": [
    {
      "position": { "lat": 37.5665, "lng": 126.9780 },
      "label": "Seoul"
    }
  ]
}
```

---

## 핵심 정리

### 확장 네이밍 규칙

```
커스텀 타입: myapp:TypeName
커스텀 dataType: myapp:dataTypeName
커스텀 behavior: myapp:actionName
커스텀 validator: myapp:validatorName
```

### extensions 필드 사용

```json
{
  "type": "Field",
  "dataType": "text",
  "extensions": {
    "myapp": {
      "customProp": "value",
      "anotherProp": 123
    }
  }
}
```

### 렌더러 등록 패턴

```typescript
const customRenderers = {
  'myapp:Chart': CustomChart,
  'myapp:Map': MapComponent
};

function renderNode(node: IDDLNode) {
  const Renderer =
    customRenderers[node.type] ||
    standardRenderers[node.type];
  return <Renderer {...node} />;
}
```

### Best Practice

```
✓ 네임스페이스 사용 (충돌 방지)
✓ 표준 속성 우선 사용
✓ TypeScript로 타입 정의
✓ 문서화 (사용법, 속성)
✓ 테스트 작성
✗ 표준 노드 타입 수정 금지
✗ 표준 속성 재정의 금지
```

---

## 다음 단계

커스텀 확장을 완벽히 이해했습니다!
이제 **반응형 디자인**을 배워봅시다.

**다음**: [반응형 디자인 →](./02-responsive-design.md)

---

**이전**: [← Wizard](../04-patterns/05-wizard.md)
**다음**: [반응형 디자인 →](./02-responsive-design.md)
