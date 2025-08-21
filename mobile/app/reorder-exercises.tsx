import React from 'react';
import { router } from 'expo-router';
import { IBlock } from '@/types/routine';
import { ReorderExercisesScreen } from '@/features/form-routine/reorder-exercises';
import {
  useBlockActions,
  useBlockToReorderState,
} from '@/features/form-routine/hooks/use-form-routine-store';

export default function ReorderExercisesPage() {
  const { reorderBlockExercises, setBlockToReorder } = useBlockActions();
  const blockToReorder = useBlockToReorderState();

  if (!blockToReorder) {
    return null;
  }

  const handleReorder = (reorderedBlock: IBlock) => {
    reorderBlockExercises(reorderedBlock);
    router.back();
    setBlockToReorder(null);
  };

  const handleCancel = () => {
    setBlockToReorder(null);
    router.back();
  };

  return (
    <ReorderExercisesScreen
      block={blockToReorder}
      onReorder={handleReorder}
      onCancel={handleCancel}
    />
  );
}
