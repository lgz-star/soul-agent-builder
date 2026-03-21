import React, { useMemo, useCallback } from 'react';
import {
  Box,
  Title,
  Text,
  ScrollArea,
  Card,
  Group,
  Badge,
  Checkbox,
  ThemeIcon,
  Collapse,
  ActionIcon,
} from '@mantine/core';
import { IconPlus, IconCheck, IconChevronDown, IconLanguage } from '@tabler/icons-react';
import { useSoulStore } from '../store/soulStore';
import type { LibraryItem, FlowStep, Soul } from '../store/soulStore.types';
import type { Language } from '../i18n';

type LayerType = 'identity' | 'ability' | 'style' | 'flow' | 'constraint' | 'tool';

interface ModuleLibraryProps {
  layerType: 'identity' | 'ability' | 'style' | 'flow' | 'constraint' | 'tool';
  title: string;
  inputType: 'single' | 'multi' | 'sort';
  isExpanded: boolean;
  onToggle: () => void;
}

const layerConfig = {
  identity: { libraryKey: 'identities' as const, selectedKey: 'identity' as const },
  ability: { libraryKey: 'abilities' as const, selectedKey: 'abilities' as const },
  style: { libraryKey: 'styles' as const, selectedKey: 'styles' as const },
  flow: { libraryKey: 'flows' as const, selectedKey: 'flows' as const },
  constraint: { libraryKey: 'constraints' as const, selectedKey: 'constraints' as const },
  tool: { libraryKey: 'tools' as const, selectedKey: 'tools' as const },
};

// 获取当前选中的 ID 列表
const getSelectedIds = (soul: Soul | null, layerType: LayerType): string[] => {
  if (!soul) return [];
  const { selectedKey } = layerConfig[layerType];
  const value = soul[selectedKey];

  if (layerType === 'identity') {
    return value ? [value as string] : [];
  }
  if (layerType === 'flow') {
    return (value as FlowStep[]).map((f) => f.id);
  }
  return value as string[];
};

// 单个库项组件 - 使用 memo 防止不必要的重渲染
interface LibraryItemProps {
  item: LibraryItem;
  isSelected: boolean;
  inputType: 'single' | 'multi' | 'sort';
  language: Language;
  onSelect: (id: string) => void;
}

const LibraryItemCard = React.memo(function LibraryItemCard({
  item,
  isSelected,
  inputType,
  language,
  onSelect,
}: LibraryItemProps) {
  const handleClick = useCallback(() => {
    onSelect(item.id);
  }, [item.id, onSelect]);

  // 获取本地化名称
  const name = typeof item.name === 'object' ? item.name[language] : item.name;

  return (
    <Card
      key={item.id}
      padding="6"
      mb={3}
      radius="sm"
      withBorder
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        backgroundColor: isSelected
          ? 'var(--mantine-color-violet-light)'
          : 'white',
        borderColor: isSelected
          ? 'var(--mantine-color-violet)'
          : 'var(--mantine-color-gray-3)',
        transition: 'all 0.2s ease',
      }}
      component="div"
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          <ThemeIcon
            variant={isSelected ? 'filled' : 'light'}
            color={isSelected ? 'violet' : 'gray'}
            size="xs"
            radius="sm"
          >
            {item.category ? <span style={{ fontSize: '10px', fontWeight: 600 }}>{item.category.charAt(0).toUpperCase()}</span> : <IconCheck size={12} />}
          </ThemeIcon>
          <Text fw={isSelected ? 600 : 500} size="xs" lh={1.3} style={{ flex: 1, minWidth: 0 }} title={name}>
            {name}
          </Text>
        </Group>
        {inputType === 'single' ? (
          <ThemeIcon
            variant={isSelected ? 'filled' : 'outline'}
            color={isSelected ? 'violet' : 'gray'}
            size="xs"
            radius="xl"
          >
            {isSelected ? <IconCheck size={12} /> : <IconPlus size={12} />}
          </ThemeIcon>
        ) : (
          <Checkbox
            checked={isSelected}
            onChange={() => {}}
            aria-label={`${language === 'zh' ? '选择' : 'Select'} ${name}`}
            size="xs"
          />
        )}
      </Group>
    </Card>
  );
});

// ModuleLibrary 主组件 - 使用 memo 防止不必要的重渲染
export const ModuleLibrary = React.memo(function ModuleLibrary({
  layerType,
  title,
  inputType,
  isExpanded,
  onToggle,
}: ModuleLibraryProps) {
  const { libraries, soul, language, setLanguage } = useSoulStore();

  const items = useMemo(() => {
    const { libraryKey } = layerConfig[layerType];
    return libraries[libraryKey];
  }, [libraries, layerType]);

  const selectedIds = useMemo(() => {
    return getSelectedIds(soul, layerType);
  }, [soul, layerType]);

  // 语言切换处理
  const handleLanguageToggle = useCallback(() => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  }, [language, setLanguage]);

  // 使用 useCallback 缓存选择处理函数
  const handleSelect = useCallback(
    (id: string) => {
      switch (layerType) {
        case 'identity':
          useSoulStore.getState().setIdentity(id);
          break;
        case 'ability':
          useSoulStore.getState().toggleAbility(id);
          break;
        case 'style':
          useSoulStore.getState().toggleStyle(id);
          break;
        case 'flow': {
          const state = useSoulStore.getState();
          const exists = state.soul?.flows.some((f) => f.id === id);
          if (exists) {
            // 已存在则移除
            const newFlows = (state.soul?.flows || []).filter((f) => f.id !== id);
            state.setFlows(newFlows);
          } else {
            // 不存在则添加
            const newFlows = [...(state.soul?.flows || []), { id, order: state.soul?.flows.length || 0 }];
            state.setFlows(newFlows);
          }
          break;
        }
        case 'constraint':
          useSoulStore.getState().toggleConstraint(id);
          break;
        case 'tool':
          useSoulStore.getState().toggleTool(id);
          break;
      }
    },
    [layerType]
  );

  // 显示前 3 个项（折叠时）
  const visibleItems = isExpanded ? items : items.slice(0, 3);
  const hasMore = items.length > 3;
  const selectedCount = selectedIds.length;

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      style={{ overflow: 'hidden', transition: 'all 0.3s ease' }}
    >
      <Group
        justify="space-between"
        mb="sm"
        onClick={onToggle}
        style={{
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          borderRadius: 'var(--mantine-radius-md)',
          padding: '6px 10px',
          margin: '-6px -10px',
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
            <IconChevronDown size={16} />
          </ActionIcon>
          <Title order={3} size="h6">{title}</Title>
        </Group>
        <Group gap="xs" wrap="nowrap">
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleLanguageToggle();
            }}
            title={language === 'zh' ? 'Switch to English' : '切换到中文'}
          >
            <IconLanguage size={14} />
            <span style={{ fontSize: '9px', marginLeft: '2px' }}>{language === 'zh' ? '中' : 'EN'}</span>
          </ActionIcon>
          {inputType === 'multi' && (
            <Badge
              variant="light"
              size="xs"
              style={{ transition: 'transform 0.2s ease' }}
            >
              {language === 'zh' ? '已选' : 'Selected'} {selectedCount}
            </Badge>
          )}
        </Group>
      </Group>

      <Collapse in={isExpanded}>
        <ScrollArea style={{ maxHeight: 'min(400px, calc(100vh - 350px))' }} offsetScrollbars type="hover">
          <Box pb="xs">
            {visibleItems.map((item: LibraryItem) => (
              <LibraryItemCard
                key={item.id}
                item={item}
                isSelected={selectedIds.includes(item.id)}
                inputType={inputType}
                language={language}
                onSelect={handleSelect}
              />
            ))}
            {!isExpanded && hasMore && (
              <Text
                size="xs"
                c="dimmed"
                ta="center"
                py="xs"
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                style={{
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--mantine-color-violet-7)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--mantine-color-dimmed)'; }}
              >
                {language === 'zh' ? '展开' : 'Expand'} {items.length - 3} {language === 'zh' ? '更多...' : 'more...'}
              </Text>
            )}
          </Box>
        </ScrollArea>
      </Collapse>
    </Card>
  );
});
