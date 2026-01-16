# 레이아웃 용어 벤치마킹: "Pack" vs 타 프레임워크

질문: *"Pack이라는 용어가 괜찮은가요? Justify보다 짧아서 좋은데, 다른 곳에선 어떻게 쓰는지 궁금합니다."*

## 1. 업계 표준 비교 (Industry Standard Comparison)

현대적인 UI 프레임워크들이 메인 축(Main Axis) 정렬을 어떻게 부르는지 조사했습니다.

| 프레임워크 | 메인 축 (흐름 방향) | 교차 축 (수직 방향) | 비고 |
| :--- | :--- | :--- | :--- |
| **Figma** | **Spacing Mode** (Packed / Space Between) | **Alignment** | "Packed"는 Figma의 핵심 용어입니다. |
| **CSS Flexbox** | `justify-content` | `align-items` | 웹 표준 용어입니다. |
| **SwiftUI** | (Spacer로 처리) | `alignment` | `justify` 속성이 없고 `Spacer()` 뷰를 넣어 밉니다. |
| **Jetpack Compose** | `horizontalArrangement` | `verticalAlignment` | 매우 명시적이지만 이름이 깁니다. |
| **Flutter** | `mainAxisAlignment` | `crossAxisAlignment` | 매우 명시적이지만 이름이 깁니다. |
| **GTK / QT**| `pack_start`, `pack_end` | `align` | 고전 데스크탑 GUI(리눅스 등)에서 "Packing"을 사용했습니다. |

---

## 2. "Pack" 용어 분석

### 장점 (Pros)
1.  **Figma와 직접 매핑**: Figma는 기본 상태를 명시적으로 **"Packed"**라고 부릅니다.
    - *UI 패널:* "Spacing Mode: Packed" vs "Space Between".
2.  **짧고 강렬함**: `pack`(4글자) vs `justify`(7글자) vs `arrangement`(11글자).
3.  **동사적 직관성**: "아이템을 시작점으로 챙겨 넣다(Pack inside)"라는 뉘앙스가 있습니다.

### 단점 (Cons)
1.  **웹 표준 아님**: CSS 개발자에게는 `justify`가 익숙합니다.
2.  **모바일(iOS)과 다름**: SwiftUI 등의 모바일 진영에서는 쓰지 않는 용어입니다.

## 3. 결론 (Verdict)

**"Pack"은 *Figma 중심* 디자인 시스템에서 탁월한 선택입니다.**

CSS 표준은 `justify`이지만, 사용자님의 목표는 **디자인(Figma)과 코드의 멘탈 모델 일치**입니다.
- Figma가 "Packed"라는 용어를 공식적으로 사용하므로, **`pack`을 사용하는 것이 CSS 용어보다 오히려 더 "설계 의도"에 부합**합니다.
- `justify-content`나 `main-axis-alignment` 같은 긴 이름의 피로도를 줄여주는 실용적인 장점도 강력합니다.

**추천:** **`pack`을 그대로 사용하세요.** 웹 표준은 아니지만, Figma-to-Code 맥락에서는 가장 논리적이고 효율적인 이름입니다.
