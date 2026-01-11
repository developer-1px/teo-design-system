# Field Specification

Field는 사용자로부터 데이터를 입력받는 Element입니다. 

## FieldRole

| Role | 설명 |
|------|------|
| `TextInput` | 단일 행 텍스트 |
| `TextArea` | 다중 행 텍스트 |
| `NumberInput` | 숫자 입력 |
| `PasswordInput` | 비밀번호 |
| `Select` | 드롭다운 선택 |
| `Combobox` | 검색 가능 선택 |
| `Checkbox` | 체크박스 |
| `Switch` | 토글 스위치 |
| `RadioGroup` | 라디오 그룹 |
| `DateInput` | 날짜 선택 |
| `TimeInput` | 시간 선택 |
| `FileInput` | 파일 업로드 |
| `Slider` | 슬라이더 조절 |
| `OTPInput` | 인증번호 입력 |

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