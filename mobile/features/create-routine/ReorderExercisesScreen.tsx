import React, { useState } from "react";
import { View, SafeAreaView, TouchableOpacity, Vibration } from "react-native";
import { GripVertical, ArrowLeft, Check } from "lucide-react-native";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";

import { Typography, Button } from "@/components/ui";
import { ExercisePlaceholderImage } from "@/components/ui/ExercisePlaceholderImage";
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

interface ReorderExercisesScreenProps {
  blockData: BlockData;
  onReorder: (reorderedBlock: BlockData) => void;
  onCancel: () => void;
}

const ExerciseHeader: React.FC<{
  exercise: ExerciseInBlock;
  index: number;
  drag: () => void;
  isActive: boolean;
  blockType: BlockData["type"];
}> = ({ exercise, index, drag, isActive, blockType }) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const getBlockTypeColor = (type: BlockData["type"]) => {
    switch (type) {
      case "superset":
        return "#FF6B35"; // Orange
      case "circuit":
        return "#4A90E2"; // Blue
      default:
        return colors.primary[500];
    }
  };

  const blockColor = getBlockTypeColor(blockType);

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

        {/* Exercise Number */}
        <View style={{ marginRight: 12 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: blockColor,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: colors.background,
            }}
          >
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: "white" }}
            >
              {index + 1}
            </Typography>
          </View>
        </View>

        {/* Exercise Image */}
        <View style={{ marginRight: 12 }}>
          <ExercisePlaceholderImage size={40} />
        </View>

        {/* Exercise Info */}
        <View style={{ flex: 1 }}>
          <Typography variant="body1" weight="semibold">
            {exercise.exercise.name}
          </Typography>
          <Typography variant="caption" color="textMuted">
            {exercise.exercise.muscleGroups.join(", ")}
          </Typography>
          <Typography variant="caption" color="textMuted">
            {exercise.sets.length} serie{exercise.sets.length > 1 ? "s" : ""}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const ReorderExercisesScreen: React.FC<ReorderExercisesScreenProps> = ({
  blockData,
  onReorder,
  onCancel,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");
  const [reorderedExercises, setReorderedExercises] = useState(
    blockData.exercises
  );

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

  const handleReorder = ({ data }: { data: ExerciseInBlock[] }) => {
    // Update orderIndex for each exercise
    const updatedExercises = data.map((exercise, index) => ({
      ...exercise,
      orderIndex: index,
    }));
    setReorderedExercises(updatedExercises);
  };

  const handleSave = () => {
    const updatedBlock = {
      ...blockData,
      exercises: reorderedExercises,
    };
    onReorder(updatedBlock);
  };

  const handleCancel = () => {
    onCancel();
  };

  const renderExerciseItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<ExerciseInBlock>) => {
    const index = reorderedExercises.findIndex((ex) => ex.id === item.id);
    return (
      <ScaleDecorator>
        <ExerciseHeader
          exercise={item}
          index={index}
          drag={drag}
          isActive={isActive}
          blockType={blockData.type}
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

        <View style={{ flex: 1, alignItems: "center" }}>
          <Typography variant="h6" weight="semibold">
            Reordenar Ejercicios
          </Typography>
          <Typography variant="caption" color="textMuted">
            {getBlockTypeLabel(blockData.type)}
          </Typography>
        </View>

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
          Mantén presionado un ejercicio por 300ms para arrastrarlo y reordenar
        </Typography>
      </View>

      {/* Draggable List */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <DraggableFlatList
          data={reorderedExercises}
          onDragEnd={handleReorder}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          activationDistance={15}
        />
      </View>
    </SafeAreaView>
  );
};
