import React from 'react';
import {
  Box,
  Title,
  Text,
  Card,
  Stack,
  Divider,
  Group,
  Button,
  Modal,
  TextInput,
  Textarea,
  ScrollArea,
  Badge,
  Skeleton,
} from '@mantine/core';
import { IconCopy } from '@tabler/icons-react';
import { useSoulStore } from '../store/soulStore';
import { EmptyState } from './EmptyState';

export function PreviewPanel(): React.ReactElement {
  const { soul, setSoulName, setSoulDescription } = useSoulStore();
  const [isShareModalOpen, setShareModalOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  // 模拟加载状态
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // 监听打开分享弹窗的事件
  React.useEffect(() => {
    const handleOpenShareModal = (event: CustomEvent<{ url: string }>) => {
      setShareUrl(event.detail.url);
      setShareModalOpen(true);
    };

    window.addEventListener('open-share-modal', handleOpenShareModal as EventListener);
    return () => window.removeEventListener('open-share-modal', handleOpenShareModal as EventListener);
  }, []);

  // 分享链接复制（降级处理）
  const copyShareLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert('分享链接已复制到剪贴板！');
      } else {
        // 降级方案：创建临时 textarea
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('分享链接已复制到剪贴板！');
      }
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请手动复制链接');
    }
  };

  if (!soul) {
    return (
      <Card withBorder shadow="sm" radius="md" style={{ height: '100%' }}>
        <EmptyState />
      </Card>
    );
  }

  return (
    <>
      <Card withBorder shadow="sm" radius="md" style={{ height: '100%', overflow: 'auto' }}>
        <Group justify="space-between" mb="lg">
          <Title order={3}>预览</Title>
        </Group>

        {/* 元数据编辑 */}
        <Stack gap="md" mb="lg">
          {isLoading ? (
            <>
              <Skeleton height={36} radius="sm" />
              <Skeleton height={70} radius="sm" />
            </>
          ) : (
            <>
              <TextInput
                label="名称"
                value={soul.name}
                onChange={(e) => setSoulName(e.target.value)}
                placeholder="输入 Soul 名称"
              />
              <Textarea
                label="描述"
                value={soul.description || ''}
                onChange={(e) => setSoulDescription(e.target.value)}
                placeholder="输入 Soul 描述"
                minRows={2}
              />
            </>
          )}
        </Stack>

        <Divider my="md" />

        {/* 预览内容 */}
        <ScrollArea style={{ maxHeight: 'calc(100vh - 400px)' }}>
          <Box>
            <Text size="xs" c="dimmed" mb="xs">
              身份
            </Text>
            <Card padding="sm" withBorder mb="md">
              <Text size="sm">{soul.identity || '未选择'}</Text>
            </Card>

            <Text size="xs" c="dimmed" mb="xs">
              能力
            </Text>
            <Card padding="sm" withBorder mb="md">
              {soul.abilities.length > 0 ? (
                <Group wrap="wrap">
                  {soul.abilities.map((id) => (
                    <Badge key={id} variant="light">
                      {id}
                    </Badge>
                  ))}
                </Group>
              ) : (
                <Text c="dimmed" size="xs">
                  未选择
                </Text>
              )}
            </Card>

            <Text size="xs" c="dimmed" mb="xs">
              风格
            </Text>
            <Card padding="sm" withBorder mb="md">
              {soul.styles.length > 0 ? (
                <Group wrap="wrap">
                  {soul.styles.map((id) => (
                    <Badge key={id} variant="outline">
                      {id}
                    </Badge>
                  ))}
                </Group>
              ) : (
                <Text c="dimmed" size="xs">
                  未选择
                </Text>
              )}
            </Card>

            <Text size="xs" c="dimmed" mb="xs">
              流程
            </Text>
            <Card padding="sm" withBorder mb="md">
              {soul.flows.length > 0 ? (
                <ol>
                  {soul.flows
                    .sort((a, b) => a.order - b.order)
                    .map((flow) => (
                      <li key={flow.id}>
                        <Text size="sm">{flow.id}</Text>
                      </li>
                    ))}
                </ol>
              ) : (
                <Text c="dimmed" size="xs">
                  未选择
                </Text>
              )}
            </Card>

            {soul.knowledge && (
              <>
                <Text size="xs" c="dimmed" mb="xs">
                  知识
                </Text>
                <Card padding="sm" withBorder mb="md">
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {soul.knowledge}
                  </Text>
                </Card>
              </>
            )}

            <Text size="xs" c="dimmed" mb="xs">
              约束
            </Text>
            <Card padding="sm" withBorder mb="md">
              {soul.constraints.length > 0 ? (
                <Group wrap="wrap">
                  {soul.constraints.map((id) => (
                    <Badge key={id} color="red" variant="light">
                      {id}
                    </Badge>
                  ))}
                </Group>
              ) : (
                <Text c="dimmed" size="xs">
                  未选择
                </Text>
              )}
            </Card>

            <Text size="xs" c="dimmed" mb="xs">
              工具
            </Text>
            <Card padding="sm" withBorder>
              {soul.tools.length > 0 ? (
                <Group wrap="wrap">
                  {soul.tools.map((id) => (
                    <Badge key={id} color="blue" variant="light">
                      {id}
                    </Badge>
                  ))}
                </Group>
              ) : (
                <Text c="dimmed" size="xs">
                  未选择
                </Text>
              )}
            </Card>
          </Box>
        </ScrollArea>
      </Card>

      {/* 分享弹窗 */}
      <Modal
        opened={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="分享 Soul"
        size="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            复制链接发送给他人，他们可以直接导入这个 Soul
          </Text>
          <Button onClick={copyShareLink} variant="light" leftSection={<IconCopy size={18} />}>
            复制分享链接
          </Button>
          {shareUrl && (
            <Box>
              <Text size="xs" c="dimmed" mb="xs">
                链接预览：
              </Text>
              <Card padding="xs" withBorder style={{ wordBreak: 'break-all', backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <Text size="xs">{shareUrl}</Text>
              </Card>
            </Box>
          )}
          {shareUrl.length > 2000 && (
            <Text size="xs" c="orange">
              链接较长，某些平台可能会被截断
            </Text>
          )}
        </Stack>
      </Modal>
    </>
  );
}
