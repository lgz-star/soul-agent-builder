import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'violet',
  defaultRadius: 'md',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
});

// 创建一个会抛出错误的组件
const ThrowErrorComponent = () => {
  throw new Error('Test error');
};

// Mock window.matchMedia (Mantine 需要)
const matchMediaMock = vi.fn(() => ({
  matches: false,
  media: '',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// 包装器组件提供 Mantine 上下文
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MantineProvider theme={theme}>
      <ErrorBoundary>{ui}</ErrorBoundary>
    </MantineProvider>
  );
};

describe('ErrorBoundary', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      value: matchMediaMock,
      writable: true,
      configurable: true,
    });
    // 删除 window.location 以便重新定义
    delete (window as any).location;
    (window as any).location = { reload: vi.fn() };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // 恢复原始 window.location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('应该渲染子组件当没有错误时', () => {
    const { container } = render(
      <MantineProvider theme={theme}>
        <ErrorBoundary>
          <div data-testid="child">Normal Content</div>
        </ErrorBoundary>
      </MantineProvider>
    );

    expect(container.textContent).toContain('Normal Content');
  });

  it('应该捕获错误并显示错误界面', () => {
    // 禁用 console.error 以避免测试输出污染
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<ThrowErrorComponent />);

    expect(screen.getByText('出错了')).toBeInTheDocument();
    expect(screen.getByText('应用遇到了一个意外错误，请尝试刷新页面')).toBeInTheDocument();
    expect(screen.getByText('重试')).toBeInTheDocument();
    expect(screen.getByText('刷新页面')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('应该显示错误详情', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<ThrowErrorComponent />);

    expect(screen.getByText(/错误信息:/)).toBeInTheDocument();
    expect(screen.getByText(/Test error/)).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('应该支持重试功能', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    let shouldThrow = true;
    const ConditionalThrowComponent = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div data-testid="recovered">Recovered</div>;
    };

    const { getByText, getByTestId } = renderWithProviders(<ConditionalThrowComponent />);

    expect(screen.getByText('出错了')).toBeInTheDocument();

    // 点击重试
    shouldThrow = false;
    fireEvent.click(getByText('重试'));

    expect(getByTestId('recovered')).toBeInTheDocument();
    expect(screen.queryByText('出错了')).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('应该支持刷新页面功能', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<ThrowErrorComponent />);

    fireEvent.click(screen.getByText('刷新页面'));
    expect(window.location.reload).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('应该支持自定义 fallback UI', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MantineProvider theme={theme}>
        <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom Fallback</div>}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      </MantineProvider>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.queryByText('出错了')).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
