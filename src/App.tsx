import React from 'react';
import { Box, Grid, Paper, ThemeIcon, Text, Group, Stack, Button, Menu, ActionIcon } from '@mantine/core';
import {
  IconUser,
  IconBrain,
  IconPalette,
  IconWorkflow,
  IconBook,
  IconShield,
  IconTools,
  IconDownload,
  IconShare,
  IconFileCode,
  IconMarkdown,
} from '@tabler/icons-react';
import { useSoulStore } from './store/soulStore';
import { ModuleLibrary } from './components/ModuleLibrary';
import { BuilderZone } from './components/BuilderZone';
import { PreviewPanel } from './components/PreviewPanel';

function App() {
  const { ui, setPreviewOpen, soul, exportToJson, generateShareLink } = useSoulStore();
  const [isMobile, setIsMobile] = React.useState(false);

  // 响应式检测
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 导出处理函数
  const handleExportJson = () => {
    try {
      const json = exportToJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `soul-${soul?.name || 'export'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出 JSON 失败:', error);
    }
  };

  const handleExportMarkdown = () => {
    try {
      const json = exportToJson();
      const soulData = JSON.parse(json);
      const md = `# ${soulData.name || 'Soul'}

## 身份
${soulData.identity || '未设置'}

## 能力
${soulData.abilities?.map((a: string) => `- ${a}`).join('\n') || '未设置'}

## 风格
${soulData.styles?.map((s: string) => `- ${s}`).join('\n') || '未设置'}

## 流程
${soulData.flows?.map((f: { id: string; order?: number }) => `- ${f.id}`).join('\n') || '未设置'}

## 知识
${soulData.knowledge || '未设置'}

## 约束
${soulData.constraints?.map((c: string) => `- ${c}`).join('\n') || '未设置'}

## 工具
${soulData.tools?.map((t: string) => `- ${t}`).join('\n') || '未设置'}
`;
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `soul-${soul?.name || 'export'}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出 Markdown 失败:', error);
    }
  };

  const handleShare = () => {
    try {
      const { url, error } = generateShareLink();
      if (error) {
        console.error('生成分享链接失败:', error);
        return;
      }
      if (url && navigator.clipboard) {
        navigator.clipboard.writeText(url);
        alert('分享链接已复制到剪贴板！');
      }
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  const hasContent = soul && (
    soul.identity ||
    soul.abilities.length > 0 ||
    soul.styles.length > 0
  );

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-gray-0)' }}>
      {/* 顶部导航栏 */}
      <Paper shadow="sm" p="md" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <Group justify="space-between">
          <Group>
            <ThemeIcon color="violet" size="lg" radius="md">
              <IconBrain size={20} />
            </ThemeIcon>
            <div>
              <Text fw={600} size="lg">
                Soul & Agent 构建器
              </Text>
              <Text size="xs" c="dimmed">
                通过拖拽创建你的 AI 人格
              </Text>
            </div>
          </Group>
          <Group gap="xs">
            {hasContent && (
              <>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon variant="light" color="violet" size="lg" title="导出">
                      <IconDownload size={18} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<IconFileCode size={18} />} onClick={handleExportJson}>
                      导出 JSON
                    </Menu.Item>
                    <Menu.Item leftSection={<IconMarkdown size={18} />} onClick={handleExportMarkdown}>
                      导出 Markdown
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                <ActionIcon variant="light" color="blue" size="lg" onClick={handleShare} title="分享">
                  <IconShare size={18} />
                </ActionIcon>
              </>
            )}
            {isMobile && (
              <ThemeIcon
                color={ui.isPreviewOpen ? 'violet' : 'gray'}
                variant={ui.isPreviewOpen ? 'filled' : 'light'}
                onClick={() => setPreviewOpen(!ui.isPreviewOpen)}
              >
                <IconBook size={18} />
              </ThemeIcon>
            )}
          </Group>
        </Group>
      </Paper>

      {/* 主内容区 */}
      <Grid gutter="md" style={{ padding: '1rem', height: 'calc(100vh - 80px)' }}>
        {/* 左侧：模块库 - 桌面端显示全部，移动端隐藏 */}
        <Grid.Col span={{ base: 12, md: 3 }} style={{ display: isMobile && ui.isPreviewOpen ? 'none' : 'block' }}>
          <Stack gap="md" style={{ maxHeight: '100%', overflow: 'auto' }}>
            <ModuleLibrary layerType="identity" title="身份" inputType="single" />
            <ModuleLibrary layerType="ability" title="能力" inputType="multi" />
            <ModuleLibrary layerType="style" title="风格" inputType="multi" />
          </Stack>
        </Grid.Col>

        {/* 中间：构建区 */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <BuilderZone onOpenPreview={() => setPreviewOpen(true)} />
        </Grid.Col>

        {/* 右侧：预览面板 - 桌面端常显，移动端可切换 */}
        <Grid.Col
          span={{ base: 12, md: 4 }}
          style={{ display: isMobile && !ui.isPreviewOpen ? 'none' : 'block' }}
        >
          <PreviewPanel
            isOpen={ui.isPreviewOpen}
            onClose={() => setPreviewOpen(false)}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default App;
