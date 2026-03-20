import { Box, Title, Text, Button, Card, Group, Stack } from '@mantine/core';
import { IconSparkles, IconClick } from '@tabler/icons-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showAction?: boolean;
  onAction?: () => void;
}

export function EmptyState({
  title = '开始创建',
  description = '从左侧选择模块开始创建你的 Soul',
  showAction = false,
  onAction,
}: EmptyStateProps) {
  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      style={{
        height: '100%',
        backgroundColor: 'var(--mantine-color-violet-0)',
      }}
    >
      <Stack
        justify="center"
        align="center"
        gap="lg"
        style={{ height: '100%', padding: '2rem' }}
      >
        {/* SVG 插图 */}
        <Box
          style={{
            width: '120px',
            height: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            viewBox="0 0 200 200"
            width="100"
            height="100"
            style={{ opacity: 0.8 }}
          >
            {/* 背景光晕 */}
            <circle cx="100" cy="100" r="80" fill="var(--mantine-color-violet-2)" opacity="0.3" />
            <circle cx="100" cy="100" r="60" fill="var(--mantine-color-violet-3)" opacity="0.2" />

            {/* 中心图标 - 抽象的灵魂/人格图标 */}
            <g transform="translate(100, 100)">
              {/* 头部 */}
              <circle cy="-20" r="25" fill="var(--mantine-color-violet-6)" />
              {/* 身体 */}
              <path
                d="M -30 10 Q -30 -10 0 -10 Q 30 -10 30 10 L 35 50 Q 0 60 -35 50 Z"
                fill="var(--mantine-color-violet-5)"
              />
              {/* 闪光效果 */}
              <polygon points="-45,-40 -35,-35 -40,-25 -30,-30 -20,-25 -25,-35 -15,-40" fill="var(--mantine-color-yellow-4)" />
              <polygon points="35,-30 42,-28 40,-20 48,-18 40,-15 42,-8 35,-12 28,-8 32,-18 25,-20 35,-22" fill="var(--mantine-color-yellow-3)" />
            </g>
          </svg>
        </Box>

        {/* 标题和描述 */}
        <Stack align="center" gap="xs">
          <Title order={4} style={{ textAlign: 'center' }}>
            {title}
          </Title>
          <Text size="sm" c="dimmed" style={{ textAlign: 'center', maxWidth: '280px' }}>
            {description}
          </Text>
        </Stack>

        {/* 操作按钮 */}
        {showAction && onAction && (
          <Button
            leftSection={<IconSparkles size={16} />}
            onClick={onAction}
            variant="gradient"
            gradient={{ from: 'violet', to: 'blue' }}
            size="md"
            radius="md"
          >
            开始创建你的第一个 Soul
          </Button>
        )}

        {/* 提示 */}
        <Group gap="xs" style={{ opacity: 0.6 }}>
          <IconClick size={14} />
          <Text size="xs" c="dimmed">
            点击左侧卡片选择模块
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
