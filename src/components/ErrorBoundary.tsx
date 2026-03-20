import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * 全局错误边界组件
 *
 * 捕获子组件树中的 JavaScript 错误，显示友好的错误页面
 * 防止整个应用白屏，提供恢复选项
 *
 * 注意：错误边界内部不使用任何 Mantine 组件，避免 Mantine 本身出错时导致边界失效
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
    errorInfo: undefined,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });

    // 在生产环境，可以上报到错误监控服务
    // if (process.env.NODE_ENV === 'production') {
    //   reportErrorToSentry(error, errorInfo);
    // }
  }

  public handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 使用纯 HTML 和内联样式，避免依赖可能出错的 UI 库
      return (
        <div style={{
          marginTop: '2rem',
          maxWidth: '600px',
          margin: '2rem auto',
          padding: '2rem',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <h2 style={{
            color: '#d32f2f',
            margin: '0 0 1rem 0',
            fontSize: '1.5rem',
          }}>
            出错了
          </h2>
          <p style={{
            color: '#666',
            margin: '0 0 1rem 0',
            fontSize: '1rem',
            textAlign: 'center',
          }}>
            应用遇到了一个意外错误，请尝试刷新页面
          </p>

          {this.state.error && (
            <div style={{
              backgroundColor: '#ffebee',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              maxWidth: '100%',
            }}>
              <div style={{
                fontWeight: 500,
                marginBottom: '0.5rem',
                color: '#c62828',
              }}>
                错误信息:
              </div>
              <code style={{
                display: 'block',
                backgroundColor: '#fff',
                padding: '0.5rem',
                borderRadius: '2px',
                border: '1px solid #ffcdd2',
                color: '#c62828',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {this.state.error.toString()}
              </code>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#7c4dff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              重试
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #bdbdbd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
