import React, { useMemo, useCallback, useState } from 'react';
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
import { IconPlus, IconCheck, IconChevronDown } from '@tabler/icons-react';
import { useSoulStore } from '../store/soulStore';
import type { LibraryItem, LayerType, Soul, FlowStep } from '../store/soulStore.types';

interface ModuleLibraryProps {
  layerType: 'identity' | 'ability' | 'style' | 'flow' | 'constraint' | 'tool';
  title: string;
  inputType: 'single' | 'multi' | 'sort';
  isExpanded: boolean;
  onToggle: () => void;
}

// 配置驱动方式：层类型到 store 数据的映射
const layerConfig: Record<LayerType, { libraryKey: keyof SoulStore['libraries']; selectedKey: keyof Soul }> = {
  identity: { libraryKey: 'identities', selectedKey: 'identity' },
  ability: { libraryKey: 'abilities', selectedKey: 'abilities' },
  style: { libraryKey: 'styles', selectedKey: 'styles' },
  flow: { libraryKey: 'flows', selectedKey: 'flows' },
  constraint: { libraryKey: 'constraints', selectedKey: 'constraints' },
  tool: { libraryKey: 'tools', selectedKey: 'tools' },
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
  onSelect: (id: string) => void;
}

const LibraryItemCard = React.memo(function LibraryItemCard({
  item,
  isSelected,
  inputType,
  onSelect,
}: LibraryItemProps) {
  const handleClick = useCallback(() => {
    onSelect(item.id);
  }, [item.id, onSelect]);

  return (
    <Card
      key={item.id}
      padding="sm"
      mb="xs"
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
        transform: 'translateY(0)',
      }}
      component="div"
      // Mantine 的 style props 用于悬停效果
      _hover={{
        shadow: 'md',
        transform: 'translateY(-2px)',
        borderColor: 'var(--mantine-color-violet-3)',
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Box style={{ flex: 1 }}>
          <Text fw={isSelected ? 600 : 500} size="sm" lh={1.3}>
            {item.name}
          </Text>
          {item.description && (
            <Text size="xs" c="dimmed" mt={4} lh={1.4}>
              {item.description}
            </Text>
          )}
          {item.category && (
            <Badge variant="outline" size="xs" mt={6} color="gray">
              {item.category}
            </Badge>
          )}
        </Box>
        {inputType === 'single' ? (
          <ThemeIcon
            variant={isSelected ? 'filled' : 'outline'}
            color={isSelected ? 'violet' : 'gray'}
            size="md"
            radius="xl"
          >
            {isSelected ? <IconCheck size={16} /> : <IconPlus size={16} />}
          </ThemeIcon>
        ) : (
          <Checkbox
            checked={isSelected}
            onChange={() => {}}
            aria-label={`选择 ${item.name}`}
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
  const { libraries, soul } = useSoulStore();

  // 使用 useMemo 缓存计算结果
  const items = useMemo(() => {
    const { libraryKey } = layerConfig[layerType];
    return libraries[libraryKey];
  }, [libraries, layerType]);

  const selectedIds = useMemo(() => {
    return getSelectedIds(soul, layerType);
  }, [soul, layerType]);

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
        case 'flow':
          useSoulStore.getState().toggleFlow(id);
          break;
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

  // 当父组件控制时，使用父组件的状态；否则使用内部状态
  const isControlled = expandedFromParent !== undefined;
  const isExpanded = isControlled ? expandedFromParent : expanded;

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      style={{ overflow: 'hidden', transition: 'all 0.3s ease' }}
      _hover={{ shadow: 'md' }}
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
            <IconChevronDown size={18} />
          </ActionIcon>
          <Title order={3} size="h5">{title}</Title>
        </Group>
        {inputType === 'multi' && (
          <Badge
            variant="light"
            size="sm"
            style={{ transition: 'transform 0.2s ease' }}
          >
            已选 {selectedCount}
          </Badge>
        )}
      </Group>

      <Collapse in={isExpanded} timeout={300}>
        <ScrollArea style={{ maxHeight: 'calc(100vh - 250px)' }} offsetScrollbars type="hover">
          <Box pb="xs">
            {visibleItems.map((item) => (
              <LibraryItemCard
                key={item.id}
                item={item}
                isSelected={selectedIds.includes(item.id)}
                inputType={inputType}
                onSelect={handleSelect}
              />
            ))}
            {!isControlled && !isExpanded && hasMore && (
              <Text
                size="xs"
                c="dimmed"
                ta="center"
                py="xs"
                onClick={(e) => {
          e.stopPropagation();
          if (isControlled) {
            // 由父组件处理点击
          } else {
            setExpanded(!isExpanded);
          }
        }}
                style={{
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
                _hover={{ color: 'var(--mantine-color-violet-7)' }}
              >
                展开 {items.length - 3} 更多...
              </Text>
            )}
          </Box>
        </ScrollArea>
      </Collapse>
    </Card>
  );
});
