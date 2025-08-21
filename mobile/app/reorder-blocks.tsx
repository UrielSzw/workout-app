import React from 'react';
import { router } from 'expo-router';
import { ReorderBlocksScreen } from '@/features/form-routine/reorder-blocks';
import { IBlock } from '@/types/routine';
import {
  useBlockActions,
  useBlocksState,
} from '@/features/form-routine/hooks/use-form-routine-store';

export default function ReorderBlocksPage() {
  const blocks = useBlocksState();
  const { reorderBlocks } = useBlockActions();

  const handleReorder = (reorderedBlocks: IBlock[]) => {
    reorderBlocks(reorderedBlocks);
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
