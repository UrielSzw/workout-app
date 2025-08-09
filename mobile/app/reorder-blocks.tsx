import React from 'react';
import { router } from 'expo-router';
import { ReorderBlocksScreen } from '@/features/form-routine/reorder-blocks';
import { createRoutineStore } from '@/store/form-routine-store';
import { IBlock } from '@/types/routine';

export default function ReorderBlocksPage() {
  const { blocks, setBlocks } = createRoutineStore((state) => state);

  const handleReorder = (reorderedBlocks: IBlock[]) => {
    setBlocks(reorderedBlocks);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ReorderBlocksScreen
      blocks={blocks}
      onReorder={handleReorder}
      onCancel={handleCancel}
    />
  );
}
