/**
 * Keyboard utility functions for headless components
 *
 * ARIA 키보드 패턴 구현을 위한 유틸리티
 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
 */

/**
 * 키보드 키 상수
 */
export const Keys = {
  Space: ' ',
  Enter: 'Enter',
  Escape: 'Escape',
  Backspace: 'Backspace',
  Delete: 'Delete',
  ArrowLeft: 'ArrowLeft',
  ArrowUp: 'ArrowUp',
  ArrowRight: 'ArrowRight',
  ArrowDown: 'ArrowDown',
  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
  Tab: 'Tab',
} as const;

/**
 * 방향키 타입
 */
export type ArrowKey = 'ArrowLeft' | 'ArrowUp' | 'ArrowRight' | 'ArrowDown';

/**
 * 방향키인지 확인
 */
export function isArrowKey(key: string): key is ArrowKey {
  return ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(key);
}

/**
 * 텍스트 입력 키인지 확인 (문자, 숫자, 특수문자 등)
 */
export function isTypingKey(event: KeyboardEvent | React.KeyboardEvent): boolean {
  // 수정 키(Ctrl, Alt, Meta)와 함께 눌린 경우 제외
  if (event.ctrlKey || event.altKey || event.metaKey) {
    return false;
  }

  // 특수 키 제외
  if (
    event.key === 'Tab' ||
    event.key === 'Enter' ||
    event.key === 'Escape' ||
    event.key === 'Backspace' ||
    event.key === 'Delete' ||
    isArrowKey(event.key)
  ) {
    return false;
  }

  // 단일 문자 키만 허용
  return event.key.length === 1;
}

/**
 * 수평 내비게이션 키 처리 (좌/우 화살표)
 */
export function handleHorizontalNavigation(
  event: React.KeyboardEvent,
  handlers: {
    onPrevious?: () => void;
    onNext?: () => void;
    onFirst?: () => void;
    onLast?: () => void;
  }
): boolean {
  switch (event.key) {
    case Keys.ArrowLeft:
      handlers.onPrevious?.();
      return true;
    case Keys.ArrowRight:
      handlers.onNext?.();
      return true;
    case Keys.Home:
      handlers.onFirst?.();
      return true;
    case Keys.End:
      handlers.onLast?.();
      return true;
    default:
      return false;
  }
}

/**
 * 수직 내비게이션 키 처리 (위/아래 화살표)
 */
export function handleVerticalNavigation(
  event: React.KeyboardEvent,
  handlers: {
    onPrevious?: () => void;
    onNext?: () => void;
    onFirst?: () => void;
    onLast?: () => void;
  }
): boolean {
  switch (event.key) {
    case Keys.ArrowUp:
      handlers.onPrevious?.();
      return true;
    case Keys.ArrowDown:
      handlers.onNext?.();
      return true;
    case Keys.Home:
      handlers.onFirst?.();
      return true;
    case Keys.End:
      handlers.onLast?.();
      return true;
    default:
      return false;
  }
}

/**
 * 선택 키 처리 (Enter, Space)
 */
export function isSelectionKey(key: string): boolean {
  return key === Keys.Enter || key === Keys.Space;
}

/**
 * Type-ahead 검색용 키 버퍼
 * 사용자가 입력한 문자들을 일정 시간 동안 모아서 검색에 사용
 */
export class TypeaheadBuffer {
  private buffer = '';
  private timeout: ReturnType<typeof setTimeout> | null = null;
  private readonly clearDelay = 500; // 500ms 후 버퍼 초기화

  /**
   * 문자 추가 및 검색 콜백 실행
   */
  public append(char: string, onSearch: (query: string) => void): void {
    // 이전 타이머 취소
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // 버퍼에 추가
    this.buffer += char.toLowerCase();

    // 검색 실행
    onSearch(this.buffer);

    // 일정 시간 후 버퍼 초기화
    this.timeout = setTimeout(() => {
      this.buffer = '';
    }, this.clearDelay);
  }

  /**
   * 버퍼 즉시 초기화
   */
  public clear(): void {
    this.buffer = '';
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}
