import React from 'react';
import { router } from 'expo-router';
import { ReorderBlocksScreen } from '@/features/form-routine/reorder-blocks';
import { IBlock } from '@/types/routine';
import { formRoutineStore } from '@/store/form-routine-store';

export default function ReorderBlocksPage() {
  const { blocks, setBlocks } = formRoutineStore((state) => state);

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
