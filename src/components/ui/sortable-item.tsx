import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface SortableItemProps {
  id: string;
  header: React.ReactNode;
  children: React.ReactNode;
}

export const SortableItem: React.FC<SortableItemProps> = ({
  id,
  header,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <>
      <div
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        className="cursor-move p-0 relative"
      >
        {header}
      </div>

      <div className="size-full" style={style}>
        {children}
      </div>
    </>
  );
};
