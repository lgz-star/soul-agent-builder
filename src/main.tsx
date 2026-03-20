import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App';

const theme = createTheme({
  primaryColor: 'violet',
  defaultRadius: 'md',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
});

// 添加全局焦点环样式，确保键盘导航可见
const globalStyles = `
  :focus-visible {
    outline: 2px solid var(--mantine-color-violet-filled);
    outline-offset: 2px;
  }
`;

// 注入全局样式
const styleElement = document.createElement('style');
styleElement.textContent = globalStyles;
document.head.appendChild(styleElement);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
