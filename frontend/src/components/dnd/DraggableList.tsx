import React, { useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Box, Paper } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const ItemTypes = {
  DRAGGABLE_ITEM: 'draggable-item',
};

// Props for draggable items
interface DraggableItemProps<T> {
  id: number;
  index: number;
  item: T;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  renderItem: (item: T) => React.ReactNode;
}

// Props for the draggable list component
interface DraggableListProps<T> {
  items: T[];
  onReorder?: (items: T[]) => void;
  renderItem: (item: T) => React.ReactNode;
  itemKey?: keyof T & string;
}

// Component for individual draggable items
function DraggableItem<T>({
  id,
  index,
  item,
  moveItem,
  renderItem,
}: DraggableItemProps<T>) {
  const ref = React.useRef<HTMLDivElement>(null);

  // Set up drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.DRAGGABLE_ITEM,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Set up drop functionality
  const [, drop] = useDrop({
    accept: ItemTypes.DRAGGABLE_ITEM,
    hover: (draggedItem: { index: number }, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Get rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Get mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset ? clientOffset.y - hoverBoundingRect.top : 0;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here
      // This is generally okay because we're not using this for render logic
      draggedItem.index = hoverIndex;
    },
  });

  // Connect the drag and drop refs
  drag(drop(ref));

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        mb: 1,
        transition: 'all 0.2s',
      }}
      data-testid={`draggable-item-${id}`}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isDragging ? 'action.hover' : 'background.paper',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <DragIndicatorIcon
          sx={{
            mr: 2,
            cursor: 'grab',
            color: 'text.secondary',
          }}
        />
        <Box sx={{ flexGrow: 1 }}>{renderItem(item)}</Box>
      </Paper>
    </Box>
  );
}

// Main draggable list component
function DraggableList<T extends { id?: number | string }>({
  items,
  onReorder,
  renderItem,
  itemKey = 'id' as keyof T & string,
}: DraggableListProps<T>) {
  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const newItems = [...items];
      const draggedItem = newItems[dragIndex];
      
      // Remove the dragged item
      newItems.splice(dragIndex, 1);
      // Insert it at the hover position
      newItems.splice(hoverIndex, 0, draggedItem);
      
      // Call the onReorder callback if provided
      if (onReorder) {
        onReorder(newItems);
      }
    },
    [items, onReorder],
  );

  return (
    <Box sx={{ width: '100%' }}>
      {items.map((item, index) => {
        // Use the itemKey prop or fallback to index if no id is available
        const key = (item[itemKey] !== undefined 
          ? item[itemKey] 
          : index) as React.Key;
          
        return (
          <DraggableItem
            key={key}
            id={index}
            index={index}
            item={item}
            moveItem={moveItem}
            renderItem={renderItem}
          />
        );
      })}
    </Box>
  );
}

// Wrapped component with DndProvider
export default function DraggableListWrapper<T extends { id?: number | string }>(
  props: DraggableListProps<T>,
) {
  return (
    <DndProvider backend={HTML5Backend}>
      <DraggableList {...props} />
    </DndProvider>
  );
} 