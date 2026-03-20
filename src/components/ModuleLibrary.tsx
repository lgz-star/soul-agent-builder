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
} from '@mantine/core';
import { IconPlus, IconCheck } from '@tabler/icons-react';
import { useSoulStore } from '../store/soulStore';
import type { LibraryItem, LayerType, Soul, FlowStep } from '../store/soulStore.types';

interface ModuleLibraryProps {
  layerType: 'identity' | 'ability' | 'style' | 'flow' | 'constraint' | 'tool';
  title: string;
  inputType: 'single' | 'multi' | 'sort';
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
          : undefined,
        borderColor: isSelected
          ? 'var(--mantine-color-violet)'
          : 'var(--mantine-color-gray-3)',
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Box style={{ flex: 1 }}>
          <Text fw={isSelected ? 600 : 400} size="sm">
            {item.name}
          </Text>
          {item.description && (
            <Text size="xs" c="dimmed" mt={2}>
              {item.description}
            </Text>
          )}
          {item.category && (
            <Badge variant="outline" size="xs" mt={2}>
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

  return (
    <Card withBorder shadow="sm" radius="md" style={{ height: '100%', overflow: 'hidden' }}>
      <Group justify="space-between" mb="md">
        <Title order={5}>{title}</Title>
        {inputType === 'multi' && (
          <Badge variant="light" size="sm">
            已选 {selectedIds.length}
          </Badge>
        )}
      </Group>

      <ScrollArea style={{ maxHeight: 'calc(100vh - 250px)' }} offsetScrollbars>
        <Box>
          {items.map((item) => (
            <LibraryItemCard
              key={item.id}
              item={item}
              isSelected={selectedIds.includes(item.id)}
              inputType={inputType}
              onSelect={handleSelect}
            />
          ))}
        </Box>
      </ScrollArea>
    </Card>
  );
});
