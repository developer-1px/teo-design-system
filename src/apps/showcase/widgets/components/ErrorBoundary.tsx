/**
 * ErrorBoundary - React 렌더링 에러 방어
 *
 * 컴포넌트 렌더링 중 발생하는 에러를 잡아서 UI를 표시합니다.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Block } from '@/components/types/Block/Block.tsx';
import { Text } from '@/components/types/Atom/Text/Text';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Component error caught:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // children이 변경되면 에러 상태 초기화
    if (prevProps.children !== this.props.children) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <Block role="Container" prominence="Standard" className="p-6 rounded-lg bg-surface">
          <Block role="Container" gap={2}>
            <Text role="Title" prominence="Strong" intent="Critical" content="렌더링 에러" />
            <Text
              role="Body"
              prominence="Standard"
              intent="Critical"
              content={this.state.error.message}
            />

            {this.state.errorInfo && (
              <Block role="Container" gap={1} className="mt-4">
                <Text
                  role="Label"
                  prominence="Standard"
                  intent="Neutral"
                  content="Component Stack:"
                />
                <pre className="text-xs text-muted bg-surface-sunken p-3 rounded overflow-auto max-h-48">
                  {this.state.errorInfo.componentStack}
                </pre>
              </Block>
            )}

            {this.state.error.stack && (
              <Block role="Container" gap={1} className="mt-2">
                <Text role="Label" prominence="Standard" intent="Neutral" content="Error Stack:" />
                <pre className="text-xs text-muted bg-surface-sunken p-3 rounded overflow-auto max-h-48">
                  {this.state.error.stack}
                </pre>
              </Block>
            )}
          </Block>
        </Block>
      );
    }

    return this.props.children;
  }
}
