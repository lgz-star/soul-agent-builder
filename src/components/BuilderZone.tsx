import {
  Box,
  Title,
  Text,
  Card,
  Group,
  Badge,
  Stack,
  Divider,
  Button,
  Textarea,
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
import { useSoulStore } from '../store/soulStore';
import { SortableItem } from './SortableItem';
import { EmptyState } from './EmptyState';

interface BuilderZoneProps {
  onOpenPreview?: () => void;
}

export function BuilderZone({ onOpenPreview }: BuilderZoneProps) {
  const { soul, setFlows, setKnowledge } = useSoulStore();

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
        title="开始创建"
        description="从左侧选择模块开始创建你的 Soul"
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

  return (
    <Card withBorder shadow="sm" radius="md" style={{ height: '100%', overflow: 'auto' }}>
      <Group justify="space-between" mb="lg">
        <Title order={2} size="h4">构建区</Title>
        {hasContent && (
          <Button size="xs" variant="light" onClick={onOpenPreview}>
            打开预览
          </Button>
        )}
      </Group>

      <Stack gap="md">
        {/* 身份层 */}
        <Box>
          <Text fw={500} size="sm" mb="xs">
            身份
          </Text>
          {soul.identity ? (
            <Card padding="sm" withBorder>
              <Text size="sm">{soul.identity}</Text>
            </Card>
          ) : (
            <Text c="dimmed" size="xs" style={{ fontStyle: 'italic' }}>
              未选择
            </Text>
          )}
        </Box>

        <Divider />

        {/* 能力层 */}
        <Box>
          <Text fw={500} size="sm" mb="xs">
            能力
          </Text>
          {soul.abilities.length > 0 ? (
            <Group wrap="wrap">
              {soul.abilities.map((id) => (
                <Badge key={id} variant="light" size="lg">
                  {id}
                </Badge>
              ))}
            </Group>
          ) : (
            <Text c="dimmed" size="xs" style={{ fontStyle: 'italic' }}>
              未选择
            </Text>
          )}
        </Box>

        <Divider />

        {/* 风格层 */}
        <Box>
          <Text fw={500} size="sm" mb="xs">
            风格
          </Text>
          {soul.styles.length > 0 ? (
            <Group wrap="wrap">
              {soul.styles.map((id) => (
                <Badge key={id} variant="outline" size="lg">
                  {id}
                </Badge>
              ))}
            </Group>
          ) : (
            <Text c="dimmed" size="xs" style={{ fontStyle: 'italic' }}>
              未选择
            </Text>
          )}
        </Box>

        <Divider />

        {/* 流程层 - 支持拖拽排序 */}
        <Box>
          <Text fw={500} size="sm" mb="xs">
            流程（拖拽排序）
          </Text>
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
                      <Text size="sm">{flow.id}</Text>
                    </SortableItem>
                  ))}
                </Stack>
              </SortableContext>
            </DndContext>
          ) : (
            <Text c="dimmed" size="xs" style={{ fontStyle: 'italic' }}>
              未选择
            </Text>
          )}
        </Box>

        <Divider />

        {/* 知识层 */}
        <Box>
          <Text fw={500} size="sm" mb="xs">
            知识
          </Text>
          <Textarea
            placeholder="输入知识内容..."
            value={soul.knowledge || ''}
            onChange={(e) => setKnowledge(e.target.value)}
            minRows={3}
            autosize
          />
        </Box>

        <Divider />

        {/* 约束层 */}
        <Box>
          <Text fw={500} size="sm" mb="xs">
            约束
          </Text>
          {soul.constraints.length > 0 ? (
            <Group wrap="wrap">
              {soul.constraints.map((id) => (
                <Badge key={id} color="red" variant="light">
                  {id}
                </Badge>
              ))}
            </Group>
          ) : (
            <Text c="dimmed" size="xs" style={{ fontStyle: 'italic' }}>
              未选择
            </Text>
          )}
        </Box>

        <Divider />

        {/* 工具层 */}
        <Box>
          <Text fw={500} size="sm" mb="xs">
            工具
          </Text>
          {soul.tools.length > 0 ? (
            <Group wrap="wrap">
              {soul.tools.map((id) => (
                <Badge key={id} color="blue" variant="light">
                  {id}
                </Badge>
              ))}
            </Group>
          ) : (
            <Text c="dimmed" size="xs" style={{ fontStyle: 'italic' }}>
              未选择
            </Text>
          )}
        </Box>
      </Stack>
    </Card>
  );
}
