import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Text, Title, Container, Paper, Stack, Code } from '@mantine/core';

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

      return (
        <Container size="md" style={{ marginTop: '2rem' }}>
          <Paper shadow="md" padding="xl" radius="md" withBorder>
            <Stack align="center" gap="md">
              <Title order={2} c="red">
                出错了
              </Title>
              <Text size="lg" c="dimmed" ta="center">
                应用遇到了一个意外错误，请尝试刷新页面
              </Text>

              {this.state.error && (
                <Paper
                  bg="red.0"
                  p="md"
                  radius="sm"
                  style={{ width: '100%', maxWidth: '500px' }}
                >
                  <Text size="sm" fw={500} mb="xs">
                    错误信息:
                  </Text>
                  <Code block c="red.9">
                    {this.state.error.toString()}
                  </Code>
                </Paper>
              )}

              <Stack gap="sm" mt="md">
                <Button onClick={this.handleReset} variant="filled" color="violet">
                  重试
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  color="gray"
                >
                  刷新页面
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
