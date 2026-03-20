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
  CopyButton,
  Tooltip,
  ActionIcon,
  ScrollArea,
  Badge,
  Skeleton,
} from '@mantine/core';
import { IconCopy, IconCheck, IconDownload, IconShare } from '@tabler/icons-react';
import { useSoulStore } from '../store/soulStore';
import { MarkdownExporter, JsonExporter } from '../exporters';
import { EmptyState } from './EmptyState';

interface PreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewPanel({ isOpen, onClose }: PreviewPanelProps) {
  const { soul, setSoulName, setSoulDescription, exportToJson, generateShareLink } = useSoulStore();
  const [isShareModalOpen, setShareModalOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState('');

  const handleExportMarkdown = () => {
    if (!soul) return;
    const exporter = new MarkdownExporter();
    const content = exporter.export(soul);
    downloadFile(content, `${soul.name}.md`, 'text/markdown');
  };

  const handleExportJson = () => {
    try {
      const content = exportToJson();
      if (!soul) return;
      downloadFile(content, `${soul.name}.json`, 'application/json');
    } catch (error) {
      alert(error instanceof Error ? error.message : '导出失败');
    }
  };

  const handleShare = () => {
    const result = generateShareLink();
    if (result.error) {
      alert(result.error);
      return;
    }
    setShareUrl(result.url);
    setShareModalOpen(true);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <Title order={5}>预览</Title>
          <Group gap="xs">
            <Button size="xs" variant="light" leftSection={<IconShare size={14} />} onClick={handleShare}>
              分享
            </Button>
            <Button
              size="xs"
              variant="light"
              leftSection={<IconDownload size={14} />}
              onClick={handleExportMarkdown}
            >
              Markdown
            </Button>
            <Button
              size="xs"
              variant="light"
              leftSection={<IconDownload size={14} />}
              onClick={handleExportJson}
            >
              JSON
            </Button>
          </Group>
        </Group>

        {/* 元数据编辑 */}
        <Stack gap="md" mb="lg">
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
          <CopyButton value={shareUrl}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? '已复制' : '复制'} withArrow position="right">
                <ActionIcon
                  color={copied ? 'teal' : 'gray'}
                  variant={copied ? 'filled' : 'default'}
                  onClick={copy}
                  style={{ width: '100%', height: 'auto', padding: '12px' }}
                >
                  {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                  <Text size="xs" ml="xs" style={{ flex: 1, textAlign: 'left' }}>
                    {shareUrl.slice(0, 50)}...
                  </Text>
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
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
