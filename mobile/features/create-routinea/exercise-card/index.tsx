import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Trash2, Edit3, MoreVertical } from "lucide-react-native";
import { Typography, Card, Button } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import { Exercise } from "@/data/mockExercises";

interface ExerciseInBlock {
  id: string;
  exercise: Exercise;
  sets: number;
  reps: string;
  weight?: string;
  restSeconds: number;
  notes?: string;
}

interface ExerciseCardProps {
  exerciseInBlock: ExerciseInBlock;
  onEdit: () => void;
  onDelete: () => void;
  orderIndex: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseInBlock,
  onEdit,
  onDelete,
  orderIndex,
}) => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const { exercise, sets, reps, weight, restSeconds } = exerciseInBlock;

  const formatRestTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  };

  return (
    <Card
      variant="outlined"
      padding="md"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: colors.primary[500],
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.primary[500],
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Typography variant="body2" weight="bold" color="white">
            {orderIndex + 1}
          </Typography>
        </View>

        <View style={{ flex: 1 }}>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 4 }}
          >
            {exercise.name}
          </Typography>

          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginBottom: 8 }}
          >
            {exercise.muscleGroups.slice(0, 2).join(", ")} •{" "}
            {exercise.equipment}
          </Typography>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Typography variant="body2" color="textMuted">
                Series:{" "}
              </Typography>
              <Typography variant="body2" weight="semibold">
                {sets}
              </Typography>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Typography variant="body2" color="textMuted">
                Reps:{" "}
              </Typography>
              <Typography variant="body2" weight="semibold">
                {reps}
              </Typography>
            </View>

            {weight && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Typography variant="body2" color="textMuted">
                  Peso:{" "}
                </Typography>
                <Typography variant="body2" weight="semibold">
                  {weight}
                </Typography>
              </View>
            )}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Typography variant="body2" color="textMuted">
                Descanso:{" "}
              </Typography>
              <Typography variant="body2" weight="semibold">
                {formatRestTime(restSeconds)}
              </Typography>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button
              variant="ghost"
              size="sm"
              onPress={onEdit}
              icon={<Edit3 size={16} color={colors.primary[500]} />}
            >
              Editar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onPress={onDelete}
              icon={<Trash2 size={16} color={colors.error[500]} />}
            >
              Eliminar
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );
};
