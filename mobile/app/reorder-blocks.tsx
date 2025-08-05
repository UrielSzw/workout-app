import React from "react";
import { ReorderBlocksScreen } from "@/features/create-routinea/ReorderBlocksScreen";
import { router, useLocalSearchParams } from "expo-router";

// Declare global variable for temporary storage
declare global {
  var reorderedBlocks: any;
}

export default function ReorderBlocksPage() {
  const params = useLocalSearchParams();

  // Parse blocks from navigation params
  const blocks = JSON.parse((params.blocks as string) || "[]");

  const handleReorder = (reorderedBlocks: any[]) => {
    console.log("Blocks reordered:", reorderedBlocks);

    // Store reordered blocks in global storage temporarily
    // In a real app, you'd use a proper state management solution
    global.reorderedBlocks = reorderedBlocks;

    // Navigate back
    router.back();
  };

  const handleCancel = () => {
    // Simply go back without changes
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
