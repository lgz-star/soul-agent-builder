import React, { useMemo, useCallback, useState } from 'react';
import {
  Box,
  Title,
  Text,
  ScrollArea,
  Card,
  Group,
  Badge,
  ActionIcon,
  Collapse,
  SimpleGrid,
  Tabs,
  Center,
} from '@mantine/core';
import { IconDownload, IconX, IconSearch } from '@tabler/icons-react';
import { useSoulStore } from '../store/soulStore';
import type { SoulTemplate, TemplateCategory } from '../data/templates';
import { templates, templateCategories } from '../data/templates';
import { getTranslations } from '../i18n';

interface TemplateGalleryProps {
  isExpanded: boolean;
  onToggle: () => void;
}

// 类别颜色映射
const categoryColors: Record<TemplateCategory, string> = {
  frontend: 'blue',
  backend: 'green',
  ai: 'violet',
  data: 'cyan',
  devops: 'orange',
};

// 类别图标映射
const categoryIcons: Record<TemplateCategory, JSX.Element> = {
  frontend: <span style={{ fontSize: '10px', fontWeight: 700 }}>FE</span>,
  backend: <span style={{ fontSize: '10px', fontWeight: 700 }}>BE</span>,
  ai: <span style={{ fontSize: '10px', fontWeight: 700 }}>AI</span>,
  data: <span style={{ fontSize: '10px', fontWeight: 700 }}>DA</span>,
  devops: <span style={{ fontSize: '10px', fontWeight: 700 }}>DO</span>,
};

// 单个模板卡片组件
interface TemplateCardProps {
  template: SoulTemplate;
  onLoad: (template: SoulTemplate) => void;
  language: 'zh' | 'en';
}

const TemplateCard = React.memo(function TemplateCard({
  template,
  onLoad,
  language,
}: TemplateCardProps) {
  const translations = useMemo(() => getTranslations(language), [language]);

  // 使用 i18n 翻译（如果存在），否则使用默认值
  const templateTranslation = translations.templates?.[template.id as keyof typeof translations.templates];
  const displayName = typeof templateTranslation === 'object' && templateTranslation !== null && 'name' in templateTranslation
    ? (templateTranslation as { name: string }).name
    : template.name;
  const displayDescription = typeof templateTranslation === 'object' && templateTranslation !== null && 'description' in templateTranslation
    ? (templateTranslation as { description: string }).description
    : template.description;

  const handleClick = useCallback(() => {
    onLoad(template);
  }, [template, onLoad]);

  const categoryColor = categoryColors[template.category];

  return (
    <Card
      padding="sm"
      radius="md"
      withBorder
      shadow="sm"
      onClick={handleClick}
      component="div"
      style={{
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        ':hover': {
          shadow: 'md',
          transform: 'translateY(-2px)',
          borderColor: `var(--mantine-color-${categoryColor}-6)`,
        },
      } as React.CSSProperties}
    >
      {/* 顶部类别标签 */}
      <Group justify="space-between" mb="xs" wrap="nowrap">
        <Badge
          color={categoryColor}
          variant="light"
          size="xs"
          radius="sm"
          leftSection={categoryIcons[template.category]}
        >
          {template.category.toUpperCase()}
        </Badge>
        <ActionIcon
          variant="subtle"
          color={categoryColor}
          size="sm"
          radius="md"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          title={language === 'zh' ? '加载模板' : 'Load template'}
          style={{
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = `var(--mantine-color-${categoryColor}-light)`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }}
        >
          <IconDownload size={16} />
        </ActionIcon>
      </Group>

      {/* 卡片内容区 */}
      <Box style={{ flex: 1 }}>
        <Text
          fw={600}
          size="sm"
          lh={1.3}
          mb="xs"
          style={{
            color: 'var(--mantine-color-gray-9)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '32px',
          }}
          title={displayName}
        >
          {displayName}
        </Text>
        <Text
          size="xs"
          c="dimmed"
          lh={1.4}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '26px',
          }}
          title={displayDescription}
        >
          {displayDescription}
        </Text>
      </Box>

      {/* 底部装饰线 */}
      <Box
        style={{
          height: '2px',
          width: '40%',
          backgroundColor: `var(--mantine-color-${categoryColor}-6)`,
          marginTop: '12px',
          borderRadius: '1px',
          transition: 'width 0.25s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.width = '100%';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.width = '40%';
        }}
      />
    </Card>
  );
});

// 模板画廊主组件
export const TemplateGallery = React.memo(function TemplateGallery({
  isExpanded,
  onToggle,
}: TemplateGalleryProps) {
  const { language, soul } = useSoulStore();
  const translations = useMemo(() => getTranslations(language), [language]);
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all');

  // 按类别分组模板
  const groupedTemplates = useMemo(() => {
    const groups: Record<TemplateCategory, SoulTemplate[]> = {
      frontend: [],
      backend: [],
      ai: [],
      data: [],
      devops: [],
    };

    templates.forEach((template) => {
      groups[template.category].push(template);
    });

    return groups;
  }, []);

  // 当前显示的模板
  const visibleTemplates = useMemo(() => {
    if (activeCategory === 'all') {
      return templates;
    }
    return groupedTemplates[activeCategory] || [];
  }, [activeCategory, groupedTemplates]);

  // 处理加载模板
  const handleLoadTemplate = useCallback((template: SoulTemplate) => {
    const { loadTemplate } = useSoulStore.getState();

    // 如果当前有未保存的 Soul，显示确认对话框
    if (soul && (soul.identity || soul.abilities.length > 0)) {
      const confirmed = window.confirm(
        translations.templates?.confirmOverwrite || '当前已有未保存的配置，加载模板将覆盖现有配置。是否继续？'
      );
      if (!confirmed) return;
    }

    loadTemplate(template);
  }, [soul, translations]);

  const categoryLabels = translations.templates?.category || {
    frontend: '前端',
    backend: '后端',
    ai: 'AI',
    data: '数据',
    devops: 'DevOps',
  };

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      style={{ overflow: 'hidden', transition: 'all 0.3s ease' }}
    >
      <Group
        justify="space-between"
        mb="xs"
        onClick={onToggle}
        style={{
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          borderRadius: 'var(--mantine-radius-md)',
          padding: '4px 8px',
          margin: '-4px -8px',
        }}
      >
        <Group gap="xs" wrap="nowrap">
          <ActionIcon
            variant="transparent"
            size="sm"
            p={0}
            style={{
              transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <IconX size={18} style={{ transform: 'rotate(45deg)' }} />
          </ActionIcon>
          <Title order={3} size="h5">
            {translations.templates?.title || '模板画廊'}
          </Title>
        </Group>
        <Badge
          variant="light"
          size="sm"
          style={{ transition: 'transform 0.2s ease' }}
        >
          {visibleTemplates.length} {language === 'zh' ? '个模板' : 'templates'}
        </Badge>
      </Group>

      <Collapse in={isExpanded}>
        <ScrollArea style={{ maxHeight: 'calc(100vh - 280px)' }} offsetScrollbars type="hover">
          <Box pb="xs">
            {/* 类别标签页 */}
            <Tabs
              value={activeCategory}
              onChange={(value) => setActiveCategory(value as TemplateCategory | 'all')}
              variant="outline"
              radius="sm"
              mb="lg"
            >
              <Tabs.List grow mb="md">
                <Tabs.Tab
                  value="all"
                  leftSection={<IconSearch size={14} />}
                >
                  {language === 'zh' ? '全部' : 'All'} ({templates.length})
                </Tabs.Tab>
                {templateCategories.map((category) => (
                  <Tabs.Tab
                    key={category}
                    value={category}
                    leftSection={categoryIcons[category]}
                  >
                    {categoryLabels[category as keyof typeof categoryLabels]} ({groupedTemplates[category].length})
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>

            {/* 模板网格布局 */}
            {visibleTemplates.length > 0 ? (
              <SimpleGrid
                cols={{ base: 1, sm: 2, md: 3 }}
                spacing="sm"
                verticalSpacing="sm"
              >
                {visibleTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onLoad={handleLoadTemplate}
                    language={language}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Center py="xl">
                <Text c="dimmed" size="sm">
                  {language === 'zh' ? '暂无模板' : 'No templates available'}
                </Text>
              </Center>
            )}
          </Box>
        </ScrollArea>
      </Collapse>
    </Card>
  );
});
