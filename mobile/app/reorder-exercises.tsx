import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ReorderExercisesScreen } from "@/features/create-routinea/ReorderExercisesScreen";

export default function ReorderExercisesPage() {
  const { blockData } = useLocalSearchParams();

  // Parse the blockData from the navigation params
  const parsedBlockData = blockData ? JSON.parse(blockData as string) : null;

  useEffect(() => {
    if (!parsedBlockData) {
      router.back();
    }
  }, [parsedBlockData]);

  if (!parsedBlockData) {
    return null;
  }

  const handleReorder = (reorderedBlock: any) => {
    // Save reordered block to global state for the parent to pick up
    (global as any).reorderedBlock = reorderedBlock;
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ReorderExercisesScreen
      blockData={parsedBlockData}
      onReorder={handleReorder}
      onCancel={handleCancel}
    />
  );
}
