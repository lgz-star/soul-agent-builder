import React from 'react';
import { Box, Title, Text } from '@mantine/core';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = '开始创建',
  description = '从左侧选择模块开始创建你的 Soul',
  icon,
}: EmptyStateProps) {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '200px',
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--mantine-color-dimmed)',
      }}
    >
      {icon && <Box mb="lg">{icon}</Box>}
      <Title order={4} mb="xs">
        {title}
      </Title>
      <Text size="sm" c="dimmed">
        {description}
      </Text>
    </Box>
  );
}
