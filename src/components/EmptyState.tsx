import { Box, Title, Text, Button, Card, Group, Stack, ThemeIcon } from '@mantine/core';
import { IconSparkles, IconClick } from '@tabler/icons-react';
import { useSoulStore } from '../store/soulStore';
import { useTranslation } from '../i18n';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showAction?: boolean;
  onAction?: () => void;
  // 新增：引导提示
  hint?: string;
}

export function EmptyState({
  title,
  description,
  showAction = false,
  onAction,
  hint,
}: EmptyStateProps) {
  const { language } = useSoulStore();
  const { t } = useTranslation();

  const defaultTitle = title || t('empty.startCreatingTitle');
  const defaultDesc = description || t('empty.startCreatingDesc');
  const defaultHint = hint || (language === 'zh' ? '点击左侧卡片选择模块' : 'Click cards on the left to select modules');

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
            {defaultTitle}
          </Title>
          <Text size="sm" c="dimmed" style={{ textAlign: 'center', maxWidth: '280px' }}>
            {defaultDesc}
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
            {language === 'zh' ? '开始创建你的第一个 Soul' : 'Start Creating Your First Soul'}
          </Button>
        )}

        {/* 提示 */}
        <Card padding="xs" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
          <Group gap="xs" justify="center">
            <ThemeIcon size="sm" radius="xl" variant="light" color="gray">
              <IconClick size={14} />
            </ThemeIcon>
            <Text size="sm" c="dimmed">
              {defaultHint}
            </Text>
          </Group>
        </Card>
      </Stack>
    </Card>
  );
}
