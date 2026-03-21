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
import { useTranslation } from '../i18n';
import {
  identityLibrary,
  abilityLibrary,
  styleLibrary,
  flowLibrary,
  constraintLibrary,
  toolLibrary,
} from '../i18n/libraries';

export function PreviewPanel(): React.ReactElement {
  const { soul, setSoulName, setSoulDescription, language } = useSoulStore();
  const { t } = useTranslation();
  const [isShareModalOpen, setShareModalOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  // 获取库条目的本地化名称
  const getLocalizedName = (id: string, library: { id: string; name: string | { zh: string; en: string } }[]): string => {
    const item = library.find((i) => i.id === id);
    return item ? (typeof item.name === 'object' ? item.name[language] : item.name) : id;
  };

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
        alert(language === 'zh' ? '分享链接已复制到剪贴板！' : 'Share link copied to clipboard!');
      } else {
        // 降级方案：创建临时 textarea
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert(language === 'zh' ? '分享链接已复制到剪贴板！' : 'Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('复制失败:', error);
      alert(language === 'zh' ? '复制失败，请手动复制链接' : 'Copy failed, please copy the link manually');
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
          <Title order={3}>{t('ui.preview')}</Title>
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
                label={t('layers.identity')}
                value={soul.name}
                onChange={(e) => setSoulName(e.target.value)}
                placeholder={language === 'zh' ? '输入 Soul 名称' : 'Enter Soul name'}
              />
              <Textarea
                label={language === 'zh' ? '描述' : 'Description'}
                value={soul.description || ''}
                onChange={(e) => setSoulDescription(e.target.value)}
                placeholder={language === 'zh' ? '输入 Soul 描述' : 'Enter Soul description'}
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
              {t('layers.identity')}
            </Text>
            <Card padding="sm" withBorder mb="md">
              <Text size="sm">{soul.identity ? getLocalizedName(soul.identity, identityLibrary) : t('status.notSelected')}</Text>
            </Card>

            <Text size="xs" c="dimmed" mb="xs">
              {t('layers.ability')}
            </Text>
            <Card padding="sm" withBorder mb="md">
              {soul.abilities.length > 0 ? (
                <Group wrap="wrap">
                  {soul.abilities.map((id) => (
                    <Badge key={id} variant="light">
                      {getLocalizedName(id, abilityLibrary)}
                    </Badge>
                  ))}
                </Group>
              ) : (
                <Text c="dimmed" size="xs">
                  {t('status.notSelected')}
                </Text>
              )}
            </Card>

            <Text size="xs" c="dimmed" mb="xs">
              {t('layers.style')}
            </Text>
            <Card padding="sm" withBorder mb="md">
              {soul.styles.length > 0 ? (
                <Group wrap="wrap">
                  {soul.styles.map((id) => (
                    <Badge key={id} variant="outline">
                      {getLocalizedName(id, styleLibrary)}
                    </Badge>
                  ))}
                </Group>
              ) : (
                <Text c="dimmed" size="xs">
                  {t('status.notSelected')}
                </Text>
              )}
            </Card>

            <Text size="xs" c="dimmed" mb="xs">
              {t('layers.flow')}
            </Text>
            <Card padding="sm" withBorder mb="md">
              {soul.flows.length > 0 ? (
                <ol>
                  {soul.flows
                    .sort((a, b) => a.order - b.order)
                    .map((flow) => (
                      <li key={flow.id}>
                        <Text size="sm">{getLocalizedName(flow.id, flowLibrary)}</Text>
                      </li>
                    ))}
                </ol>
              ) : (
                <Text c="dimmed" size="xs">
                  {t('status.notSelected')}
                </Text>
              )}
            </Card>

            {soul.knowledge && (
              <>
                <Text size="xs" c="dimmed" mb="xs">
                  {t('layers.knowledge')}
                </Text>
                <Card padding="sm" withBorder mb="md">
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {soul.knowledge}
                  </Text>
                </Card>
              </>
            )}

            <Text size="xs" c="dimmed" mb="xs">
              {t('layers.constraint')}
            </Text>
            <Card padding="sm" withBorder mb="md">
              {soul.constraints.length > 0 ? (
                <Group wrap="wrap">
                  {soul.constraints.map((id) => (
                    <Badge key={id} color="red" variant="light">
                      {getLocalizedName(id, constraintLibrary)}
                    </Badge>
                  ))}
                </Group>
              ) : (
                <Text c="dimmed" size="xs">
                  {t('status.notSelected')}
                </Text>
              )}
            </Card>

            <Text size="xs" c="dimmed" mb="xs">
              {t('layers.tool')}
            </Text>
            <Card padding="sm" withBorder>
              {soul.tools.length > 0 ? (
                <Group wrap="wrap">
                  {soul.tools.map((id) => (
                    <Badge key={id} color="blue" variant="light">
                      {getLocalizedName(id, toolLibrary)}
                    </Badge>
                  ))}
                </Group>
              ) : (
                <Text c="dimmed" size="xs">
                  {t('status.notSelected')}
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
        title={t('share.title')}
        size="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            {language === 'zh'
              ? '复制链接发送给他人，他们可以直接导入这个 Soul'
              : 'Copy the link and send it to others, they can import this Soul directly'}
          </Text>
          <Button onClick={copyShareLink} variant="light" leftSection={<IconCopy size={18} />}>
            {t('share.copyLink')}
          </Button>
          {shareUrl && (
            <Box>
              <Text size="xs" c="dimmed" mb="xs">
                {t('share.linkPreview')}
              </Text>
              <Card padding="xs" withBorder style={{ wordBreak: 'break-all', backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <Text size="xs">{shareUrl}</Text>
              </Card>
            </Box>
          )}
          {shareUrl.length > 2000 && (
            <Text size="xs" c="orange">
              {language === 'zh' ? '链接较长，某些平台可能会被截断' : 'Link is long, may be truncated on some platforms'}
            </Text>
          )}
        </Stack>
      </Modal>
    </>
  );
}
