import React from 'react';
import { Box, Grid, Paper, ThemeIcon, Text, Group, Stack, Menu, ActionIcon, Title, Button } from '@mantine/core';
import {
  IconBrain,
  IconBook,
  IconDownload,
  IconShare,
  IconFileCode,
  IconMarkdown,
  IconRobot,
  IconLanguage,
  IconSettings,
  IconSparkles,
} from '@tabler/icons-react';
import { useSoulStore } from './store/soulStore';
import { ModuleLibrary } from './components/ModuleLibrary';
import { TemplateGallery } from './components/TemplateGallery';
import { AIGenerateModal } from './components/AIGenerateModal';
import { SettingsModal } from './components/SettingsModal';
import { BuilderZone } from './components/BuilderZone';
import { PreviewPanel } from './components/PreviewPanel';
import { ClaudeCodeExporter } from './exporters/ClaudeCodeExporter';
import { useTranslation } from './i18n';

function App() {
  const { ui, setPreviewOpen, soul, exportToJson, language, setLanguage } = useSoulStore();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = React.useState(false);
  const [expandedModule, setExpandedModule] = React.useState<string | null>('identity');
  const [templateGalleryExpanded, setTemplateGalleryExpanded] = React.useState(true);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [aiGenerateOpen, setAIGenerateOpen] = React.useState(false);

  // 处理模块展开/折叠
  const handleModuleToggle = (moduleKey: string) => {
    setExpandedModule(prev => prev === moduleKey ? null : moduleKey);
  };

  // 语言切换
  const handleLanguageToggle = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  // 打开设置
  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  // 打开 AI 生成
  const handleAIGenerateOpen = () => {
    const config = useSoulStore.getState().getLLMConfig();
    if (!config || !config.apiKey || !config.baseURL || !config.model) {
      setSettingsOpen(true);
    } else {
      setAIGenerateOpen(true);
    }
  };

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

${language === 'zh' ? '## 身份' : '## Identity'}
${soulData.identity || (language === 'zh' ? '未设置' : 'Not set')}

${language === 'zh' ? '## 能力' : '## Abilities'}
${soulData.abilities?.map((a: string) => `- ${a}`).join('\n') || (language === 'zh' ? '未设置' : 'Not set')}

${language === 'zh' ? '## 风格' : '## Styles'}
${soulData.styles?.map((s: string) => `- ${s}`).join('\n') || (language === 'zh' ? '未设置' : 'Not set')}

${language === 'zh' ? '## 流程' : '## Flows'}
${soulData.flows?.map((f: { id: string; order?: number }) => `- ${f.id}`).join('\n') || (language === 'zh' ? '未设置' : 'Not set')}

${language === 'zh' ? '## 知识' : '## Knowledge'}
${soulData.knowledge || (language === 'zh' ? '未设置' : 'Not set')}

${language === 'zh' ? '## 约束' : '## Constraints'}
${soulData.constraints?.map((c: string) => `- ${c}`).join('\n') || (language === 'zh' ? '未设置' : 'Not set')}

${language === 'zh' ? '## 工具' : '## Tools'}
${soulData.tools?.map((t: string) => `- ${t}`).join('\n') || (language === 'zh' ? '未设置' : 'Not set')}
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

  const handleExportClaudeCode = () => {
    try {
      if (!soul) return;
      const exporter = new ClaudeCodeExporter();
      const md = exporter.export(soul, language);
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CLAUDE.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出 CLAUDE.md 失败:', error);
    }
  };

  const handleShare = () => {
    try {
      const result = useSoulStore.getState().generateShareLink();
      if (result.error) {
        console.error('生成分享链接失败:', result.error);
        alert(result.error);
        return;
      }
      if (!result.url) {
        alert('生成分享链接失败');
        return;
      }
      // 打开预览面板并显示分享弹窗
      setPreviewOpen(true);
      // 使用自定义事件通知 PreviewPanel 打开分享弹窗
      window.dispatchEvent(new CustomEvent('open-share-modal', { detail: { url: result.url } }));
    } catch (error) {
      console.error('分享失败:', error);
      alert('分享失败，请重试');
    }
  };

  const hasContent = soul && (
    soul.identity ||
    soul.abilities.length > 0 ||
    soul.styles.length > 0
  );

  // 左侧模块列表配置
  const leftModules = [
    { key: 'identity' as const, title: t('layers.identity'), inputType: 'single' as const },
    { key: 'ability' as const, title: t('layers.ability'), inputType: 'multi' as const },
    { key: 'style' as const, title: t('layers.style'), inputType: 'multi' as const },
    { key: 'flow' as const, title: t('layers.flow'), inputType: 'sort' as const },
    { key: 'constraint' as const, title: t('layers.constraint'), inputType: 'multi' as const },
    { key: 'tool' as const, title: t('layers.tool'), inputType: 'multi' as const },
  ];

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
              <Title order={1} fw={600} size="xl">
                {t('ui.title')}
              </Title>
              <Text size="sm" c="dimmed" mt={2}>
                {t('ui.subtitle')}
              </Text>
            </div>
          </Group>
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={handleSettingsOpen}
              title={t('settings.title')}
              style={{ width: '44px', height: '44px' }}
            >
              <IconSettings size={18} />
            </ActionIcon>
            <Button
              variant="gradient"
              gradient={{ from: 'violet', to: 'purple' }}
              size="md"
              leftSection={<IconSparkles size={18} />}
              onClick={handleAIGenerateOpen}
            >
              {language === 'zh' ? 'AI 生成' : 'AI Generate'}
            </Button>
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={handleLanguageToggle}
              title={language === 'zh' ? 'Switch to English' : '切换到中文'}
              style={{ width: '44px', height: '44px' }}
            >
              <IconLanguage size={18} />
              <span style={{ fontSize: '9px', marginLeft: '2px' }}>{language === 'zh' ? '中' : 'EN'}</span>
            </ActionIcon>
            {hasContent && (
              <>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon variant="light" color="violet" size="xl" title={t('ui.export')} style={{ width: '44px', height: '44px' }}>
                      <IconDownload size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<IconFileCode size={18} />} onClick={handleExportJson}>
                      {t('export.json')}
                    </Menu.Item>
                    <Menu.Item leftSection={<IconMarkdown size={18} />} onClick={handleExportMarkdown}>
                      {t('export.markdown')}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item leftSection={<IconRobot size={18} />} onClick={handleExportClaudeCode}>
                      {t('export.claude')}
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                <ActionIcon variant="light" color="blue" size="xl" onClick={handleShare} title={t('ui.share')} style={{ width: '44px', height: '44px' }}>
                  <IconShare size={20} />
                </ActionIcon>
              </>
            )}
            {isMobile && (
              <ThemeIcon
                color={ui.isPreviewOpen ? 'violet' : 'gray'}
                variant={ui.isPreviewOpen ? 'filled' : 'light'}
                onClick={() => setPreviewOpen(!ui.isPreviewOpen)}
                size="xl"
                style={{ width: '44px', height: '44px' }}
              >
                <IconBook size={20} />
              </ThemeIcon>
            )}
          </Group>
        </Group>
      </Paper>

      {/* 主内容区 */}
      <Grid gutter="md" style={{ padding: '1rem', height: 'calc(100vh - 80px)' }}>
        {/* 左侧：模块库 - 桌面端显示全部，移动端隐藏 */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Stack gap="md" style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }}>
            {/* 模板画廊 */}
            <TemplateGallery
              isExpanded={templateGalleryExpanded}
              onToggle={() => setTemplateGalleryExpanded(prev => !prev)}
            />
            {/* 模块库 */}
            {leftModules.map((module) => (
              <ModuleLibrary
                key={module.key}
                layerType={module.key}
                title={module.title}
                inputType={module.inputType}
                isExpanded={expandedModule === module.key}
                onToggle={() => handleModuleToggle(module.key)}
              />
            ))}
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
          <PreviewPanel />
        </Grid.Col>
      </Grid>

      {/* 设置面板 */}
      <SettingsModal opened={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* AI 生成对话框 */}
      <AIGenerateModal opened={aiGenerateOpen} onClose={() => setAIGenerateOpen(false)} />
    </Box>
  );
}

export default App;
