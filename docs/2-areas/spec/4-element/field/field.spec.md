# Field Specification

Field는 사용자로부터 데이터를 입력받는 Element입니다. 

## FieldRole

| Role | 설명 |
|------|------|
| Role | ARIA / 설명 |
|------|------|
| `Textbox` | `textbox`: 단일/다중 행 텍스트 |
| `Spinbutton` | `spinbutton`: 숫자 입력 |
| `Slider` | `slider`: 범위 선택 |
| `Checkbox` | `checkbox`: 예/아니오 선택 |
| `Switch` | `switch`: 온/오프 토글 |
| `Radio` | `radio`: 단일 선택 (Radio Group) |
| `Combobox` | `combobox`: 검색 + 선택 |
| `Listbox` | `listbox`: 단순 선택 (Select) |
| `Datepicker` | 날짜 선택 (Composite) |
| `Filepicker` | 파일 업로드 (Composite) |
| `Colorpicker` | 색상 선택 (Composite) |
| `Rating` | 평점 (Custom) |

## Props

```typescript
interface FieldProps extends BaseProps {
  label: string;
  model: string;   // 데이터 바인딩 키
  role: FieldRole;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  spec?: FieldSpec; // 각 Role별로 다른 구체 속성
}
```

## FieldSpec (예시)

- `Select`: `{ options: { label: string, value: any }[] }`
- `OTPInput`: `{ length: number }`
- `Slider`: `{ min: number, max: number, step?: number }`

## 규칙 (Rules)

1. Field는 자식을 가질 수 없습니다 (Leaf node).
2. Renderer는 모든 Field에 대해 일관된 레이아웃(Label + Input + Description)을 제공해야 합니다.
3. Native HTML Input의 한계를 극복하기 위해, Renderer는 가능한 한 Custom UI(예: Datepicker, Combobox Panel)를 직접 구현해야 합니다.