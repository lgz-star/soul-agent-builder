import {
  Box,
  Title,
  Text,
  Card,
  Group,
  Badge,
  Stack,
  Button,
  Textarea,
  SimpleGrid,
  Progress,
  ThemeIcon,
} from '@mantine/core';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { IconCheck, IconCircle } from '@tabler/icons-react';
import { useSoulStore } from '../store/soulStore';
import { SortableItem } from './SortableItem';
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

interface BuilderZoneProps {
  onOpenPreview?: () => void;
}

export function BuilderZone({ onOpenPreview }: BuilderZoneProps) {
  const { soul, setFlows, setKnowledge, language } = useSoulStore();
  const { t } = useTranslation();

  // 计算进度
  const progressLayers = [
    { key: 'identity', completed: !!soul?.identity },
    { key: 'ability', completed: !!soul && soul.abilities.length > 0 },
    { key: 'style', completed: !!soul && soul.styles.length > 0 },
    { key: 'flow', completed: !!soul && soul.flows.length > 0 },
    { key: 'knowledge', completed: !!soul?.knowledge },
    { key: 'constraint', completed: !!soul && soul.constraints.length > 0 },
    { key: 'tool', completed: !!soul && soul.tools.length > 0 },
  ];
  const completedCount = progressLayers.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / 7) * 100);

  // 获取库条目的本地化名称
  const getLocalizedName = (id: string, library: { id: string; name: string | { zh: string; en: string } }[]): string => {
    const item = library.find((i) => i.id === id);
    return item ? (typeof item.name === 'object' ? item.name[language] : item.name) : id;
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, args) => {
        // 阻止在输入框/文本域中使用键盘触发拖拽
        const target = event.target as HTMLElement;
        const isInteractive =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.hasAttribute('contenteditable');

        if (isInteractive) {
          return undefined;
        }
        // 只在非交互元素上允许键盘拖拽
        return sortableKeyboardCoordinates(event, args) || undefined;
      },
    })
  );

  if (!soul) {
    return (
      <EmptyState
        title={t('empty.startCreatingTitle')}
        description={t('empty.startCreatingDesc')}
        showAction={false}
      />
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = soul.flows.findIndex((f) => f.id === active.id);
      const newIndex = soul.flows.findIndex((f) => f.id === over.id);
      const newFlows = [...soul.flows];
      const [moved] = newFlows.splice(oldIndex, 1);
      newFlows.splice(newIndex, 0, moved);
      setFlows(newFlows);
    }
  };

  const hasContent =
    soul.identity ||
    soul.abilities.length > 0 ||
    soul.styles.length > 0 ||
    soul.flows.length > 0 ||
    soul.knowledge ||
    soul.constraints.length > 0 ||
    soul.tools.length > 0;

  // 渲染层内容组件（可复用）
  const renderLayerContent = (
    _layerKey: string,
    items: string[] | null | undefined,
    library: { id: string; name: string | { zh: string; en: string } }[],
    variant: 'light' | 'outline' = 'light',
    color?: string
  ) => {
    const hasItems = Array.isArray(items) && items.length > 0;

    if (hasItems) {
      return (
        <Group wrap="wrap">
          {items.map((id) => (
            <Badge key={id} variant={variant} size="lg" color={color}>
              {getLocalizedName(id, library)}
            </Badge>
          ))}
        </Group>
      );
    }
    return (
      <Text c="dimmed" size="xs" style={{ fontStyle: 'italic' }}>
        {t('status.notSelected')}
      </Text>
    );
  };

  // 渲染层标题（带完成状态）
  const renderLayerTitle = (label: string, completed: boolean) => (
    <Group gap="xs" mb="xs">
      <ThemeIcon
        size="xs"
        radius="xl"
        variant={completed ? 'filled' : 'light'}
        color={completed ? 'green' : 'gray'}
      >
        {completed ? <IconCheck size={10} /> : <IconCircle size={8} />}
      </ThemeIcon>
      <Text fw={500} size="sm">
        {label}
      </Text>
    </Group>
  );

  return (
    <Card withBorder shadow="sm" radius="md" style={{ height: '100%', overflow: 'auto' }}>
      <Group justify="space-between" mb="lg">
        <Title order={2} size="h4">{t('ui.builder')}</Title>
        {hasContent && (
          <Button size="xs" variant="light" onClick={onOpenPreview}>
            {t('ui.openPreview')}
          </Button>
        )}
      </Group>

      {/* 进度指示器 */}
      <Box mb="lg">
        <Group justify="space-between" mb="xs">
          <Text size="xs" c="dimmed">
            {language === 'zh' ? '完成进度' : 'Progress'}: {completedCount}/7
          </Text>
          <Text size="xs" c="dimmed">{progressPercent}%</Text>
        </Group>
        <Progress value={progressPercent} size="sm" radius="md" color="violet" />
      </Box>

      {/* 身份层 - 整行，最重要 */}
      <Box mb="lg">
        {renderLayerTitle(t('layers.identity'), !!soul.identity)}
        {soul.identity ? (
          <Card padding="sm" withBorder>
            <Text size="sm">{getLocalizedName(soul.identity, identityLibrary)}</Text>
          </Card>
        ) : (
          <Text c="dimmed" size="xs" style={{ fontStyle: 'italic' }}>
            {t('status.notSelected')}
          </Text>
        )}
      </Box>

      {/* 能力层 + 风格层 - 双列并排 */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="lg">
        <Box>
          {renderLayerTitle(t('layers.ability'), soul.abilities.length > 0)}
          {renderLayerContent('ability', soul.abilities, abilityLibrary, 'light')}
        </Box>
        <Box>
          {renderLayerTitle(t('layers.style'), soul.styles.length > 0)}
          {renderLayerContent('style', soul.styles, styleLibrary, 'outline')}
        </Box>
      </SimpleGrid>

      {/* 流程层 - 整行，支持拖拽排序 */}
      <Box mb="lg">
        {renderLayerTitle(
          t('layers.flow'),
          soul.flows.length > 0
        )}
        {soul.flows.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={soul.flows.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              <Stack gap="xs">
                {soul.flows.map((flow) => (
                  <SortableItem
                    key={flow.id}
                    id={flow.id}
                    onRemove={() => {
                      const newFlows = soul.flows.filter((f) => f.id !== flow.id);
                      setFlows(newFlows);
                    }}
                  >
                    <Text size="sm">{getLocalizedName(flow.id, flowLibrary)}</Text>
                  </SortableItem>
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        ) : (
          <Text c="dimmed" size="xs" style={{ fontStyle: 'italic' }}>
            {t('status.notSelected')}
          </Text>
        )}
      </Box>

      {/* 约束层 + 工具层 - 双列并排 */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="lg">
        <Box>
          {renderLayerTitle(t('layers.constraint'), soul.constraints.length > 0)}
          {renderLayerContent('constraint', soul.constraints, constraintLibrary, 'light', 'red')}
        </Box>
        <Box>
          {renderLayerTitle(t('layers.tool'), soul.tools.length > 0)}
          {renderLayerContent('tool', soul.tools, toolLibrary, 'light', 'blue')}
        </Box>
      </SimpleGrid>

      {/* 知识层 - 整行，可折叠 Textarea */}
      <Box>
        {renderLayerTitle(t('layers.knowledge'), !!soul.knowledge)}
        <Textarea
          placeholder={language === 'zh' ? '输入知识内容...' : 'Enter knowledge content...'}
          value={soul.knowledge || ''}
          onChange={(e) => setKnowledge(e.target.value)}
          minRows={3}
          autosize
        />
      </Box>
    </Card>
  );
}
