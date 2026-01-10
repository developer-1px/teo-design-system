/**
 * Field Type Definitions
 */

import type { AsProp, Density, Intent, Prominence } from '../../Shared.types';

/**
 * Field Role - 필드의 UI 렌더링 방식
 * v2.0: role + type + value 일관성 체계 도입
 */
export type FieldRole =
    | 'Input' // 텍스트 입력 (text, email, password, url, tel)
    | 'Textarea' // 여러 줄 텍스트
    | 'Select' // 드롭다운 선택
    | 'Radio' // 라디오 버튼 그룹
    | 'Checkbox' // 체크박스 그룹
    | 'Switch' // 토글 스위치
    | 'Slider' // 슬라이더 (range)
    | 'ColorPicker' // 색상 선택기
    | 'DatePicker' // 날짜 선택기
    | 'Rating' // 별점
    | 'FilePicker'; // 파일 업로드

/**
 * Field Type - 필드의 데이터 타입/검증 규칙
 * v1.0.1: 14개 타입 추가
 * v2.0: FieldDataType → FieldType으로 rename (role + type + value 일관성)
 */
export type FieldType =
    | 'text'
    | 'number'
    | 'currency' // v1.0.1
    | 'date'
    | 'datetime' // v1.0.1
    | 'boolean'
    | 'select'
    | 'multiselect' // v1.0.1
    | 'radio' // v1.0.1
    | 'checkbox' // v1.0.1
    | 'textarea' // v1.0.1
    | 'richtext' // v1.0.1
    | 'image'
    | 'file' // v1.0.1
    | 'password'
    | 'email' // v1.0.1
    | 'url' // v1.0.1
    | 'phone' // v1.0.1
    | 'color' // v1.0.1
    | 'rating' // v1.0.1
    | 'range'; // v1.0.1

/**
 * Field Constraints - 유효성 검사 규칙
 * v1.0.1 추가
 */
export interface FieldConstraints {
    min?: number; // number, date, range
    max?: number; // number, date, range
    minLength?: number; // text, textarea
    maxLength?: number; // text, textarea
    pattern?: string; // regex pattern
    patternMessage?: string; // pattern 실패 시 메시지
    custom?: string; // 커스텀 validator 함수명
}

/**
 * Field Option - select/radio/checkbox용 선택지
 * v1.0.1: disabled, icon 추가
 */
export interface FieldOption {
    label: string;
    value: string | number | boolean;
    disabled?: boolean;
    icon?: string;
}

/**
 * Field Props - 데이터 바인딩 (View/Edit 모드)
 * v1.0.1: constraints, dependsOn, modeOverride 추가
 * v2.0: role + type + value 일관성 체계 (dataType → type, role 추가)
 */
export interface FieldProps extends AsProp {
    // IDDL Core (v2.0)
    role?: FieldRole; // UI 렌더링 방식 (optional, type에서 추론 가능)
    type: FieldType; // 데이터 타입/검증 규칙 (v2.0: dataType → type)

    // Data Definition
    label: string;
    model: string;

    // Styling
    prominence?: Prominence;
    intent?: Intent;
    density?: Density; // v2.0: 추가 (일관성)
    /**
     * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
     * 예: 색상 인디케이터, 차트 색상, 데이터 기반 배경색
     * 정적 스타일은 반드시 role을 통해 정의해야 함
     */
    className?: string;

    // Constraints
    required?: boolean;
    options?: FieldOption[]; // For select/radio/checkbox type
    constraints?: FieldConstraints; // v1.0.1

    // Dependencies
    dependsOn?: string; // v1.0.1

    // View/Edit Config
    placeholder?: string;
    modeOverride?: 'view' | 'edit'; // v1.0.1
    clearable?: boolean; // v1.0.2: 입력 내용 지우기 버튼 표시
    hidden?: boolean;
    condition?: string; // v1.0.1: 조건부 렌더링
    disabled?: boolean; // v1.0.2: 비활성화 상태

    // Controlled Component (React)
    value?: any; // v1.0.2: controlled value
    onChange?: (e: any) => void; // v1.0.2: onChange handler
}
