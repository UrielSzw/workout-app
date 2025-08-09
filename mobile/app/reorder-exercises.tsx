import React from 'react';
import { router } from 'expo-router';
import { createRoutineStore } from '@/store/form-routine-store';
import { IBlock } from '@/types/routine';
import { ReorderExercisesScreen } from '@/features/form-routine/reorder-exercises';

export default function ReorderExercisesPage() {
  const { reorderedBlock, setReorderedBlock, blocks, setBlocks } =
    createRoutineStore((state) => state);

  if (!reorderedBlock) {
    return null;
  }

  const handleReorder = (reorderedBlock: IBlock) => {
    // Save reordered block to global state for the parent to pick up
    const updatedBlocks = blocks.map((block) =>
      block.id === reorderedBlock.id ? reorderedBlock : block,
    );

    setBlocks(updatedBlocks);
    setReorderedBlock(null);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ReorderExercisesScreen
      block={reorderedBlock}
      onReorder={handleReorder}
      onCancel={handleCancel}
    />
  );
}
