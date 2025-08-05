import React, { useState } from "react";
import { View, SafeAreaView, TouchableOpacity, Vibration } from "react-native";
import { GripVertical, ArrowLeft, Check } from "lucide-react-native";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";

import { Typography, Button } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";

interface SetData {
  id: string;
  setNumber: number;
  weight?: string;
  reps?: string;
  type:
    | "normal"
    | "warmup"
    | "drop"
    | "failure"
    | "cluster"
    | "rest-pause"
    | "mechanical";
  completed: boolean;
  notes?: string;
  repsType: "reps" | "range" | "time" | "distance";
  repsValue?: string;
  repsRange?: { min: string; max: string };
}

interface ExerciseInBlock {
  id: string;
  exercise: {
    id: string;
    name: string;
    muscleGroups: string[];
    equipment: string[];
    type: string;
  };
  sets: SetData[];
  orderIndex: number;
  notes?: string;
}

interface BlockData {
  id: string;
  type: "individual" | "superset" | "circuit";
  orderIndex: number;
  exercises: ExerciseInBlock[];
  restTimeSeconds: number;
  restBetweenExercisesSeconds: number;
  name?: string;
}

interface ReorderBlocksScreenProps {
  blocks: BlockData[];
  onReorder: (reorderedBlocks: BlockData[]) => void;
  onCancel: () => void;
}

const BlockHeader: React.FC<{
  blockData: BlockData;
  index: number;
  drag: () => void;
  isActive: boolean;
}> = ({ blockData, index, drag, isActive }) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const getBlockTypeLabel = (type: BlockData["type"]) => {
    switch (type) {
      case "superset":
        return "Superserie";
      case "circuit":
        return "Circuito";
      default:
        return "Individual";
    }
  };

  const getBlockTypeColor = (type: BlockData["type"]) => {
    switch (type) {
      case "superset":
        return colors.warning[500];
      case "circuit":
        return colors.primary[500];
      default:
        return colors.textMuted;
    }
  };

  const exerciseNames = blockData.exercises
    .map((ex) => ex.exercise.name)
    .join(", ");

  const totalSets = blockData.exercises.reduce(
    (total, ex) => total + ex.sets.length,
    0
  );

  return (
    <TouchableOpacity
      onLongPress={() => {
        Vibration.vibrate(50); // Haptic feedback
        drag();
      }}
      delayLongPress={300}
      style={{
        backgroundColor: isActive ? colors.primary[100] : colors.surface,
        borderWidth: 1,
        borderColor: isActive ? colors.primary[300] : colors.border,
        borderRadius: 12,
        padding: 16,
        marginVertical: 4,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isActive ? 0.2 : 0.1,
        shadowRadius: 4,
        elevation: isActive ? 4 : 2,
      }}
      activeOpacity={0.9}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Drag Handle */}
        <View style={{ marginRight: 12 }}>
          <GripVertical size={20} color={colors.textMuted} />
        </View>

        {/* Block Info */}
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Typography variant="body1" weight="semibold">
              Bloque {index + 1}
            </Typography>
            <View
              style={{
                backgroundColor: getBlockTypeColor(blockData.type) + "20",
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
                marginLeft: 8,
              }}
            >
              <Typography
                variant="caption"
                weight="medium"
                style={{ color: getBlockTypeColor(blockData.type) }}
              >
                {getBlockTypeLabel(blockData.type)}
              </Typography>
            </View>
          </View>

          {/* Exercise Info */}
          <Typography
            variant="body2"
            color="textMuted"
            numberOfLines={2}
            style={{ marginBottom: 4 }}
          >
            {exerciseNames}
          </Typography>

          {/* Stats */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Typography variant="caption" color="textMuted">
              {blockData.exercises.length} ejercicio
              {blockData.exercises.length > 1 ? "s" : ""} • {totalSets} serie
              {totalSets > 1 ? "s" : ""}
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const ReorderBlocksScreen: React.FC<ReorderBlocksScreenProps> = ({
  blocks,
  onReorder,
  onCancel,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");
  const [reorderedBlocks, setReorderedBlocks] = useState(blocks);

  const handleReorder = ({ data }: { data: BlockData[] }) => {
    // Update orderIndex for each block
    const updatedBlocks = data.map((block, index) => ({
      ...block,
      orderIndex: index,
    }));
    setReorderedBlocks(updatedBlocks);
  };

  const handleSave = () => {
    onReorder(reorderedBlocks);
  };

  const handleCancel = () => {
    onCancel();
  };

  const renderBlockItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<BlockData>) => {
    const index = reorderedBlocks.findIndex((block) => block.id === item.id);
    return (
      <ScaleDecorator>
        <BlockHeader
          blockData={item}
          index={index}
          drag={drag}
          isActive={isActive}
        />
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        <Button variant="ghost" size="sm" onPress={handleCancel}>
          <ArrowLeft size={18} color={colors.text} />
        </Button>

        <Typography variant="h6" weight="semibold">
          Reordenar Bloques
        </Typography>

        <Button
          variant="primary"
          size="sm"
          onPress={handleSave}
          style={{
            backgroundColor: colors.primary[500],
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Check size={18} color="white" />
          <Typography
            variant="button"
            style={{ color: "white", marginLeft: 4, fontSize: 14 }}
          >
            Guardar
          </Typography>
        </Button>
      </View>

      {/* Instructions */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <Typography
          variant="body2"
          color="textMuted"
          style={{ textAlign: "center" }}
        >
          Mantén presionado un bloque por 300ms para arrastrarlo y reordenar
        </Typography>
      </View>

      {/* Draggable List */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <DraggableFlatList
          data={reorderedBlocks}
          onDragEnd={handleReorder}
          keyExtractor={(item) => item.id}
          renderItem={renderBlockItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          activationDistance={15}
        />
      </View>

      {/* Bottom Actions */}
      {/* <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          gap: 12,
        }}
      >
        <Button variant="outline" onPress={handleCancel} style={{ flex: 1 }}>
          <X size={16} color={colors.text} />
          <Typography variant="button" style={{ marginLeft: 8 }}>
            Cancelar
          </Typography>
        </Button>

        <Button variant="primary" onPress={handleSave} style={{ flex: 1 }}>
          <Check size={16} color="white" />
          <Typography
            variant="button"
            style={{ color: "white", marginLeft: 8 }}
          >
            Guardar Cambios
          </Typography>
        </Button>
      </View> */}
    </SafeAreaView>
  );
};
