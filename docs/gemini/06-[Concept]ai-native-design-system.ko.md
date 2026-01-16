# AI-Native 디자인 시스템 설계 (Designing an AI-Native Design System)

이 문서는 우리의 "4대 기둥 (Surface, Layout, Sizing, Behavior)" 시스템을 **AI의 이해와 코드 생성 능력**을 극대화하는 방향으로 설계하는 모델들을 탐구합니다.

**목표**: "성공의 구덩이(Pit of Success)"를 너무 넓게 파서, LLM이 자연스럽게 올바른 코드를 작성하도록 유도하는 것입니다. AI의 "환각(Hallucination)"을 줄이고 "의도(Intent)" 파악 능력을 높이는 것이 핵심입니다.

---

## 모델 1: "엄격한 분리" 모델 (The Strict Separation Model)
가장 "컴퓨터 공학적"인 접근법입니다. 속성들은 상호 배타적이고 순수하게 설명적입니다.

*   **철학**: "하나의 속성은 하나의 효과만." 매직이나 사이드 이펙트 금지.
*   **AI 이점**: 환각 감소. AI가 패딩을 원하면 `padding`을 찾습니다. 토큰이 제한된 CSS처럼 작동하므로 AI에게 익숙합니다.
*   **코드**:
    ```tsx
    <Frame
      // 1. Layout (위치 잡기)
      layout="row" gap="n4" distribute="between"
      // 2. Surface (칠하기)
      surface="card"
      // 3. Sizing (크기 잡기)
      w="full"
    />
    ```
*   **결론**: **정확성**에는 좋지만, **창의성**이나 **추상화**에는 약합니다. AI가 단순히 CSS 번역기처럼 작동하게 됩니다.

---

## 모델 2: "의도 기반" 모델 (The Intent-Based Model)
메커니즘(CSS)이 아닌 **설계 의도**로 그룹화합니다. LLM의 가장 큰 강점인 자연어 이해력을 활용합니다.

*   **철학**: "방법(How)이 아니라 대상(What)을 말하라."
*   **AI 이점**: 높은 의미적 일치. AI는 `shadow-lg`보다 `prominence="high"`(중요도 높음)라는 추상적 개념을 더 잘 이해하고 적절한 디자인을 제안할 수 있습니다.
*   **코드**:
    ```tsx
    <Frame
      // 의도: "리스트 아이템을 담는 통이야"
      role="list-item"
      prominence="high" // AI 추론: 그림자, 테두리, 밝은 배경 자동 적용
      layout="row-center"
    />
    ```
*   **결론**: **코드 생성**에 탁월합니다. "유저 리스트 만들어줘" 한마디면 고품질 UI가 나옵니다. 단점은 세밀한 제어(Fine-tuning)가 어려울 수 있습니다.

---

## 모델 3: "컨텍스트 주입" 모델 (The Context-Injection Model)
속성의 의미가 **위치**에 따라 변합니다. 인간 디자이너의 사고방식("테이블 안이니까 여기 패딩은 셀 패딩이지")을 모방합니다.

*   **철학**: "맥락이 기본값을 결정한다."
*   **AI 이점**: 토큰 효율성. AI는 최소한의 코드만 작성하면 됩니다. 기본값이 나머지를 처리하니까요.
*   **코드**:
    ```tsx
    <Table>
      <Row>
         {/* Row 내부이므로 자동으로 'cell' 스타일 적용 */}
        <Frame>Content</Frame>
      </Row>
    </Table>
    ```
*   **결론**: 강력하지만 AI에게 **높은 인지 부하**를 줍니다. AI가 깊은 문맥을 계속 추적해야 하며, "문맥 환각(Context Hallucination)" 위험이 있습니다.

---

## 하이브리드 제안: "서술형 시맨틱 (Descriptive Semantics)"
AI를 가장 잘 유도하기 위해 **모델 1(구조)**과 **모델 2(의도)**를 결합해야 합니다.

### AI를 위한 4대 기둥 재정의
각 기둥을 기능이 아니라, AI가 답해야 하는 **질문**으로 정의합니다.

1.  **Layout**: *"아이템들이 서로 어떤 관계인가?"*
    *   **AI 지침**: "`flow`를 사용하여 관계(나열, 쌓기, 격자)를 설명해라."
    *   **예시**: `flow="stack"`, `gap="connected"` (의미론적 간격).

2.  **Surface**: *"이 물체의 재질은 무엇인가?"*
    *   **AI 지침**: "`material`을 사용하여 물성(유리, 종이, 카드)을 설명해라."
    *   **예시**: `material="glass"`, `elevation="floating"`.

3.  **Sizing**: *"이것은 얼마나 공간을 차지하는가?"*
    *   **AI 지침**: "픽셀 대신 상대적 관계(채우기, 감싸기)를 사용해라."
    *   **예시**: `fit="hug"`, `fill="parent"`.

4.  **Behavior**: *"이것은 어떻게 반응하는가?"*
    *   **AI 지침**: "인터랙션 여부를 설명해라."
    *   **예시**: `pressable`, `scrollable`.

### AI 프롬프트 전략 예시
이 시스템이 구축되면, AI 시스템 프롬프트는 다음과 같이 단순해집니다:

> "UI를 4단계로 생각하여 구축하라:
> 1. **구조(Structure/Layout)**를 정의하고
> 2. **재질(Material/Surface)**을 입히고
> 3. **공간(Space/Sizing)**을 점유하고
> 4. **생명(Life/Behavior)**을 불어넣어라."

이러한 구조적 사고 과정(Chain-of-Thought)은 LLM의 추론 방식과 완벽하게 일치합니다.
