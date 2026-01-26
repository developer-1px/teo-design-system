# 디자인 시스템 아키텍처: Vanilla Extract로의 전환

우리는 **"One-Shot High-Fidelity Design"**무엇보다 중요하게 생각하며, 이를 위해 스타일링 도구의 선택은 단순한 취향을 넘어 AI 에이전트의 성능과 코드의 안정성을 결정짓는 핵심 요소입니다. 

우리의 아키텍처는 **"Vanilla-Native"** 원칙을 따릅니다. 이는 `Box`나 `Stack`과 같은 높은 추상화 레벨의 컴포넌트와 "props-as-styles" 패턴에서 벗어나, 표준 HTML5 요소와 플랫폼 네이티브 CSS(Vanilla Extract)로의 전환을 의미합니다.

## 1. 왜 Tailwind CSS가 아닌가? (AI의 역설)

Tailwind는 빠른 프로토타이핑에는 훌륭하지만, AI 기반의 고품질 디자인 시스템 구축에는 다음과 같은 한계가 있습니다:

*   **일관성 없는 템플릿화**: AI는 학습된 데이터의 평균적인 패턴을 따르는 경향이 있어, Tailwind를 사용하면 독창성 없는 "템플릿 같은" 디자인을 생성하기 쉽습니다.
*   **미세 제어의 어려움**: 1px 단위의 정교한 겹침(layering)이나 복잡한 그리드 오프셋을 구현하려면 `top-[-1.5px]`과 같은 임의의 값(arbitrary values)을 사용해야 하는데, 이는 코드 가독성을 해치고 유지보수를 어렵게 합니다.
*   **토큰과의 괴리**: Tailwind 유틸리티 클래스는 종종 프로젝트의 시맨틱 디자인 토큰(Surface/Intent)을 우회하여 하드코딩된 값을 사용하게 만듭니다.

## 2. Vanilla Extract: "Style-as-Code"와 AI Fidelity

우리는 **Vanilla Extract**를 선택하여 다음과 같은 이점을 확보합니다:

### 2.1 강력한 타입 안정성 (Type-Safe Fidelity)
Vanilla Extract는 TypeScript 기반의 **"Style-as-Code"**입니다. 
*   **AI 환각 방지**: `Recipes` API를 통해 정의된 변형(Variant)만을 허용함으로써, AI가 시스템에 존재하지 않는 스타일이나 값을 "환각(hallucinate)"하는 것을 방지합니다.
*   **엄격한 제약**: `variant: 'primary' | 'secondary'`와 같이 타입을 강제함으로써 디자인 시스템의 규칙을 코드로 보장합니다.

### 2.2 Zero-Runtime 퍼포먼스
*   빌드 타임에 정적인 CSS 파일을 생성하므로, 수백 개의 블록이 있는 복잡한 Visual CMS나 에디터 환경에서도 런타임 오버헤드 없이 고성능을 유지합니다.

### 2.3 AI 친화성 (AI Friendliness)
*   **네이티브 CSS 지식 활용**: AI는 본래 Raw CSS에 대한 방대한 지식을 가지고 있습니다. Vanilla Extract는 추상화된 유틸리티 대신 네이티브 CSS 속성(subgrid, mask-image 등)을 직접 다룰 수 있게 하여 AI의 잠재력을 극대화합니다.
*   **예측 가능한 DOM**: 표준 태그(`aside`, `main`)를 사용함으로써 DOM 구조가 의도(Intent)를 명확히 반영하도록 합니다.

## 3. 도구 비교 및 결정 매트릭스

| 특징 | Tailwind CSS | Vanilla Extract (선택) |
| :--- | :--- | :--- |
| **타입 안정성** | 낮음 (문자열 클래스 기반) | **높음 (TS 객체 기반)** |
| **제약 조건 강제** | 어려움 (임의 값 허용 쉬움) | **내장됨 (Recipes/Tokens)** |
| **런타임 오버헤드** | 없음 | **없음 (Static Extraction)** |
| **AI 적합성** | 중간 (환각 가능성 있음) | **최상 (타입으로 환각 방지)** |

**결론**: 우리는 디자인 시스템의 **"타입 안전한 고품질(Type-Safe Fidelity)"**을 보장하고, AI가 비즈니스 로직만큼이나 스타일도 엄격하게 다룰 수 있도록 하기 위해 **Vanilla Extract**를 표준으로 채택합니다.
