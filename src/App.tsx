import React from 'react';
import { Box, Grid, Paper, ThemeIcon, Text, Group, Stack } from '@mantine/core';
import {
  IconUser,
  IconBrain,
  IconPalette,
  IconWorkflow,
  IconBook,
  IconShield,
  IconTools,
} from '@tabler/icons-react';
import { useSoulStore } from './store/soulStore';
import { ModuleLibrary } from './components/ModuleLibrary';
import { BuilderZone } from './components/BuilderZone';
import { PreviewPanel } from './components/PreviewPanel';

function App() {
  const { ui, setPreviewOpen } = useSoulStore();
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
