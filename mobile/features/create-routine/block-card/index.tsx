import React from "react";
import { View } from "react-native";
import { Trash2, Plus } from "lucide-react-native";
import { Typography, Card, Button } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import { ExerciseCard } from "../exercise-card";

interface ExerciseInBlock {
  id: string;
  exercise: any;
  sets: number;
  reps: string;
  weight?: string;
  restSeconds: number;
  notes?: string;
}

interface Block {
  id: string;
  type: string;
  name: string;
  exercises: ExerciseInBlock[];
}

interface BlockCardProps {
  block: Block;
  onDelete: (blockId: string) => void;
  onAddExercises: (blockId: string) => void;
  onEditExercise: (blockId: string, exerciseId: string) => void;
  onDeleteExercise: (blockId: string, exerciseId: string) => void;
}

export const BlockCard: React.FC<BlockCardProps> = ({
  block,
  onDelete,
  onAddExercises,
  onEditExercise,
  onDeleteExercise,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const getBlockTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      individual: "Bloque Individual",
      superset: "Superserie",
      circuit: "Circuito",
      dropset: "Drop Set",
    };
    return typeMap[type] || "Bloque";
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "superset":
        return colors.warning[500];
      case "circuit":
        return colors.info[500];
      default:
        return colors.primary[500];
    }
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case "superset":
        return "🔥";
      case "circuit":
        return "🔄";
      case "dropset":
        return "⬇️";
      default:
        return "💪";
    }
  };

  return (
    <Card
      variant="outlined"
      padding="lg"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: getBorderColor(block.type),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View
              style={{
                backgroundColor: colors.gray[100],
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                marginRight: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="caption" style={{ marginRight: 4 }}>
                {getBlockIcon(block.type)}
              </Typography>
              <Typography variant="caption" color="textMuted" weight="medium">
                {getBlockTypeDisplay(block.type)}
              </Typography>
            </View>
          </View>

          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 4 }}
          >
            {block.name}
          </Typography>

          <Typography variant="body2" color="textMuted">
            {block.exercises.length} ejercicios
            {block.exercises.length === 0 && " • Sin configurar"}
          </Typography>
        </View>

        <Button
          variant="ghost"
          size="sm"
          onPress={() => onDelete(block.id)}
          icon={<Trash2 size={16} color={colors.error[500]} />}
        >
          {""}
        </Button>
      </View>

      {/* Exercises List */}
      {block.exercises.length > 0 && (
        <View style={{ gap: 12, marginBottom: 16 }}>
          {block.exercises.map((exerciseInBlock, index) => (
            <ExerciseCard
              key={exerciseInBlock.id}
              exerciseInBlock={exerciseInBlock}
              orderIndex={index}
              onEdit={() => onEditExercise(block.id, exerciseInBlock.id)}
              onDelete={() => onDeleteExercise(block.id, exerciseInBlock.id)}
            />
          ))}
        </View>
      )}

      {/* Add Exercises Button */}
      <Button
        variant="outline"
        size="sm"
        fullWidth
        onPress={() => onAddExercises(block.id)}
        icon={<Plus size={16} color={colors.primary[500]} />}
      >
        {block.exercises.length === 0
          ? "Agregar Ejercicios"
          : "Agregar Más Ejercicios"}
      </Button>
    </Card>
  );
};
