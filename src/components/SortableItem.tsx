import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Group, ActionIcon, Box } from '@mantine/core';
import { IconGripVertical, IconX } from '@tabler/icons-react';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  onRemove?: () => void;
  dragHandleOnly?: boolean;
}

export function SortableItem({ id, children, onRemove, dragHandleOnly = false }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: dragHandleOnly ? 'default' : 'grab',
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      padding="xs"
      withBorder
      shadow={isDragging ? 'md' : 'sm'}
    >
      <Group wrap="nowrap" gap="xs">
        <ActionIcon
          variant="transparent"
          color="gray"
          size="sm"
          style={{ cursor: 'grab' }}
          {...attributes}
          {...listeners}
        >
          <IconGripVertical size={18} />
        </ActionIcon>
        <Box flex={1}>{children}</Box>
        {onRemove && (
          <ActionIcon
            variant="transparent"
            color="red"
            size="sm"
            onClick={onRemove}
            style={{ cursor: 'pointer' }}
          >
            <IconX size={18} />
          </ActionIcon>
        )}
      </Group>
    </Card>
  );
}
